import { Project } from '../models/index.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { validateRequired, validateUrl, validateImageUrl } from '../utils/validation.js';
import { clearCache } from '../utils/cache.js';
import { getFullImageUrl } from '../utils/image.js';

// Helper to fix image URLs
const fixImageUrl = (url) => {
  if (!url || typeof url !== 'string') return url;
  const backendUrl = process.env.BACKEND_URL || 'https://galatadesalegn.onrender.com';
  // Replace localhost URLs with production URL
  return url.replace(/http:\/\/localhost:\d+/g, backendUrl).replace(/http:\/\/127\.0\.0\.1:\d+/g, backendUrl);
};

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
export const getProjects = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // For list view, only fetch essential fields to improve performance
  let selectFields = 'title description image techStack category featured createdAt _id';
  if (req.query.excludeImages === 'true') {
    selectFields = 'title description techStack category featured createdAt _id';
  }

  let projects = await Project.find()
    .select(selectFields)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  // Fix localhost URLs in image paths
  projects = projects.map(project => ({
    ...project,
    image: fixImageUrl(project.image)
  }));

  const total = await Project.countDocuments();

  res.json({
    success: true,
    count: projects.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: projects,
  });
});

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Public
export const getProject = asyncHandler(async (req, res) => {
  let project = await Project.findById(req.params.id).lean();

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  // Fix localhost URLs in image paths
  project.image = fixImageUrl(project.image);
  if (project.galleryImages) {
    project.galleryImages = project.galleryImages.map(img => ({
      ...img,
      url: fixImageUrl(img.url)
    }));
  }

  res.json({
    success: true,
    data: project,
  });
});

// @desc    Create project
// @route   POST /api/projects
// @access  Private
export const createProject = asyncHandler(async (req, res) => {
  const { title, description, image, githubLink, liveDemo, techStack, mission, challenge, pillars, galleryImages, duration, collaborationType, videoUrl, category, featured } = req.body;

  const missing = validateRequired(['title', 'description'], req.body);
  if (missing.length > 0) {
    res.status(400);
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }

  if (githubLink && !validateUrl(githubLink)) {
    res.status(400);
    throw new Error('Invalid GitHub URL');
  }

  if (liveDemo && !validateUrl(liveDemo)) {
    res.status(400);
    throw new Error('Invalid live demo URL');
  }

  // Validate image URLs
  if (image !== undefined && !validateImageUrl(image)) {
    res.status(400);
    throw new Error('Invalid image URL. Only Cloudinary or production URLs are allowed.');
  }

  if (galleryImages && Array.isArray(galleryImages)) {
    for (const img of galleryImages) {
      if (img && !validateImageUrl(img)) {
        res.status(400);
        throw new Error('Invalid gallery image URL. Only Cloudinary or production URLs are allowed.');
      }
    }
  }

  // Temporarily disabled pillar icon validation to isolate issue
  // if (pillars && Array.isArray(pillars)) {
  //   for (const pillar of pillars) {
  //     // Skip validation entirely for emoji or non-URL icons
  //     if (pillar.icon && typeof pillar.icon === 'string') {
  //       // Check if it's an emoji or single character (skip validation)
  //       const isEmoji = /^[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(pillar.icon) || 
  //                      pillar.icon.length <= 3; // Most emojis are 1-3 characters
          
  //       if (!isEmoji && (pillar.icon.startsWith('http') || pillar.icon.startsWith('/') || pillar.icon.includes('cloudinary.com'))) {
  //         if (!validateImageUrl(pillar.icon)) {
  //           res.status(400);
  //           throw new Error('Invalid pillar icon URL. Only Cloudinary or production URLs are allowed.');
  //         }
  //       }
  //     }
  //   }
  // }

  let project = await Project.create({
    title,
    description,
    image,
    githubLink,
    liveDemo,
    techStack: techStack || [],
    mission,
    challenge,
    pillars: pillars || [],
    galleryImages: galleryImages || [],
    duration,
    collaborationType,
    videoUrl,
    category,
    featured
  });

  clearCache('projects');

  // Transform image URLs to full URLs
  project = {
    ...project.toObject(),
    image: getFullImageUrl(project.image),
    galleryImages: project.galleryImages?.map(getFullImageUrl) || [],
    pillars: project.pillars?.map(p => ({
      ...p,
      icon: getFullImageUrl(p.icon)
    })) || []
  };

  res.status(201).json({
    success: true,
    data: project,
  });
});

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
export const updateProject = asyncHandler(async (req, res) => {
  const { title, description, image, githubLink, liveDemo, techStack, mission, challenge, pillars, galleryImages, category, featured, duration, collaborationType, videoUrl } = req.body;

  const existingProject = await Project.findById(req.params.id);

  if (!existingProject) {
    res.status(404);
    throw new Error('Project not found');
  }

  if (githubLink && !validateUrl(githubLink)) {
    res.status(400);
    throw new Error('Invalid GitHub URL');
  }

  if (liveDemo && !validateUrl(liveDemo)) {
    res.status(400);
    throw new Error('Invalid live demo URL');
  }

  // Validate image URLs
  if (image !== undefined && !validateImageUrl(image)) {
    res.status(400);
    throw new Error('Invalid image URL. Only Cloudinary or production URLs are allowed.');
  }

  if (galleryImages !== undefined && Array.isArray(galleryImages)) {
    for (const img of galleryImages) {
      if (img && !validateImageUrl(img)) {
        res.status(400);
        throw new Error('Invalid gallery image URL. Only Cloudinary or production URLs are allowed.');
      }
    }
  }

  // Temporarily disabled pillar icon validation in update function too
  // if (pillars !== undefined && Array.isArray(pillars)) {
  //   for (const pillar of pillars) {
  //     // Skip validation entirely for emoji or non-URL icons
  //     if (pillar.icon && typeof pillar.icon === 'string') {
  //       // Check if it's an emoji or single character (skip validation)
  //       const isEmoji = /^[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(pillar.icon) || 
  //                      pillar.icon.length <= 3; // Most emojis are 1-3 characters
          
  //       if (!isEmoji && (pillar.icon.startsWith('http') || pillar.icon.startsWith('/') || pillar.icon.includes('cloudinary.com'))) {
  //         if (!validateImageUrl(pillar.icon)) {
  //           res.status(400);
  //           throw new Error('Invalid pillar icon URL. Only Cloudinary or production URLs are allowed.');
  //         }
  //       }
  //     }
  //   }
  // }

  // Build update object with only provided fields
  const updateData = {};
  if (title !== undefined) updateData.title = title;
  if (description !== undefined) updateData.description = description;
  if (image !== undefined) updateData.image = image;
  if (githubLink !== undefined) updateData.githubLink = githubLink;
  if (liveDemo !== undefined) updateData.liveDemo = liveDemo;
  if (techStack !== undefined) updateData.techStack = techStack;
  if (mission !== undefined) updateData.mission = mission;
  if (challenge !== undefined) updateData.challenge = challenge;
  if (pillars !== undefined) updateData.pillars = pillars;
  if (galleryImages !== undefined) updateData.galleryImages = galleryImages;
  if (category !== undefined) updateData.category = category;
  if (featured !== undefined) updateData.featured = featured;
  if (duration !== undefined) updateData.duration = duration;
  if (collaborationType !== undefined) updateData.collaborationType = collaborationType;
  if (videoUrl !== undefined) updateData.videoUrl = videoUrl;

  let project = await Project.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true, runValidators: true }
  );

  clearCache('projects');

  // Transform image URLs to full URLs
  project = {
    ...project.toObject(),
    image: getFullImageUrl(project.image),
    galleryImages: project.galleryImages?.map(getFullImageUrl) || [],
    pillars: project.pillars?.map(p => ({
      ...p,
      icon: getFullImageUrl(p.icon)
    })) || []
  };

  res.json({
    success: true,
    data: project,
  });
});

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
export const deleteProject = asyncHandler(async (req, res) => {
  const existingProject = await Project.findById(req.params.id);

  if (!existingProject) {
    res.status(404);
    throw new Error('Project not found');
  }

  await Project.findByIdAndDelete(req.params.id);

  clearCache('projects');

  res.json({
    success: true,
    message: 'Project deleted successfully',
  });
});
