import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  title: {
    type: String,
    required: [true, 'Title is required']
  },
  subtitle: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: ''
  },
  heroDescription: {
    type: String,
    default: "I'm a full-stack developer focused on building modern web and mobile applications with clean design, strong performance, and real-world impact."
  },
  avatar: {
    type: String,
    default: null
  },
  resume: {
    type: String,
    default: null
  },
  email: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  github: {
    type: String,
    default: ''
  },
  linkedin: {
    type: String,
    default: ''
  },
  twitter: {
    type: String,
    default: ''
  },
  upworkUrl: {
    type: String,
    default: ''
  },
  focusStats: {
    title: {
      type: String,
      default: 'Intelligent System Orchestration'
    },
    subtitle: {
      type: String,
      default: 'CURRENT FOCUS'
    },
    description: {
      type: String,
      default: 'Developing autonomous agent workflows and AI-integrated web environments.'
    },
    image: {
      type: String,
      default: null
    },
    stats: {
      type: [{
        value: String,
        label: String
      }],
      default: [
        { value: '0.4ms', label: 'INTERFACE LATENCY' },
        { value: '99.9%', label: 'UPTIME PRECISION' }
      ]
    }
  },
  skillCategoryOrder: {
    type: [String],
    default: []
  }
}, {
  timestamps: true
});

const Profile = mongoose.model('Profile', profileSchema);

export default Profile;
