import React, { useState } from 'react';
import { Listing } from '../../types';
import {
  MapPin,
  Layers,
  Flame,
  Droplets,
  Scale,
  Navigation,
  Compass,
  Info,
  Maximize2,
} from 'lucide-react';

interface WasteHeatmapProps {
  listings: Listing[];
  onSelectListing?: (listingId: string) => void;
  selectedCropFilter?: string;
}

interface RegionHotspot {
  id: string;
  name: string;
  state: string;
  cropDominant: string;
  totalTons: number;
  avgMoisture: number;
  density: 'high' | 'medium' | 'moderate';
  x: number; // percentage in SVG coordinate plane
  y: number;
  listingIds: string[];
}

export const WasteHeatmap: React.FC<WasteHeatmapProps> = ({
  listings,
  onSelectListing,
  selectedCropFilter,
}) => {
  const [activeMode, setActiveMode] = useState<'tonnage' | 'moisture'>('tonnage');
  const [hoveredHotspot, setHoveredHotspot] = useState<RegionHotspot | null>(null);
  const [selectedHotspot, setSelectedHotspot] = useState<RegionHotspot | null>(null);

  // Region hotspots representing agricultural clusters
  const hotspots: RegionHotspot[] = [
    {
      id: 'hotspot-1',
      name: 'Kurukshetra - Karnal Belt',
      state: 'Haryana / Punjab Border',
      cropDominant: 'Paddy Straw & Wheat Turi',
      totalTons: 480,
      avgMoisture: 10.8,
      density: 'high',
      x: 32,
      y: 28,
      listingIds: ['lst-101', 'lst-104'],
    },
    {
      id: 'hotspot-2',
      name: 'Muzaffarnagar Sugarcane Basin',
      state: 'Western Uttar Pradesh',
      cropDominant: 'Sugarcane Bagasse',
      totalTons: 620,
      avgMoisture: 16.5,
      density: 'high',
      x: 42,
      y: 35,
      listingIds: ['lst-102'],
    },
    {
      id: 'hotspot-3',
      name: 'Ludhiana - Patiala Agro Corridor',
      state: 'Central Punjab',
      cropDominant: 'Corn Stover & Maize Husks',
      totalTons: 310,
      avgMoisture: 13.0,
      density: 'medium',
      x: 24,
      y: 20,
      listingIds: ['lst-103'],
    },
    {
      id: 'hotspot-4',
      name: 'Vidarbha Agro Fiber Zone',
      state: 'Eastern Maharashtra',
      cropDominant: 'Cotton Stalks & Soybean Husk',
      totalTons: 220,
      avgMoisture: 14.2,
      density: 'medium',
      x: 48,
      y: 58,
      listingIds: ['lst-105'],
    },
    {
      id: 'hotspot-5',
      name: 'Coimbatore - Pollachi Belt',
      state: 'Tamil Nadu',
      cropDominant: 'Coconut Coir Pith',
      totalTons: 180,
      avgMoisture: 17.5,
      density: 'moderate',
      x: 44,
      y: 82,
      listingIds: ['lst-106'],
    },
  ];

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden flex flex-col">
      
      {/* Header */}
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-zinc-900 dark:text-white font-['Space_Grotesk'] flex items-center gap-1.5">
              Biomass Concentration Heatmap
              <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                Logistics GIS
              </span>
            </h3>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
              Procurement cluster density and hauling radiuses
            </p>
          </div>
        </div>

        {/* Heatmap Layer Mode Toggle */}
        <div className="flex items-center bg-zinc-200/80 dark:bg-zinc-800 p-0.5 rounded-lg text-[11px] font-medium">
          <button
            onClick={() => setActiveMode('tonnage')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              activeMode === 'tonnage'
                ? 'bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 shadow-xs font-semibold'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            Tonnage Density
          </button>
          <button
            onClick={() => setActiveMode('moisture')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              activeMode === 'moisture'
                ? 'bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 shadow-xs font-semibold'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            Moisture Index
          </button>
        </div>
      </div>

      {/* Heatmap Visual Canvas */}
      <div className="relative w-full h-[320px] bg-zinc-950 overflow-hidden select-none border-b border-zinc-200 dark:border-zinc-800">
        
        {/* Dark map grid aesthetic */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:24px_24px] opacity-30 pointer-events-none"></div>

        {/* Subtle geographic contours silhouette */}
        <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" viewBox="0 0 500 400">
          <path
            d="M120,40 Q180,60 220,110 T250,210 T240,320 T210,380 L180,390 Q150,330 140,250 T100,160 Z"
            fill="none"
            stroke="#10b981"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <circle cx="200" cy="180" r="120" fill="none" stroke="#059669" strokeWidth="0.5" strokeDasharray="2 2" />
        </svg>

        {/* Plant Hub Marker (Buyer Facility Center) */}
        <div
          className="absolute z-20 flex flex-col items-center transform -translate-x-1/2 -translate-y-1/2"
          style={{ left: '38%', top: '38%' }}
        >
          <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/50 ring-4 ring-amber-500/20">
            <span className="text-[10px] font-bold">🏭</span>
          </div>
          <span className="text-[9px] font-bold text-amber-300 bg-zinc-900/90 px-1.5 py-0.5 rounded mt-1 border border-amber-500/40 shadow-xs">
            My Bio-Plant
          </span>
        </div>

        {/* 100km & 200km radius circles around Buyer Plant */}
        <div
          className="absolute border border-dashed border-amber-500/30 rounded-full pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
          style={{ left: '38%', top: '38%', width: '150px', height: '150px' }}
        >
          <span className="absolute bottom-1 right-3 text-[8px] text-amber-400/60 font-mono">100 km Radius</span>
        </div>
        <div
          className="absolute border border-dashed border-emerald-500/20 rounded-full pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
          style={{ left: '38%', top: '38%', width: '280px', height: '280px' }}
        >
          <span className="absolute bottom-2 right-6 text-[8px] text-emerald-400/50 font-mono">250 km Radius</span>
        </div>

        {/* Render Regional Biomass Hotspots */}
        {hotspots.map((spot) => {
          const isSelected = selectedHotspot?.id === spot.id;
          const isHovered = hoveredHotspot?.id === spot.id;

          // Heat color logic
          const heatColor =
            activeMode === 'tonnage'
              ? spot.density === 'high'
                ? 'from-red-500/40 via-amber-500/20 to-transparent text-amber-300'
                : 'from-emerald-500/40 via-teal-500/20 to-transparent text-emerald-300'
              : spot.avgMoisture > 15
              ? 'from-blue-500/40 via-cyan-500/20 to-transparent text-blue-300'
              : 'from-emerald-500/40 via-teal-500/20 to-transparent text-emerald-300';

          const size = spot.density === 'high' ? 84 : spot.density === 'medium' ? 64 : 50;

          return (
            <div
              key={spot.id}
              onClick={() => {
                setSelectedHotspot(spot);
                if (spot.listingIds[0] && onSelectListing) {
                  onSelectListing(spot.listingIds[0]);
                }
              }}
              onMouseEnter={() => setHoveredHotspot(spot)}
              onMouseLeave={() => setHoveredHotspot(null)}
              className="absolute z-10 cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-110"
              style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
            >
              {/* Radial Heat Gradient Ring */}
              <div
                className={`rounded-full bg-gradient-to-r ${heatColor} blur-md animate-pulse`}
                style={{ width: `${size}px`, height: `${size}px` }}
              ></div>

              {/* Central Pin */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shadow-lg ${
                    isSelected
                      ? 'bg-white text-zinc-950 ring-4 ring-emerald-400'
                      : spot.density === 'high'
                      ? 'bg-rose-500 text-white'
                      : 'bg-emerald-500 text-white'
                  }`}
                >
                  <MapPin className="w-3 h-3" />
                </div>
                <span className="text-[9px] font-semibold text-white bg-zinc-900/90 px-1.5 py-0.5 rounded mt-1 whitespace-nowrap shadow-xs border border-zinc-800">
                  {spot.totalTons} T
                </span>
              </div>
            </div>
          );
        })}

        {/* Floating Tooltip info on hover / click */}
        {(hoveredHotspot || selectedHotspot) && (
          <div className="absolute bottom-3 left-3 right-3 z-30 bg-zinc-900/95 backdrop-blur-md p-3 rounded-xl border border-zinc-700/80 text-white text-xs shadow-xl flex items-center justify-between gap-3">
            <div>
              <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                {(hoveredHotspot || selectedHotspot)?.name}
                <span className="text-[10px] text-zinc-400 font-normal">
                  ({(hoveredHotspot || selectedHotspot)?.state})
                </span>
              </div>
              <div className="text-[11px] text-zinc-300 mt-0.5">
                Residue: {(hoveredHotspot || selectedHotspot)?.cropDominant} • Avg Moisture: {(hoveredHotspot || selectedHotspot)?.avgMoisture}%
              </div>
            </div>

            <div className="text-right flex-shrink-0">
              <span className="text-xs font-bold text-white bg-emerald-950 px-2 py-1 rounded border border-emerald-700">
                {(hoveredHotspot || selectedHotspot)?.totalTons} Tons Available
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Heatmap Legend */}
      <div className="p-3 bg-zinc-50 dark:bg-zinc-800/40 text-[11px] text-zinc-600 dark:text-zinc-400 flex flex-wrap items-center justify-between gap-2 px-4">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            High Volume (&gt; 400 T)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            Medium Volume (200 - 400 T)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            Buyer Digester Facility
          </span>
        </div>
        <span className="text-zinc-400 text-[10px]">
          Click any hotspot cluster to focus lots
        </span>
      </div>

    </div>
  );
};
