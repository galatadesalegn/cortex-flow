import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Skill name is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Frontend Development', 'Backend Development', 'Database', 'DevOps', 'AI & ML', 'Mobile Development', 'UI/UX Design', 'Security', 'Data Science', 'Automation', 'Web Development', 'Tools & Deployment', 'Other', 'frontend', 'backend', 'database', 'devops', 'other']
  },
  level: {
    type: Number,
    min: 1,
    max: 5,
    default: 3
  },
  proficiency: {
    type: Number,
    min: 0,
    max: 100,
    default: null
  },
  icon: {
    type: String,
    default: null
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

skillSchema.index({ category: 1, level: -1 });
skillSchema.index({ featured: -1 });

const Skill = mongoose.model('Skill', skillSchema);

export default Skill;
