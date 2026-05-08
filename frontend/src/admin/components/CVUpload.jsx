import { useState, useRef } from 'react';
import { Upload, FileText, X, Loader2, ExternalLink } from 'lucide-react';
import { uploadService } from '../services';
import { toast } from 'sonner';

const CVUpload = ({ resumeUrl, onChange }) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (file.type !== 'application/pdf') {
      toast.error('Please select a PDF file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    try {
      setUploading(true);

      // Upload to server (reusing image upload endpoint - backend should handle PDFs too)
      const result = await uploadService.uploadImage(file);
      
      if (result.success) {
        onChange(result.data.url);
        toast.success('CV uploaded successfully!');
      } else {
        toast.error('Failed to upload CV');
      }
    } catch (error) {
      toast.error('Upload failed: ' + (error.message || 'Unknown error'));
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-[#12121a] border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all duration-300 hover:transform hover:scale-[1.01] hover:shadow-2xl hover:shadow-orange-400/60 hover:-translate-y-1"
         style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">CV / Resume</h3>
        {resumeUrl && (
          <button
            onClick={handleRemove}
            className="text-red-400 hover:text-red-300 p-1"
            title="Remove CV"
          >
            <X size={18} />
          </button>
        )}
      </div>
      
      <div 
        onClick={() => !uploading && !resumeUrl && fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
          resumeUrl ? 'border-orange-500/50' : 'border-gray-700 hover:border-orange-500 cursor-pointer'
        } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />

        {resumeUrl ? (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                <FileText className="text-orange-400" size={28} />
              </div>
              <div>
                <p className="text-sm text-gray-300 font-medium">CV Uploaded</p>
                <p className="text-xs text-gray-500">PDF Document</p>
              </div>
            </div>
            <div className="flex gap-2">
              <a
                href={resumeUrl}
                className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <ExternalLink size={16} />
                Open CV
              </a>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <Upload size={16} />
                Replace
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gray-800/50 flex items-center justify-center flex-shrink-0">
                {uploading ? (
                  <Loader2 className="text-orange-500 animate-spin" size={28} />
                ) : (
                  <FileText className="text-gray-500" size={28} />
                )}
              </div>
              <div>
                <p className="text-sm text-gray-300 font-medium">
                  {uploading ? 'Uploading...' : 'Upload your CV'}
                </p>
                <p className="text-xs text-gray-500">PDF format only (Max 5MB)</p>
              </div>
            </div>
            {!uploading && (
              <button className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                <Upload size={16} />
                Upload CV
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CVUpload;
