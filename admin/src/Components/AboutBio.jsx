const AboutBio = ({ bio, onChange }) => {
  return (
    <div className="bg-[#12121a] border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all duration-300 hover:transform hover:scale-[1.01] hover:shadow-2xl hover:shadow-green-400/60 hover:-translate-y-1"
         style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}>
      <h3 className="text-lg font-semibold text-white mb-4">About Bio</h3>
      
      <textarea
        value={bio || ''}
        onChange={(e) => onChange(e.target.value)}
        rows={6}
        className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none"
        placeholder="Write your bio here..."
      />
    </div>
  );
};

export default AboutBio;
