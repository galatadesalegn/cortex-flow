import { Profile } from '../models/index.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { clearCache } from '../utils/cache.js';
import { getFullImageUrl } from '../utils/image.js';

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

  // Clean data and transform URLs
  profile.name = cleanString(profile.name);
  profile.avatar = getFullImageUrl(cleanString(profile.avatar));
  profile.resume = getFullImageUrl(cleanString(profile.resume));
  profile.github = cleanString(profile.github);
  profile.linkedin = cleanString(profile.linkedin);
  
  if (profile.focusStats) {
    profile.focusStats.title = cleanString(profile.focusStats.title);
    if (profile.focusStats.image) {
      profile.focusStats.image = getFullImageUrl(cleanString(profile.focusStats.image));
    }
  }

  res.json({
    success: true,
    data: profile,
  });
});

// @desc    Update profile (admin only)
// @route   PUT /api/profile
// @access  Private
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, title, subtitle, bio, location, email, image, resume, github, linkedin, twitter, phone, focusStats } = req.body;

  let profile = await Profile.findOne();

  const updateData = {};
  if (name !== undefined) updateData.name = name;
  if (title !== undefined) updateData.title = title;
  if (subtitle !== undefined) updateData.subtitle = subtitle;
  if (bio !== undefined) updateData.bio = bio;
  if (location !== undefined) updateData.location = location;
  if (email !== undefined) updateData.email = email;
  if (image !== undefined) updateData.avatar = image;
  if (resume !== undefined) updateData.resume = resume;
  if (github !== undefined) updateData.github = github;
  if (linkedin !== undefined) updateData.linkedin = linkedin;
  if (twitter !== undefined) updateData.twitter = twitter;
  if (phone !== undefined) updateData.phone = phone;
  if (focusStats !== undefined) updateData.focusStats = focusStats;

  if (profile) {
    profile = await Profile.findByIdAndUpdate(
      profile._id,
      updateData,
      { new: true, runValidators: true, upsert: true }
    );

    clearCache('profile');
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
