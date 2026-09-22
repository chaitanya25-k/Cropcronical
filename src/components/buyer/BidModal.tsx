import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { placeBid } from '../../firebase/firestoreService';
import { Listing, Bid } from '../../types';
import {
  X,
  Factory,
  DollarSign,
  TrendingUp,
  Scale,
  Droplets,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Truck,
  Leaf,
  Sparkles,
} from 'lucide-react';

interface BidModalProps {
  listing: Listing | null;
  isOpen: boolean;
  onClose: () => void;
  onBidSubmitted?: (bid: Bid) => void;
}

export const BidModal: React.FC<BidModalProps> = ({
  listing,
  isOpen,
  onClose,
  onBidSubmitted,
}) => {
  const { currentUser } = useAuth();

  if (!isOpen || !listing) return null;

  const currentHigh = listing.currentHighestBid || (listing.askingPricePerTon || 2400) * listing.weightTons;
  const currentPricePerTon = currentHigh / listing.weightTons;

  // Initialize offer with +₹50 per ton above current high
  const [offerPricePerTon, setOfferPricePerTon] = useState<number>(() => {
    return Math.ceil(currentPricePerTon + 50);
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const totalBidAmount = Math.round(offerPricePerTon * listing.weightTons);

  const handleIncrement = (deltaPerTon: number) => {
    setOfferPricePerTon((prev) => Math.max(Math.ceil(currentPricePerTon + 10), prev + deltaPerTon));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (totalBidAmount <= currentHigh) {
      setErrorMsg(`Bid must be higher than current highest bid of ₹${currentHigh.toLocaleString('en-IN')}.`);
      return;
    }

    setIsSubmitting(true);
    try {
      const newBid = await placeBid(listing.id, {
        buyerId: currentUser.uid,
        buyerName: currentUser.organization || currentUser.fullName,
        buyerIndustry: 'Compressed Bio-Gas (CBG) / Bio-Refinery',
        bidAmount: totalBidAmount,
        pricePerTon: offerPricePerTon,
      });

      setSuccess(true);
      if (onBidSubmitted) {
        onBidSubmitted(newBid);
      }

      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1400);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to submit bid.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 my-8 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
              <Factory className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-white font-['Space_Grotesk']">
                Submit Industrial Bid
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Lot #{listing.id}: {listing.cropType}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/80 text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {success && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>Bid placed successfully! Updated instantly in live Firestore feed.</span>
            </div>
          )}

          {/* Batch Metrics Snapshot */}
          <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 grid grid-cols-3 gap-2 text-xs">
            <div>
              <span className="text-[10px] text-zinc-400 block">Total Volume</span>
              <span className="font-bold text-zinc-900 dark:text-white">
                {listing.weightTons} Tons
              </span>
            </div>
            <div>
              <span className="text-[10px] text-zinc-400 block">Moisture</span>
              <span className="font-bold text-zinc-900 dark:text-white">
                {listing.moisturePercentage}%
              </span>
            </div>
            <div>
              <span className="text-[10px] text-zinc-400 block">Current High</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                ₹{currentHigh.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Bid Controls */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Offer Rate per Metric Ton (₹ / Ton) *
              </label>
              <span className="text-[11px] text-zinc-400">
                Current: ₹{Math.round(currentPricePerTon).toLocaleString('en-IN')}/Ton
              </span>
            </div>

            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-sm font-semibold text-zinc-400">₹</span>
              <input
                type="number"
                step="50"
                min={currentPricePerTon + 1}
                required
                value={offerPricePerTon}
                onChange={(e) => setOfferPricePerTon(Number(e.target.value))}
                className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-base font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-['Space_Grotesk']"
              />
            </div>

            {/* Quick Increment Chips */}
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] text-zinc-400">Quick Bumps:</span>
              <button
                type="button"
                onClick={() => handleIncrement(50)}
                className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-emerald-50 dark:hover:bg-emerald-950 text-xs font-semibold text-zinc-700 dark:text-zinc-300 transition-colors"
              >
                +₹50 / Ton
              </button>
              <button
                type="button"
                onClick={() => handleIncrement(100)}
                className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-emerald-50 dark:hover:bg-emerald-950 text-xs font-semibold text-zinc-700 dark:text-zinc-300 transition-colors"
              >
                +₹100 / Ton
              </button>
              <button
                type="button"
                onClick={() => handleIncrement(250)}
                className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-emerald-50 dark:hover:bg-emerald-950 text-xs font-semibold text-zinc-700 dark:text-zinc-300 transition-colors"
              >
                +₹250 / Ton
              </button>
            </div>
          </div>

          {/* Offer Summary & Financials */}
          <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 space-y-2 text-xs">
            <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-300">
              <span>Gross Procurement Value ({listing.weightTons} T @ ₹{offerPricePerTon}/T):</span>
              <span className="font-bold text-zinc-900 dark:text-white">
                ₹{totalBidAmount.toLocaleString('en-IN')} INR
              </span>
            </div>

            <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-300">
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-zinc-400" />
                Est. Freight & Logistics:
              </span>
              <span className="text-zinc-600 dark:text-zinc-400 font-medium">
                ~₹{(listing.weightTons * 450).toLocaleString('en-IN')} INR
              </span>
            </div>

            <div className="pt-2 border-t border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between text-emerald-900 dark:text-emerald-200">
              <span className="font-bold">Total Bid Commitment:</span>
              <span className="text-lg font-extrabold font-['Space_Grotesk'] text-emerald-600 dark:text-emerald-400">
                ₹{totalBidAmount.toLocaleString('en-IN')} INR
              </span>
            </div>
          </div>

          {/* Escrow Guarantee */}
          <div className="flex items-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Funds held in smart escrow. Released to farmer only upon weighbridge verification.</span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || success}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Publishing Bid...</span>
              ) : (
                <>
                  <DollarSign className="w-4 h-4" />
                  <span>Submit Bid (₹{totalBidAmount.toLocaleString('en-IN')})</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
