import { Experience } from '../models/index.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { validateRequired } from '../utils/validation.js';
import { clearCache } from '../utils/cache.js';
import { getFullImageUrl } from '../utils/image.js';

// @desc    Get all experiences
// @route   GET /api/experiences
// @access  Public
export const getExperiences = async (req, res) => {
  try {
    let experiences = await Experience.find().sort({ startDate: -1 }).lean();
    
    // Transform image URLs
    experiences = experiences.map(exp => ({
      ...exp,
      logo: getFullImageUrl(exp.logo),
      icon: getFullImageUrl(exp.icon)
    }));

    res.status(200).json({
      success: true,
      data: experiences
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single experience
// @route   GET /api/experiences/:id
// @access  Public
export const getExperience = async (req, res) => {
  try {
    let experience = await Experience.findById(req.params.id).lean();
    if (!experience) {
      return res.status(404).json({
        success: false,
        message: 'Experience not found'
      });
    }

    // Transform image URLs
    experience.logo = getFullImageUrl(experience.logo);
    experience.icon = getFullImageUrl(experience.icon);

    res.status(200).json({
      success: true,
      data: experience
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new experience
// @route   POST /api/experiences
// @access  Private
export const createExperience = async (req, res) => {
  try {
    let experience = await Experience.create(req.body);
    clearCache('experiences');
    
    // Transform image URLs
    experience = {
      ...experience.toObject(),
      logo: getFullImageUrl(experience.logo),
      icon: getFullImageUrl(experience.icon)
    };

    res.status(201).json({
      success: true,
      data: experience
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update experience
// @route   PUT /api/experiences/:id
// @access  Private
export const updateExperience = async (req, res) => {
  try {
    let experience = await Experience.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    clearCache('experiences');
    if (!experience) {
      return res.status(404).json({
        success: false,
        message: 'Experience not found'
      });
    }

    // Transform image URLs
    experience = {
      ...experience.toObject(),
      logo: getFullImageUrl(experience.logo),
      icon: getFullImageUrl(experience.icon)
    };

    res.status(200).json({
      success: true,
      data: experience
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete experience
// @route   DELETE /api/experiences/:id
// @access  Private
export const deleteExperience = async (req, res) => {
  try {
    const experience = await Experience.findByIdAndDelete(req.params.id);
    clearCache('experiences');
    if (!experience) {
      return res.status(404).json({
        success: false,
        message: 'Experience not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Experience deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
