import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { FarmerDashboard } from './components/farmer/FarmerDashboard';
import { BuyerDashboard } from './components/buyer/BuyerDashboard';
import { LogisticsTracker } from './components/logistics/LogisticsTracker';
import { AuthPage } from './components/auth/AuthPage';
import {
  Sprout,
  ShieldCheck,
  Leaf,
  Globe2,
  FileText,
  Activity,
  Award,
} from 'lucide-react';

export function MainLayout() {
  const [currentView, setCurrentView] = useState<'landing' | 'farmer' | 'buyer' | 'logistics' | 'auth'>('landing');
  const [authRole, setAuthRole] = useState<'farmer' | 'buyer'>('farmer');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const handleNavigateToAuth = (role: 'farmer' | 'buyer' = 'farmer', mode: 'login' | 'register' = 'login') => {
    setAuthRole(role);
    setAuthMode(mode);
    setCurrentView('auth');
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
      
      {/* Top Fixed / Sticky Navigation */}
      <Navbar currentView={currentView} onNavigate={setCurrentView} />

      {/* Main View Area */}
      <main className="flex-1 w-full">
        {currentView === 'landing' && (
          <LandingPage
            onNavigate={(view) => setCurrentView(view)}
            onNavigateToAuth={handleNavigateToAuth}
          />
        )}

        {currentView === 'auth' && (
          <AuthPage
            initialMode={authMode}
            initialRole={authRole}
            onNavigate={(view) => setCurrentView(view)}
          />
        )}

        {currentView === 'farmer' && (
          <FarmerDashboard
            onNavigateToBuyer={() => setCurrentView('buyer')}
            onNavigateToLogistics={() => setCurrentView('logistics')}
          />
        )}

        {currentView === 'buyer' && (
          <BuyerDashboard
            onNavigateToFarmer={() => setCurrentView('farmer')}
            onNavigateToLogistics={() => setCurrentView('logistics')}
          />
        )}

        {currentView === 'logistics' && (
          <LogisticsTracker />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 py-8 px-4 sm:px-6 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-zinc-500 dark:text-zinc-400">
          
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
              <Sprout className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-zinc-900 dark:text-white font-['Space_Grotesk']">
              CropCronical MVP
            </span>
            <span>— Agricultural Waste Upcycling & Carbon B2B/B2C Marketplace</span>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <span className="flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              UNFCCC ACM0006 Methodology
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              Escrow-Secured Trades
            </span>
            <span className="flex items-center gap-1">
              <Leaf className="w-3.5 h-3.5 text-emerald-500" />
              Real-time Firestore onSnapshot Stream
            </span>
          </div>

        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainLayout />
      </AuthProvider>
    </ThemeProvider>
  );
}
