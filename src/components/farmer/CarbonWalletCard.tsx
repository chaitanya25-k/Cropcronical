import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Leaf,
  DollarSign,
  TrendingUp,
  Award,
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
  TreePine,
  Calculator,
  Info,
} from 'lucide-react';

interface CarbonWalletCardProps {
  onOpenCalculator?: () => void;
}

export const CarbonWalletCard: React.FC<CarbonWalletCardProps> = ({ onOpenCalculator }) => {
  const { currentUser, updateUserCarbonCredits } = useAuth();
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);
  const [recentlyEarned, setRecentlyEarned] = useState<number | null>(null);

  // Carbon credits metrics
  const credits = currentUser.carbonCredits || 148.5;
  const benchmarkRateInr = 1550; // ₹1,550 per Verified Carbon Credit (~$18.50 benchmark)
  const totalValueInr = Math.round(credits * benchmarkRateInr);
  const treesEquivalent = Math.round((credits * 1000) / 22);

  // Trigger pulse when credits increase
  useEffect(() => {
    const lastStored = Number(sessionStorage.getItem('last_seen_credits') || credits);
    if (credits > lastStored) {
      const delta = Math.round((credits - lastStored) * 10) / 10;
      setRecentlyEarned(delta);
      const timer = setTimeout(() => setRecentlyEarned(null), 5000);
      sessionStorage.setItem('last_seen_credits', credits.toString());
      return () => clearTimeout(timer);
    }
    sessionStorage.setItem('last_seen_credits', credits.toString());
  }, [credits]);

  const handleClaimTokens = () => {
    setIsClaiming(true);
    setTimeout(() => {
      setIsClaiming(false);
      setClaimSuccess(true);
      setTimeout(() => setClaimSuccess(false), 4000);
    }, 1200);
  };

  return (
    <div className="bg-gradient-to-br from-emerald-900 via-teal-950 to-zinc-900 text-white rounded-2xl p-5 sm:p-6 shadow-lg border border-emerald-700/50 relative overflow-hidden">
      
      {/* Decorative ambient ring */}
      <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none"></div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-emerald-800/60">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
            <Leaf className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base tracking-tight text-white font-['Space_Grotesk']">
                Digital Carbon Wallet
              </h3>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                Gold Standard Verified
              </span>
            </div>
            <p className="text-xs text-emerald-200/80">
              Holder: {currentUser.fullName} ({currentUser.organization || 'Verified Farmer'})
            </p>
          </div>
        </div>

        {onOpenCalculator && (
          <button
            onClick={onOpenCalculator}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-800/60 hover:bg-emerald-800 text-xs font-semibold text-emerald-200 border border-emerald-600/40 transition-colors"
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Credit Estimator</span>
          </button>
        )}
      </div>

      {/* Primary Balance Display */}
      {recentlyEarned && (
        <div className="my-3 p-3 rounded-xl bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-300 animate-spin" />
            <span className="text-xs font-bold text-white">
              Real-time Payout Minted: +{recentlyEarned} MT CO2e Carbon Credits credited to your wallet!
            </span>
          </div>
          <span className="text-[10px] uppercase font-bold bg-emerald-400 text-zinc-950 px-2 py-0.5 rounded-full">
            Confirmed Delivery
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-5">
        
        {/* Credit Token Balance */}
        <div className={`rounded-xl p-3.5 border transition-all duration-500 ${recentlyEarned ? 'bg-emerald-500/30 border-emerald-400 ring-2 ring-emerald-400' : 'bg-white/5 border-white/10'}`}>
          <div className="text-xs text-emerald-300 flex items-center gap-1 mb-1">
            <Award className="w-3.5 h-3.5" /> Verified Micro-Credits
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-['Space_Grotesk'] flex items-baseline gap-1.5">
            {credits.toFixed(1)}
            <span className="text-xs font-semibold text-emerald-400">MT CO2e</span>
          </div>
          <div className="text-[11px] text-zinc-400 mt-1">
            Avoided field burning @ 1.35 MT/Ton
          </div>
        </div>

        {/* Estimated Market Payout Value */}
        <div className="bg-white/5 rounded-xl p-3.5 border border-white/10">
          <div className="text-xs text-amber-300 flex items-center gap-1 mb-1">
            <DollarSign className="w-3.5 h-3.5" /> Redeemable Value
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-['Space_Grotesk'] flex items-baseline gap-1.5">
            ₹{totalValueInr.toLocaleString('en-IN')}
            <span className="text-xs font-semibold text-zinc-300">INR</span>
          </div>
          <div className="text-[11px] text-zinc-400 mt-1">
            @ ₹{benchmarkRateInr.toLocaleString('en-IN')}/credit market rate
          </div>
        </div>

        {/* Environmental Equivalence */}
        <div className="bg-white/5 rounded-xl p-3.5 border border-white/10">
          <div className="text-xs text-teal-300 flex items-center gap-1 mb-1">
            <TreePine className="w-3.5 h-3.5" /> Climate Impact
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-teal-300 font-['Space_Grotesk'] flex items-baseline gap-1.5">
            {treesEquivalent.toLocaleString()}
            <span className="text-xs font-semibold text-teal-400">Trees</span>
          </div>
          <div className="text-[11px] text-zinc-400 mt-1">
            Annual atmospheric CO2 absorption
          </div>
        </div>

      </div>

      {/* Cashout / Monetization Action Bar */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 text-zinc-300">
          <Info className="w-3.5 h-3.5 text-emerald-400" />
          <span>Credits are issued automatically upon confirmed bio-refinery delivery.</span>
        </div>

        <button
          onClick={handleClaimTokens}
          disabled={isClaiming || claimSuccess}
          className={`w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-semibold text-xs transition-all ${
            claimSuccess
              ? 'bg-emerald-500 text-white'
              : 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-md shadow-emerald-500/20'
          }`}
        >
          {claimSuccess ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Payout Initiated to Bank!</span>
            </>
          ) : isClaiming ? (
            <span>Auditing Credit Ledger...</span>
          ) : (
            <>
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Cash Out to Bank (₹{totalValueInr.toLocaleString('en-IN')})</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
};
