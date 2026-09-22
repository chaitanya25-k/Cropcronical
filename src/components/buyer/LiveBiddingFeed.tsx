import React, { useState, useEffect, useRef } from 'react';
import { subscribeToLiveBids } from '../../firebase/firestoreService';
import { mockStore } from '../../firebase/mockStore';
import { Bid } from '../../types';
import {
  Activity,
  Zap,
  TrendingUp,
  Factory,
  Clock,
  Sparkles,
  Volume2,
  VolumeX,
  PlusCircle,
  Filter,
} from 'lucide-react';

interface LiveBiddingFeedProps {
  onSelectListing?: (listingId: string) => void;
}

export const LiveBiddingFeed: React.FC<LiveBiddingFeedProps> = ({ onSelectListing }) => {
  const [bids, setBids] = useState<Bid[]>([]);
  const [newestBidId, setNewestBidId] = useState<string | null>(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [filterCrop, setFilterCrop] = useState<string>('all');

  const prevBidsCountRef = useRef<number>(0);

  // Firestore onSnapshot subscription (and fallback reactive store)
  useEffect(() => {
    // Subscribe to real-time bids stream
    const unsubscribe = subscribeToLiveBids((incomingBids) => {
      setBids(incomingBids);

      // Check if a new bid just arrived
      if (prevBidsCountRef.current > 0 && incomingBids.length > prevBidsCountRef.current) {
        const fresh = incomingBids[0];
        if (fresh) {
          setNewestBidId(fresh.id);
          setTimeout(() => setNewestBidId(null), 3500);

          // Subtle audio cue if enabled
          if (isAudioEnabled && typeof window !== 'undefined' && window.AudioContext) {
            try {
              const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.type = 'sine';
              osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
              osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
              gain.gain.setValueAtTime(0.05, ctx.currentTime);
              gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.start();
              osc.stop(ctx.currentTime + 0.2);
            } catch (e) {
              // ignore audio error
            }
          }
        }
      }
      prevBidsCountRef.current = incomingBids.length;
    });

    return () => unsubscribe();
  }, [isAudioEnabled]);

  // Handle triggering a simulated competitor bid for live demonstration
  const handleTriggerSimulatedBid = () => {
    const created = mockStore.simulateIncomingBid();
    if (created) {
      setNewestBidId(created.id);
      setTimeout(() => setNewestBidId(null), 3500);
    }
  };

  const filteredBids = bids.filter((b) => {
    if (filterCrop === 'all') return true;
    return b.cropType?.toLowerCase().includes(filterCrop.toLowerCase());
  });

  const formatTimeAgo = (dateStr: string | number | Date) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const seconds = Math.floor(diff / 1000);
    if (seconds < 60) return `${Math.max(1, seconds)}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden flex flex-col h-full max-h-[580px]">
      
      {/* Header with Live Status & Audio Controls */}
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <div>
            <h3 className="font-bold text-sm text-zinc-900 dark:text-white font-['Space_Grotesk'] flex items-center gap-1.5">
              Live Bidding Feed
              <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                onSnapshot
              </span>
            </h3>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
              Real-time Firestore stream of competitive bids
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Audio Chime Toggle */}
          <button
            onClick={() => setIsAudioEnabled(!isAudioEnabled)}
            title={isAudioEnabled ? 'Mute bid audio notifications' : 'Enable live auction bid chimes'}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 transition-colors"
          >
            {isAudioEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-600" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* Test Live Bid Trigger */}
          <button
            id="btn-trigger-test-bid"
            onClick={handleTriggerSimulatedBid}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold transition-all shadow-xs"
            title="Simulate an instant incoming industrial bid to verify live onSnapshot update without page reload"
          >
            <Zap className="w-3 h-3" />
            <span className="hidden sm:inline">Simulate Bid</span>
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="px-3 py-2 bg-zinc-100/70 dark:bg-zinc-800/40 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-[11px]">
        <span className="text-zinc-500 font-medium">
          Showing {filteredBids.length} live auction events
        </span>
        <div className="flex items-center gap-1 text-zinc-600 dark:text-zinc-300">
          <Filter className="w-3 h-3 text-zinc-400" />
          <select
            value={filterCrop}
            onChange={(e) => setFilterCrop(e.target.value)}
            className="bg-transparent border-none text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 focus:ring-0 p-0 cursor-pointer"
          >
            <option value="all">All Biomass Types</option>
            <option value="paddy">Paddy Straw</option>
            <option value="bagasse">Sugarcane Bagasse</option>
            <option value="corn">Corn Stover</option>
            <option value="wheat">Wheat Straw</option>
          </select>
        </div>
      </div>

      {/* Bids Stream List with Real-time pulse highlighting */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 divide-y divide-zinc-100 dark:divide-zinc-800/50">
        {filteredBids.length === 0 ? (
          <div className="py-8 text-center text-zinc-400 text-xs">
            No live bids recorded yet. Click "Simulate Bid" to trigger an event!
          </div>
        ) : (
          filteredBids.map((bid) => {
            const isFresh = bid.id === newestBidId;

            return (
              <div
                key={bid.id}
                onClick={() => onSelectListing && onSelectListing(bid.listingId)}
                className={`pt-2.5 first:pt-0 p-2 rounded-xl transition-all cursor-pointer ${
                  isFresh
                    ? 'bg-emerald-50 dark:bg-emerald-950/70 ring-2 ring-emerald-500 animate-pulse'
                    : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/60'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    <div className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-300 flex-shrink-0 mt-0.5">
                      <Factory className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-xs text-zinc-900 dark:text-white">
                          {bid.buyerName || 'Industrial Bio-Plant'}
                        </span>
                        {isFresh && (
                          <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-emerald-500 text-white">
                            NEW
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
                        {bid.buyerIndustry || 'Bio-CNG / 2G Ethanol'}
                      </p>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className="font-extrabold text-sm text-emerald-600 dark:text-emerald-400 font-['Space_Grotesk']">
                      ₹{bid.bidAmount?.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[10px] text-zinc-500 font-medium">
                      ₹{Math.round(bid.pricePerTon || (bid.bidAmount / (bid.weightTons || 50))).toLocaleString('en-IN')}/Ton
                    </div>
                  </div>
                </div>

                <div className="mt-2 flex items-center justify-between text-[10px] text-zinc-400 pl-9">
                  <span className="font-medium text-zinc-600 dark:text-zinc-300">
                    Lot #{bid.listingId}: {bid.cropType || 'Biomass'} ({bid.weightTons || 80} T)
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    {formatTimeAgo(bid.timestamp)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer ticker info */}
      <div className="p-2.5 bg-zinc-50 dark:bg-zinc-800/40 border-t border-zinc-200 dark:border-zinc-800 text-[10px] text-zinc-500 flex items-center justify-between px-4">
        <span>Bidding increments: ₹50 - ₹250/Ton</span>
        <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> Live Escrow Backed
        </span>
      </div>

    </div>
  );
};
