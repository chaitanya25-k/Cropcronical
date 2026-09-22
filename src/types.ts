/**
 * Core Data Types for CropCronical Agricultural Waste Marketplace
 */

export type UserRole = 'farmer' | 'buyer' | 'driver';

export interface GeoLocation {
  latitude: number;
  longitude: number;
}

export interface UserProfile {
  uid: string;
  fullName: string;
  role: UserRole;
  location: GeoLocation;
  carbonCredits: number;
  email?: string;
  phone?: string;
  organization?: string;
}

export type ListingStatus = 'open' | 'pending' | 'sold';

export interface Listing {
  id: string;
  farmerId: string;
  farmerName?: string;
  cropType: string;
  weightTons: number;
  moisturePercentage: number;
  status: ListingStatus;
  createdAt: string | number | Date;
  acreage?: number;
  askingPricePerTon?: number;
  locationName?: string;
  coordinates?: GeoLocation;
  currentHighestBid?: number;
  bidCount?: number;
  description?: string;
  baleType?: 'round_bales' | 'square_bales' | 'loose_bulk';
  carbonCreditsAwarded?: number;
  deliveredAt?: string;
}

export interface Bid {
  id: string;
  listingId: string;
  buyerId: string;
  buyerName?: string;
  buyerIndustry?: string;
  bidAmount: number;
  pricePerTon?: number;
  timestamp: string | number | Date;
  status?: 'pending' | 'accepted' | 'outbid' | 'rejected';
  cropType?: string;
  weightTons?: number;
}

export type JobPickupStatus = 'scheduled' | 'in-transit' | 'delivered';

export interface Job {
  id: string;
  listingId: string;
  driverId: string;
  driverName?: string;
  pickupStatus: JobPickupStatus;
  origin?: string;
  destination?: string;
  originCoords?: GeoLocation;
  destCoords?: GeoLocation;
  weightTons?: number;
  cropType?: string;
  farmerName?: string;
  buyerName?: string;
  dispatchTime?: string;
  estimatedDelivery?: string;
}

export interface CarbonCalculationResult {
  weightTons: number;
  cropType: string;
  co2AvoidedTons: number;
  carbonCreditsEarned: number;
  estimatedRevenueUsd: number;
  estimatedRevenueInr?: number;
  equivalentTreesPlanted: number;
  burningAvoided: boolean;
}

export interface MarketplaceStats {
  tonsUpcycled: number;
  carbonCreditsGenerated: number;
  activeListingsCount: number;
  activeBidsCount: number;
  totalTradingVolumeUsd: number;
  totalTradingVolumeInr?: number;
  participatingFarmersCount: number;
  partnerPlantsCount: number;
}
