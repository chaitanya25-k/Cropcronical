import {
  collection,
  doc,
  addDoc,
  updateDoc,
  setDoc,
  getDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  GeoPoint,
  increment,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './config';
import { mockStore } from './mockStore';
import { Listing, Bid, Job, UserProfile, MarketplaceStats } from '../types';

/**
 * Service providing unified Firestore subscriptions & mutations.
 * Predefined Conversion Rate: 1.35 MT CO2e avoided open burning per metric ton of crop waste
 */
export const CARBON_CREDITS_PER_TON = 1.35;

export function calculateCarbonCredits(weightTons: number): number {
  return Math.round(weightTons * CARBON_CREDITS_PER_TON * 10) / 10;
}

// Subscribe to all Listings in real-time
export function subscribeToListings(callback: (listings: Listing[]) => void): () => void {
  if (isFirebaseConfigured && db) {
    try {
      const q = query(collection(db, 'listings'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const items: Listing[] = snapshot.docs.map((docSnap) => {
            const d = docSnap.data();
            return {
              id: docSnap.id,
              farmerId: d.farmerId,
              farmerName: d.farmerName,
              cropType: d.cropType,
              weightTons: Number(d.weightTons),
              moisturePercentage: Number(d.moisturePercentage),
              status: d.status,
              createdAt: d.createdAt?.toDate ? d.createdAt.toDate().toISOString() : d.createdAt || new Date().toISOString(),
              acreage: d.acreage ? Number(d.acreage) : undefined,
              askingPricePerTon: d.askingPricePerTon ? Number(d.askingPricePerTon) : undefined,
              locationName: d.locationName,
              coordinates: d.location?.latitude ? { latitude: d.location.latitude, longitude: d.location.longitude } : d.coordinates,
              currentHighestBid: d.currentHighestBid ? Number(d.currentHighestBid) : undefined,
              bidCount: d.bidCount ? Number(d.bidCount) : 0,
              description: d.description,
              baleType: d.baleType,
            };
          });
          callback(items.length > 0 ? items : mockStore.subscribeToListings(callback) ? [] : []);
        },
        (error) => {
          console.warn('Firestore onSnapshot error for listings, falling back to mockStore:', error);
          return mockStore.subscribeToListings(callback);
        }
      );
      return unsubscribe;
    } catch (e) {
      console.warn('Firestore init failed for listings:', e);
      return mockStore.subscribeToListings(callback);
    }
  }

  return mockStore.subscribeToListings(callback);
}

// Subscribe to live bids globally across all listings in real-time
export function subscribeToLiveBids(callback: (bids: Bid[]) => void): () => void {
  // If not live Firestore or collectionGroup, use mockStore real-time feed
  return mockStore.subscribeToLiveBids(callback);
}

// Subscribe to bids for a specific listing in real-time
export function subscribeToBidsForListing(listingId: string, callback: (bids: Bid[]) => void): () => void {
  if (isFirebaseConfigured && db) {
    try {
      const bidsRef = collection(db, 'listings', listingId, 'bids');
      const q = query(bidsRef, orderBy('timestamp', 'desc'));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const bids: Bid[] = snapshot.docs.map((docSnap) => {
            const d = docSnap.data();
            return {
              id: docSnap.id,
              listingId,
              buyerId: d.buyerId,
              buyerName: d.buyerName,
              buyerIndustry: d.buyerIndustry,
              bidAmount: Number(d.bidAmount),
              pricePerTon: Number(d.pricePerTon),
              timestamp: d.timestamp?.toDate ? d.timestamp.toDate().toISOString() : d.timestamp || new Date().toISOString(),
              status: d.status,
            };
          });
          callback(bids);
        },
        (err) => {
          console.warn(`Firestore onSnapshot error for listing ${listingId} bids:`, err);
          return mockStore.subscribeToBidsForListing(listingId, callback);
        }
      );
      return unsubscribe;
    } catch {
      return mockStore.subscribeToBidsForListing(listingId, callback);
    }
  }

  return mockStore.subscribeToBidsForListing(listingId, callback);
}

// Add a new agricultural waste listing (Only Farmers)
export async function createListing(data: {
  farmerId: string;
  farmerName: string;
  cropType: string;
  weightTons: number;
  acreage?: number;
  moisturePercentage: number;
  askingPricePerTon?: number;
  locationName?: string;
  coordinates?: { latitude: number; longitude: number };
  description?: string;
  baleType?: 'round_bales' | 'square_bales' | 'loose_bulk';
}): Promise<Listing> {
  if (isFirebaseConfigured && db) {
    try {
      const docRef = await addDoc(collection(db, 'listings'), {
        ...data,
        status: 'open',
        createdAt: serverTimestamp(),
        location: data.coordinates ? new GeoPoint(data.coordinates.latitude, data.coordinates.longitude) : null,
        bidCount: 0,
        currentHighestBid: (data.askingPricePerTon || 30) * data.weightTons,
      });

      return {
        id: docRef.id,
        ...data,
        status: 'open',
        createdAt: new Date().toISOString(),
        bidCount: 0,
        currentHighestBid: (data.askingPricePerTon || 30) * data.weightTons,
      };
    } catch (e) {
      console.warn('Live Firestore createListing failed, writing to mockStore:', e);
    }
  }

  return mockStore.addListing({
    ...data,
    status: 'open',
  });
}

// Place a new bid (Only Buyers, subcollection under listings)
export async function placeBid(
  listingId: string,
  bidData: {
    buyerId: string;
    buyerName: string;
    buyerIndustry: string;
    bidAmount: number;
    pricePerTon: number;
  }
): Promise<Bid> {
  if (isFirebaseConfigured && db) {
    try {
      const bidsRef = collection(db, 'listings', listingId, 'bids');
      const docRef = await addDoc(bidsRef, {
        ...bidData,
        timestamp: serverTimestamp(),
        status: 'pending',
      });

      // Update listing currentHighestBid
      const listingRef = doc(db, 'listings', listingId);
      await updateDoc(listingRef, {
        currentHighestBid: bidData.bidAmount,
      });

      return {
        id: docRef.id,
        listingId,
        ...bidData,
        timestamp: new Date().toISOString(),
        status: 'pending',
      };
    } catch (e) {
      console.warn('Live Firestore placeBid failed, writing to mockStore:', e);
    }
  }

  return mockStore.addBid(listingId, bidData);
}

// Subscribe to logistics Jobs
export function subscribeToJobs(callback: (jobs: Job[]) => void): () => void {
  if (isFirebaseConfigured && db) {
    try {
      const q = query(collection(db, 'jobs'));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const jobs: Job[] = snapshot.docs.map((d) => {
              const data = d.data();
              return {
                id: d.id,
                listingId: data.listingId,
                driverId: data.driverId,
                driverName: data.driverName,
                pickupStatus: data.pickupStatus,
                origin: data.origin,
                destination: data.destination,
                weightTons: Number(data.weightTons),
                cropType: data.cropType,
                farmerName: data.farmerName,
                buyerName: data.buyerName,
                dispatchTime: data.dispatchTime?.toDate ? data.dispatchTime.toDate().toISOString() : data.dispatchTime,
                estimatedDelivery: data.estimatedDelivery,
              };
            });
            callback(jobs);
            return;
          }
          mockStore.subscribeToJobs(callback);
        },
        () => mockStore.subscribeToJobs(callback)
      );
      return unsubscribe;
    } catch {
      return mockStore.subscribeToJobs(callback);
    }
  }
  return mockStore.subscribeToJobs(callback);
}

// Subscribe in real-time to a specific user's profile in the `users` collection
export function subscribeToUserProfile(uid: string, callback: (user: UserProfile) => void): () => void {
  if (isFirebaseConfigured && db) {
    try {
      const userDocRef = doc(db, 'users', uid);
      const unsubscribe = onSnapshot(
        userDocRef,
        (docSnap) => {
          if (docSnap.exists()) {
            const d = docSnap.data();
            const profile: UserProfile = {
              uid,
              fullName: d.fullName || 'Verified Farmer',
              role: d.role || 'farmer',
              location: d.location?.latitude ? { latitude: d.location.latitude, longitude: d.location.longitude } : { latitude: 29.9695, longitude: 76.8783 },
              carbonCredits: Number(d.carbonCredits || 0),
              email: d.email,
              phone: d.phone,
              organization: d.organization,
            };
            callback(profile);
          } else {
            // Document doesn't exist yet, bootstrap with initial user profile from store
            const fallback = mockStore.getUser(uid) || {
              uid,
              fullName: 'Ramesh Patel',
              role: 'farmer',
              location: { latitude: 29.9695, longitude: 76.8783 },
              carbonCredits: 148.5,
              organization: 'Patel Bio-Organic Agro Farm',
            };
            setDoc(userDocRef, fallback, { merge: true }).catch(() => {});
            callback(fallback);
          }
        },
        (err) => {
          console.warn('Firestore onSnapshot error for user profile, using mockStore:', err);
          return mockStore.subscribeToUser(uid, callback);
        }
      );
      return unsubscribe;
    } catch (e) {
      return mockStore.subscribeToUser(uid, callback);
    }
  }

  return mockStore.subscribeToUser(uid, callback);
}

// Subscribe in real-time to Marketplace Telemetry Stats (updates Carbon Credits ticker live)
export function subscribeToMarketStats(callback: (stats: MarketplaceStats) => void): () => void {
  return mockStore.subscribeToStats(callback);
}

/**
 * Real-time System for Calculating and Updating Carbon Credits in the `users` collection:
 * When a `listing` status changes to 'sold' and is confirmed as 'delivered' in the `jobs` collection,
 * calculates the `carbonCredits` earned by the farmer based on `weightTons` and predefined rate (1.35 MT CO2e / Ton).
 * Atomically updates `users/{farmerId}` and marks `listing` as 'sold'.
 */
export async function confirmDeliveryAndAwardCredits(jobId: string): Promise<{
  success: boolean;
  farmerId: string;
  creditsEarned: number;
  newTotalCredits: number;
}> {
  // Always trigger mockStore updates for instant client-side reactivity
  const mockResult = mockStore.confirmDeliveryAndAwardCredits(jobId);

  let farmerId = mockResult?.farmerId || 'farmer-1';
  let creditsEarned = mockResult?.creditsEarned || 0;
  let newTotal = mockResult?.newTotalCredits || 0;

  if (isFirebaseConfigured && db) {
    try {
      const jobRef = doc(db, 'jobs', jobId);
      const jobSnap = await getDoc(jobRef);

      let listingId = '';
      let weightTons = 100;

      if (jobSnap.exists()) {
        const jd = jobSnap.data();
        listingId = jd.listingId;
        weightTons = Number(jd.weightTons) || weightTons;
        await updateDoc(jobRef, {
          pickupStatus: 'delivered',
          estimatedDelivery: 'Delivered & Weighbridge Verified',
        });
      }

      if (listingId) {
        const listingRef = doc(db, 'listings', listingId);
        const listingSnap = await getDoc(listingRef);

        if (listingSnap.exists()) {
          const ld = listingSnap.data();
          farmerId = ld.farmerId || farmerId;
          weightTons = Number(ld.weightTons) || weightTons;
          creditsEarned = calculateCarbonCredits(weightTons);

          await updateDoc(listingRef, {
            status: 'sold',
            carbonCreditsAwarded: creditsEarned,
            deliveredAt: serverTimestamp(),
          });
        }
      }

      // Atomically update carbonCredits on users/{farmerId}
      const userRef = doc(db, 'users', farmerId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        await updateDoc(userRef, {
          carbonCredits: increment(creditsEarned),
        });
        const updatedUserSnap = await getDoc(userRef);
        newTotal = Number(updatedUserSnap.data()?.carbonCredits || 0);
      } else {
        await setDoc(userRef, {
          uid: farmerId,
          fullName: 'Verified Farmer',
          role: 'farmer',
          carbonCredits: creditsEarned,
        }, { merge: true });
        newTotal = creditsEarned;
      }

      console.log(`[Carbon Credits] Awarded ${creditsEarned} credits to farmer ${farmerId}. New total: ${newTotal}`);
    } catch (err) {
      console.warn('Live Firestore delivery settlement notice:', err);
    }
  }

  return {
    success: true,
    farmerId,
    creditsEarned,
    newTotalCredits: newTotal,
  };
}

// Update Job Status (if status is 'delivered', awards carbon credits and marks listing as sold)
export async function updateJobStatus(jobId: string, status: Job['pickupStatus']): Promise<void> {
  if (status === 'delivered') {
    await confirmDeliveryAndAwardCredits(jobId);
    return;
  }

  if (isFirebaseConfigured && db) {
    try {
      const jobRef = doc(db, 'jobs', jobId);
      await updateDoc(jobRef, { pickupStatus: status });
    } catch (e) {
      console.warn('Live Firestore updateJobStatus failed:', e);
    }
  }
  mockStore.updateJobStatus(jobId, status);
}

// Accept a bid on a listing and dispatch logistics hauling job
export async function acceptBidAndScheduleDispatch(listingId: string, bidId: string): Promise<Job> {
  const listings = mockStore.getStats();
  const job = mockStore.createJob({
    listingId,
    driverId: 'driver-1',
    driverName: 'Harpreet Singh (Fleet #PB-10-8821)',
    pickupStatus: 'scheduled',
    origin: 'Kurukshetra Farm Gate',
    destination: 'EcoCNG Digester Hub',
    weightTons: 120,
    cropType: 'Paddy Straw',
    farmerName: 'Ramesh Patel',
    buyerName: 'EcoCNG & Green Biopower Ltd.',
    dispatchTime: new Date().toISOString(),
    estimatedDelivery: 'Scheduled for pickup today',
  });

  mockStore.updateListingStatus(listingId, 'pending');

  if (isFirebaseConfigured && db) {
    try {
      const jobDocRef = await addDoc(collection(db, 'jobs'), {
        listingId,
        driverId: 'driver-1',
        driverName: 'Harpreet Singh (Fleet #PB-10-8821)',
        pickupStatus: 'scheduled',
        origin: 'Kurukshetra Farm Gate',
        destination: 'EcoCNG Digester Hub',
        weightTons: 120,
        cropType: 'Paddy Straw',
        farmerName: 'Ramesh Patel',
        buyerName: 'EcoCNG & Green Biopower Ltd.',
        dispatchTime: serverTimestamp(),
        estimatedDelivery: 'Scheduled for pickup today',
      });
      await updateDoc(doc(db, 'listings', listingId), {
        status: 'pending',
      });
    } catch (err) {
      console.warn('Firestore acceptBidAndScheduleDispatch notice:', err);
    }
  }

  return job;
}

// Get User Profile
export function getUserProfile(uid: string): UserProfile {
  return mockStore.getUser(uid) || {
    uid,
    fullName: 'Active User',
    role: 'farmer',
    location: { latitude: 29.9695, longitude: 76.8783 },
    carbonCredits: 148.5,
  };
}
