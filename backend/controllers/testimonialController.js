import { Testimonial } from '../models/index.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { clearCache } from '../utils/cache.js';
import { getFullImageUrl } from '../utils/image.js';
import { validateImageUrl } from '../utils/validation.js';

// @desc    Get all testimonials (public - only active)
// @route   GET /api/testimonials
// @access  Public
export const getTestimonials = asyncHandler(async (req, res) => {
  let testimonials = await Testimonial.find({ active: true })
    .sort({ order: 1, createdAt: -1 })
    .lean();

  res.json({
    success: true,
    count: testimonials.length,
    data: testimonials,
  });
});

// @desc    Get all testimonials (admin - all)
// @route   GET /api/testimonials/admin
// @access  Private
export const getAllTestimonials = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  let testimonials = await Testimonial.find()
    .sort({ order: 1, createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await Testimonial.countDocuments();

  res.json({
    success: true,
    count: testimonials.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: testimonials,
  });
});

// @desc    Get single testimonial
// @route   GET /api/testimonials/:id
// @access  Private
export const getTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id);

  if (!testimonial) {
    res.status(404);
    throw new Error('Testimonial not found');
  }

  res.json({
    success: true,
    data: testimonial,
  });
});

// @desc    Create testimonial
// @route   POST /api/testimonials
// @access  Private
export const createTestimonial = asyncHandler(async (req, res) => {
  const { name, role, company, content, avatar, rating, verified, projectName, order } = req.body;

  // Validate required fields
  if (!name || !role || !company || !content) {
    res.status(400);
    throw new Error('Please provide name, role, company, and content');
  }

  // Validate avatar URL
  if (avatar !== undefined && avatar !== null && !validateImageUrl(avatar)) {
    res.status(400);
    throw new Error('Invalid avatar URL. Only Cloudinary or production URLs are allowed.');
  }

  let testimonial = await Testimonial.create({
    name,
    role,
    company,
    content,
    avatar: avatar || null,
    rating: rating || 5,
    verified: verified !== undefined ? verified : true,
    projectName: projectName || null,
    order: order || 0,
    active: true,
  });

  // Clear cache
  clearCache('/api/testimonials');

  // Transform avatar URL to full URL
  testimonial = {
    ...testimonial.toObject(),
    avatar: getFullImageUrl(testimonial.avatar)
  };

  res.status(201).json({
    success: true,
    data: testimonial,
  });
});

// @desc    Update testimonial
// @route   PUT /api/testimonials/:id
// @access  Private
export const updateTestimonial = asyncHandler(async (req, res) => {
  const { avatar } = req.body;

  // Validate avatar URL
  if (avatar !== undefined && avatar !== null && !validateImageUrl(avatar)) {
    res.status(400);
    throw new Error('Invalid avatar URL. Only Cloudinary or production URLs are allowed.');
  }

  let testimonial = await Testimonial.findById(req.params.id);

  if (!testimonial) {
    res.status(404);
    throw new Error('Testimonial not found');
  }

  testimonial = await Testimonial.findByIdAndUpdate(
    req.params.id,
    { ...req.body },
    { new: true, runValidators: true }
  );

  // Clear cache
  clearCache('/api/testimonials');
  clearCache(`/api/testimonials/${req.params.id}`);

  res.json({
    success: true,
    data: testimonial,
  });
});

// @desc    Delete testimonial
// @route   DELETE /api/testimonials/:id
// @access  Private
export const deleteTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id);

  if (!testimonial) {
    res.status(404);
    throw new Error('Testimonial not found');
  }

  await testimonial.deleteOne();

  // Clear cache
  clearCache('/api/testimonials');
  clearCache(`/api/testimonials/${req.params.id}`);

  res.json({
    success: true,
    message: 'Testimonial removed',
  });
});

// @desc    Toggle testimonial active status
// @route   PATCH /api/testimonials/:id/toggle
// @access  Private
export const toggleTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id);

  if (!testimonial) {
    res.status(404);
    throw new Error('Testimonial not found');
  }

  testimonial.active = !testimonial.active;
  await testimonial.save();

  // Clear cache
  clearCache('/api/testimonials');

  res.json({
    success: true,
    data: testimonial,
    message: `Testimonial ${testimonial.active ? 'activated' : 'deactivated'}`,
  });
});
