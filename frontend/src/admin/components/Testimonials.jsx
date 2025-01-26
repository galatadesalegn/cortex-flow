import { useState, useEffect, useMemo, useCallback } from 'react';
import { Plus, Pencil, Trash2, Star, CheckCircle, XCircle, Quote, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import { useTestimonials, useCreateTestimonial, useUpdateTestimonial, useDeleteTestimonial, useToggleTestimonial, useUpload, useTheme } from '../hooks';

const initialFormState = {
  name: '',
  role: '',
  company: '',
  content: '',
  avatar: '',
  rating: 5,
  verified: true,
  projectName: '',
  active: true,
  order: 0,
};

const Testimonials = () => {
  const { isDark } = useTheme();
  const { testimonials, loading, refetch } = useTestimonials();
  const { create, loading: creating } = useCreateTestimonial();
  const { update, loading: updating } = useUpdateTestimonial();
  const { delete: deleteTestimonial, loading: deleting } = useDeleteTestimonial();
  const { toggle, loading: toggling } = useToggleTestimonial();
  const { uploadImage, uploading } = useUpload();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialFormState);
  const [previewAvatar, setPreviewAvatar] = useState(null);

  // Memoized testimonial list for better performance
  const memoizedTestimonials = useMemo(() => testimonials || [], [testimonials]);

  const handleChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onload = (e) => setPreviewAvatar(e.target.result);
    reader.readAsDataURL(file);

    // Upload
    const result = await uploadImage(file);
    if (result.success) {
      handleChange('avatar', result.url);
      toast.success('Avatar uploaded successfully');
    } else {
      toast.error('Failed to upload avatar');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.role || !formData.company || !formData.content) {
      toast.error('Please fill in all required fields');
      return;
    }

    let result;
    if (editingId) {
      result = await update(editingId, formData);
      if (result.success) {
        toast.success('Testimonial updated successfully');
      } else { 
        toast.error(result.error || 'Failed to update testimonial');
        return;
      }
    } else {
      result = await create(formData);
      if (result.success) {
        toast.success('Testimonial created successfully');
      } else {
        toast.error(result.error || 'Failed to create testimonial');
        return;
      }
    }

    closeModal();
    refetch(true); // Force refresh after create/update
  };

  const handleEdit = (testimonial) => {
    setEditingId(testimonial._id);
    setFormData({
      name: testimonial.name,
      role: testimonial.role,
      company: testimonial.company,
      content: testimonial.content,
      avatar: testimonial.avatar || '',
      rating: testimonial.rating || 5,
      verified: testimonial.verified !== false,
      projectName: testimonial.projectName || '',
      active: testimonial.active !== false,
      order: testimonial.order || 0,
    });
    setPreviewAvatar(testimonial.avatar);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;

    const result = await deleteTestimonial(id);
    if (result.success) {
      toast.success('Testimonial deleted successfully');
      refetch(true); // Force refresh after delete
    } else {
      toast.error(result.error || 'Failed to delete testimonial');
    }
  };

  const handleToggle = async (id) => {
    const result = await toggle(id);
    if (result.success) {
      toast.success(`Testimonial ${result.data.active ? 'activated' : 'deactivated'}`);
      refetch(true); // Force refresh after toggle
    } else {
      toast.error(result.error || 'Failed to toggle testimonial');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData(initialFormState);
    setPreviewAvatar(null);
  };

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <Star
        key={i}
        size={12}
        className={i < rating ? 'text-accent fill-accent' : isDark ? 'text-gray-600' : 'text-text-muted'}
      />
    ));
  };

  return (
    <div className={`p-6 min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#0a0a0f]' : 'bg-bg-primary'}`}>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-bold transition-colors duration-300 ${isDark ? 'text-white' : 'text-text-primary'}`}>Testimonials</h1>
          <p className={`mt-1 transition-colors duration-300 ${isDark ? 'text-gray-500' : 'text-text-muted'}`}>Manage client testimonials and reviews</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-lg shadow-blue-600/20"
        >
          <Plus size={18} />
          Add Testimonial
        </button>
      </div>

      {/* Testimonials Grid */}
      {loading && !memoizedTestimonials.length ? (
        <div className="flex justify-center py-12">
          <div className="w-12 h-12 border-4 border-[#1de9b6]/30 border-t-[#1de9b6] rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {memoizedTestimonials.map((testimonial) => (
            <div
              key={testimonial._id}
              className={`rounded-xl border p-5 transition-all group ${
                testimonial.active 
                  ? isDark ? 'bg-[#0c0c0c] border-blue-500/20 hover:border-blue-500/40' : 'bg-bg-card border-accent/20 hover:border-accent shadow-soft hover:shadow-md'
                  : isDark ? 'bg-gray-900/50 border-gray-800' : 'bg-bg-secondary border-border-theme'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {testimonial.avatar ? (
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className={`w-12 h-12 rounded-full object-cover border ${isDark ? 'border-blue-500/30' : 'border-border-theme'}`}
                    />
                  ) : (
                    <div className={`w-12 h-12 rounded-full border flex items-center justify-center ${
                      isDark ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' : 'bg-bg-secondary border-border-theme text-accent'
                    }`}>
                      <span className="font-bold text-lg">
                        {testimonial.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <h3 className={`font-semibold text-sm transition-colors duration-300 ${isDark ? 'text-white' : 'text-text-primary'}`}>{testimonial.name}</h3>
                    <p className={`text-xs transition-colors duration-300 ${isDark ? 'text-gray-500' : 'text-text-muted'}`}>{testimonial.role}</p>
                    <p className={`text-xs transition-colors duration-300 ${isDark ? 'text-blue-400' : 'text-accent'}`}>{testimonial.company}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  {renderStars(testimonial.rating || 5)}
                </div>
              </div>

              <div className="relative">
                <Quote size={24} className={`absolute -top-2 -left-2 opacity-10 ${isDark ? 'text-blue-400' : 'text-accent'}`} />
                <p className={`text-sm leading-relaxed mb-4 relative z-10 transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
                  "{testimonial.content}"
                </p>
              </div>

              <div className={`pt-4 border-t flex items-center justify-between transition-colors duration-300 ${isDark ? 'border-gray-800' : 'border-border-theme'}`}>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleToggle(testimonial._id)}
                    className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                      testimonial.active ? 'text-green-400' : 'text-gray-500'
                    }`}
                  >
                    {testimonial.active ? <CheckCircle size={14} /> : <XCircle size={14} />}
                    {testimonial.active ? 'Active' : 'Draft'}
                  </button>
                  {testimonial.verified && (
                    <span className="flex items-center gap-1 text-[10px] text-blue-400 font-bold uppercase tracking-wider">
                      <CheckCircle size={12} />
                      Verified
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(testimonial)}
                    className={`p-2 rounded-lg transition-colors ${isDark ? 'bg-gray-800 text-gray-400 hover:text-white' : 'bg-bg-secondary text-text-secondary hover:text-text-primary'}`}
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(testimonial._id)}
                    className={`p-2 rounded-lg transition-colors ${isDark ? 'bg-gray-800 text-gray-400 hover:text-red-400' : 'bg-bg-secondary text-text-secondary hover:text-red-600'}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0c0c0c] rounded-2xl border border-[#1de9b6]/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h2 className="text-xl font-bold text-white">
                {editingId ? 'Edit Testimonial' : 'Add Testimonial'}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Avatar Upload */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  {previewAvatar ? (
                    <img
                      src={previewAvatar}
                      alt="Preview"
                      className="w-20 h-20 rounded-full object-cover border-2 border-[#1de9b6]/30"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-[#1de9b6]/10 border-2 border-dashed border-[#1de9b6]/30 flex items-center justify-center">
                      <Quote size={24} className="text-[#1de9b6]/50" />
                    </div>
                  )}
                  <label className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#1de9b6] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#1de9b6]/80 transition-colors">
                    <Plus size={16} className="text-[#0a0a0a]" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <div>
                  <p className="text-white font-medium">Profile Photo</p>
                  <p className="text-gray-500 text-sm">Upload a photo (optional)</p>
                </div>
              </div>

              {/* Name, Role, Company */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#1de9b6]/50 transition-colors"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">
                    Role *
                  </label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => handleChange('role', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#1de9b6]/50 transition-colors"
                    placeholder="CTO"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">
                    Company *
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => handleChange('company', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#1de9b6]/50 transition-colors"
                    placeholder="Company Name"
                    required
                  />
                </div>
              </div>

              {/* Content */}
              <div>
                <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">
                  Testimonial Content *
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => handleChange('content', e.target.value)}
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#1de9b6]/50 transition-colors resize-none"
                  placeholder="What they said about working with you..."
                  required
                />
              </div>

              {/* Rating & Project */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">
                    Rating
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleChange('rating', star)}
                        className="p-1 transition-colors"
                      >
                        <Star
                          size={24}
                          className={star <= formData.rating ? 'text-[#1de9b6] fill-[#1de9b6]' : 'text-gray-600'}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">
                    Project Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.projectName}
                    onChange={(e) => handleChange('projectName', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#1de9b6]/50 transition-colors"
                    placeholder="e.g. E-commerce Platform"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className={`relative w-12 h-6 rounded-full transition-colors ${formData.verified ? 'bg-[#1de9b6]' : 'bg-gray-700'}`}>
                    <input
                      type="checkbox"
                      checked={formData.verified}
                      onChange={(e) => handleChange('verified', e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${formData.verified ? 'translate-x-6' : ''}`} />
                  </div>
                  <span className="text-gray-400 text-sm">Verified Project</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <div className={`relative w-12 h-6 rounded-full transition-colors ${formData.active ? 'bg-[#1de9b6]' : 'bg-gray-700'}`}>
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={(e) => handleChange('active', e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${formData.active ? 'translate-x-6' : ''}`} />
                  </div>
                  <span className="text-gray-400 text-sm">Active</span>
                </label>
              </div>

              {/* Submit */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating || updating || uploading}
                  className="flex items-center gap-2 bg-[#1de9b6] hover:bg-[#1de9b6]/90 disabled:bg-[#1de9b6]/50 text-[#0a0a0a] px-6 py-2.5 rounded-lg font-bold transition-all"
                >
                  <Save size={18} />
                  {creating || updating ? 'Saving...' : (editingId ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Testimonials;
