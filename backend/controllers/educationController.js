import { Education } from '../models/index.js';
import { clearCache } from '../utils/cache.js';
import { getFullImageUrl } from '../utils/image.js';
import { validateImageUrl } from '../utils/validation.js';

// @desc    Get all education entries
// @route   GET /api/education
// @access  Public
export const getEducations = async (req, res) => {
  try {
    let educations = await Education.find().sort({ order: 1, createdAt: -1 }).lean();

    res.status(200).json({
      success: true,
      data: educations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single education entry
// @route   GET /api/education/:id
// @access  Public
export const getEducation = async (req, res) => {
  try {
    let education = await Education.findById(req.params.id).lean();
    if (!education) {
      return res.status(404).json({
        success: false,
        message: 'Education entry not found'
      });
    }

    res.status(200).json({
      success: true,
      data: education
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new education entry
// @route   POST /api/education
// @access  Private
export const createEducation = async (req, res) => {
  try {
    const { logo, icon } = req.body;

    // Validate image URLs - allow any valid URL
    if (logo !== undefined && logo !== '' && logo !== null) {
      try {
        new URL(logo);
      } catch {
        return res.status(400).json({
          success: false,
          message: 'Invalid logo URL format.'
        });
      }
    }
    if (icon !== undefined && icon !== '' && icon !== null) {
      try {
        new URL(icon);
      } catch {
        return res.status(400).json({
          success: false,
          message: 'Invalid icon URL format.'
        });
      }
    }

    let education = await Education.create(req.body);
    clearCache('education');

    res.status(201).json({
      success: true,
      data: education
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update education entry
// @route   PUT /api/education/:id
// @access  Private
export const updateEducation = async (req, res) => {
  try {
    const { logo, icon } = req.body;

    // Validate image URLs - allow any valid URL
    if (logo !== undefined && logo !== '' && logo !== null) {
      try {
        new URL(logo);
      } catch {
        return res.status(400).json({
          success: false,
          message: 'Invalid logo URL format.'
        });
      }
    }
    if (icon !== undefined && icon !== '' && icon !== null) {
      try {
        new URL(icon);
      } catch {
        return res.status(400).json({
          success: false,
          message: 'Invalid icon URL format.'
        });
      }
    }

    let education = await Education.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    clearCache('education');
    if (!education) {
      return res.status(404).json({
        success: false,
        message: 'Education entry not found'
      });
    }

    // Transform image URLs
    education = {
      ...education.toObject(),
      logo: getFullImageUrl(education.logo),
      icon: getFullImageUrl(education.icon)
    };

    res.status(200).json({
      success: true,
      data: education
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete education entry
// @route   DELETE /api/education/:id
// @access  Private
export const deleteEducation = async (req, res) => {
  try {
    const education = await Education.findByIdAndDelete(req.params.id);
    clearCache('education');
    if (!education) {
      return res.status(404).json({
        success: false,
        message: 'Education entry not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Education entry deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
