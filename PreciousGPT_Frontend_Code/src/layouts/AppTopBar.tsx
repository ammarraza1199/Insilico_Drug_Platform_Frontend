import React from 'react';
import { Bell, Search, User, LogOut, Cpu, Menu } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useModelStore } from '../stores/modelStore';
import { useUIStore } from '../stores/uiStore';

const AppTopBar: React.FC = () => {
  const { logout } = useAuthStore();
  const { globalDefault } = useModelStore();
  const { toggleMobileMenu } = useUIStore();

  return (
    <header className="h-16 border-b bg-white px-4 lg:px-6">
      <div className="flex h-full items-center justify-between">
        {/* Left side: Hamburger (mobile only) & Brand (mobile only) & Search */}
        <div className="flex items-center gap-4 flex-1">
          <button 
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-md"
          >
            <Menu size={24} />
          </button>
          
          {/* Brand visibility on mobile top-bar */}
          <div className="lg:hidden text-xl font-bold text-scientific-blue">WallahGPT</div>

          {/* Search bar - hidden on small mobile */}
          <div className="hidden sm:flex w-full max-w-sm items-center ml-0 lg:ml-0">
            <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search experiments, projects..." 
              className="w-full rounded-md border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm focus:border-scientific-blue focus:outline-none focus:ring-1 focus:ring-scientific-blue"
            />
          </div>
        </div>
      </div>

        {/* Right side: Global Indicators & User Menu */}
        <div className="flex items-center space-x-2 md:space-x-6">
          {/* Global Model Indicator - Hidden on extra small mobile */}
          <div className="hidden md:flex items-center rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
            <Cpu size={14} className="mr-2 text-scientific-blue" />
            <span className="hidden lg:inline">Active Model: </span>
            <span className="ml-1 font-bold text-slate-900">{globalDefault.modelName}</span>
          </div>

          {/* Running Jobs Indicator (Mock) - Hidden on mobile */}
          <div className="hidden lg:flex items-center text-xs font-medium text-slate-500">
            <div className="mr-2 h-2 w-2 animate-pulse rounded-full bg-scientific-green" />
            <span>2 Jobs Running</span>
          </div>

          {/* Notifications */}
          <button className="relative text-slate-400 hover:text-slate-600 p-2">
            <Bell size={20} />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-scientific-red border border-white" />
          </button>

          {/* User Profile & Logout */}
          <div className="flex items-center space-x-2 md:space-x-3 border-l pl-2 md:pl-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 flex-shrink-0">
              <User size={18} />
            </div>
            <button 
              onClick={logout}
              className="flex items-center text-sm font-medium text-slate-500 hover:text-scientific-red p-2"
              title="Sign Out"
            >
              <LogOut size={18} className="md:mr-2" />
              <span className="hidden md:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppTopBar;
