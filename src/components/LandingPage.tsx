import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Sprout,
  Tractor,
  Factory,
  ArrowRight,
  TrendingUp,
  Leaf,
  ShieldCheck,
  Flame,
  Truck,
  CheckCircle2,
  DollarSign,
  Layers,
  Sparkles,
  Award,
} from 'lucide-react';
import { mockStore } from '../firebase/mockStore';
import { subscribeToMarketStats } from '../firebase/firestoreService';

interface LandingPageProps {
  onNavigate: (view: 'farmer' | 'buyer' | 'logistics' | 'auth') => void;
  onNavigateToAuth?: (role: 'farmer' | 'buyer', mode?: 'login' | 'register') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onNavigateToAuth }) => {
  const { switchRole, isAuthenticated, currentUser } = useAuth();
  const [stats, setStats] = useState(() => mockStore.getStats());
  const [hasRecentUpdate, setHasRecentUpdate] = useState(false);

  useEffect(() => {
    const unsub = subscribeToMarketStats((newStats) => {
      setStats(newStats);
      setHasRecentUpdate(true);
      const t = setTimeout(() => setHasRecentUpdate(false), 2500);
      return () => clearTimeout(t);
    });
    return () => unsub();
  }, []);

  const handleFarmerClick = () => {
    if (!isAuthenticated && onNavigateToAuth) {
      onNavigateToAuth('farmer', 'login');
    } else {
      switchRole('farmer');
      onNavigate('farmer');
    }
  };

  const handleBuyerClick = () => {
    if (!isAuthenticated && onNavigateToAuth) {
      onNavigateToAuth('buyer', 'login');
    } else {
      switchRole('buyer');
      onNavigate('buyer');
    }
  };

  return (
    <div className="w-full space-y-16 pb-20">
      
      {/* Hero Section */}
      <section className="relative pt-8 sm:pt-14 pb-12 overflow-hidden">
        {/* Subtle decorative background gradient */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_50%_at_50%_0%,rgba(16,185,129,0.12)_0%,rgba(245,158,11,0.04)_60%,transparent_100%)]"></div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 text-xs font-semibold mb-6 shadow-xs">
            <Leaf className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Empowering Climate Action & Biomass Circular Economy</span>
          </div>

          {/* Core Value Proposition Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-[1.15] font-['Space_Grotesk']">
            Turn Agricultural Waste{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-600 dark:from-emerald-400 dark:via-teal-300 dark:to-amber-400">
              into Wealth
            </span>
          </h1>

          <p className="mt-5 text-lg sm:text-xl text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto leading-relaxed">
            CropCronical connects farmers directly with green bio-industries—biogas plants, 2G ethanol refineries, and pulp mills—to transparently bid on crop residue, eliminate field burning, and earn verified carbon micro-credits.
          </p>

          {/* Primary Dual Call-to-Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <button
              id="cta-farmer-btn"
              onClick={handleFarmerClick}
              className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-base shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/35 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Tractor className="w-5 h-5" />
              <span>I am a Farmer</span>
              <ArrowRight className="w-4 h-4 ml-1 opacity-80" />
            </button>

            <button
              id="cta-buyer-btn"
              onClick={handleBuyerClick}
              className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 font-semibold text-base shadow-lg shadow-zinc-900/15 hover:shadow-zinc-900/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 border border-zinc-800 dark:border-zinc-200"
            >
              <Factory className="w-5 h-5 text-emerald-500" />
              <span>I am a Buyer</span>
              <ArrowRight className="w-4 h-4 ml-1 opacity-80" />
            </button>
          </div>

          {/* Quick Sign In / Create Account Navigation */}
          <div className="mt-4 flex items-center justify-center gap-3 text-xs">
            <span className="text-zinc-500 dark:text-zinc-400">Want to use your email credentials?</span>
            <button
              id="hero-btn-signin"
              onClick={() => onNavigateToAuth ? onNavigateToAuth('farmer', 'login') : onNavigate('auth')}
              className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Sign In
            </button>
            <span className="text-zinc-400 dark:text-zinc-600">•</span>
            <button
              id="hero-btn-create-account"
              onClick={() => onNavigateToAuth ? onNavigateToAuth('farmer', 'register') : onNavigate('auth')}
              className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Create Account
            </button>
          </div>

          <div className="mt-4 flex items-center justify-center gap-6 text-xs text-zinc-500 dark:text-zinc-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Zero Upfront Listing Fees
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Escrow Protected Payments
            </span>
          </div>
        </div>
      </section>

      {/* Live Ticker Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-emerald-900 via-zinc-900 to-zinc-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-emerald-800/40 relative overflow-hidden">
          
          {/* Subtle glow accent */}
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></div>
              <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                Live Marketplace Telemetry
                <span className="text-xs font-normal text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800">
                  Real-time Sync
                </span>
              </h2>
            </div>
            <p className="text-xs text-zinc-400">
              Audited in accordance with UNFCCC ACM0006 standard for crop residue diversion
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-6 text-left">
            
            {/* Ticker 1: Tons of Waste Upcycled */}
            <div id="ticker-tons-upcycled" className="space-y-1">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-medium uppercase tracking-wider">
                <Layers className="w-4 h-4" />
                <span>Waste Upcycled</span>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight font-['Space_Grotesk'] text-white">
                {stats.tonsUpcycled.toLocaleString()}{' '}
                <span className="text-lg font-semibold text-emerald-400">Tons</span>
              </div>
              <p className="text-xs text-zinc-400">
                Residue diverted from open-field burning
              </p>
            </div>

            {/* Ticker 2: Carbon Credits Generated */}
            <div id="ticker-carbon-credits" className={`space-y-1 transition-all duration-500 rounded-xl p-2 -m-2 ${hasRecentUpdate ? 'bg-amber-400/20 ring-2 ring-amber-400/40' : ''}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-medium uppercase tracking-wider">
                  <Leaf className="w-4 h-4" />
                  <span>Carbon Credits</span>
                </div>
                {hasRecentUpdate && (
                  <span className="text-[10px] uppercase font-bold text-amber-300 bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-500/40 animate-pulse">
                    Live Updated
                  </span>
                )}
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight font-['Space_Grotesk'] text-amber-300 flex items-baseline gap-1.5">
                {stats.carbonCreditsGenerated.toLocaleString()}{' '}
                <span className="text-lg font-semibold text-amber-400">MT CO2e</span>
              </div>
              <p className="text-xs text-zinc-400">
                Verified micro-credits minted to farmers
              </p>
            </div>

            {/* Ticker 3: Trading Volume */}
            <div id="ticker-trading-volume" className="space-y-1">
              <div className="flex items-center gap-2 text-teal-400 text-xs font-medium uppercase tracking-wider">
                <DollarSign className="w-4 h-4" />
                <span>Trading Value</span>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight font-['Space_Grotesk'] text-white">
                ₹{((stats.totalTradingVolumeInr || stats.totalTradingVolumeUsd || 28400000) / 10000000).toFixed(2)} Cr
              </div>
              <p className="text-xs text-zinc-400">
                Direct economic lift delivered to growers
              </p>
            </div>

            {/* Ticker 4: Active Ecosystem */}
            <div id="ticker-active-plants" className="space-y-1">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-medium uppercase tracking-wider">
                <Factory className="w-4 h-4" />
                <span>Industrial Network</span>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight font-['Space_Grotesk'] text-white">
                {stats.partnerPlantsCount} <span className="text-lg font-semibold text-zinc-400">Plants</span>
              </div>
              <p className="text-xs text-zinc-400">
                Bio-CNG, paper, & pelletizing facilities
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* The 3-Step Circular Pipeline */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white font-['Space_Grotesk']">
            How CropCronical Closes the Agricultural Loop
          </h2>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400 text-sm">
            A frictionless marketplace removing middlemen, stopping pollution, and monetizing stubble.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Step 1 */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm relative group hover:border-emerald-500/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-lg mb-4">
              01
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2 flex items-center gap-2">
              <Tractor className="w-5 h-5 text-emerald-600" />
              Farmer Lists Stubble Batch
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              In under 60 seconds from any mobile device, specify crop type, estimated tons, and moisture. Our automated GHG algorithm instantly estimates your carbon credit bounty.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm relative group hover:border-emerald-500/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold text-lg mb-4">
              02
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2 flex items-center gap-2">
              <Factory className="w-5 h-5 text-amber-600" />
              Real-Time Industry Bidding
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Industrial plants view geographic heatmaps and place competitive bids via Firestore onSnapshot real-time feeds. Market competition ensures top dollar per ton.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm relative group hover:border-emerald-500/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold text-lg mb-4">
              03
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2 flex items-center gap-2">
              <Truck className="w-5 h-5 text-teal-600" />
              GPS Hauling & Instant Escrow
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Logistics drivers receive turn-by-turn farm pickup contracts. Once weight is verified at the mill's weighbridge, escrow funds and carbon credits land in the digital wallet.
            </p>
          </div>

        </div>
      </section>

      {/* Upcycling Sector Opportunities */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-zinc-100 dark:bg-zinc-900/60 p-6 sm:p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                Agricultural Residues Traded on CropCronical
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                High-calorific and fibrous byproducts matching diverse industrial procurement specs
              </p>
            </div>
            <button
              onClick={handleBuyerClick}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              Browse Active Batches <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
            {[
              { name: 'Paddy Straw', use: 'Bio-Gas & 2G Ethanol', tons: '1,420 T Available', icon: '🌾' },
              { name: 'Sugarcane Bagasse', use: 'Boiler Fuel & Pulp', tons: '2,800 T Available', icon: '🎋' },
              { name: 'Corn Stover', use: 'Cattle Feed & Briquettes', tons: '850 T Available', icon: '🌽' },
              { name: 'Wheat Straw', use: 'Molded Packaging', tons: '1,200 T Available', icon: '🌾' },
              { name: 'Cotton Stalks', use: 'Industrial Pellets', tons: '680 T Available', icon: '🌱' },
              { name: 'Coconut Coir', use: 'Horticulture Substrate', tons: '450 T Available', icon: '🥥' },
            ].map((item) => (
              <div
                key={item.name}
                onClick={handleBuyerClick}
                className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500 cursor-pointer transition-all hover:shadow-xs group"
              >
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">{item.icon}</div>
                <div className="font-semibold text-xs text-zinc-900 dark:text-white">{item.name}</div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">{item.use}</div>
                <div className="text-[10px] text-zinc-500 dark:text-zinc-500 mt-1">{item.tons}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
