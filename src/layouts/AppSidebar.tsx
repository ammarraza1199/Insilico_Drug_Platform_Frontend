import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  History, 
  FlaskConical, 
  Settings, 
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Database,
  Cpu,
  TestTube2,
  X
} from 'lucide-react';
import { useUIStore } from '../stores/uiStore';
import { cn } from '../utils/formatters';

const AppSidebar: React.FC = () => {
  const { isSidebarCollapsed, toggleSidebar, isMobileMenuOpen, closeMobileMenu } = useUIStore();

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Experiment Builder', icon: FlaskConical, path: '/experiment/new' },
    { name: 'Experiment History', icon: History, path: '/history' },
    { name: 'Precious1GPT', icon: TestTube2, path: '/experiment/p1/new' },
    { name: 'Precious2GPT', icon: Database, path: '/experiment/p2/new' },
    { name: 'Precious3GPT', icon: Cpu, path: '/experiment/p3/new' },
    { name: 'Model Settings', icon: Settings, path: '/settings/models' },
    { name: 'Admin Panel', icon: ShieldCheck, path: '/admin' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden" 
          onClick={closeMobileMenu}
        />
      )}

      {/* Main Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 flex h-full flex-col bg-slate-900 text-white transition-all duration-300 lg:relative lg:translate-x-0 lg:z-auto",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        isSidebarCollapsed ? "lg:w-16" : "lg:w-64",
        "w-64" // Fixed width on mobile
      )}>
      <div className="flex h-16 items-center justify-between px-4">
        {(!isSidebarCollapsed || isMobileMenuOpen) && (
          <div className="text-xl font-bold text-scientific-blue">PreciousGPT</div>
        )}
        <button 
          onClick={isMobileMenuOpen ? closeMobileMenu : toggleSidebar}
          className="rounded p-1 hover:bg-slate-800"
        >
          {isMobileMenuOpen ? (
            <X size={20} />
          ) : (
            isSidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />
          )}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="mt-4 flex-1 space-y-1 px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={closeMobileMenu}
            className={({ isActive }) => cn(
              "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive 
                ? "bg-slate-800 text-scientific-blue" 
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            )}
          >
            <item.icon size={20} className={cn(
              "flex-shrink-0",
              (!isSidebarCollapsed || isMobileMenuOpen) && "mr-3"
            )} />
            {(!isSidebarCollapsed || isMobileMenuOpen) && <span>{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-800 p-4">
        {(!isSidebarCollapsed || isMobileMenuOpen) && (
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-scientific-blue flex-shrink-0" />
            <div className="ml-3 overflow-hidden">
              <p className="truncate text-sm font-medium">Researcher One</p>
              <p className="truncate text-xs text-slate-400">researcher@precious.ai</p>
            </div>
          </div>
        )}
        {(isSidebarCollapsed && !isMobileMenuOpen) && (
          <div className="h-8 w-8 rounded-full bg-scientific-blue" />
        )}
      </div>
    </aside>
    </>
  );
};

export default AppSidebar;
