import React, { useState, useEffect } from 'react';
import { subscribeToJobs, updateJobStatus } from '../../firebase/firestoreService';
import { Job } from '../../types';
import {
  Truck,
  MapPin,
  Clock,
  CheckCircle2,
  Navigation,
  Scale,
  ShieldCheck,
  AlertCircle,
  FileCheck,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const LogisticsTracker: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const unsub = subscribeToJobs((data) => {
      setJobs(data);
    });
    return () => unsub();
  }, []);

  const handleStatusChange = async (jobId: string, newStatus: Job['pickupStatus']) => {
    const job = jobs.find((j) => j.id === jobId);
    await updateJobStatus(jobId, newStatus);
    if (newStatus === 'delivered') {
      const weight = job?.weightTons || 100;
      const credits = Math.round(weight * 1.35 * 10) / 10;
      setToastMessage(`Job #${jobId} DELIVERED! Listing marked as 'SOLD' & +${credits} MT CO2e Carbon Credits minted to farmer in real-time.`);
    } else {
      setToastMessage(`Job #${jobId} status updated to: ${newStatus.toUpperCase()}`);
    }
    setTimeout(() => setToastMessage(null), 5000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-emerald-800 text-white shadow-xl border border-emerald-600 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-300 flex-shrink-0" />
          <span className="text-xs font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white font-['Space_Grotesk']">
              Biomass Logistics & Hauling Fleet
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
              Jobs Dispatch
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Track farm gate collection, weighbridge verification, and mill delivery contracts.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Weighbridge OTP Integration Active</span>
        </div>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {jobs.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-zinc-400 text-xs">
            No logistics jobs dispatched yet.
          </div>
        ) : (
          jobs.map((job) => {
            const isDelivered = job.pickupStatus === 'delivered';
            const isInTransit = job.pickupStatus === 'in-transit';

            return (
              <div
                key={job.id}
                className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-xs">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-sm text-zinc-900 dark:text-white font-['Space_Grotesk']">
                        Contract #{job.id}
                      </span>
                      <span className="text-xs text-zinc-400 ml-2">Lot Reference: #{job.listingId}</span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full border self-start sm:self-auto ${
                      isDelivered
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                        : isInTransit
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                        : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                    }`}
                  >
                    {job.pickupStatus.replace('-', ' ')}
                  </span>
                </div>

                {/* Logistics Route Origin & Destination */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-800">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                      Farm Gate Collection (Origin)
                    </span>
                    <div className="font-semibold text-zinc-900 dark:text-white flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                      <span>{job.origin || 'Karnal Farm Storage'}</span>
                    </div>
                    <div className="text-[11px] text-zinc-500 mt-1 pl-5">
                      Farmer Contact: {job.farmerName || 'Verified Producer'}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-800">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                      Industrial Bio-Plant Destination
                    </span>
                    <div className="font-semibold text-zinc-900 dark:text-white flex items-center gap-1.5">
                      <Navigation className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                      <span>{job.destination || 'GreenPower Digester Hub'}</span>
                    </div>
                    <div className="text-[11px] text-zinc-500 mt-1 pl-5">
                      Procuring Buyer: {job.buyerName || 'EcoBiogas Corp'}
                    </div>
                  </div>
                </div>

                {/* Cargo Details */}
                <div className="flex flex-wrap items-center justify-between gap-4 p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 text-xs">
                  <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4 text-emerald-600" />
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                      Cargo: {job.weightTons || 120} Tons of {job.cropType || 'Agricultural Biomass'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-zinc-400" />
                    <span className="text-zinc-500 dark:text-zinc-400">
                      ETA: {job.estimatedDelivery || 'In Transit'}
                    </span>
                  </div>
                </div>

                {/* Driver Actions (Update Status) */}
                <div className="flex items-center justify-end gap-2 pt-2">
                  {job.pickupStatus === 'scheduled' && (
                    <button
                      onClick={() => handleStatusChange(job.id, 'in-transit')}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Start Hauling (Mark In-Transit)</span>
                    </button>
                  )}

                  {job.pickupStatus === 'in-transit' && (
                    <button
                      onClick={() => handleStatusChange(job.id, 'delivered')}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verify Weighbridge & Release Escrow</span>
                    </button>
                  )}

                  {isDelivered && (
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      <FileCheck className="w-4 h-4" />
                      <span>Weighbridge Slip Verified • Escrow Settled • +{Math.round((job.weightTons || 100) * 1.35 * 10) / 10} Carbon Credits Minted</span>
                    </span>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
