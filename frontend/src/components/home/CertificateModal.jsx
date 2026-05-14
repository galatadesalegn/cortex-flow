import React from "react";
import { toast } from "sonner";
import { fixImageUrl } from "../../utils/imageHelper.js";

const CertificateModal = ({ isOpen, onClose, certificate }) => {
  if (!isOpen || !certificate) return null;

  const handleCopyLink = () => {
    if (!certificate.link) {
      toast.error('No link available to copy');
      return;
    }
    navigator.clipboard.writeText(certificate.link);
    toast.success('Link copied to clipboard!', {
      description: 'You can now share this certificate link.',
    });
  };

  const handleDownloadImage = () => {
    if (!certificate.image) {
      toast.error('No image available to download');
      return;
    }
    const link = document.createElement('a');
    link.href = fixImageUrl(certificate.image);
    link.download = `${certificate.title || 'certificate'}.png`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Downloading certificate...', {
      description: 'The image download should start shortly.',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4 backdrop-blur-sm">
      <div className="bg-bg-card rounded-2xl shadow-soft max-w-5xl w-full flex flex-col md:flex-row overflow-hidden relative border border-border-theme">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-theme-muted hover:text-accent text-2xl z-10"
          onClick={onClose}
        >
          &times;
        </button>
        {/* Certificate Image */}
        <div className="flex-1 flex items-center justify-center p-6 md:p-8 bg-bg-secondary min-h-[250px] md:min-h-[400px]">
          <img
            src={fixImageUrl(certificate.image) || "/certificate-placeholder.png"}
            alt={certificate.title}
            className="rounded-xl max-h-64 md:max-h-96 shadow-soft border border-border-theme"
          />
        </div>
        {/* Certificate Details */}
        <div className="flex-1 p-6 md:p-8 flex flex-col gap-4 bg-bg-card">
          <h2 className="text-2xl font-bold text-theme-primary mb-2">
            {certificate.title}
          </h2>
          <div className="text-accent text-sm mb-2">
            <span className="font-semibold">Issue Date:</span> {certificate.issueDate || certificate.date}
          </div>
          <div className="text-accent text-sm mb-2">
            <span className="font-semibold">Expiry:</span> {certificate.expiry || "Lifetime"}
          </div>
          <div className="text-theme-muted text-sm mb-2">
            <span className="font-semibold">Certificate ID:</span> {certificate.id || "-"}
          </div>
          <div className="bg-bg-secondary rounded-lg p-4 flex items-center gap-4 mb-2 border border-border-theme">
            {certificate.link ? (
              <div className="bg-white rounded-lg p-2 shadow-sm">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=${encodeURIComponent(certificate.link)}`}
                  alt="QR Code"
                  className="w-8 h-8"
                />
              </div>
            ) : (
              <div className="bg-white rounded-lg p-2 shadow-sm">
                <img src="/blockchain-icon.png" alt="Verified" className="w-8 h-8" />
              </div>
            )}
            <div>
              <div className="text-theme-primary font-semibold">QR Code Verified</div>
              <div className="text-theme-muted text-xs">Scan to verify certificate authenticity and view details.</div>
            </div>
          </div>
          <div className="flex gap-2 mt-4 flex-wrap">
            {certificate.image && (
              <button
                onClick={handleDownloadImage}
                className="bg-accent text-dark-primary px-4 py-2 rounded-full font-semibold hover:bg-accent-hover transition shadow-soft"
              >
                Download Image
              </button>
            )}
            {certificate.link && (
              <button
                onClick={handleCopyLink}
                className="bg-bg-secondary text-accent px-4 py-2 rounded-full font-semibold hover:bg-bg-accent transition border border-border-theme"
              >
                Copy Link
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateModal;
