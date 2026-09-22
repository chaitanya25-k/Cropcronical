import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { UserRole } from '../types';
import {
  Sprout,
  Sun,
  Moon,
  Tractor,
  Factory,
  Truck,
  Leaf,
  Activity,
  Flame,
  ShieldCheck,
  LogIn,
  LogOut,
  User,
  ChevronDown,
} from 'lucide-react';

interface NavbarProps {
  currentView: 'landing' | 'farmer' | 'buyer' | 'logistics' | 'auth';
  onNavigate: (view: 'landing' | 'farmer' | 'buyer' | 'logistics' | 'auth') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const {
    currentUser,
    activeRole,
    switchRole,
    isSimulatingLiveBids,
    toggleLiveBidSimulation,
    isAuthenticated,
    logout,
  } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRoleChange = (newRole: UserRole) => {
    switchRole(newRole);
    if (newRole === 'farmer') onNavigate('farmer');
    else if (newRole === 'buyer') onNavigate('buyer');
    else onNavigate('logistics');
  };

  const handleSignOut = async () => {
    setIsProfileMenuOpen(false);
    await logout();
    onNavigate('landing');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          
          {/* Brand Logo */}
          <div
            id="brand-logo"
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2.5 cursor-pointer group select-none flex-shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Sprout className="w-5 h-5 text-emerald-100" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight text-zinc-900 dark:text-white font-['Space_Grotesk']">
                  Crop<span className="text-emerald-600 dark:text-emerald-400">Cronical</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  B2B Biomass
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 hidden sm:block">
                Agricultural Waste to Wealth Engine
              </p>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800/70 p-1 rounded-xl border border-zinc-200 dark:border-zinc-700/60">
            <button
              id="nav-btn-landing"
              onClick={() => onNavigate('landing')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentView === 'landing'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              Overview
            </button>
            <button
              id="nav-btn-farmer"
              onClick={() => {
                handleRoleChange('farmer');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentView === 'farmer'
                  ? 'bg-emerald-600 text-white shadow-xs shadow-emerald-600/30'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <Tractor className="w-3.5 h-3.5" />
              Farmer Hub
            </button>
            <button
              id="nav-btn-buyer"
              onClick={() => {
                handleRoleChange('buyer');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentView === 'buyer'
                  ? 'bg-emerald-600 text-white shadow-xs shadow-emerald-600/30'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <Factory className="w-3.5 h-3.5" />
              Buyer Terminal
              <span className="flex h-2 w-2 relative ml-0.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </button>
            <button
              id="nav-btn-logistics"
              onClick={() => {
                handleRoleChange('driver');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentView === 'logistics'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              Logistics
            </button>
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Live Feed Simulator Indicator */}
            <button
              id="btn-toggle-live-simulation"
              onClick={toggleLiveBidSimulation}
              title={isSimulatingLiveBids ? 'Live market simulation active. Click to pause.' : 'Live market simulation paused. Click to resume.'}
              className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                isSimulatingLiveBids
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-300'
                  : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-500'
              }`}
            >
              <Activity className={`w-3.5 h-3.5 ${isSimulatingLiveBids ? 'animate-pulse text-emerald-500' : ''}`} />
              <span>{isSimulatingLiveBids ? 'Live Bids: Active' : 'Live Bids: Paused'}</span>
            </button>

            {/* Role Switcher Pills */}
            <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs">
              <button
                id="role-switch-farmer"
                onClick={() => handleRoleChange('farmer')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  activeRole === 'farmer'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                <Tractor className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Farmer</span>
              </button>
              <button
                id="role-switch-buyer"
                onClick={() => handleRoleChange('buyer')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  activeRole === 'buyer'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                <Factory className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Buyer</span>
              </button>
              <button
                id="role-switch-driver"
                onClick={() => handleRoleChange('driver')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  activeRole === 'driver'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                <Truck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Driver</span>
              </button>
            </div>

            {/* Dark / Light Toggle */}
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-2 rounded-xl text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 transition-colors flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
              )}
            </button>

            {/* User Profile & Auth Controls */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2 pl-2 border-l border-zinc-200 dark:border-zinc-800 relative" ref={profileMenuRef}>
                
                {/* User Profile Pill with Dropdown Trigger */}
                <button
                  type="button"
                  id="nav-user-profile-menu-btn"
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-xl bg-zinc-100/90 dark:bg-zinc-800/80 hover:bg-zinc-200/80 dark:hover:bg-zinc-700/80 border border-zinc-200 dark:border-zinc-700 transition-all select-none text-left group"
                  title="View user profile & session options"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-700 flex items-center justify-center font-bold text-xs text-emerald-800 dark:text-emerald-200 group-hover:scale-105 transition-transform flex-shrink-0">
                    {currentUser.fullName ? currentUser.fullName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="hidden sm:block leading-tight text-left">
                    <div className="text-xs font-semibold text-zinc-900 dark:text-white truncate max-w-[110px] group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {currentUser.fullName}
                    </div>
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                      <Leaf className="w-2.5 h-2.5 flex-shrink-0" />
                      <span>{currentUser.carbonCredits} MT</span>
                    </div>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-200 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Direct Visible Log Out Button on Nav Bar */}
                <button
                  id="nav-btn-logout"
                  onClick={handleSignOut}
                  title="Log out of account"
                  className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-red-600 dark:hover:text-red-400 bg-zinc-100 hover:bg-red-50 dark:bg-zinc-800/90 dark:hover:bg-red-950/40 border border-zinc-200 dark:border-zinc-700 hover:border-red-200 dark:hover:border-red-900/60 transition-all shadow-xs group"
                >
                  <LogOut className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors" />
                  <span className="hidden sm:inline">Log Out</span>
                </button>

                {/* Profile Popover Dropdown */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 p-2 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    {/* Header Details */}
                    <div className="p-2.5 border-b border-zinc-100 dark:border-zinc-800 mb-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 font-bold text-xs flex items-center justify-center flex-shrink-0">
                          {currentUser.fullName ? currentUser.fullName.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div className="truncate">
                          <div className="text-xs font-bold text-zinc-900 dark:text-white truncate">
                            {currentUser.fullName}
                          </div>
                          <div className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                            {currentUser.email || 'Authenticated User'}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] bg-zinc-50 dark:bg-zinc-800/60 p-2 rounded-xl border border-zinc-200/60 dark:border-zinc-700/60">
                        <span className="text-zinc-500 dark:text-zinc-400">Carbon Credits:</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <Leaf className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          {currentUser.carbonCredits} MT CO2e
                        </span>
                      </div>
                    </div>

                    {/* Quick Navigation Items */}
                    <div className="space-y-1">
                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          onNavigate(activeRole === 'farmer' ? 'farmer' : 'buyer');
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                      >
                        <User className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Go to {activeRole === 'farmer' ? 'Farmer Hub' : 'Buyer Terminal'}</span>
                      </button>

                      {/* Theme Toggle within Menu */}
                      <button
                        onClick={() => {
                          toggleTheme();
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          {theme === 'dark' ? (
                            <Sun className="w-3.5 h-3.5 text-amber-400" />
                          ) : (
                            <Moon className="w-3.5 h-3.5 text-zinc-500" />
                          )}
                          <span>Appearance</span>
                        </span>
                        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                          {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                        </span>
                      </button>

                      {/* Explicit Logout Option inside Dropdown */}
                      <button
                        id="nav-dropdown-logout-btn"
                        onClick={handleSignOut}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors group"
                      >
                        <span className="flex items-center gap-2">
                          <LogOut className="w-3.5 h-3.5 group-hover:scale-105 transition-transform" />
                          <span>Log Out</span>
                        </span>
                        <span className="text-[10px] text-red-400 dark:text-red-500">Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 pl-2 border-l border-zinc-200 dark:border-zinc-800">
                <button
                  id="nav-btn-auth"
                  onClick={() => onNavigate('auth')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    currentView === 'auth'
                      ? 'bg-emerald-600 text-white shadow-xs shadow-emerald-600/30'
                      : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/60'
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
                <button
                  id="nav-btn-logout-reset"
                  onClick={handleSignOut}
                  title="Reset session & return to landing page"
                  className="flex items-center gap-1 px-2 py-1.5 rounded-xl text-xs font-medium text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden xl:inline">Reset</span>
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </header>
  );
};
