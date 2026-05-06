import { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, X, Loader2 } from 'lucide-react';
import { uploadService } from '../services';
import { toast } from 'sonner';

const ProfileImageUpload = ({ image, onChange }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(image || null);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    try {
      setUploading(true);
      
      // Show preview immediately
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);

      // Upload to server
      const result = await uploadService.uploadImage(file);
      
      if (result.success) {
        onChange(result.data.url);
        toast.success('Image uploaded successfully!');
      } else {
        toast.error('Failed to upload image');
      }
    } catch (error) {
      toast.error('Upload failed: ' + (error.message || 'Unknown error'));
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const displayImage = preview || image;

  return (
    <div className="bg-[#12121a] border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all duration-300 hover:transform hover:scale-[1.01] hover:shadow-2xl hover:shadow-purple-400/60 hover:-translate-y-1"
         style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Profile Image</h3>
        {displayImage && (
          <button
            onClick={handleRemove}
            className="text-red-400 hover:text-red-300 p-1"
            title="Remove image"
          >
            <X size={18} />
          </button>
        )}
      </div>
      
      <div 
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
          displayImage ? 'border-blue-500/50' : 'border-gray-700 hover:border-blue-500'
        } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />

        {displayImage ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-xl overflow-hidden bg-gray-800 shadow-lg">
              <img 
                src={displayImage} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-sm text-gray-400">Click to change image</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 py-8">
            <div className="w-20 h-20 rounded-full bg-gray-800/50 flex items-center justify-center">
              {uploading ? (
                <Loader2 className="text-blue-500 animate-spin" size={40} />
              ) : (
                <ImageIcon className="text-gray-500" size={40} />
              )}
            </div>
            <div className="text-center">
              <p className="text-base text-gray-300 font-medium">
                {uploading ? 'Uploading...' : 'Click to upload image'}
              </p>
              <p className="text-sm text-gray-500 mt-2">PNG, JPG or WEBP (Max 5MB)</p>
            </div>
            {!uploading && (
              <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors mt-2">
                <Upload size={18} />
                Upload Image
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileImageUpload;
