import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  image: {
    type: String,
    default: null
  },
  githubLink: {
    type: String,
    default: null
  },
  liveDemo: {
    type: String,
    default: null
  },
  techStack: [{
    type: String
  }],
  mission: {
    type: String,
    default: null
  },
  challenge: {
    type: String,
    default: null
  },
  pillars: [{
    icon: String,
    title: String,
    description: String
  }],
  galleryImages: [{
    type: String
  }],
  category: {
    type: String,
    default: 'Other'
  },
  duration: {
    type: String,
    default: null
  },
  collaborationType: {
    type: String,
    enum: ['Solo', 'Team'],
    default: 'Solo'
  },
  videoUrl: {
    type: String,
    default: null
  },
  featured: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

projectSchema.index({ featured: -1, order: 1, createdAt: -1 });

const Project = mongoose.model('Project', projectSchema);

export default Project;
