import React from "react";

const CertificateModal = ({ isOpen, onClose, certificate }) => {
  if (!isOpen || !certificate) return null;

  const handleCopyLink = () => {
    if (!certificate.link) {
      alert('No link to copy');
      return;
    }
    navigator.clipboard.writeText(certificate.link);
    alert('Link copied to clipboard!');
  };

  const handleDownloadImage = () => {
    if (!certificate.image) {
      alert('No image to download');
      return;
    }
    const link = document.createElement('a');
    link.href = certificate.image;
    link.download = `${certificate.title || 'certificate'}.png`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4">
      <div className="bg-[#0a1a14] rounded-2xl shadow-lg max-w-5xl w-full flex flex-col md:flex-row overflow-hidden relative border border-[#1de9b6]/30">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-[#1de9b6] text-2xl z-10"
          onClick={onClose}
        >
          &times;
        </button>
        {/* Certificate Image */}
        <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-[#1de9b6]/10 to-[#0a1a14] min-h-[400px]">
          <img
            src={certificate.image || "/certificate-placeholder.png"}
            alt={certificate.title}
            className="rounded-xl max-h-96 shadow-lg border border-[#1de9b6]/30"
          />
        </div>
        {/* Certificate Details */}
        <div className="flex-1 p-8 flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-white mb-2">
            {certificate.title}
          </h2>
          <div className="text-[#1de9b6] text-sm mb-2">
            <span className="font-semibold">Issue Date:</span> {certificate.issueDate || certificate.date}
          </div>
          <div className="text-[#1de9b6] text-sm mb-2">
            <span className="font-semibold">Expiry:</span> {certificate.expiry || "Lifetime"}
          </div>
          <div className="text-gray-400 text-sm mb-2">
            <span className="font-semibold">Certificate ID:</span> {certificate.id || "-"}
          </div>
          <div className="bg-[#13241c] rounded-lg p-4 flex items-center gap-4 mb-2">
            {certificate.link ? (
              <div className="bg-white rounded-lg p-2">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=${encodeURIComponent(certificate.link)}`}
                  alt="QR Code"
                  className="w-8 h-8"
                />
              </div>
            ) : (
              <div className="bg-white rounded-lg p-2">
                <img src="/blockchain-icon.png" alt="Verified" className="w-8 h-8" />
              </div>
            )}
            <div>
              <div className="text-white font-semibold">QR Code Verified</div>
              <div className="text-gray-400 text-xs">Scan to verify certificate authenticity and view details.</div>
            </div>
          </div>
          <div className="flex gap-2 mt-4 flex-wrap">
            {certificate.image && (
              <button
                onClick={handleDownloadImage}
                className="bg-[#1de9b6] text-[#0a1a14] px-4 py-2 rounded-lg font-semibold hover:bg-[#14b98a] transition"
              >
                Download Image
              </button>
            )}
            {certificate.link && (
              <button
                onClick={handleCopyLink}
                className="bg-[#13241c] text-[#1de9b6] px-4 py-2 rounded-lg font-semibold hover:bg-[#1de9b6] hover:text-[#0a1a14] transition"
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
