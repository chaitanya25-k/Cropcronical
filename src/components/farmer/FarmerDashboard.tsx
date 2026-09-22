import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  subscribeToListings,
  subscribeToJobs,
  acceptBidAndScheduleDispatch,
  confirmDeliveryAndAwardCredits,
  calculateCarbonCredits,
} from '../../firebase/firestoreService';
import { Listing, Job } from '../../types';
import { CarbonWalletCard } from './CarbonWalletCard';
import { NewListingModal } from './NewListingModal';
import {
  PlusCircle,
  Tractor,
  Clock,
  Layers,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  MapPin,
  Scale,
  Droplets,
  DollarSign,
  ChevronRight,
  Flame,
  ShieldCheck,
  Truck,
  Sparkles,
  ExternalLink,
  Award,
} from 'lucide-react';

interface FarmerDashboardProps {
  onNavigateToBuyer?: () => void;
  onNavigateToLogistics?: () => void;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({
  onNavigateToBuyer,
  onNavigateToLogistics,
}) => {
  const { currentUser } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isNewListingModalOpen, setIsNewListingModalOpen] = useState(false);
  const [selectedListingForReview, setSelectedListingForReview] = useState<Listing | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'open' | 'pending' | 'sold'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [processingJobId, setProcessingJobId] = useState<string | null>(null);

  useEffect(() => {
    const unsubListings = subscribeToListings((data) => {
      setListings(data);
    });
    const unsubJobs = subscribeToJobs((data) => {
      setJobs(data);
    });
    return () => {
      unsubListings();
      unsubJobs();
    };
  }, []);

  // Filter listings by current farmer (or show sample farmer items)
  const myListings = listings.filter(
    (l) => l.farmerId === currentUser.uid || l.farmerId === 'farmer-1' || l.farmerId === 'farmer-2'
  );

  const filteredListings = myListings.filter((l) => {
    if (activeFilter === 'all') return true;
    return l.status === activeFilter;
  });

  const handleAcceptHighBid = async (listing: Listing) => {
    try {
      await acceptBidAndScheduleDispatch(listing.id, 'bid-accepted');
      setToastMessage(`Accepted highest offer of ₹${listing.currentHighestBid?.toLocaleString('en-IN')} for ${listing.cropType}! Logistics hauling job created & dispatched.`);
      setTimeout(() => setToastMessage(null), 5000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleConfirmDeliveryFromFarmer = async (listing: Listing) => {
    const matchingJob = jobs.find((j) => j.listingId === listing.id) || jobs[0];
    if (!matchingJob) return;

    setProcessingJobId(matchingJob.id);
    try {
      const result = await confirmDeliveryAndAwardCredits(matchingJob.id);
      const earned = result.creditsEarned;
      setToastMessage(`Delivery confirmed at weighbridge! Listing marked as 'SOLD' and +${earned} MT CO2e Carbon Credits credited to your wallet in real-time.`);
      setTimeout(() => setToastMessage(null), 6000);
    } catch (err) {
      console.error('Delivery confirmation error:', err);
    } finally {
      setProcessingJobId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-emerald-800 text-white shadow-xl border border-emerald-600 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-300 flex-shrink-0" />
          <span className="text-xs font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white font-['Space_Grotesk']">
              Farmer Control Terminal
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
              Mobile-First
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Manage your crop residue batches, track real-time industrial bids, and claim carbon rewards.
          </p>
        </div>

        {/* Primary New Listing Button */}
        <button
          id="btn-open-new-listing"
          onClick={() => setIsNewListingModalOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md shadow-emerald-600/20 hover:shadow-emerald-600/30 transition-all transform hover:-translate-y-0.5"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post New Residue Batch</span>
        </button>
      </div>

      {/* Digital Carbon Wallet Component */}
      <section>
        <CarbonWalletCard onOpenCalculator={() => setIsNewListingModalOpen(true)} />
      </section>

      {/* Summary KPI Cards */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <div className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-emerald-600" /> Active Batches
          </div>
          <div className="text-2xl font-bold text-zinc-900 dark:text-white mt-1">
            {myListings.filter((l) => l.status === 'open').length}
          </div>
          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5">
            Bidding in progress
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <div className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5 text-teal-600" /> Tonnage Under Trade
          </div>
          <div className="text-2xl font-bold text-zinc-900 dark:text-white mt-1">
            {myListings.reduce((sum, l) => sum + l.weightTons, 0)} <span className="text-sm font-normal text-zinc-500">Tons</span>
          </div>
          <div className="text-[10px] text-zinc-500 mt-0.5">
            Residue diverted
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <div className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-amber-600" /> Current Highest Bids
          </div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
            ₹{myListings.reduce((sum, l) => sum + (l.currentHighestBid || 0), 0).toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-zinc-500 mt-0.5">
            Combined offer value
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <div className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> Total Bids Received
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {myListings.reduce((sum, l) => sum + (l.bidCount || 0), 0)}
          </div>
          <div className="text-[10px] text-zinc-500 mt-0.5">
            Across industrial buyers
          </div>
        </div>
      </section>

      {/* "My Listings" Section */}
      <section className="space-y-4">
        
        {/* Section Header with status filter tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white font-['Space_Grotesk']">
              My Crop Residue Batches
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Live status, competitive offers, and hauling dispatch readiness
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs">
            {(['all', 'open', 'pending', 'sold'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1 rounded-lg capitalize font-medium transition-colors ${
                  activeFilter === filter
                    ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Listings List / Grid (Mobile-friendly stacked cards) */}
        {filteredListings.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30">
            <Tractor className="w-10 h-10 text-zinc-400 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              No batches match the selected status
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm mx-auto">
              Post your harvested crop residue to receive live bids from bio-gas refineries and paper mills.
            </p>
            <button
              onClick={() => setIsNewListingModalOpen(true)}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create First Batch</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredListings.map((listing) => {
              const askingTotal = (listing.askingPricePerTon || 2400) * listing.weightTons;
              const currentHigh = listing.currentHighestBid || askingTotal;
              const hasOutbidAsking = currentHigh > askingTotal;

              return (
                <div
                  key={listing.id}
                  className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-xs hover:border-emerald-500/50 transition-all space-y-4"
                >
                  {/* Top Bar: Title & Status Badge */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-base text-zinc-900 dark:text-white font-['Space_Grotesk']">
                          {listing.cropType}
                        </span>
                        <span className="text-xs text-zinc-400">#{listing.id}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                        <span>{listing.locationName || 'Farm Hub'}</span>
                      </div>
                    </div>

                    {/* Status badge */}
                    <span
                      className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full border ${
                        listing.status === 'open'
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                          : listing.status === 'pending'
                          ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-300 dark:border-zinc-700'
                      }`}
                    >
                      {listing.status === 'open' ? 'Active Bidding' : listing.status === 'pending' ? 'Escrow Pending' : 'Sold & Hauled'}
                    </span>
                  </div>

                  {/* Lot Characteristics */}
                  <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 text-xs">
                    <div>
                      <span className="text-[10px] text-zinc-400 block">Weight</span>
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
                      <span className="text-[10px] text-zinc-400 block">Format</span>
                      <span className="font-medium text-zinc-700 dark:text-zinc-300 capitalize truncate">
                        {listing.baleType?.replace('_', ' ') || 'Square Bales'}
                      </span>
                    </div>
                  </div>

                  {/* Bidding Summary Box */}
                  <div className="p-3 rounded-xl border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-800/20 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-emerald-500" />
                        Highest Industrial Bid
                      </div>
                      <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 font-['Space_Grotesk'] flex items-baseline gap-1">
                        ₹{currentHigh.toLocaleString('en-IN')}
                        <span className="text-xs font-normal text-zinc-500">
                          (₹{Math.round(currentHigh / listing.weightTons).toLocaleString('en-IN')}/ton)
                        </span>
                      </div>
                      <div className="text-[10px] text-zinc-500 mt-0.5">
                        Reserve base: ₹{askingTotal.toLocaleString('en-IN')} (₹{(listing.askingPricePerTon || 2400).toLocaleString('en-IN')}/ton)
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
                        {listing.bidCount || 0} Bids Placed
                      </span>
                      {hasOutbidAsking && (
                        <div className="text-[10px] text-emerald-600 font-semibold mt-1">
                          +₹{(currentHigh - askingTotal).toLocaleString('en-IN')} above reserve!
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions for this batch */}
                  <div className="flex items-center justify-between pt-1 gap-2">
                    <button
                      onClick={() => onNavigateToBuyer && onNavigateToBuyer()}
                      className="text-xs text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 flex items-center gap-1 font-medium"
                    >
                      <span>View Live Auction Stream</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>

                    {listing.status === 'open' && (
                      <button
                        onClick={() => handleAcceptHighBid(listing)}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-xs"
                      >
                        Accept Best Bid
                      </button>
                    )}

                    {listing.status === 'pending' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onNavigateToLogistics && onNavigateToLogistics()}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition-colors"
                        >
                          <Truck className="w-3 h-3" />
                          <span>Track Hauler</span>
                        </button>
                        <button
                          onClick={() => handleConfirmDeliveryFromFarmer(listing)}
                          disabled={Boolean(processingJobId)}
                          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-xs"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{processingJobId ? 'Minting Credits...' : 'Confirm Delivery & Claim Credits'}</span>
                        </button>
                      </div>
                    )}

                    {listing.status === 'sold' && (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-semibold text-xs border border-emerald-300 dark:border-emerald-800">
                        <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>Sold & Delivered • +{listing.carbonCreditsAwarded || calculateCarbonCredits(listing.weightTons)} MT CO2e Minted</span>
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Modal for creating a new listing */}
      <NewListingModal
        isOpen={isNewListingModalOpen}
        onClose={() => setIsNewListingModalOpen(false)}
        onListingCreated={(newLot) => {
          setToastMessage(`Batch for ${newLot.weightTons} Tons of ${newLot.cropType} successfully broadcasted to industrial buyers!`);
          setTimeout(() => setToastMessage(null), 5000);
        }}
      />

    </div>
  );
};
