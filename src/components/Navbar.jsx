import { useState } from 'react';
import HomeIcon from '../icons/HomeIcon';
import UserIcon from '../icons/UserIcon';
import SettingsIcon from '../icons/SettingsIcon';

const Navbar = () => {
  const [activeNav, setActiveNav] = useState('home');

  const navItems = [
    { id: 'home', icon: HomeIcon, label: '首页' },
    { id: 'user', icon: UserIcon, label: '用户' },
    { id: 'settings', icon: SettingsIcon, label: '设置' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 paper-bg border-b-2 border-ink-800 shadow-lg">
      <div className="max-w-6xl mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full border-2 border-vermilion-500 flex items-center justify-center">
              <span className="text-vermilion-500 font-kai text-xl">墨</span>
            </div>
            <h1 className="text-2xl font-kai text-ink-900 ink-text-shadow">墨韵占卜</h1>
          </div>
          
          <div className="flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveNav(item.id)}
                  className={`flex flex-col items-center space-y-1 transition-all duration-300 group ${
                    isActive ? 'text-ink-900' : 'text-ink-500 hover:text-ink-700'
                  }`}
                >
                  <div 
                    className={`p-3 rounded-lg transition-all duration-300 ${
                      isActive 
                        ? 'bg-ink-100 border border-ink-300' 
                        : 'group-hover:bg-ink-50'
                    }`}
                  >
                    <Icon 
                      className={`w-8 h-8 ${isActive ? 'text-vermilion-500' : ''}`} 
                    />
                  </div>
                  <span className="text-sm font-song">{item.label}</span>
                  {isActive && (
                    <div className="w-8 h-0.5 bg-vermilion-500 rounded-full animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
