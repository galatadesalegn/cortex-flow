import { useState, useEffect } from 'react';
import { useTheme, useNotification, useInactivityLock } from '../hooks';
import PopupNotification from './PopupNotification.jsx';
import LockScreen from './LockScreen.jsx';
import {
  Code2,
  Plus,
  Search,
  Settings,
  BarChart3,
  Target,
  Zap,
  TrendingUp,
  Award,
  Clock,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Edit2,
  Trash2,
  Save,
  X,
  GripVertical,
  Tag,
  Hash,
  Layers,
  Cpu,
  Smartphone,
  Palette,
  Wrench,
  Briefcase,
  Building2,
  Calendar,
  MapPin,
  Sparkles,
  GraduationCap,
  Layout,
  Server,
  Bot,
  Image as ImageIcon,
  MessageSquare,
  ExternalLink
} from 'lucide-react';
import { skillService } from '../services/skillService.js';
import { experienceService } from '../services/experienceService.js';
import { educationService } from '../services/educationService.js';
import { profileService } from '../services/profileService.js';
import { fixImageUrl } from '../../utils/imageHelper.js';
import Testimonials from './Testimonials.jsx';

const Skills = () => {
  const { isDark } = useTheme();
  const { notifications, success, error, info, removeNotification } = useNotification();
  const { isLocked, unlock, timeRemaining } = useInactivityLock(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [editingFocus, setEditingFocus] = useState(false);
  const [showExpModal, setShowExpModal] = useState(false);
  const [editingExp, setEditingExp] = useState(null);
  const [activeTab, setActiveTab] = useState('skills');
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [categories, setCategories] = useState([]);
  const [hasLoadedOrder, setHasLoadedOrder] = useState(false);
  const [profile, setProfile] = useState(null);
  const [orderModified, setOrderModified] = useState(false);
  const [expDraggedIndex, setExpDraggedIndex] = useState(null);
  const [expOrderModified, setExpOrderModified] = useState(false);
  const [eduDraggedIndex, setEduDraggedIndex] = useState(null);
  const [eduOrderModified, setEduOrderModified] = useState(false);

  // Education states
  const [educations, setEducations] = useState([]);
  const [eduLoading, setEduLoading] = useState(true);
  const [eduError, setEduError] = useState(null);
  const [showEduModal, setShowEduModal] = useState(false);
  const [editingEdu, setEditingEdu] = useState(null);
  const [eduFormData, setEduFormData] = useState({
    role: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    description: '',
    tags: [],
    icon: '',
    logo: ''
  });
  const [newEduTag, setNewEduTag] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleLogoUpload = async (file, type) => {
    if (!file) return;
    try {
      setIsUploading(true);
      const { uploadService } = await import('../services/uploadService.js');
      const result = await uploadService.uploadImage(file);
      if (result.success) {
        if (type === 'experience') {
          setExpFormData(prev => ({ ...prev, logo: result.data.url }));
        } else if (type === 'focus') {
          setFocusFormData(prev => ({ ...prev, image: result.data.url }));
        } else {
          setEduFormData(prev => ({ ...prev, logo: result.data.url }));
        }
        success('Logo uploaded successfully');
      }
    } catch (err) {
      error('Failed to upload logo');
    } finally {
      setIsUploading(false);
    }
  };

  // API data
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    category: 'Frontend Development',
    level: 3,
    proficiency: null,
    icon: ''
  });

  // Combined loading state for better UX
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Fetch all data in parallel for better performance
  useEffect(() => {
    const loadAllData = async () => {
      setIsInitialLoading(true);

      try {
        // Fire all API calls in parallel
        const [skillsRes, expRes, eduRes, profileRes] = await Promise.allSettled([
          skillService.getAll(),
          experienceService.getAll(),
          educationService.getAll(),
          profileService.getProfile()
        ]);

        // Handle skills result
        if (skillsRes.status === 'fulfilled') {
          setSkills(skillsRes.value.data || []);
        } else {
          console.error('Failed to fetch skills:', skillsRes.reason);
          setError('Failed to load skills');
        }

        // Handle experiences result
        if (expRes.status === 'fulfilled') {
          setExperiences(expRes.value.data || []);
        } else {
          console.error('Failed to fetch experiences:', expRes.reason);
          setExpError('Failed to load experiences');
        }

        // Handle educations result
        if (eduRes.status === 'fulfilled') {
          setEducations(eduRes.value.data || []);
        } else {
          console.error('Failed to fetch educations:', eduRes.reason);
          setEduError('Failed to load educations');
        }

        // Handle profile result
        if (profileRes.status === 'fulfilled') {
          setProfile(profileRes.value.data);
          if (profileRes.value.data?.focusStats) {
            setFocusStats(profileRes.value.data.focusStats);
          }
        }
      } catch (err) {
        console.error('Error loading data:', err);
      } finally {
        setIsInitialLoading(false);
        setLoading(false);
        setExpLoading(false);
        setEduLoading(false);
      }
    };

    loadAllData();
  }, []);

  // Individual refresh functions
  const fetchExperiences = async () => {
    try {
      setExpLoading(true);
      setExpError(null);
      const response = await experienceService.getAll();
      setExperiences(response.data || []);
    } catch (err) {
      console.error('Failed to fetch experiences:', err);
      setExpError('Failed to load experiences');
      error('Failed to load experiences');
    } finally {
      setExpLoading(false);
    }
  };

  const fetchEducations = async () => {
    try {
      setEduLoading(true);
      setEduError(null);
      const response = await educationService.getAll();
      setEducations(response.data || []);
    } catch (err) {
      console.error('Failed to fetch educations:', err);
      setEduError('Failed to load educations');
      error('Failed to load educations');
    } finally {
      setEduLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await profileService.getProfile();
      setProfile(response.data);
      if (response.data?.focusStats) {
        setFocusStats(response.data.focusStats);
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    }
  };

  // Handle create experience
  const handleCreateExperience = async (e) => {
    e.preventDefault();

    if (!expFormData.role || !expFormData.company || !expFormData.description) {
      error('Please fill in all required fields');
      return;
    }

    try {
      const response = await experienceService.create({
        ...expFormData,
        order: experiences.length
      });

      setExperiences(prev => [...prev, response.data]);
      setShowExpModal(false);
      setExpFormData({
        role: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        isCurrent: false,
        description: '',
        tags: [],
        logo: ''
      });
      success('Experience added successfully!');
    } catch (err) {
      console.error('Failed to create experience:', err);
      error('Failed to create experience: ' + (err.response?.data?.message || err.message));
    }
  };

  // Handle update experience
  const handleUpdateExperience = async (e) => {
    e.preventDefault();

    if (!expFormData.role || !expFormData.company || !expFormData.description) {
      error('Please fill in all required fields');
      return;
    }

    try {
      const response = await experienceService.update(editingExp._id, expFormData);

      setExperiences(prev => prev.map(exp =>
        exp._id === editingExp._id ? response.data : exp
      ));
      setEditingExp(null);
      setShowExpModal(false);
      setExpFormData({
        role: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        isCurrent: false,
        description: '',
        tags: [],
        logo: ''
      });
      success('Experience updated successfully!');
    } catch (err) {
      console.error('Failed to update experience:', err);
      error('Failed to update experience: ' + (err.response?.data?.message || err.message));
    }
  };

  // Handle delete experience
  const handleDeleteExperience = async (expId) => {
    if (!window.confirm('Are you sure you want to delete this experience?')) return;

    try {
      await experienceService.delete(expId);
      setExperiences(prev => prev.filter(exp => exp._id !== expId));
      setShowExpModal(false);
      setEditingExp(null);
      success('Experience deleted successfully!');
    } catch (err) {
      console.error('Failed to delete experience:', err);
      error('Failed to delete experience');
    }
  };

  // Open experience edit modal
  const openExpEditModal = (exp) => {
    setEditingExp(exp);
    setExpFormData({
      role: exp.role || '',
      company: exp.company || '',
      location: exp.location || '',
      startDate: exp.startDate || '',
      endDate: exp.endDate || '',
      isCurrent: exp.isCurrent || false,
      description: exp.description || '',
      tags: exp.tags || [],
      icon: exp.icon || '',
      logo: exp.logo || ''
    });
    setShowExpModal(true);
  };

  // Open experience add modal
  const openExpAddModal = () => {
    setEditingExp(null);
    setExpFormData({
      role: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      description: '',
      tags: [],
      icon: '',
      logo: ''
    });
    setShowExpModal(true);
  };

  // Add tag to experience
  const handleAddTag = () => {
    if (newTag.trim() && !expFormData.tags.includes(newTag.trim().toUpperCase())) {
      setExpFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim().toUpperCase()]
      }));
      setNewTag('');
    }
  };

  // Remove tag from experience
  const handleRemoveTag = (tagToRemove) => {
    setExpFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Handle create education
  const handleCreateEducation = async (e) => {
    e.preventDefault();

    if (!eduFormData.role || !eduFormData.company || !eduFormData.description) {
      error('Please fill in all required fields');
      return;
    }

    try {
      const response = await educationService.create({
        ...eduFormData,
        order: educations.length
      });

      setEducations(prev => [...prev, response.data]);
      setShowEduModal(false);
      setEduFormData({
        role: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        isCurrent: false,
        description: '',
        tags: [],
        icon: '',
        logo: ''
      });
      success('Education added successfully!');
    } catch (err) {
      console.error('Failed to create education:', err);
      error('Failed to add education');
    }
  };

  // Handle update education
  const handleUpdateEducation = async (e) => {
    e.preventDefault();

    if (!eduFormData.role || !eduFormData.company || !eduFormData.description) {
      error('Please fill in all required fields');
      return;
    }

    try {
      const response = await educationService.update(editingEdu._id, eduFormData);

      setEducations(prev => prev.map(edu => edu._id === editingEdu._id ? response.data : edu));
      setShowEduModal(false);
      setEditingEdu(null);
      success('Education updated successfully!');
    } catch (err) {
      console.error('Failed to update education:', err);
      error('Failed to update education');
    }
  };

  // Handle delete education
  const handleDeleteEducation = async (eduId) => {
    if (!window.confirm('Are you sure you want to delete this education entry?')) return;

    try {
      await educationService.delete(eduId);
      setEducations(prev => prev.filter(edu => edu._id !== eduId));
      setShowEduModal(false);
      setEditingEdu(null);
      success('Education deleted successfully!');
    } catch (err) {
      console.error('Failed to delete education:', err);
      error('Failed to delete education');
    }
  };

  // Open education edit modal
  const openEduEditModal = (edu) => {
    setEditingEdu(edu);
    setEduFormData({
      role: edu.role || '',
      company: edu.company || '',
      location: edu.location || '',
      startDate: edu.startDate || '',
      endDate: edu.endDate || '',
      isCurrent: edu.isCurrent || false,
      description: edu.description || '',
      tags: edu.tags || [],
      icon: edu.icon || '',
      logo: edu.logo || ''
    });
    setShowEduModal(true);
  };

  // Open education add modal
  const openEduAddModal = () => {
    setEditingEdu(null);
    setEduFormData({
      role: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      description: '',
      tags: [],
      icon: '',
      logo: ''
    });
    setShowEduModal(true);
  };

  // Add tag to education
  const handleAddEduTag = () => {
    if (newEduTag.trim() && !eduFormData.tags.includes(newEduTag.trim().toUpperCase())) {
      setEduFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newEduTag.trim().toUpperCase()]
      }));
      setNewEduTag('');
    }
  };

  // Remove tag from education
  const handleRemoveEduTag = (tagToRemove) => {
    setEduFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Handle update focus stats
  const handleUpdateFocus = async (e) => {
    e.preventDefault();

    try {
      const response = await profileService.updateProfile({
        focusStats: focusFormData
      });

      if (response.data?.focusStats) {
        setFocusStats(response.data.focusStats);
      }
      setEditingFocus(false);
      success('Focus section updated successfully!');
    } catch (err) {
      console.error('Failed to update focus:', err);
      error('Failed to update focus: ' + (err.response?.data?.message || err.message));
    }
  };

  // Open focus edit modal
  const openFocusEditModal = () => {
    setFocusFormData({
      title: focusStats.title,
      subtitle: focusStats.subtitle,
      description: focusStats.description,
      image: focusStats.image || '',
      stats: focusStats.stats.map(s => ({ ...s }))
    });
    setEditingFocus(true);
  };

  // Group skills by category for display
  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {});

  // Transform to category display format with specific order
  const categoryOrder = [
    'Frontend Development',
    'Backend Development',
    'Database',
    'DevOps',
    'AI & ML',
    'Mobile Development',
    'UI/UX Design',
    'Security',
    'Data Science',
    'Automation',
    'Web Development',
    'Tools & Deployment',
    'Other'
  ];

  const skillCategories = Object.entries(skillsByCategory)
    .map(([category, categorySkills]) => {
      // Convert level 1-5 to percentage for display
      const avgLevel = categorySkills.reduce((sum, s) => sum + s.level, 0) / categorySkills.length;
      const percent = Math.round((avgLevel / 5) * 100);

      const categoryNames = {
        frontend: 'Frontend Development',
        backend: 'Backend Development',
        database: 'Database',
        devops: 'DevOps',
        other: 'Other'
      };

      const categoryIcons = {
        frontend: 'Layers',
        backend: 'Cpu',
        database: 'Layers',
        devops: 'Wrench',
        other: 'Code2'
      };

      return {
        id: category,
        title: categoryNames[category] || category,
        percent,
        icon: categoryIcons[category] || 'Code2',
        skills: categorySkills.map(s => ({
          id: s._id,
          name: s.name,
          level: Math.round((s.level / 5) * 100),
          rawLevel: s.level
        }))
      };
    })
    .sort((a, b) => {
      const orderA = categoryOrder.indexOf(a.title);
      const orderB = categoryOrder.indexOf(b.title);
      // If category not in order list, put it at the end
      const finalOrderA = orderA === -1 ? categoryOrder.length : orderA;
      const finalOrderB = orderB === -1 ? categoryOrder.length : orderB;
      return finalOrderA - finalOrderB;
    });

  // Update categories state - load custom order or use default
  useEffect(() => {
    if (skillCategories.length === 0 || hasLoadedOrder) return;

    // Check if custom order exists in profile
    if (profile?.skillCategoryOrder && profile.skillCategoryOrder.length > 0) {
      // Reorder categories based on saved order
      const orderedCategories = [];
      const remainingCategories = [...skillCategories];

      // Add categories in saved order
      profile.skillCategoryOrder.forEach(title => {
        const index = remainingCategories.findIndex(cat => cat.title === title);
        if (index !== -1) {
          orderedCategories.push(remainingCategories[index]);
          remainingCategories.splice(index, 1);
        }
      });

      // Add any remaining categories not in saved order
      orderedCategories.push(...remainingCategories);
      setCategories(orderedCategories);
    } else {
      // Use default order if no custom order
      setCategories(skillCategories);
    }

    setHasLoadedOrder(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skillCategories.length, profile?.skillCategoryOrder]);

  // Drag and drop handlers
  const handleDragStart = (e, index) => {
    e.dataTransfer.effectAllowed = 'move';
    setDraggedIndex(index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const newCategories = [...categories];
    const draggedItem = newCategories[draggedIndex];
    newCategories.splice(draggedIndex, 1);
    newCategories.splice(dropIndex, 0, draggedItem);

    setCategories(newCategories);
    setDraggedIndex(null);
    setOrderModified(true);
    info('Category order updated. Click "Save Order" to save permanently.');
  };

  const saveCategoryOrder = async () => {
    try {
      const categoryTitles = categories.map(cat => cat.title);
      await profileService.updateProfile({
        skillCategoryOrder: categoryTitles
      });
      // Clear profile cache so frontend will fetch fresh data
      localStorage.removeItem('cached_profile_v2');
      localStorage.removeItem('cached_profile');
      setOrderModified(false);
      success('Category order saved! Frontend will show new order on next load.');
    } catch (err) {
      console.error('Failed to save category order:', err);
      error('Failed to save category order');
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  // Experience drag and drop handlers
  const handleExpDragStart = (e, index) => {
    e.dataTransfer.effectAllowed = 'move';
    setExpDraggedIndex(index);
  };

  const handleExpDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleExpDrop = (e, dropIndex) => {
    e.preventDefault();
    if (expDraggedIndex === null || expDraggedIndex === dropIndex) return;

    const newExperiences = [...experiences];
    const draggedItem = newExperiences[expDraggedIndex];
    newExperiences.splice(expDraggedIndex, 1);
    newExperiences.splice(dropIndex, 0, draggedItem);

    setExperiences(newExperiences);
    setExpDraggedIndex(null);
    setExpOrderModified(true);
    info('Experience order updated. Click "Save Order" to save permanently.');
  };

  const handleExpDragEnd = () => {
    setExpDraggedIndex(null);
  };

  const saveExperienceOrder = async () => {
    try {
      // Update order for each experience
      const updatePromises = experiences.map((exp, index) => 
        experienceService.update(exp._id, { ...exp, order: index })
      );
      await Promise.all(updatePromises);
      setExpOrderModified(false);
      success('Experience order saved successfully!');
    } catch (err) {
      console.error('Failed to save experience order:', err);
      error('Failed to save experience order');
    }
  };

  // Education drag and drop handlers
  const handleEduDragStart = (e, index) => {
    e.dataTransfer.effectAllowed = 'move';
    setEduDraggedIndex(index);
  };

  const handleEduDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleEduDrop = (e, dropIndex) => {
    e.preventDefault();
    if (eduDraggedIndex === null || eduDraggedIndex === dropIndex) return;

    const newEducations = [...educations];
    const draggedItem = newEducations[eduDraggedIndex];
    newEducations.splice(eduDraggedIndex, 1);
    newEducations.splice(dropIndex, 0, draggedItem);

    setEducations(newEducations);
    setEduDraggedIndex(null);
    setEduOrderModified(true);
    info('Education order updated. Click "Save Order" to save permanently.');
  };

  const handleEduDragEnd = () => {
    setEduDraggedIndex(null);
  };

  const saveEducationOrder = async () => {
    try {
      // Update order for each education
      const updatePromises = educations.map((edu, index) => 
        educationService.update(edu._id, { ...edu, order: index })
      );
      await Promise.all(updatePromises);
      setEduOrderModified(false);
      success('Education order saved successfully!');
    } catch (err) {
      console.error('Failed to save education order:', err);
      error('Failed to save education order');
    }
  };

  // Focus stats - from API
  const [focusStats, setFocusStats] = useState({
    title: 'Intelligent System Orchestration',
    subtitle: 'CURRENT FOCUS',
    description: 'Developing autonomous agent workflows and AI-integrated web environments. Currently focused on bridging the gap between LLM reasoning and real-world automation within the MERN stack.',
    stats: [
      { value: '0.4ms', label: 'INTERFACE LATENCY' },
      { value: '99.9%', label: 'UPTIME PRECISION' }
    ],
    image: ''
  });
  const [focusFormData, setFocusFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    image: '',
    stats: [
      { value: '', label: '' },
      { value: '', label: '' }
    ]
  });

  // Experience data - from API
  const [experiences, setExperiences] = useState([]);
  const [expLoading, setExpLoading] = useState(true);
  const [expError, setExpError] = useState(null);
  const [expFormData, setExpFormData] = useState({
    role: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    description: '',
    tags: [],
    icon: '',
    logo: ''
  });
  const [newTag, setNewTag] = useState('');

  // Bottom stats - dynamic from API
  const bottomStats = [
    { title: 'Total Skills', value: skills.length.toString(), icon: Award, color: 'blue' },
    { title: 'Categories', value: Object.keys(skillsByCategory).length.toString(), icon: Layers, color: 'cyan' },
    { title: 'Avg Level', value: skills.length > 0 ? (skills.reduce((sum, s) => sum + s.level, 0) / skills.length).toFixed(1) : '0', icon: Target, color: 'purple' },
    { title: 'Top Category', value: skillCategories[0]?.title?.split(' ')[0] || 'N/A', icon: TrendingUp, color: 'green' }
  ];


  const iconMap = {
    Layers,
    Cpu,
    Zap,
    Smartphone,
    Palette,
    Wrench,
    Code2
  };

  const categoryOptions = [
    { value: 'Frontend Development', label: '📦 Frontend Development' },
    { value: 'Backend Development', label: '🗄️ Backend Development' },
    { value: 'Database', label: '🗄️ Database' },
    { value: 'DevOps', label: '☁️ DevOps / Cloud' },
    { value: 'AI & ML', label: '🤖 AI & Machine Learning' },
    { value: 'Mobile Development', label: '📱 Mobile Development' },
    { value: 'UI/UX Design', label: '🎨 UI/UX Design' },
    { value: 'Security', label: '🔒 Security' },
    { value: 'Data Science', label: '📊 Data Science' },
    { value: 'Automation', label: '⚡ Automation' },
    { value: 'Web Development', label: '🌐 Web Development' },
    { value: 'Tools & Deployment', label: '🛠️ Tools & Deployment' },
    { value: 'Other', label: '⚙️ Other' }
  ];

  const filteredCategories = categories.filter(cat =>
    cat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.skills.some(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Handle create skill
  const handleCreateSkill = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.category) {
      error('Please fill in all required fields');
      return;
    }

    try {
      const response = await skillService.create({
        name: formData.name,
        category: formData.category,
        level: parseInt(formData.level),
        proficiency: formData.proficiency,
        icon: formData.icon
      });

      setSkills(prev => [...prev, response.data]);
      setShowAddModal(false);
      setFormData({
        name: '',
        category: 'Frontend Development',
        level: 3,
        proficiency: null,
        icon: ''
      });
      success('Skill created successfully!');
    } catch (err) {
      console.error('Failed to create skill:', err);
      error('Failed to create skill: ' + (err.response?.data?.message || err.message));
    }
  };

  // Handle update skill
  const handleUpdateSkill = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.category) {
      error('Please fill in all required fields');
      return;
    }

    try {
      const response = await skillService.update(editingSkill.id, {
        name: formData.name,
        category: formData.category,
        level: parseInt(formData.level),
        proficiency: formData.proficiency,
        icon: formData.icon
      });

      setSkills(prev => prev.map(skill =>
        skill._id === editingSkill.id ? response.data : skill
      ));
      setEditingSkill(null);
      setFormData({
        name: '',
        category: 'Frontend Development',
        level: 3,
        proficiency: null,
        icon: ''
      });
      success('Skill updated successfully!');
    } catch (err) {
      console.error('Failed to update skill:', err);
      error('Failed to update skill: ' + (err.response?.data?.message || err.message));
    }
  };

  // Handle delete skill
  const handleDeleteSkill = async (skillId) => {
    if (!window.confirm('Are you sure you want to delete this skill?')) return;

    try {
      await skillService.delete(skillId);
      setSkills(prev => prev.filter(skill => skill._id !== skillId));
      success('Skill deleted successfully!');
    } catch (err) {
      console.error('Failed to delete skill:', err);
      error('Failed to delete skill');
    }
  };

  // Open edit modal with skill data
  const openEditModal = (skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name,
      category: skill.category,
      level: skill.rawLevel || 3,
      proficiency: skill.proficiency,
      icon: skill.icon || ''
    });
  };

  // Open add modal
  const openAddModal = () => {
    setEditingSkill(null);
    setFormData({
      name: '',
      category: 'Frontend Development',
      level: 3,
      proficiency: null,
      icon: ''
    });
    setShowAddModal(true);
  };

  return (
    <>
      {/* Notifications */}
      {notifications.map(notification => (
        <PopupNotification
          key={notification.id}
          message={notification.message}
          type={notification.type}
          duration={notification.duration}
          onClose={() => removeNotification(notification.id)}
        />
      ))}

      {/* Lock Screen */}
      {isLocked && (
        <LockScreen 
          onUnlock={unlock} 
          timeRemaining={timeRemaining}
          isDark={isDark}
        />
      )}

      <div className={`p-6 min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#0a0a0f]' : 'bg-bg-primary'}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className={`text-xs uppercase tracking-widest mb-1 transition-colors duration-300 ${isDark ? 'text-gray-500' : 'text-text-muted'}`}>ROOT / ENGINE / SKILLS_MATRIX</p>
          <h1 className={`text-3xl font-bold mb-2 transition-colors duration-300 ${isDark ? 'text-white' : 'text-text-primary'}`}>Skills Management</h1>
          <p className={`transition-colors duration-300 ${isDark ? 'text-gray-500' : 'text-text-muted'}`}>Technical proficiency matrix and architectural competence index.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search system repository..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`border rounded-lg pl-10 pr-4 py-2 text-sm transition-all focus:outline-none focus:border-accent w-64 ${
                isDark ? 'bg-gray-800/50 border-gray-700 text-white placeholder-gray-500' : 'bg-bg-secondary border-border-theme text-text-primary placeholder-text-muted'
              }`}
            />
          </div>
          <button className={`p-2 rounded-lg transition-colors ${isDark ? 'bg-gray-800/50 text-gray-400 hover:text-white' : 'bg-bg-secondary text-text-secondary hover:text-text-primary'}`}>
            <Settings size={18} />
          </button>
          <button
            onClick={() => window.open('/', '_blank')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 text-white hover:bg-cyan-700 transition-colors text-sm font-medium"
          >
            <ExternalLink size={16} />
            Preview
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className={`flex items-center gap-1 mb-6 border-b transition-colors duration-300 ${isDark ? 'border-gray-800' : 'border-border-theme'}`}>
        {[
          { id: 'skills', label: 'Skills Matrix', icon: BarChart3 },
          { id: 'experience', label: 'Experience', icon: Briefcase },
          { id: 'education', label: 'Education', icon: GraduationCap },
          { id: 'testimonials', label: 'Testimonials', icon: MessageSquare }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === tab.id
              ? isDark ? 'text-cyan-400 border-cyan-400' : 'text-accent border-accent'
              : isDark ? 'text-gray-500 border-transparent hover:text-gray-300' : 'text-text-muted border-transparent hover:text-text-primary'
              }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'skills' ? (
        <>
          {/* Action Buttons */}
          <div className="flex items-center gap-3 mb-8">
            <button
              onClick={openFocusEditModal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors text-sm font-medium"
            >
              <Edit2 size={16} />
              Edit Focus
            </button>
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <Plus size={16} />
              Add New Skill
            </button>
            <button
              onClick={saveCategoryOrder}
              disabled={!orderModified}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                orderModified
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Save size={16} />
              Save Order
            </button>
          </div>

          {/* Skills Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
                <p className="text-gray-400">Loading skills...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-8">
              <p className="text-red-400">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {categories.map((category, index) => {
                const IconComponent = iconMap[category.icon] || Code2;
                return (
                  <div
                    key={category.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`bg-[#12121a] border rounded-xl p-5 hover:border-gray-700 transition-all duration-300 hover:transform hover:scale-[1.01] hover:shadow-2xl hover:shadow-cyan-400/10 hover:-translate-y-1 group cursor-move ${
                      draggedIndex === index ? 'opacity-50 border-cyan-400' : 'border-gray-800'
                    }`}
                    style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
                  >
                    {/* Card Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center">
                          <IconComponent size={20} className="text-cyan-400" />
                        </div>
                        <GripVertical size={16} className="text-gray-600" />
                      </div>
                      <span className="text-[10px] text-gray-600 font-mono">0{index + 1}</span>
                    </div>

                    {/* Category Title */}
                    <h3 className="text-lg font-semibold text-white mb-4">{category.title}</h3>

                    {/* Skills List */}
                    <div className="space-y-3">
                      {category.skills.map((skill) => (
                        <div key={skill.id} className="group/skill">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-400">{skill.name}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-cyan-400 font-medium">{skill.level}%</span>
                              {/* Individual Skill Actions */}
                              <div className="flex items-center gap-1 opacity-0 group-hover/skill:opacity-100 transition-opacity">
                                <button
                                  onClick={() => openEditModal(skill)}
                                  className="p-1 rounded bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 transition-colors"
                                  title="Edit Skill"
                                >
                                  <Edit2 size={10} />
                                </button>
                                <button
                                  onClick={() => handleDeleteSkill(skill.id)}
                                  className="p-1 rounded bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-colors"
                                  title="Delete Skill"
                                >
                                  <Trash2 size={10} />
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
                              style={{ width: `${skill.level}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Focus Card & Bottom Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            {/* Focus Card */}
            <div className="bg-[#12121a] border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <span className="inline-block text-xs font-semibold text-cyan-400 bg-cyan-400/10 px-3 py-1 rounded-full">
                  {focusStats.subtitle}
                </span>
                <button
                  onClick={openFocusEditModal}
                  className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white transition-colors"
                >
                  <Edit2 size={14} />
                </button>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{focusStats.title}</h3>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">{focusStats.description}</p>
              <div className="flex gap-8">
                {focusStats.stats.map((stat, i) => (
                  <div key={i}>
                    <span className="block text-cyan-400 text-lg font-bold">{stat.value}</span>
                    <span className="text-gray-500 text-[10px] uppercase tracking-wider">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Decorative Card / Focus Image Preview */}
            <div className="bg-[#12121a] border border-gray-800 rounded-xl flex items-center justify-center min-h-[200px] overflow-hidden relative">
              {focusStats.image ? (
                <img src={fixImageUrl(focusStats.image)} alt="Focus" className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <Zap size={64} className="text-cyan-400/30" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] to-transparent opacity-40"></div>
            </div>
          </div>

          {/* Bottom Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {bottomStats.map((stat, index) => (
              <div
                key={index}
                className="bg-[#12121a] border border-gray-800 rounded-xl p-4 flex items-center gap-3 hover:border-gray-700 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center">
                  <stat.icon size={18} className={`text-${stat.color}-400`} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">{stat.title}</p>
                  <p className="text-lg font-bold text-white">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : activeTab === 'experience' ? (
        /* Experience Tab */
        <>
          {/* Experience Header */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-xs text-gray-500 uppercase tracking-widest">MAIN / EXPERIENCE</p>
            <div className="flex items-center gap-3">
              <button
                onClick={saveExperienceOrder}
                disabled={!expOrderModified}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  expOrderModified
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Save size={16} />
                Save Order
              </button>
              <button
                onClick={openExpAddModal}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-500 text-black hover:bg-cyan-400 transition-colors text-sm font-semibold"
              >
                <Plus size={18} />
                Add Experience
              </button>
            </div>
          </div>

          {/* Experience List */}
          {expLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
                <p className="text-gray-400">Loading experiences...</p>
              </div>
            </div>
          ) : expError ? (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-8">
              <p className="text-red-400">{expError}</p>
              <button
                onClick={fetchExperiences}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="space-y-4 mb-8">
              {experiences.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Briefcase size={48} className="mx-auto mb-4 opacity-30" />
                  <p>No experiences yet. Add your first experience!</p>
                </div>
              ) : (
                experiences.map((exp, index) => (
                  <div
                    key={exp._id}
                    draggable
                    onDragStart={(e) => handleExpDragStart(e, index)}
                    onDragOver={handleExpDragOver}
                    onDrop={(e) => handleExpDrop(e, index)}
                    onDragEnd={handleExpDragEnd}
                    className={`bg-[#12121a] border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all duration-300 group cursor-move ${
                      expDraggedIndex === index ? 'opacity-50 border-cyan-500' : ''
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Drag Handle */}
                      <div className="flex-shrink-0 pt-2">
                        <GripVertical size={20} className="text-gray-600" />
                      </div>
                      {/* Company Logo Section */}
                      <div className="w-14 h-14 rounded-xl bg-gray-800 flex items-center justify-center flex-shrink-0 relative overflow-hidden border border-gray-700">
                        {exp.logo ? (
                          <img src={fixImageUrl(exp.logo)} alt={exp.company} className="w-full h-full object-cover" />
                        ) : (
                          <Building2 size={24} className="text-gray-600" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-lg font-semibold text-white mb-1">{exp.role}</h3>
                            <p className="text-sm text-cyan-400 mb-2">{exp.company} • {exp.location}</p>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="text-right">
                              <span className="text-xs text-gray-500 bg-gray-800 px-3 py-1 rounded-full">
                                {exp.startDate} — {exp.endDate}
                              </span>
                              {exp.isCurrent && (
                                <span className="block text-[10px] text-green-400 mt-1 text-right uppercase tracking-wider">Current Role</span>
                              )}
                            </div>
                            <div className="flex flex-col gap-1 ml-2">
                              <button
                                onClick={() => openExpEditModal(exp)}
                                className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                                title="Edit"
                              >
                                <Edit2 size={14} />
                              </button>
                              <button
                                onClick={() => handleDeleteExperience(exp._id)}
                                className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                title="Delete"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>

                        <p className="text-gray-400 text-sm mb-4 leading-relaxed">{exp.description}</p>

                        {/* Tags */}
                        <div className="flex items-center gap-2 flex-wrap">
                          {exp.tags?.map((tag, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-1 rounded-md bg-cyan-500/10 text-cyan-400 text-xs font-medium border border-cyan-500/20"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {/* End of Timeline */}
              {experiences.length > 0 && (
                <div className="flex flex-col items-center py-8 text-gray-600">
                  <Clock size={24} className="mb-2 opacity-50" />
                  <span className="text-sm">End of Timeline</span>
                </div>
              )}
            </div>
          )}
        </>
      ) : activeTab === 'education' ? (
        /* Education Tab */
        <>
          {/* Education Header */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-xs text-gray-500 uppercase tracking-widest">MAIN / EDUCATION</p>
            <div className="flex items-center gap-3">
              <button
                onClick={saveEducationOrder}
                disabled={!eduOrderModified}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  eduOrderModified
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Save size={16} />
                Save Order
              </button>
              <button
                onClick={openEduAddModal}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-500 text-black hover:bg-cyan-400 transition-colors text-sm font-semibold"
              >
                <Plus size={18} />
                Add Education
              </button>
            </div>
          </div>

          {/* Education List */}
          {eduLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
                <p className="text-gray-400">Loading education data...</p>
              </div>
            </div>
          ) : eduError ? (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-8">
              <p className="text-red-400">{eduError}</p>
              <button
                onClick={fetchEducations}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="space-y-4 mb-8">
              {educations.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <GraduationCap size={48} className="mx-auto mb-4 opacity-30" />
                  <p>No education entries yet. Add your first education!</p>
                </div>
              ) : (
                educations.map((edu, index) => (
                  <div
                    key={edu._id}
                    draggable
                    onDragStart={(e) => handleEduDragStart(e, index)}
                    onDragOver={handleEduDragOver}
                    onDrop={(e) => handleEduDrop(e, index)}
                    onDragEnd={handleEduDragEnd}
                    className={`bg-[#12121a] border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all duration-300 group cursor-move ${
                      eduDraggedIndex === index ? 'opacity-50 border-cyan-500' : ''
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Drag Handle */}
                      <div className="flex-shrink-0 pt-2">
                        <GripVertical size={20} className="text-gray-600" />
                      </div>
                      {/* Institution Logo */}
                      <div className="w-14 h-14 rounded-xl bg-gray-800 flex items-center justify-center flex-shrink-0 text-2xl overflow-hidden border border-gray-700">
                        {edu.logo ? (
                          <img src={fixImageUrl(edu.logo)} alt={edu.company} className="w-full h-full object-cover" />
                        ) : (
                          edu.icon || '🎓'
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-lg font-semibold text-white mb-1">{edu.role}</h3>
                            <p className="text-sm text-cyan-400 mb-2">{edu.company} {edu.location && `• ${edu.location}`}</p>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="text-right">
                              <span className="text-xs text-gray-500 bg-gray-800 px-3 py-1 rounded-full">
                                {edu.startDate} — {edu.endDate}
                              </span>
                            </div>
                            <div className="flex flex-col gap-1 ml-2">
                              <button
                                onClick={() => openEduEditModal(edu)}
                                className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                                title="Edit"
                              >
                                <Edit2 size={14} />
                              </button>
                              <button
                                onClick={() => handleDeleteEducation(edu._id)}
                                className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                title="Delete"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>

                        <p className="text-gray-400 text-sm mb-4 leading-relaxed">{edu.description}</p>

                        {/* Tags */}
                        <div className="flex items-center gap-2 flex-wrap">
                          {edu.tags?.map((tag, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-1 rounded-md bg-cyan-500/10 text-cyan-400 text-xs font-medium border border-cyan-500/20"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {/* End of Timeline */}
              {educations.length > 0 && (
                <div className="flex flex-col items-center py-8 text-gray-600">
                  <Clock size={24} className="mb-2 opacity-50" />
                  <span className="text-sm">End of Timeline</span>
                </div>
              )}
            </div>
          )}
        </>
      ) : activeTab === 'testimonials' ? (
        /* Testimonials Tab */
        <Testimonials />
      ) : null}

      {/* Add/Edit Skill Modal */}
      {(showAddModal || editingSkill) && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#12121a] border border-gray-800 rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <form onSubmit={editingSkill ? handleUpdateSkill : handleCreateSkill}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">
                  {editingSkill ? 'Edit Skill' : 'Add New Skill'}
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingSkill(null);
                    setFormData({
                      name: '',
                      category: 'Frontend Development',
                      level: 3,
                      proficiency: null,
                      icon: ''
                    });
                  }}
                  className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">
                    Skill Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., React, Node.js, Python"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">
                    Category <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                  >
                    {categoryOptions.map(opt => (
                      <option key={opt.value} value={opt.value} className="bg-gray-800">{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">
                    Skill Level (1-5) <span className="text-red-400">*</span>
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={formData.level}
                      onChange={(e) => setFormData(prev => ({ ...prev, level: parseInt(e.target.value) }))}
                      className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-cyan-400 font-bold w-8 text-center">{formData.level}</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                    <span>Beginner</span>
                    <span>Intermediate</span>
                    <span>Expert</span>
                  </div>
                </div>

                {/* Overall Category Proficiency */}
                <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700">
                  <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">
                    Overall Category Proficiency % <span className="text-gray-600">- Optional</span>
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={formData.proficiency || Math.round(formData.level * 20)}
                      onChange={(e) => setFormData(prev => ({ ...prev, proficiency: parseInt(e.target.value) }))}
                      className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-cyan-400 font-bold w-12 text-center">{formData.proficiency || Math.round(formData.level * 20)}%</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">This overrides the auto-calculated proficiency for this skill category on the frontend</p>
                </div>

                <div>
                  <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">
                    Icon (Optional)
                  </label>
                  <select
                    value={formData.icon || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="" className="bg-gray-800">None</option>
                    <option value="Layers" className="bg-gray-800">📦 Layers (Frontend)</option>
                    <option value="Cpu" className="bg-gray-800">🗄️ Cpu (Backend)</option>
                    <option value="Zap" className="bg-gray-800">⚡ Zap (AI/ML)</option>
                    <option value="Smartphone" className="bg-gray-800">📱 Smartphone (Mobile)</option>
                    <option value="Palette" className="bg-gray-800">🎨 Palette (Design)</option>
                    <option value="Wrench" className="bg-gray-800">🛠️ Wrench (Tools)</option>
                    <option value="Database" className="bg-gray-800">🗄️ Database</option>
                    <option value="Cloud" className="bg-gray-800">☁️ Cloud (DevOps)</option>
                    <option value="Bot" className="bg-gray-800">🤖 Bot (Automation)</option>
                    <option value="Globe" className="bg-gray-800">🌐 Globe (Web)</option>
                    <option value="Code2" className="bg-gray-800">💻 Code2 (General)</option>
                    <option value="Terminal" className="bg-gray-800">⌨️ Terminal (Scripting)</option>
                    <option value="Shield" className="bg-gray-800">🔒 Shield (Security)</option>
                    <option value="BarChart" className="bg-gray-800">📊 BarChart (Data)</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6 pt-6 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingSkill(null);
                    setFormData({
                      name: '',
                      category: 'Frontend Development',
                      level: 3,
                      proficiency: null,
                      icon: ''
                    });
                  }}
                  className="px-4 py-2.5 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
                <div className="flex-1"></div>
                {editingSkill && (
                  <button
                    type="button"
                    onClick={() => handleDeleteSkill(editingSkill.id)}
                    className="px-4 py-2.5 rounded-lg bg-red-600/10 text-red-400 hover:bg-red-600/20 transition-colors text-sm font-medium border border-red-600/20 flex items-center gap-2"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                )}
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg bg-cyan-600 text-white hover:bg-cyan-700 transition-colors text-sm font-medium flex items-center gap-2"
                >
                  <Save size={16} />
                  {editingSkill ? 'Save Changes' : 'Add Skill'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add/Edit Experience Modal */}
      {(showExpModal || editingExp) && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#12121a] border border-gray-800 rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <form onSubmit={editingExp ? handleUpdateExperience : handleCreateExperience}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">
                  {editingExp ? 'Edit Experience' : 'Add Experience'}
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    setShowExpModal(false);
                    setEditingExp(null);
                    setExpFormData({
                      role: '',
                      company: '',
                      location: '',
                      startDate: '',
                      endDate: '',
                      isCurrent: false,
                      description: '',
                      tags: []
                    });
                  }}
                  className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">
                    Role / Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Senior AI Engineer"
                    value={expFormData.role}
                    onChange={(e) => setExpFormData(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">
                      Company <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Company Name"
                      value={expFormData.company}
                      onChange={(e) => setExpFormData(prev => ({ ...prev, company: e.target.value }))}
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">Location</label>
                    <input
                      type="text"
                      placeholder="City, State"
                      value={expFormData.location}
                      onChange={(e) => setExpFormData(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">Start Date</label>
                    <input
                      type="text"
                      placeholder="Jan 2022"
                      value={expFormData.startDate}
                      onChange={(e) => setExpFormData(prev => ({ ...prev, startDate: e.target.value }))}
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">End Date</label>
                    <input
                      type="text"
                      placeholder="Present"
                      value={expFormData.endDate}
                      onChange={(e) => setExpFormData(prev => ({ ...prev, endDate: e.target.value }))}
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">
                    Description <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe your responsibilities and achievements..."
                    value={expFormData.description}
                    onChange={(e) => setExpFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 resize-none"
                    required
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">Tech Stack / Tags</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {expFormData.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-cyan-500/10 text-cyan-400 text-xs font-medium border border-cyan-500/20"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-white"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add tag..."
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      className="flex-1 bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="px-3 py-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                {/* Icon */}
                <div>
                  <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">
                    Icon (Emoji) <span className="text-gray-600">- Optional</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., ⚛️, 🎓, 💼, 🚀"
                    value={expFormData.icon}
                    onChange={(e) => setExpFormData(prev => ({ ...prev, icon: e.target.value }))}
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                    maxLength={10}
                  />
                  <p className="text-xs text-gray-500 mt-1">Add an emoji icon to represent this experience</p>
                </div>

                {/* Logo Upload */}
                <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700">
                  <label className="block text-xs text-gray-500 uppercase tracking-wider mb-3">Company Logo / Image</label>
                  <div className="flex items-center gap-4">
                    {expFormData.logo && (
                      <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-700 bg-gray-800/30">
                        <img src={fixImageUrl(expFormData.logo)} alt="Logo Preview" className="w-full h-full object-contain" />
                      </div>
                    )}
                    <div className="flex-1">
                      <input
                        type="file"
                        id="exp-logo-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleLogoUpload(e.target.files[0], 'experience')}
                      />
                      <label
                        htmlFor="exp-logo-upload"
                        className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed border-gray-700 hover:border-cyan-500 hover:bg-cyan-500/5 cursor-pointer transition-all ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {isUploading ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-cyan-400"></div>
                        ) : (
                          <ImageIcon size={16} className="text-gray-400" />
                        )}
                        <span className="text-sm text-gray-400">{expFormData.logo ? 'Change Logo' : 'Upload Logo'}</span>
                      </label>
                      {expFormData.logo && (
                        <button
                          type="button"
                          onClick={() => setExpFormData(prev => ({ ...prev, logo: '' }))}
                          className="text-xs text-red-500 mt-2 hover:underline"
                        >
                          Remove Logo
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isCurrent"
                    checked={expFormData.isCurrent}
                    onChange={(e) => setExpFormData(prev => ({ ...prev, isCurrent: e.target.checked }))}
                    className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-cyan-500 focus:ring-cyan-500"
                  />
                  <label htmlFor="isCurrent" className="text-sm text-gray-400">This is my current role</label>
                </div>
              </div>

              <div className="flex gap-3 mt-6 pt-6 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => {
                    setShowExpModal(false);
                    setEditingExp(null);
                    setExpFormData({
                      role: '',
                      company: '',
                      location: '',
                      startDate: '',
                      endDate: '',
                      isCurrent: false,
                      description: '',
                      tags: [],
                      icon: '',
                      logo: ''
                    });
                  }}
                  className="px-4 py-2.5 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
                <div className="flex-1"></div>
                {editingExp && (
                  <button
                    type="button"
                    onClick={() => handleDeleteExperience(editingExp._id)}
                    className="px-4 py-2.5 rounded-lg bg-red-600/10 text-red-400 hover:bg-red-600/20 transition-colors text-sm font-medium border border-red-600/20 flex items-center gap-2"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                )}
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg bg-cyan-600 text-white hover:bg-cyan-700 transition-colors text-sm font-medium flex items-center gap-2"
                >
                  <Save size={16} />
                  {editingExp ? 'Save Changes' : 'Add Experience'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add/Edit Education Modal */}
      {(showEduModal || editingEdu) && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#12121a] border border-gray-800 rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <form onSubmit={editingEdu ? handleUpdateEducation : handleCreateEducation}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">
                  {editingEdu ? 'Edit Education' : 'Add Education'}
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    setShowEduModal(false);
                    setEditingEdu(null);
                    setEduFormData({
                      role: '',
                      company: '',
                      location: '',
                      startDate: '',
                      endDate: '',
                      isCurrent: false,
                      description: '',
                      tags: [],
                      icon: '',
                      logo: ''
                    });
                  }}
                  className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">
                    Degree / Certificate <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Bachelor of Computer Science"
                    value={eduFormData.role}
                    onChange={(e) => setEduFormData(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">
                      Institution <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Addis Ababa University"
                      value={eduFormData.company}
                      onChange={(e) => setEduFormData(prev => ({ ...prev, company: e.target.value }))}
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">Location</label>
                    <input
                      type="text"
                      placeholder="City, State"
                      value={eduFormData.location}
                      onChange={(e) => setEduFormData(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">Start Date</label>
                    <input
                      type="text"
                      placeholder="2018"
                      value={eduFormData.startDate}
                      onChange={(e) => setEduFormData(prev => ({ ...prev, startDate: e.target.value }))}
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">End Date</label>
                    <input
                      type="text"
                      placeholder="2022"
                      value={eduFormData.endDate}
                      onChange={(e) => setEduFormData(prev => ({ ...prev, endDate: e.target.value }))}
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">
                    Description <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe your studies, achievements, and coursework..."
                    value={eduFormData.description}
                    onChange={(e) => setEduFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 resize-none"
                    required
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">Tags / Skills Learned</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {eduFormData.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-cyan-500/10 text-cyan-400 text-xs font-medium border border-cyan-500/20"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveEduTag(tag)}
                          className="hover:text-white"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add tag..."
                      value={newEduTag}
                      onChange={(e) => setNewEduTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddEduTag())}
                      className="flex-1 bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddEduTag}
                      className="px-3 py-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                {/* Icon */}
                <div>
                  <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">
                    Icon (Emoji) <span className="text-gray-600">- Optional</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 🎓, 📜, 🤖, 📚"
                    value={eduFormData.icon}
                    onChange={(e) => setEduFormData(prev => ({ ...prev, icon: e.target.value }))}
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                    maxLength={10}
                  />
                  <p className="text-xs text-gray-500 mt-1">Add an emoji icon to represent this education entry</p>
                </div>

                {/* Logo Upload */}
                <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700">
                  <label className="block text-xs text-gray-500 uppercase tracking-wider mb-3">Institution Logo / Image</label>
                  <div className="flex items-center gap-4">
                    {eduFormData.logo && (
                      <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-700 bg-gray-800/30">
                        <img src={fixImageUrl(eduFormData.logo)} alt="Logo Preview" className="w-full h-full object-contain" />
                      </div>
                    )}
                    <div className="flex-1">
                      <input
                        type="file"
                        id="edu-logo-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleLogoUpload(e.target.files[0], 'education')}
                      />
                      <label
                        htmlFor="edu-logo-upload"
                        className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed border-gray-700 hover:border-cyan-500 hover:bg-cyan-500/5 cursor-pointer transition-all ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {isUploading ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-cyan-400"></div>
                        ) : (
                          <ImageIcon className="text-gray-400" size={16} />
                        )}
                        <span className="text-sm text-gray-400">{eduFormData.logo ? 'Change Logo' : 'Upload Logo'}</span>
                      </label>
                      {eduFormData.logo && (
                        <button
                          type="button"
                          onClick={() => setEduFormData(prev => ({ ...prev, logo: '' }))}
                          className="text-xs text-red-500 mt-2 hover:underline"
                        >
                          Remove Logo
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6 pt-6 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => {
                    setShowEduModal(false);
                    setEditingEdu(null);
                    setEduFormData({
                      role: '',
                      company: '',
                      location: '',
                      startDate: '',
                      endDate: '',
                      isCurrent: false,
                      description: '',
                      tags: [],
                      icon: ''
                    });
                  }}
                  className="px-4 py-2.5 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
                <div className="flex-1"></div>
                {editingEdu && (
                  <button
                    type="button"
                    onClick={() => handleDeleteEducation(editingEdu._id)}
                    className="px-4 py-2.5 rounded-lg bg-red-600/10 text-red-400 hover:bg-red-600/20 transition-colors text-sm font-medium border border-red-600/20 flex items-center gap-2"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                )}
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg bg-cyan-600 text-white hover:bg-cyan-700 transition-colors text-sm font-medium flex items-center gap-2"
                >
                  <Save size={16} />
                  {editingEdu ? 'Save Changes' : 'Add Education'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Focus Modal */}
      {editingFocus && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#12121a] border border-gray-800 rounded-xl p-6 w-full max-w-lg">
            <form onSubmit={handleUpdateFocus}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">Edit Focus Section</h2>
                <button
                  type="button"
                  onClick={() => setEditingFocus(false)}
                  className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">Subtitle Label</label>
                  <input
                    type="text"
                    value={focusFormData.subtitle}
                    onChange={(e) => setFocusFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">Title</label>
                  <input
                    type="text"
                    value={focusFormData.title}
                    onChange={(e) => setFocusFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">Description</label>
                  <textarea
                    rows={3}
                    value={focusFormData.description}
                    onChange={(e) => setFocusFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 resize-none"
                  />
                </div>

                {/* Focus Image Upload */}
                <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700">
                  <label className="block text-xs text-gray-500 uppercase tracking-wider mb-3">Focus Representation (Photo/Logo)</label>
                  <div className="flex items-center gap-4">
                    {focusFormData.image && (
                      <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-700 bg-gray-800/30">
                        <img src={fixImageUrl(focusFormData.image)} alt="Focus Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1">
                      <input
                        type="file"
                        id="focus-image-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleLogoUpload(e.target.files[0], 'focus')}
                      />
                      <label
                        htmlFor="focus-image-upload"
                        className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed border-gray-700 hover:border-cyan-500 hover:bg-cyan-500/5 cursor-pointer transition-all ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {isUploading ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-cyan-400"></div>
                        ) : (
                          <ImageIcon className="text-gray-400" size={16} />
                        )}
                        <span className="text-sm text-gray-400">{focusFormData.image ? 'Change Photo' : 'Upload Photo'}</span>
                      </label>
                      {focusFormData.image && (
                        <button
                          type="button"
                          onClick={() => setFocusFormData(prev => ({ ...prev, image: '' }))}
                          className="text-xs text-red-500 mt-2 hover:underline"
                        >
                          Remove Photo
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">Stat 1 Value</label>
                    <input
                      type="text"
                      value={focusFormData.stats[0]?.value || ''}
                      onChange={(e) => setFocusFormData(prev => ({
                        ...prev,
                        stats: [{ ...prev.stats[0], value: e.target.value }, prev.stats[1]]
                      }))}
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">Stat 1 Label</label>
                    <input
                      type="text"
                      value={focusFormData.stats[0]?.label || ''}
                      onChange={(e) => setFocusFormData(prev => ({
                        ...prev,
                        stats: [{ ...prev.stats[0], label: e.target.value }, prev.stats[1]]
                      }))}
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">Stat 2 Value</label>
                    <input
                      type="text"
                      value={focusFormData.stats[1]?.value || ''}
                      onChange={(e) => setFocusFormData(prev => ({
                        ...prev,
                        stats: [prev.stats[0], { ...prev.stats[1], value: e.target.value }]
                      }))}
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">Stat 2 Label</label>
                    <input
                      type="text"
                      value={focusFormData.stats[1]?.label || ''}
                      onChange={(e) => setFocusFormData(prev => ({
                        ...prev,
                        stats: [prev.stats[0], { ...prev.stats[1], label: e.target.value }]
                      }))}
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6 pt-6 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setEditingFocus(false)}
                  className="px-4 py-2.5 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg bg-cyan-600 text-white hover:bg-cyan-700 transition-colors text-sm font-medium flex items-center gap-2 ml-auto"
                >
                  <Save size={16} />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default Skills;
