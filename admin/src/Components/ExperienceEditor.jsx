import { useState } from 'react';
import { Briefcase, Plus, Trash2, Image as ImageIcon, Loader2 } from 'lucide-react';
import { uploadService } from '../services';
import { toast } from 'sonner';

const ExperienceEditor = ({ data, onChange }) => {
  const [newExp, setNewExp] = useState({ role: '', period: '', desc: '', highlight: false, logo: '' });
  const [uploadingState, setUploadingState] = useState(null); // track what is uploading

  const experience = data?.experience || [];

  const handleUploadLogo = async (index, file) => {
    if (!file) return;
    try {
      setUploadingState(index);
      const result = await uploadService.uploadImage(file);
      if (result.success) {
        if (index === 'new') {
          setNewExp({ ...newExp, logo: result.data.url });
        } else {
          updateExperience(index, 'logo', result.data.url);
        }
        toast.success('Logo uploaded successfully');
      } else {
        toast.error('Failed to upload logo');
      }
    } catch (error) {
      toast.error('Upload failed');
    } finally {
      setUploadingState(null);
    }
  };

  const addExperience = () => {
    if (!newExp.role || !newExp.period) return;
    const updated = [...experience, { ...newExp, id: Date.now() }];
    onChange('experience', updated);
    setNewExp({ role: '', period: '', desc: '', highlight: false, logo: '' });
  };

  const removeExperience = (index) => {
    const updated = experience.filter((_, i) => i !== index);
    onChange('experience', updated);
  };

  const updateExperience = (index, field, value) => {
    const updated = experience.map((exp, i) =>
      i === index ? { ...exp, [field]: value } : exp
    );
    onChange('experience', updated);
  };

  return (
    <div className="bg-[#12121a] border border-gray-800 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <Briefcase size={20} className="text-orange-400" />
        <h2 className="text-lg font-semibold text-white">Work Experience</h2>
      </div>

      {/* List */}
      <div className="space-y-4 mb-6">
        {experience.map((exp, index) => (
          <div key={exp.id || index} className="bg-gray-800/30 border border-gray-700 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <input
                type="text"
                value={exp.role}
                onChange={(e) => updateExperience(index, 'role', e.target.value)}
                placeholder="Role & Company"
                className="flex-1 bg-transparent border-none outline-none text-sm font-semibold text-white placeholder-gray-500 focus:ring-0"
              />
              <button
                onClick={() => removeExperience(index)}
                className="text-red-400 hover:text-red-300 p-1"
              >
                <Trash2 size={16} />
              </button>
            </div>
            {/* Logo Upload Section */}
            <div className="flex gap-4 items-center mb-3 mt-1">
              {exp.logo && (
                <img src={exp.logo} alt="Logo" className="w-10 h-10 rounded-lg object-cover bg-white" />
              )}
              <label className="flex items-center gap-2 cursor-pointer w-fit text-xs text-blue-400 hover:text-blue-300 transition-colors bg-blue-500/10 px-3 py-1.5 rounded disabled:opacity-50">
                {uploadingState === index ? <Loader2 size={14} className="animate-spin" /> : <ImageIcon size={14} />}
                {uploadingState === index ? 'Uploading...' : 'Upload Company Logo'}
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  disabled={uploadingState === index}
                  onChange={(e) => handleUploadLogo(index, e.target.files[0])}
                />
              </label>
            </div>
            <input
              type="text"
              value={exp.period}
              onChange={(e) => updateExperience(index, 'period', e.target.value)}
              placeholder="Period (e.g., 2021 — PRESENT)"
              className="w-full bg-transparent border-none outline-none text-xs text-gray-400 placeholder-gray-600 mb-2 focus:ring-0"
            />
            <textarea
              value={exp.desc}
              onChange={(e) => updateExperience(index, 'desc', e.target.value)}
              placeholder="Description"
              rows={2}
              className="w-full bg-transparent border-none outline-none text-xs text-gray-300 placeholder-gray-600 resize-none focus:ring-0"
            />
            <label className="flex items-center gap-2 mt-2 cursor-pointer">
              <input
                type="checkbox"
                checked={exp.highlight}
                onChange={(e) => updateExperience(index, 'highlight', e.target.checked)}
                className="rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-0"
              />
              <span className="text-xs text-gray-400">Highlight this experience</span>
            </label>
          </div>
        ))}
      </div>

      {/* Add New */}
      <div className="border-t border-gray-700 pt-4">
        <h3 className="text-sm font-medium text-gray-400 mb-3">Add New Experience</h3>
        <div className="space-y-3">
          <input
            type="text"
            value={newExp.role}
            onChange={(e) => setNewExp({ ...newExp, role: e.target.value })}
            placeholder="Role & Company (e.g., Senior Developer at Google)"
            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
          <div className="flex gap-4 items-center">
            {newExp.logo && (
              <img src={newExp.logo} alt="New Logo" className="w-10 h-10 rounded-lg object-cover" />
            )}
            <label className="flex items-center gap-2 cursor-pointer w-fit text-xs text-blue-400 hover:text-blue-300 transition-colors bg-blue-500/10 px-3 py-1.5 rounded disabled:opacity-50">
              {uploadingState === 'new' ? <Loader2 size={14} className="animate-spin" /> : <ImageIcon size={14} />}
              {uploadingState === 'new' ? 'Uploading...' : 'Upload Company Logo'}
              <input
                type="file"
                className="hidden"
                accept="image/*"
                disabled={uploadingState === 'new'}
                onChange={(e) => handleUploadLogo('new', e.target.files[0])}
              />
            </label>
          </div>
          <input
            type="text"
            value={newExp.period}
            onChange={(e) => setNewExp({ ...newExp, period: e.target.value })}
            placeholder="Period (e.g., 2021 — PRESENT)"
            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
          <textarea
            value={newExp.desc}
            onChange={(e) => setNewExp({ ...newExp, desc: e.target.value })}
            placeholder="Description of your role and achievements"
            rows={2}
            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
          />
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={newExp.highlight}
              onChange={(e) => setNewExp({ ...newExp, highlight: e.target.checked })}
              className="rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-0"
            />
            <span className="text-sm text-gray-400">Highlight this experience</span>
          </label>
          <button
            onClick={addExperience}
            disabled={!newExp.role || !newExp.period}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors w-full justify-center"
          >
            <Plus size={16} />
            Add Experience
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExperienceEditor;
