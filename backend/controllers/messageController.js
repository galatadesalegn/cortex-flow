import { Message } from '../models/index.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { validateRequired, validateEmail } from '../utils/validation.js';
import { clearCache } from '../utils/cache.js';
import { sendReplyEmail } from '../utils/emailService.js';

// @desc    Get all messages (admin only)
// @route   GET /api/messages
// @access  Private
export const getMessages = asyncHandler(async (req, res) => {
  const messages = await Message.find().sort({ createdAt: -1 }).lean();

  res.json({
    success: true,
    count: messages.length,
    data: messages,
  });
});

// @desc    Get single message (admin only)
// @route   GET /api/messages/:id
// @access  Private
export const getMessage = asyncHandler(async (req, res) => {
  const message = await Message.findById(req.params.id).lean();

  if (!message) {
    res.status(404);
    throw new Error('Message not found');
  }

  res.json({
    success: true,
    data: message,
  });
});

// @desc    Create message (public contact form)
// @route   POST /api/messages
// @access  Public
export const createMessage = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;

  const missing = validateRequired(['name', 'email', 'message'], req.body);
  if (missing.length > 0) {
    res.status(400);
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }

  if (!validateEmail(email)) {
    res.status(400);
    throw new Error('Invalid email format');
  }

  const newMessage = await Message.create({
    name,
    email,
    subject: subject || 'No Subject',
    message,
  });

  clearCache('messages');

  res.status(201).json({
    success: true,
    message: 'Message sent successfully',
    data: newMessage,
  });
});

// @desc    Delete message (admin only)
// @route   DELETE /api/messages/:id
// @access  Private
export const deleteMessage = asyncHandler(async (req, res) => {
  const existingMessage = await Message.findById(req.params.id);

  if (!existingMessage) {
    res.status(404);
    throw new Error('Message not found');
  }

  await Message.findByIdAndDelete(req.params.id);

  clearCache('messages');

  res.json({
    success: true,
    message: 'Message deleted successfully',
  });
});

// @desc    Reply to message (admin only)
// @route   POST /api/messages/:id/reply
// @access  Private
export const replyMessage = asyncHandler(async (req, res) => {
  const { message, subject } = req.body;
  const messageId = req.params.id;

  if (!message) {
    res.status(400);
    throw new Error('Reply message is required');
  }

  const existingMessage = await Message.findById(messageId);

  if (!existingMessage) {
    res.status(404);
    throw new Error('Message not found');
  }

  // Add reply to the message (fast)
  const emailSubject = subject || `Re: ${existingMessage.subject}`;
  existingMessage.replies.push({
    message,
    subject: emailSubject,
    sentAt: new Date()
  });
  existingMessage.read = true;
  await existingMessage.save();

  // Send email asynchronously (don't block response)
  sendReplyEmail(
    existingMessage.email,
    existingMessage.name,
    emailSubject,
    message,
    existingMessage.message
  ).catch(err => console.error('Failed to send reply email:', err));

  res.json({
    success: true,
    message: 'Reply sent successfully to client email',
    data: existingMessage,
  });
});
