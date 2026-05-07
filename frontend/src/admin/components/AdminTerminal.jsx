import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, Cpu, Activity, Globe, ShieldCheck } from 'lucide-react';
import { useTheme } from '../hooks';

const AdminTerminal = () => {
  const [logs, setLogs] = useState([]);
  const [uptime, setUptime] = useState('00:00:00');
  const scrollRef = useRef(null);
  const { isDark } = useTheme();

  const initialLogs = [
    { type: 'system', text: `Initializing ${isDark ? 'Obsidian' : 'Silver'} Nexus Core v2.1.0...` },
    { type: 'success', text: 'Secure handshake established with MongoDB Atlas.' },
    { type: 'info', text: 'Syncing portfolio data with global edge nodes...' },
    { type: 'success', text: 'Admin authentication verified. Session active.' },
    { type: 'warning', text: 'Monitoring active sessions: 1 detected (You).' },
    { type: 'system', text: 'All systems operational. Ready for commands.' },
  ];

  useEffect(() => {
    setLogs(initialLogs);
    const startTime = Date.now();

    const interval = setInterval(() => {
      // Update uptime
      const diff = Date.now() - startTime;
      const h = Math.floor(diff / 3600000).toString().padStart(2, '0');
      const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
      const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
      setUptime(`${h}:${m}:${s}`);

      // Continuous system iteration logs
      const randomMsgs = [
        { type: 'info', text: 'Health Check: All systems nominal (100%).' },
        { type: 'system', text: 'Scanning database for integrity... [OK]' },
        { type: 'info', text: 'Optimizing API gateway throughput...' },
        { type: 'success', text: 'Portfolio assets revalidated at global edge nodes.' },
        { type: 'warning', text: 'Active session detected: admin@obsidian-nexus' },
        { type: 'info', text: 'Memory leak scan complete: 0 leaks found.' },
        { type: 'success', text: 'Firewall state: HIGH VIGILANCE' },
        { type: 'system', text: 'Re-indexing project metadata for search optimization...' }
      ];
      
      const msg = randomMsgs[Math.floor(Math.random() * randomMsgs.length)];
      setLogs(prev => {
        const newLogs = [...prev, { ...msg, time: new Date().toLocaleTimeString() }];
        return newLogs.slice(-10); // Keep only 10 to prevent vertical overflow
      });
    }, 2000); // Faster iteration for "continuous" feel

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className={`border rounded-xl overflow-hidden shadow-2xl h-full flex flex-col transition-all duration-300 ${
      isDark ? 'bg-[#0a0a0f] border-gray-800' : 'bg-[#FFFFFF] border-[#DDDDDD]'
    }`}>
      {/* Terminal Header */}
      <div className={`px-4 py-2 border-b flex items-center justify-between transition-colors duration-300 ${
        isDark ? 'bg-gray-900/50 border-gray-800' : 'bg-[#ECECEC] border-[#DDDDDD]'
      }`}>
        <div className="flex items-center gap-2">
          <TerminalIcon size={14} className={isDark ? 'text-cyan-400' : 'text-accent'} />
          <span className={`text-[10px] font-bold uppercase tracking-widest transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-[#555555]'}`}>System Console</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Activity size={12} className="text-green-500 animate-pulse" />
            <span className={`text-[10px] transition-colors duration-300 ${isDark ? 'text-gray-500' : 'text-[#888888]'}`}>UPTIME: {uptime}</span>
          </div>
          <div className="flex gap-1.5">
            <div className="w-2 h-2 rounded-full bg-red-500/20 border border-red-500/50" />
            <div className="w-2 h-2 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
            <div className="w-2 h-2 rounded-full bg-green-500/20 border border-green-500/50" />
          </div>
        </div>
      </div>

      {/* Terminal Body */}
      <div 
        ref={scrollRef}
        className={`flex-1 p-4 font-mono text-[11px] overflow-hidden transition-colors duration-300 ${
          isDark ? 'bg-black/40' : 'bg-[#F5F5F7]/50'
        }`}
      >
        {logs.map((log, idx) => (
          <div key={idx} className="mb-1.5 flex gap-2">
            <span className={isDark ? 'text-gray-600' : 'text-[#AAAAAA]'}>[{log.time || 'CORE'}]</span>
            <span className={
              log.type === 'success' ? (isDark ? 'text-green-400' : 'text-green-600') :
              log.type === 'warning' ? (isDark ? 'text-yellow-400' : 'text-yellow-600') :
              log.type === 'system' ? (isDark ? 'text-cyan-400 font-bold' : 'text-accent font-bold') :
              (isDark ? 'text-gray-300' : 'text-[#555555]')
            }>
              {log.type === 'system' ? '> ' : ':: '}
              {log.text}
            </span>
          </div>
        ))}
        <div className="flex items-center gap-2 mt-2">
          <span className={isDark ? 'text-cyan-500' : 'text-accent'}>admin@{isDark ? 'obsidian' : 'silver'}-nexus:~$</span>
          <span className={`w-2 h-4 animate-pulse ${isDark ? 'bg-cyan-500' : 'bg-accent'}`} />
        </div>
      </div>

      {/* Stats Footer */}
      <div className={`p-3 grid grid-cols-3 gap-2 border-t transition-colors duration-300 ${
        isDark ? 'border-gray-800 bg-gray-900/20' : 'border-[#DDDDDD] bg-[#ECECEC]'
      }`}>
        <div className="flex flex-col gap-1">
          <span className={`text-[8px] uppercase tracking-tighter transition-colors duration-300 ${isDark ? 'text-gray-500' : 'text-[#888888]'}`}>CPU Load</span>
          <div className={`h-1 rounded-full overflow-hidden transition-colors duration-300 ${isDark ? 'bg-gray-800' : 'bg-[#DDDDDD]'}`}>
            <div className={`h-full animate-pulse w-[12%] ${isDark ? 'bg-cyan-500' : 'bg-accent'}`} />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <span className={`text-[8px] uppercase tracking-tighter transition-colors duration-300 ${isDark ? 'text-gray-500' : 'text-[#888888]'}`}>Memory</span>
          <div className={`h-1 rounded-full overflow-hidden transition-colors duration-300 ${isDark ? 'bg-gray-800' : 'bg-[#DDDDDD]'}`}>
            <div className={`h-full w-[24%] ${isDark ? 'bg-purple-500' : 'bg-purple-600'}`} />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <span className={`text-[8px] uppercase tracking-tighter transition-colors duration-300 ${isDark ? 'text-gray-500' : 'text-[#888888]'}`}>Network</span>
          <div className={`h-1 rounded-full overflow-hidden transition-colors duration-300 ${isDark ? 'bg-gray-800' : 'bg-[#DDDDDD]'}`}>
            <div className={`h-full animate-pulse w-[8%] ${isDark ? 'bg-green-500' : 'bg-green-600'}`} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTerminal;
