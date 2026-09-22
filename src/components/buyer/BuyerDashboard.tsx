import React, { useState, useEffect } from 'react';
import { subscribeToListings } from '../../firebase/firestoreService';
import { Listing } from '../../types';
import { LiveBiddingFeed } from './LiveBiddingFeed';
import { WasteHeatmap } from './WasteHeatmap';
import { BidModal } from './BidModal';
import {
  Factory,
  Search,
  Filter,
  SlidersHorizontal,
  Scale,
  Droplets,
  MapPin,
  TrendingUp,
  DollarSign,
  Leaf,
  Layers,
  Sparkles,
  ArrowUpDown,
  CheckCircle2,
  Calendar,
  Compass,
} from 'lucide-react';

interface BuyerDashboardProps {
  onNavigateToFarmer?: () => void;
  onNavigateToLogistics?: () => void;
}

export const BuyerDashboard: React.FC<BuyerDashboardProps> = ({
  onNavigateToFarmer,
  onNavigateToLogistics,
}) => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState<string>('all');
  const [maxMoisture, setMaxMoisture] = useState<number>(30);
  const [maxRadiusKm, setMaxRadiusKm] = useState<number>(300);
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'pending'>('open');
  const [sortBy, setSortBy] = useState<'highestBid' | 'lowestPrice' | 'highestTons' | 'lowestMoisture'>('highestTons');

  const [activeTab, setActiveTab] = useState<'listings' | 'heatmap'>('listings');
  const [selectedListingForBid, setSelectedListingForBid] = useState<Listing | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Subscribe to real-time listings
  useEffect(() => {
    const unsubscribe = subscribeToListings((data) => {
      setListings(data);
    });
    return () => unsubscribe();
  }, []);

  // Filter listings based on multi-parameter procurement criteria
  const filteredListings = listings.filter((item) => {
    // Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = item.cropType.toLowerCase().includes(q);
      const matchLoc = (item.locationName || '').toLowerCase().includes(q);
      const matchFarmer = (item.farmerName || '').toLowerCase().includes(q);
      if (!matchName && !matchLoc && !matchFarmer) return false;
    }

    // Crop filter
    if (selectedCrop !== 'all') {
      if (!item.cropType.toLowerCase().includes(selectedCrop.toLowerCase())) {
        return false;
      }
    }

    // Moisture filter
    if (item.moisturePercentage > maxMoisture) {
      return false;
    }

    // Status filter
    if (statusFilter !== 'all' && item.status !== statusFilter) {
      return false;
    }

    return true;
  });

  // Sort logic
  const sortedListings = [...filteredListings].sort((a, b) => {
    if (sortBy === 'highestTons') return b.weightTons - a.weightTons;
    if (sortBy === 'lowestMoisture') return a.moisturePercentage - b.moisturePercentage;
    if (sortBy === 'lowestPrice') {
      const priceA = (a.currentHighestBid || 0) / a.weightTons;
      const priceB = (b.currentHighestBid || 0) / b.weightTons;
      return priceA - priceB;
    }
    return (b.currentHighestBid || 0) - (a.currentHighestBid || 0);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-emerald-800 text-white shadow-xl border border-emerald-600 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-300 flex-shrink-0" />
          <span className="text-xs font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Top Header & Telemetry */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white font-['Space_Grotesk']">
              Industrial Procurement Terminal
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
              Desktop-Optimized
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Procure agricultural residue for Bio-CNG digesters, 2G ethanol, and paper pulp mills with live bidding & GIS routing.
          </p>
        </div>

        {/* Global Stats bar */}
        <div className="flex items-center gap-3 bg-zinc-100 dark:bg-zinc-800/80 p-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700/80 text-xs">
          <div className="px-3 py-1">
            <span className="text-[10px] text-zinc-400 block uppercase font-bold">Open Batches</span>
            <span className="font-extrabold text-sm text-zinc-900 dark:text-white">
              {listings.filter((l) => l.status === 'open').length}
            </span>
          </div>
          <div className="w-px h-7 bg-zinc-300 dark:bg-zinc-700"></div>
          <div className="px-3 py-1">
            <span className="text-[10px] text-zinc-400 block uppercase font-bold">Total Available</span>
            <span className="font-extrabold text-sm text-emerald-600 dark:text-emerald-400">
              {listings.reduce((acc, l) => acc + l.weightTons, 0).toLocaleString()} Tons
            </span>
          </div>
          <div className="w-px h-7 bg-zinc-300 dark:bg-zinc-700"></div>
          <div className="px-3 py-1">
            <span className="text-[10px] text-zinc-400 block uppercase font-bold">Avg Moisture</span>
            <span className="font-extrabold text-sm text-blue-600 dark:text-blue-400">
              {(listings.reduce((acc, l) => acc + l.moisturePercentage, 0) / (listings.length || 1)).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Advanced Search & Filtering Toolbar */}
      <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
        
        {/* Row 1: Search & Core Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Keyword Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search crop, region, farmer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          {/* Crop Type Filter */}
          <div className="relative">
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-medium cursor-pointer"
            >
              <option value="all">All Biomass Residues</option>
              <option value="paddy">Paddy Straw (Parali)</option>
              <option value="bagasse">Sugarcane Bagasse</option>
              <option value="corn">Corn Stover (Maize)</option>
              <option value="wheat">Wheat Straw (Turi)</option>
              <option value="cotton">Cotton Stalks</option>
              <option value="coir">Coconut Coir Pith</option>
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-medium cursor-pointer"
            >
              <option value="highestTons">Sort: Highest Volume (Tons)</option>
              <option value="lowestMoisture">Sort: Lowest Moisture %</option>
              <option value="lowestPrice">Sort: Lowest ₹/Ton</option>
              <option value="highestBid">Sort: Highest Total Bid</option>
            </select>
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs">
            {(['open', 'all'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`flex-1 py-1 rounded-lg capitalize font-medium transition-colors ${
                  statusFilter === st
                    ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs font-semibold'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                {st === 'open' ? 'Active Bidding' : 'All Batches'}
              </button>
            ))}
          </div>

        </div>

        {/* Row 2: Sliders for Moisture Level and Radius */}
        <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs">
          
          {/* Max Moisture Level Slider */}
          <div className="w-full sm:w-1/2 flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-300 flex-shrink-0">
              <Droplets className="w-3.5 h-3.5 text-blue-500" />
              <span>Max Moisture:</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">{maxMoisture}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="25"
              step="1"
              value={maxMoisture}
              onChange={(e) => setMaxMoisture(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>

          {/* Procurement Radius Slider */}
          <div className="w-full sm:w-1/2 flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-300 flex-shrink-0">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              <span>Logistics Radius:</span>
              <span className="font-bold text-rose-600 dark:text-rose-400">{maxRadiusKm} km</span>
            </div>
            <input
              type="range"
              min="50"
              max="500"
              step="25"
              value={maxRadiusKm}
              onChange={(e) => setMaxRadiusKm(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>

        </div>

      </div>

      {/* Main Content Layout: Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (7 Columns): Biomass Batches Grid & Interactive Listings */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-zinc-900 dark:text-white font-['Space_Grotesk']">
                Available Biomass Batches ({sortedListings.length})
              </h2>
              <span className="text-xs text-zinc-500">Live verified lots</span>
            </div>

            {/* View Switcher Tabs: Cards vs Heatmap */}
            <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 p-0.5 rounded-lg text-xs">
              <button
                onClick={() => setActiveTab('listings')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  activeTab === 'listings'
                    ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs font-semibold'
                    : 'text-zinc-500'
                }`}
              >
                Lot Grid
              </button>
              <button
                onClick={() => setActiveTab('heatmap')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  activeTab === 'heatmap'
                    ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs font-semibold'
                    : 'text-zinc-500'
                }`}
              >
                Geographic Map
              </button>
            </div>
          </div>

          {activeTab === 'heatmap' ? (
            <WasteHeatmap
              listings={listings}
              onSelectListing={(id) => {
                const found = listings.find((l) => l.id === id);
                if (found) {
                  setSelectedListingForBid(found);
                  setActiveTab('listings');
                }
              }}
            />
          ) : sortedListings.length === 0 ? (
            <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
              <Factory className="w-10 h-10 text-zinc-400 mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                No lots match the current procurement filters
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Try widening your moisture threshold or resetting the crop type filter.
              </p>
              <button
                onClick={() => {
                  setSelectedCrop('all');
                  setMaxMoisture(30);
                  setSearchQuery('');
                }}
                className="mt-3 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedListings.map((listing) => {
                const currentHigh = listing.currentHighestBid || (listing.askingPricePerTon || 2400) * listing.weightTons;
                const pricePerTon = currentHigh / listing.weightTons;
                const carbonTons = Math.round(listing.weightTons * 1.35);

                return (
                  <div
                    key={listing.id}
                    className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 shadow-xs hover:border-emerald-500/60 transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-base text-zinc-900 dark:text-white font-['Space_Grotesk']">
                            {listing.cropType}
                          </span>
                          <span className="text-xs text-zinc-400">#{listing.id}</span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            {listing.status === 'open' ? 'Active Auction' : 'Escrow Pending'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                            {listing.locationName || 'Agro Hub'}
                          </span>
                          <span>•</span>
                          <span>Farmer: {listing.farmerName || 'Verified Grower'}</span>
                        </div>
                      </div>

                      {/* Current Highest Bid Highlight */}
                      <div className="text-right flex-shrink-0">
                        <div className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 font-['Space_Grotesk']">
                          ₹{currentHigh.toLocaleString('en-IN')}
                        </div>
                        <div className="text-[11px] text-zinc-500 font-semibold">
                          ₹{Math.round(pricePerTon).toLocaleString('en-IN')} / Ton
                        </div>
                      </div>
                    </div>

                    {/* Specification tags */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 text-xs">
                      <div>
                        <span className="text-[10px] text-zinc-400 block">Tonnage</span>
                        <span className="font-bold text-zinc-900 dark:text-white">
                          {listing.weightTons} Metric Tons
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-400 block">Moisture Content</span>
                        <span className="font-bold text-blue-600 dark:text-blue-400">
                          {listing.moisturePercentage}%
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-400 block">Packaging</span>
                        <span className="font-medium text-zinc-700 dark:text-zinc-300 capitalize truncate">
                          {listing.baleType?.replace('_', ' ') || 'Square Bales'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-400 block">CO2e Mitigation</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <Leaf className="w-3 h-3" />
                          {carbonTons} MT CO2e
                        </span>
                      </div>
                    </div>

                    {/* Description excerpt */}
                    {listing.description && (
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-1">
                        {listing.description}
                      </p>
                    )}

                    {/* Bottom Action Footer */}
                    <div className="flex items-center justify-between pt-1 text-xs">
                      <div className="flex items-center gap-2 text-zinc-500">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">
                          <TrendingUp className="w-3 h-3 text-emerald-500" />
                          {listing.bidCount || 0} competing bids
                        </span>
                        <span className="text-[11px] text-zinc-400">
                          Reserve: ₹{(listing.askingPricePerTon || 2400).toLocaleString('en-IN')}/T
                        </span>
                      </div>

                      <button
                        onClick={() => setSelectedListingForBid(listing)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md shadow-emerald-600/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                      >
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>Place Competitive Bid</span>
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* Right Column (5 Columns): Live Bidding Feed & Map Preview */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Live Bidding Feed (Requirement 3: Firestore onSnapshot listener) */}
          <LiveBiddingFeed
            onSelectListing={(listingId) => {
              const found = listings.find((l) => l.id === listingId);
              if (found) {
                setSelectedListingForBid(found);
              }
            }}
          />

          {/* Quick Heat Map Preview */}
          {activeTab !== 'heatmap' && (
            <WasteHeatmap
              listings={listings}
              onSelectListing={(id) => {
                const found = listings.find((l) => l.id === id);
                if (found) {
                  setSelectedListingForBid(found);
                }
              }}
            />
          )}

        </div>

      </div>

      {/* Bid Placement Modal */}
      <BidModal
        listing={selectedListingForBid}
        isOpen={Boolean(selectedListingForBid)}
        onClose={() => setSelectedListingForBid(null)}
        onBidSubmitted={(bid) => {
          setToastMessage(`Bid of ₹${bid.bidAmount.toLocaleString('en-IN')} submitted for Lot #${bid.listingId}!`);
          setTimeout(() => setToastMessage(null), 5000);
        }}
      />

    </div>
  );
};
