import { Skill } from '../models/index.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { validateRequired, validateSkillLevel } from '../utils/validation.js';
import { clearCache } from '../utils/cache.js';
import { getFullImageUrl } from '../utils/image.js';

// @desc    Get all skills
// @route   GET /api/skills
// @access  Public
export const getSkills = asyncHandler(async (req, res) => {
  let skills = await Skill.find().sort({ category: 1, name: 1 }).lean();

  skills = skills.map(skill => ({
    ...skill,
    icon: getFullImageUrl(skill.icon)
  }));

  res.json({
    success: true,
    count: skills.length,
    data: skills,
  });
});

// @desc    Get skills by category
// @route   GET /api/skills/category/:category
// @access  Public
export const getSkillsByCategory = asyncHandler(async (req, res) => {
  let skills = await Skill.find({ category: req.params.category }).sort({ level: -1 }).lean();

  skills = skills.map(skill => ({
    ...skill,
    icon: getFullImageUrl(skill.icon)
  }));

  res.json({
    success: true,
    count: skills.length,
    data: skills,
  });
});

// @desc    Get single skill
// @route   GET /api/skills/:id
// @access  Public
export const getSkill = asyncHandler(async (req, res) => {
  let skill = await Skill.findById(req.params.id).lean();

  if (!skill) {
    res.status(404);
    throw new Error('Skill not found');
  }

  skill.icon = getFullImageUrl(skill.icon);

  res.json({
    success: true,
    data: skill,
  });
});

// @desc    Create skill
// @route   POST /api/skills
// @access  Private
export const createSkill = asyncHandler(async (req, res) => {
  const { name, level, category, icon } = req.body;

  const missing = validateRequired(['name', 'level', 'category'], req.body);
  if (missing.length > 0) {
    res.status(400);
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }

  if (!validateSkillLevel(level)) {
    res.status(400);
    throw new Error('Skill level must be between 1 and 5');
  }

  let skill = await Skill.create({
    name,
    level,
    category,
    icon,
  });

  clearCache('skills');

  // Transform image URLs
  skill = {
    ...skill.toObject(),
    icon: getFullImageUrl(skill.icon)
  };

  res.status(201).json({
    success: true,
    data: skill,
  });
});

// @desc    Update skill
// @route   PUT /api/skills/:id
// @access  Private
export const updateSkill = asyncHandler(async (req, res) => {
  const { name, level, category, icon } = req.body;

  const existingSkill = await Skill.findById(req.params.id);

  if (!existingSkill) {
    res.status(404);
    throw new Error('Skill not found');
  }

  if (level !== undefined && !validateSkillLevel(level)) {
    res.status(400);
    throw new Error('Skill level must be between 1 and 5');
  }

  const updateData = {};
  if (name !== undefined) updateData.name = name;
  if (level !== undefined) updateData.level = level;
  if (category !== undefined) updateData.category = category;
  if (icon !== undefined) updateData.icon = icon;

  let skill = await Skill.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true, runValidators: true }
  );

  clearCache('skills');

  // Transform image URLs
  skill = {
    ...skill.toObject(),
    icon: getFullImageUrl(skill.icon)
  };

  res.json({
    success: true,
    data: skill,
  });
});

// @desc    Delete skill
// @route   DELETE /api/skills/:id
// @access  Private
export const deleteSkill = asyncHandler(async (req, res) => {
  const existingSkill = await Skill.findById(req.params.id);

  if (!existingSkill) {
    res.status(404);
    throw new Error('Skill not found');
  }

  await Skill.findByIdAndDelete(req.params.id);

  clearCache('skills');

  res.json({
    success: true,
    message: 'Skill deleted successfully',
  });
});
