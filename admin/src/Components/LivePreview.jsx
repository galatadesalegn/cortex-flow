import { useState, useEffect } from 'react';
import { ExternalLink, RefreshCw, Globe, AlertCircle } from 'lucide-react';

const LivePreview = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const portfolioUrl = 'http://localhost:5174';

  useEffect(() => {
    // Check if portfolio is available
    fetch(portfolioUrl, { mode: 'no-cors' })
      .then(() => {
        setIsLoading(false);
        setHasError(false);
      })
      .catch(() => {
        setIsLoading(false);
        setHasError(true);
      });
  }, []);

  const handleRefresh = () => {
    setIframeKey(prev => prev + 1);
  };

  return (
    <div className="bg-[#12121a] border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all duration-300"
         style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Live Preview</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Portfolio Website</span>
          <a
            href={portfolioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
          >
            <ExternalLink size={14} />
            Open
          </a>
        </div>
      </div>

      <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-700" style={{ height: '700px' }}>
        {hasError ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-6">
            <AlertCircle size={48} className="text-orange-400 mb-4" />
            <p className="text-gray-400 text-center mb-4">Portfolio website is not running</p>
            <p className="text-xs text-gray-500 text-center mb-4">
              Start the portfolio site with:<br/>
              <code className="bg-gray-800 px-2 py-1 rounded mt-1 inline-block">cd ../Frontend && npm run dev -- --port 5174</code>
            </p>
            <button
              onClick={() => window.open(portfolioUrl, '_blank')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
            >
              <Globe size={16} />
              Open Portfolio
            </button>
          </div>
        ) : (
          <iframe
            key={iframeKey}
            src={portfolioUrl}
            className="w-full h-full border-0"
            title="Live Preview"
            sandbox="allow-same-origin allow-scripts allow-forms"
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setHasError(true);
            }}
          />
        )}
        {isLoading && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <p className="text-xs text-gray-500">
          {hasError ? 'Portfolio not connected' : 'Preview updates in real-time'}
        </p>
        <button
          onClick={handleRefresh}
          disabled={hasError}
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors disabled:opacity-50"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>
    </div>
  );
};

export default LivePreview;
