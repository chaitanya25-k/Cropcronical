import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { createListing } from '../../firebase/firestoreService';
import { Listing } from '../../types';
import {
  X,
  Tractor,
  UploadCloud,
  Leaf,
  DollarSign,
  Droplets,
  Scale,
  MapPin,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileText,
} from 'lucide-react';

interface NewListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onListingCreated?: (listing: Listing) => void;
}

const COMMON_CROPS = [
  'Paddy Straw (Parali)',
  'Sugarcane Bagasse',
  'Corn Stover (Maize)',
  'Wheat Straw (Turi)',
  'Cotton Stalks',
  'Coconut Coir Pith',
  'Mustard Stalk Residue',
  'Barley Straw',
];

export const NewListingModal: React.FC<NewListingModalProps> = ({
  isOpen,
  onClose,
  onListingCreated,
}) => {
  const { currentUser, updateUserCarbonCredits } = useAuth();

  const [cropType, setCropType] = useState<string>('Paddy Straw (Parali)');
  const [acreage, setAcreage] = useState<number>(30);
  const [weightTons, setWeightTons] = useState<number>(90);
  const [moisturePercentage, setMoisturePercentage] = useState<number>(12);
  const [askingPricePerTon, setAskingPricePerTon] = useState<number>(2500);
  const [baleType, setBaleType] = useState<'square_bales' | 'round_bales' | 'loose_bulk'>('square_bales');
  const [locationName, setLocationName] = useState<string>('Kurukshetra Agro Hub, Haryana');
  const [description, setDescription] = useState<string>('Stored under waterproof tarp shed. Mechanically baled and moisture tested.');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Carbon Credit preview
  const [carbonPreview, setCarbonPreview] = useState<{
    credits: number;
    valueInr: number;
    trees: number;
  }>({
    credits: 112.5,
    valueInr: 174375,
    trees: 5113,
  });

  // Re-calculate projected carbon credits when weight/crop changes
  useEffect(() => {
    const fetchEstimate = async () => {
      try {
        const res = await fetch('/api/carbon-credits/calculate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cropType,
            weightTons,
            moisturePercentage,
          }),
        });
        if (res.ok) {
          const json = await res.json();
          if (json.data) {
            setCarbonPreview({
              credits: json.data.carbonCreditsEarned,
              valueInr: json.data.estimatedRevenueInr || Math.round(json.data.carbonCreditsEarned * 1550),
              trees: json.data.equivalentTreesPlanted,
            });
          }
        }
      } catch (e) {
        // Fallback calculation formula if offline
        const dry = weightTons * (1 - moisturePercentage / 100);
        const credits = Math.round(dry * 1.35 * 10) / 10;
        setCarbonPreview({
          credits,
          valueInr: Math.round(credits * 1550),
          trees: Math.round((credits * 1000) / 22),
        });
      }
    };

    fetchEstimate();
  }, [cropType, weightTons, moisturePercentage]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (weightTons <= 0) {
      setErrorMsg('Please specify a positive tonnage for the biomass.');
      return;
    }

    setIsSubmitting(true);
    try {
      const newListing = await createListing({
        farmerId: currentUser.uid,
        farmerName: currentUser.fullName,
        cropType,
        acreage: Number(acreage),
        weightTons: Number(weightTons),
        moisturePercentage: Number(moisturePercentage),
        askingPricePerTon: Number(askingPricePerTon),
        locationName,
        coordinates: currentUser.location || { latitude: 29.9695, longitude: 76.8783 },
        baleType,
        description,
      });

      // Reward provisional carbon credit milestone
      updateUserCarbonCredits(Math.round(carbonPreview.credits * 0.2 * 10) / 10);

      setSuccess(true);
      if (onListingCreated) {
        onListingCreated(newListing);
      }

      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to submit listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 my-8 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
              <Tractor className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white font-['Space_Grotesk']">
                List Agricultural Biomass
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Upload crop residue for competitive bidding by bio-gas & paper industries
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

        {/* Content Body */}
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
              <span>Listing published successfully! Industrial buyers are now viewing your lot.</span>
            </div>
          )}

          {/* Crop Type Selection */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
              Crop Residue Type *
            </label>
            <select
              value={cropType}
              onChange={(e) => setCropType(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            >
              {COMMON_CROPS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Numerical Inputs: Weight, Acreage, Moisture */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5 flex items-center gap-1">
                <Scale className="w-3.5 h-3.5 text-emerald-600" />
                Estimated Weight (Tons) *
              </label>
              <input
                type="number"
                min="1"
                step="1"
                required
                value={weightTons}
                onChange={(e) => setWeightTons(Math.max(1, Number(e.target.value)))}
                className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-amber-600" />
                Harvested Acreage
              </label>
              <input
                type="number"
                min="1"
                value={acreage}
                onChange={(e) => setAcreage(Math.max(1, Number(e.target.value)))}
                className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5 flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5 text-blue-500" />
                Moisture Content (%) *
              </label>
              <input
                type="number"
                min="5"
                max="40"
                step="0.5"
                required
                value={moisturePercentage}
                onChange={(e) => setMoisturePercentage(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
              <span className="text-[10px] text-zinc-500">Optimum &lt; 15%</span>
            </div>
          </div>

          {/* Pricing & Packaging Format */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                Baseline Reserve (₹ / Ton)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2 text-sm text-zinc-400">₹</span>
                <input
                  type="number"
                  min="500"
                  step="50"
                  value={askingPricePerTon}
                  onChange={(e) => setAskingPricePerTon(Number(e.target.value))}
                  className="w-full pl-7 pr-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
              <span className="text-[10px] text-zinc-500">
                Total Reserve: ₹{(weightTons * askingPricePerTon).toLocaleString('en-IN')} INR
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Bale / Packaging Format
              </label>
              <select
                value={baleType}
                onChange={(e) => setBaleType(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                <option value="square_bales">High Density Square Bales</option>
                <option value="round_bales">Standard Round Bales</option>
                <option value="loose_bulk">Loose Bulk (Unchopped/Chipped)</option>
              </select>
            </div>
          </div>

          {/* Location & Details */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              Farm Storage / Pickup Hub
            </label>
            <input
              type="text"
              required
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
              Storage Condition & Access Notes
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          {/* Carbon Credit Live Bonus Banner */}
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <div>
                <span className="font-bold text-emerald-900 dark:text-emerald-200">
                  Estimated Carbon Bounty: +{carbonPreview.credits} MT CO2e
                </span>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                  Valued at ~₹{carbonPreview.valueInr.toLocaleString('en-IN')} INR upon confirmed upcycling delivery
                </p>
              </div>
            </div>
            <span className="text-[10px] font-semibold px-2 py-1 rounded bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 whitespace-nowrap">
              UNFCCC Method
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
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
                <span>Publishing Lot...</span>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" />
                  <span>Publish to Marketplace</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
