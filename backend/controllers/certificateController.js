import { Certificate } from '../models/index.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { validateRequired, validateUrl, validateImageUrl } from '../utils/validation.js';
import { clearCache } from '../utils/cache.js';
import { getFullImageUrl } from '../utils/image.js';

// @desc    Get all certificates
// @route   GET /api/certificates
// @access  Public
export const getCertificates = asyncHandler(async (req, res) => {
  let certificates = await Certificate.find().sort({ order: 1, date: -1 }).lean();

  res.json({
    success: true,
    count: certificates.length,
    data: certificates,
  });
});

// @desc    Get single certificate
// @route   GET /api/certificates/:id
// @access  Public
export const getCertificate = asyncHandler(async (req, res) => {
  let certificate = await Certificate.findById(req.params.id).lean();

  if (!certificate) {
    res.status(404);
    throw new Error('Certificate not found');
  }

  res.json({
    success: true,
    data: certificate,
  });
});

// @desc    Create certificate
// @route   POST /api/certificates
// @access  Private
export const createCertificate = asyncHandler(async (req, res) => {
  const { name, issuer, image, date, link, category, certificateId, order } = req.body;

  const missing = validateRequired(['name', 'issuer', 'date'], req.body);
  if (missing.length > 0) {
    res.status(400);
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }

  // Validate image URL
  if (image !== undefined && !validateImageUrl(image)) {
    res.status(400);
    throw new Error('Invalid image URL. Only Cloudinary or production URLs are allowed.');
  }

  const certificate = await Certificate.create({
    name,
    issuer,
    image,
    date: new Date(date),
    link,
    category,
    certificateId,
    order: order !== undefined ? order : 0
  });

  clearCache('certificates');

  res.status(201).json({
    success: true,
    data: certificate,
  });
});

// @desc    Update certificate
// @route   PUT /api/certificates/:id
// @access  Private
export const updateCertificate = asyncHandler(async (req, res) => {
  const { name, issuer, image, date, link, category, certificateId, order } = req.body;

  const existingCertificate = await Certificate.findById(req.params.id);

  if (!existingCertificate) {
    res.status(404);
    throw new Error('Certificate not found');
  }

  // Validate image URL
  if (image !== undefined && !validateImageUrl(image)) {
    res.status(400);
    throw new Error('Invalid image URL. Only Cloudinary or production URLs are allowed.');
  }

  const updateData = {};
  if (name !== undefined) updateData.name = name;
  if (issuer !== undefined) updateData.issuer = issuer;
  if (image !== undefined) updateData.image = image;
  if (date !== undefined) updateData.date = new Date(date);
  if (link !== undefined) updateData.link = link;
  if (category !== undefined) updateData.category = category;
  if (certificateId !== undefined) updateData.certificateId = certificateId;
  if (order !== undefined) updateData.order = order;

  const certificate = await Certificate.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true, runValidators: true }
  );

  clearCache('certificates');

  res.json({
    success: true,
    data: certificate,
  });
});

// @desc    Delete certificate
// @route   DELETE /api/certificates/:id
// @access  Private
export const deleteCertificate = asyncHandler(async (req, res) => {
  const existingCertificate = await Certificate.findById(req.params.id);

  if (!existingCertificate) {
    res.status(404);
    throw new Error('Certificate not found');
  }

  await Certificate.findByIdAndDelete(req.params.id);

  clearCache('certificates');

  res.json({
    success: true,
    message: 'Certificate deleted successfully',
  });
});

// @desc    Reorder certificates
// @route   POST /api/certificates/reorder
// @access  Private
export const reorderCertificates = asyncHandler(async (req, res) => {
  const { orders } = req.body; // Array of { id, order }

  if (!orders || !Array.isArray(orders)) {
    res.status(400);
    throw new Error('Invalid orders data');
  }

  const updates = orders.map(({ id, order }) =>
    Certificate.findByIdAndUpdate(id, { order }, { new: true })
  );

  await Promise.all(updates);

  res.json({
    success: true,
    message: 'Certificates reordered successfully'
  });
});
