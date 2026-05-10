import HomeIcon from '../icons/HomeIcon';
import UserIcon from '../icons/UserIcon';
import SettingsIcon from '../icons/SettingsIcon';
import { useAuth } from '../hooks/useAuth.jsx';

const Navbar = ({ currentPage, onNavigate, onOpenAuth }) => {
  const { user, signOut, isAuthenticated } = useAuth();

  const navItems = [
    { id: 'home', icon: HomeIcon, label: '首页' },
    { id: 'history', icon: UserIcon, label: '记录' },
    { id: 'settings', icon: SettingsIcon, label: '设置' },
  ];

  const handleUserClick = () => {
    if (isAuthenticated) {
      signOut();
    } else {
      onOpenAuth();
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 paper-bg border-b-2 border-ink-800 shadow-lg">
      <div className="max-w-6xl mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => onNavigate('home')}
            className="flex items-center space-x-3 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full border-2 border-vermilion-500 flex items-center justify-center">
              <span className="text-vermilion-500 font-kai text-xl">墨</span>
            </div>
            <h1 className="text-2xl font-kai text-ink-900 ink-text-shadow">墨韵占卜</h1>
          </button>
          
          <div className="flex items-center space-x-4 sm:space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'history' && !isAuthenticated) {
                      onOpenAuth();
                    } else {
                      onNavigate(item.id);
                    }
                  }}
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

            {/* 登录信息区域 - 移动端和桌面端保持一致的占位宽度 */}
            <div className="hidden sm:block ml-4 pl-4 border-l border-ink-300 min-w-[140px]">
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-song text-ink-600">
                      {user?.email?.split('@')[0]}
                    </p>
                    <button
                      onClick={handleUserClick}
                      className="text-xs font-song text-ink-400 hover:text-vermilion-500 transition-colors"
                    >
                      退出登录
                    </button>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-vermilion-100 flex items-center justify-center">
                    <span className="text-vermilion-500 font-kai">
                      {user?.email?.[0]?.toUpperCase()}
                    </span>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleUserClick}
                  className="px-6 py-2 bg-ink-800 text-paper-50 font-song rounded-lg
                           hover:bg-ink-700 transition-all duration-300"
                >
                  登录
                </button>
              )}
            </div>

            {/* 移动端登录按钮 - 简化版 */}
            <div className="sm:hidden min-w-[60px] flex justify-end">
              <button
                onClick={handleUserClick}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isAuthenticated 
                    ? 'bg-vermilion-100 text-vermilion-500' 
                    : 'bg-ink-800 text-paper-50 hover:bg-ink-700'
                }`}
              >
                {isAuthenticated ? (
                  <span className="font-kai text-sm">{user?.email?.[0]?.toUpperCase()}</span>
                ) : (
                  <span className="text-xs font-song">登</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
