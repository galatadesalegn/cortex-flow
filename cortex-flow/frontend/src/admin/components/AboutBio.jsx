import { useTheme } from '../hooks';

const AboutBio = ({ bio, onChange }) => {
  const { isDark } = useTheme();
  return (
    <div className={`border rounded-xl p-6 transition-all duration-300 hover:transform hover:scale-[1.01] hover:-translate-y-1 ${
      isDark ? 'bg-[#12121a] border-gray-800 hover:border-gray-700 hover:shadow-2xl hover:shadow-green-400/60' : 'bg-bg-card border-border-theme hover:border-accent shadow-soft hover:shadow-md'
    }`}
         style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}>
      <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${isDark ? 'text-white' : 'text-text-primary'}`}>About Bio</h3>
      
      <textarea
        value={bio || ''}
        onChange={(e) => onChange(e.target.value)}
        rows={6}
        className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 transition-all duration-300 resize-none ${
          isDark 
            ? 'bg-gray-800/50 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500' 
            : 'bg-bg-secondary border-border-theme text-text-primary placeholder-text-muted focus:border-accent focus:ring-accent'
        }`}
        placeholder="Write your bio here..."
      />
    </div>
  );
};

export default AboutBio;
