import { Profile } from '../models/index.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { clearCache } from '../utils/cache.js';
import { getFullImageUrl } from '../utils/image.js';
import { validateImageUrl } from '../utils/validation.js';

// Helper to clean strings from backticks and extra spaces
const cleanString = (str) => {
  if (typeof str !== 'string') return str;
  const cleaned = str.replace(/`/g, '').trim();
  return cleaned;
};

// @desc    Get profile (public)
// @route   GET /api/profile
// @access  Public
export const getProfile = asyncHandler(async (req, res) => {
  // Set cache control headers to prevent browser caching
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');

  let profile = await Profile.findOne().lean();

  // Create default profile if none exists
  if (!profile) {
    profile = await Profile.create({
      name: 'Galata Desalegn',
      title: 'Full-Stack Developer & AI Automation Engineer',
      subtitle: 'Building modern web apps, mobile apps, and AI-powered solutions',
      bio: 'Passionate full-stack developer with expertise in building scalable web applications and AI automation solutions.',
      location: 'Silicon Valley, CA',
      email: 'galataddesalegn@gmail.com',
    });
    profile = profile.toObject();
  }

  // Return profile as-is from MongoDB (no runtime mutations)
  res.json({
    success: true,
    data: {
      ...profile,
      _timestamp: new Date().toISOString()
    }
  });
});

// @desc    Update profile (admin only)
// @route   PUT /api/profile
// @access  Private
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, title, subtitle, bio, heroDescription, location, email, image, resume, github, linkedin, twitter, phone, focusStats, siteTitle, telegram, skillCategoryOrder } = req.body;

  // Validate image URLs
  if (image !== undefined && !validateImageUrl(image)) {
    res.status(400);
    throw new Error('Invalid image URL. Only Cloudinary or production URLs are allowed.');
  }
  if (resume !== undefined && !validateImageUrl(resume)) {
    res.status(400);
    throw new Error('Invalid resume URL. Only Cloudinary or production URLs are allowed.');
  }
  if (focusStats?.image !== undefined && !validateImageUrl(focusStats.image)) {
    res.status(400);
    throw new Error('Invalid focusStats.image URL. Only Cloudinary or production URLs are allowed.');
  }

  let profile = await Profile.findOne();

  const updateData = {};
  if (name !== undefined) updateData.name = name;
  if (title !== undefined) updateData.title = title;
  if (subtitle !== undefined) updateData.subtitle = subtitle;
  if (bio !== undefined) updateData.bio = bio;
  if (heroDescription !== undefined) updateData.heroDescription = heroDescription;
  if (location !== undefined) updateData.location = location;
  if (email !== undefined) updateData.email = email;
  if (image !== undefined) updateData.avatar = image;
  if (resume !== undefined) updateData.resume = resume;
  if (github !== undefined) updateData.github = github;
  if (linkedin !== undefined) updateData.linkedin = linkedin;
  if (twitter !== undefined) updateData.twitter = twitter;
  if (phone !== undefined) updateData.phone = phone;
  if (focusStats !== undefined) updateData.focusStats = focusStats;
  if (siteTitle !== undefined) updateData.siteTitle = siteTitle;
  if (telegram !== undefined) updateData.telegram = telegram;
  if (skillCategoryOrder !== undefined) updateData.skillCategoryOrder = skillCategoryOrder;

  if (profile) {
    console.log('Updating existing profile with data:', updateData);
    profile = await Profile.findByIdAndUpdate(
      profile._id,
      updateData,
      { new: true, runValidators: true, upsert: true }
    );

    console.log('Profile updated successfully, clearing cache...');
    clearCache('profile');
    console.log('Cache cleared');
  } else {
    profile = await Profile.create({
      name: name || 'Your Name',
      title: title || 'Developer',
      subtitle: subtitle || '',
      bio: bio || '',
      location: location || '',
      email: email || '',
      avatar: image,
      resume,
      github,
      linkedin,
      twitter,
      phone,
    });
  }

  res.json({
    success: true,
    data: profile,
    message: 'Profile updated successfully',
  });
});
