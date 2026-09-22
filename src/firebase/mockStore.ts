import { Listing, Bid, Job, UserProfile, MarketplaceStats } from '../types';

export const INITIAL_USERS: Record<string, UserProfile> = {
  'farmer-1': {
    uid: 'farmer-1',
    fullName: 'Ramesh Patel',
    role: 'farmer',
    location: { latitude: 29.9695, longitude: 76.8783 }, // Kurukshetra / Punjab Agri belt
    carbonCredits: 148.5,
    email: 'ramesh.farmer@cropcronical.org',
    phone: '+91 98765 43210',
    organization: 'Patel Bio-Organic Agro Farm',
  },
  'buyer-1': {
    uid: 'buyer-1',
    fullName: 'Dr. Anita Sharma',
    role: 'buyer',
    location: { latitude: 28.5355, longitude: 77.3910 }, // Greater Noida / Bio-Gas Corridor
    carbonCredits: 920.0,
    email: 'procurement@ecocng-biopower.com',
    phone: '+91 98111 22334',
    organization: 'EcoCNG & Green Biopower Ltd.',
  },
  'driver-1': {
    uid: 'driver-1',
    fullName: 'Harpreet Singh',
    role: 'driver',
    location: { latitude: 29.1492, longitude: 75.7217 },
    carbonCredits: 15.0,
    email: 'harpreet.logistics@agrotransport.in',
    phone: '+91 98450 11223',
    organization: 'Kisan Cargo Green Haulers',
  },
};

export const INITIAL_LISTINGS: Listing[] = [
  {
    id: 'lst-101',
    farmerId: 'farmer-1',
    farmerName: 'Ramesh Patel',
    cropType: 'Paddy Straw (Parali)',
    weightTons: 120,
    acreage: 45,
    moisturePercentage: 11.5,
    status: 'open',
    askingPricePerTon: 2400,
    locationName: 'Kurukshetra, Haryana',
    coordinates: { latitude: 29.9695, longitude: 76.8783 },
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    currentHighestBid: 348000,
    bidCount: 4,
    description: 'Freshly baled high-density rectangular paddy straw, stored in covered dry shed. Zero soil contamination. Ideal for 2G Bio-Ethanol and Compressed Biogas (CBG).',
    baleType: 'square_bales',
  },
  {
    id: 'lst-102',
    farmerId: 'farmer-1',
    farmerName: 'Ramesh Patel',
    cropType: 'Sugarcane Bagasse',
    weightTons: 280,
    acreage: 90,
    moisturePercentage: 17.0,
    status: 'open',
    askingPricePerTon: 3200,
    locationName: 'Muzaffarnagar, UP',
    coordinates: { latitude: 29.4727, longitude: 77.7085 },
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    currentHighestBid: 980000,
    bidCount: 6,
    description: 'Post-milling unburnt sugarcane residue. High calorific value (approx 3200 kcal/kg). Excellent for boiler fuel or molded eco-crockery manufacturing.',
    baleType: 'loose_bulk',
  },
  {
    id: 'lst-103',
    farmerId: 'farmer-2',
    farmerName: 'Gurpreet Singh Mann',
    cropType: 'Corn Stover (Maize)',
    weightTons: 85,
    acreage: 32,
    moisturePercentage: 13.2,
    status: 'open',
    askingPricePerTon: 2100,
    locationName: 'Ludhiana, Punjab',
    coordinates: { latitude: 30.9010, longitude: 75.8573 },
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    currentHighestBid: 204000,
    bidCount: 3,
    description: 'Chopped stalks and husks, mechanically collected after grain harvest. Low ash content, perfect for cattle feed enrichment and pelletization.',
    baleType: 'round_bales',
  },
  {
    id: 'lst-104',
    farmerId: 'farmer-3',
    farmerName: 'Balwinder Kaur',
    cropType: 'Wheat Straw (Turi)',
    weightTons: 160,
    acreage: 60,
    moisturePercentage: 9.8,
    status: 'pending',
    askingPricePerTon: 3400,
    locationName: 'Karnal, Haryana',
    coordinates: { latitude: 29.6857, longitude: 76.9905 },
    createdAt: new Date(Date.now() - 3600000 * 28).toISOString(),
    currentHighestBid: 576000,
    bidCount: 5,
    description: 'Premium golden fine-chopped straw. Highest dry matter ratio (90.2%). Suitable for virgin paper mills and fungal substrate cultivation.',
    baleType: 'square_bales',
  },
  {
    id: 'lst-105',
    farmerId: 'farmer-4',
    farmerName: 'Sanjay Deshmukh',
    cropType: 'Cotton Stalks',
    weightTons: 95,
    acreage: 40,
    moisturePercentage: 14.5,
    status: 'open',
    askingPricePerTon: 2200,
    locationName: 'Nagpur, Maharashtra',
    coordinates: { latitude: 21.1458, longitude: 79.0882 },
    createdAt: new Date(Date.now() - 3600000 * 42).toISOString(),
    currentHighestBid: 228000,
    bidCount: 2,
    description: 'Hard woody biomass shredded to 50mm chips. High density briquette grade, clean burning alternative to fossil coal in industrial boilers.',
    baleType: 'loose_bulk',
  },
  {
    id: 'lst-106',
    farmerId: 'farmer-5',
    farmerName: 'M. Selvaraj',
    cropType: 'Coconut Coir Pith',
    weightTons: 60,
    acreage: 25,
    moisturePercentage: 18.0,
    status: 'open',
    askingPricePerTon: 3800,
    locationName: 'Pollachi, Tamil Nadu',
    coordinates: { latitude: 10.6609, longitude: 77.0048 },
    createdAt: new Date(Date.now() - 3600000 * 50).toISOString(),
    currentHighestBid: 252000,
    bidCount: 4,
    description: 'Washed low-EC coir peat blocks. Ideal moisture retention for organic nursery substrates and mycelium packaging composite boards.',
    baleType: 'square_bales',
  },
];

export const INITIAL_BIDS: Record<string, Bid[]> = {
  'lst-101': [
    {
      id: 'bid-101-1',
      listingId: 'lst-101',
      buyerId: 'buyer-2',
      buyerName: 'Verdant Biofuels Corp',
      buyerIndustry: '2G Bio-Ethanol Refinery',
      bidAmount: 300000,
      pricePerTon: 2500,
      timestamp: new Date(Date.now() - 3600000 * 2.5).toISOString(),
      status: 'outbid',
      cropType: 'Paddy Straw (Parali)',
      weightTons: 120,
    },
    {
      id: 'bid-101-2',
      listingId: 'lst-101',
      buyerId: 'buyer-3',
      buyerName: 'NorthKraft Specialty Paper',
      buyerIndustry: 'Corrugated Board & Pulp Mill',
      bidAmount: 312000,
      pricePerTon: 2600,
      timestamp: new Date(Date.now() - 3600000 * 1.5).toISOString(),
      status: 'outbid',
      cropType: 'Paddy Straw (Parali)',
      weightTons: 120,
    },
    {
      id: 'bid-101-3',
      listingId: 'lst-101',
      buyerId: 'buyer-1',
      buyerName: 'EcoCNG & Green Biopower Ltd.',
      buyerIndustry: 'Compressed Bio-Gas (CBG)',
      bidAmount: 330000,
      pricePerTon: 2750,
      timestamp: new Date(Date.now() - 3600000 * 0.8).toISOString(),
      status: 'outbid',
      cropType: 'Paddy Straw (Parali)',
      weightTons: 120,
    },
    {
      id: 'bid-101-4',
      listingId: 'lst-101',
      buyerId: 'buyer-4',
      buyerName: 'TerraPower Biomass Consortium',
      buyerIndustry: 'Clean Energy Grid',
      bidAmount: 348000,
      pricePerTon: 2900,
      timestamp: new Date(Date.now() - 60000 * 12).toISOString(),
      status: 'pending',
      cropType: 'Paddy Straw (Parali)',
      weightTons: 120,
    },
  ],
  'lst-102': [
    {
      id: 'bid-102-1',
      listingId: 'lst-102',
      buyerId: 'buyer-1',
      buyerName: 'EcoCNG & Green Biopower Ltd.',
      buyerIndustry: 'Compressed Bio-Gas (CBG)',
      bidAmount: 924000,
      pricePerTon: 3300,
      timestamp: new Date(Date.now() - 3600000 * 6).toISOString(),
      status: 'outbid',
      cropType: 'Sugarcane Bagasse',
      weightTons: 280,
    },
    {
      id: 'bid-102-2',
      listingId: 'lst-102',
      buyerId: 'buyer-5',
      buyerName: 'BioCrockery Tableware Inc.',
      buyerIndustry: 'Molded Fiber Packaging',
      bidAmount: 980000,
      pricePerTon: 3500,
      timestamp: new Date(Date.now() - 60000 * 45).toISOString(),
      status: 'pending',
      cropType: 'Sugarcane Bagasse',
      weightTons: 280,
    },
  ],
  'lst-103': [
    {
      id: 'bid-103-1',
      listingId: 'lst-103',
      buyerId: 'buyer-1',
      buyerName: 'EcoCNG & Green Biopower Ltd.',
      buyerIndustry: 'Compressed Bio-Gas (CBG)',
      bidAmount: 187000,
      pricePerTon: 2200,
      timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
      status: 'outbid',
      cropType: 'Corn Stover (Maize)',
      weightTons: 85,
    },
    {
      id: 'bid-103-2',
      listingId: 'lst-103',
      buyerId: 'buyer-6',
      buyerName: 'AgriPellets Industrial Fuel',
      buyerIndustry: 'Biomass Briquettes',
      bidAmount: 204000,
      pricePerTon: 2400,
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      status: 'pending',
      cropType: 'Corn Stover (Maize)',
      weightTons: 85,
    },
  ],
};

export const INITIAL_JOBS: Job[] = [
  {
    id: 'job-501',
    listingId: 'lst-104',
    driverId: 'driver-1',
    driverName: 'Harpreet Singh (Fleet #PB-10-8821)',
    pickupStatus: 'in-transit',
    origin: 'Karnal Farm #4, Haryana',
    destination: 'GreenKraft Paper Mill, Sonipat',
    originCoords: { latitude: 29.6857, longitude: 76.9905 },
    destCoords: { latitude: 28.9931, longitude: 77.0151 },
    weightTons: 160,
    cropType: 'Wheat Straw (Turi)',
    farmerName: 'Balwinder Kaur',
    buyerName: 'NorthKraft Specialty Paper',
    dispatchTime: new Date(Date.now() - 3600000 * 2).toISOString(),
    estimatedDelivery: 'Today, 4:30 PM',
  },
  {
    id: 'job-502',
    listingId: 'lst-100',
    driverId: 'driver-1',
    driverName: 'Harpreet Singh (Fleet #PB-10-8821)',
    pickupStatus: 'delivered',
    origin: 'Ambala Rice Cluster, Punjab',
    destination: 'EcoCNG Digester Complex, Panipat',
    originCoords: { latitude: 30.3782, longitude: 76.7767 },
    destCoords: { latitude: 29.3909, longitude: 76.9635 },
    weightTons: 95,
    cropType: 'Paddy Straw',
    farmerName: 'Sohan Lal',
    buyerName: 'EcoCNG & Green Biopower Ltd.',
    dispatchTime: new Date(Date.now() - 86400000).toISOString(),
    estimatedDelivery: 'Delivered Yesterday',
  },
];

type Listener<T> = (data: T) => void;

class MockFirestoreStore {
  private listings: Listing[] = [];
  private bids: Record<string, Bid[]> = {};
  private jobs: Job[] = [];
  private users: Record<string, UserProfile> = {};

  private listingListeners: Set<Listener<Listing[]>> = new Set();
  private allBidListeners: Set<Listener<Bid[]>> = new Set();
  private listingBidListeners: Map<string, Set<Listener<Bid[]>>> = new Map();
  private jobListeners: Set<Listener<Job[]>> = new Set();
  private userListeners: Map<string, Set<Listener<UserProfile>>> = new Map();
  private statsListeners: Set<Listener<MarketplaceStats>> = new Set();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const savedListings = localStorage.getItem('cropcronical_listings');
      const savedBids = localStorage.getItem('cropcronical_bids');
      const savedJobs = localStorage.getItem('cropcronical_jobs');
      const savedUsers = localStorage.getItem('cropcronical_users');

      let listings: Listing[] = savedListings ? JSON.parse(savedListings) : [...INITIAL_LISTINGS];
      let bids: Record<string, Bid[]> = savedBids ? JSON.parse(savedBids) : { ...INITIAL_BIDS };

      // Migration: If existing storage contains old USD scale pricing (< 200/ton), migrate to INR
      if (listings.length > 0 && (listings[0].askingPricePerTon || 0) < 500) {
        localStorage.removeItem('cropcronical_listings');
        localStorage.removeItem('cropcronical_bids');
        listings = [...INITIAL_LISTINGS];
        bids = { ...INITIAL_BIDS };
      }

      this.listings = listings;
      this.bids = bids;
      this.jobs = savedJobs ? JSON.parse(savedJobs) : [...INITIAL_JOBS];
      this.users = savedUsers ? JSON.parse(savedUsers) : { ...INITIAL_USERS };
    } catch {
      this.listings = [...INITIAL_LISTINGS];
      this.bids = { ...INITIAL_BIDS };
      this.jobs = [...INITIAL_JOBS];
      this.users = { ...INITIAL_USERS };
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem('cropcronical_listings', JSON.stringify(this.listings));
      localStorage.setItem('cropcronical_bids', JSON.stringify(this.bids));
      localStorage.setItem('cropcronical_jobs', JSON.stringify(this.jobs));
      localStorage.setItem('cropcronical_users', JSON.stringify(this.users));
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
  }

  // --- Real-time onSnapshot style subscriptions ---

  subscribeToListings(callback: Listener<Listing[]>): () => void {
    this.listingListeners.add(callback);
    callback([...this.listings]);
    return () => {
      this.listingListeners.delete(callback);
    };
  }

  subscribeToLiveBids(callback: Listener<Bid[]>): () => void {
    this.allBidListeners.add(callback);
    callback(this.getAllBidsSorted());
    return () => {
      this.allBidListeners.delete(callback);
    };
  }

  subscribeToBidsForListing(listingId: string, callback: Listener<Bid[]>): () => void {
    if (!this.listingBidListeners.has(listingId)) {
      this.listingBidListeners.set(listingId, new Set());
    }
    const set = this.listingBidListeners.get(listingId)!;
    set.add(callback);
    callback([...(this.bids[listingId] || [])]);
    return () => {
      set.delete(callback);
    };
  }

  subscribeToJobs(callback: Listener<Job[]>): () => void {
    this.jobListeners.add(callback);
    callback([...this.jobs]);
    return () => {
      this.jobListeners.delete(callback);
    };
  }

  subscribeToUser(uid: string, callback: Listener<UserProfile>): () => void {
    if (!this.userListeners.has(uid)) {
      this.userListeners.set(uid, new Set());
    }
    this.userListeners.get(uid)!.add(callback);
    const u = this.getUser(uid);
    if (u) callback({ ...u });
    return () => {
      this.userListeners.get(uid)?.delete(callback);
    };
  }

  subscribeToStats(callback: Listener<MarketplaceStats>): () => void {
    this.statsListeners.add(callback);
    callback(this.getStats());
    return () => {
      this.statsListeners.delete(callback);
    };
  }

  private notifyListings() {
    const data = [...this.listings];
    this.listingListeners.forEach((fn) => fn(data));
    this.saveToStorage();
    this.notifyStats();
  }

  private notifyBids(listingId?: string) {
    const allBids = this.getAllBidsSorted();
    this.allBidListeners.forEach((fn) => fn(allBids));

    if (listingId && this.listingBidListeners.has(listingId)) {
      const specific = [...(this.bids[listingId] || [])];
      this.listingBidListeners.get(listingId)!.forEach((fn) => fn(specific));
    }
    this.saveToStorage();
    this.notifyStats();
  }

  private notifyJobs() {
    const data = [...this.jobs];
    this.jobListeners.forEach((fn) => fn(data));
    this.saveToStorage();
    this.notifyStats();
  }

  private notifyUser(uid: string) {
    const u = this.users[uid];
    if (u && this.userListeners.has(uid)) {
      const copy = { ...u };
      this.userListeners.get(uid)!.forEach((fn) => fn(copy));
    }
    this.saveToStorage();
    this.notifyStats();
  }

  private notifyStats() {
    const stats = this.getStats();
    this.statsListeners.forEach((fn) => fn(stats));
  }

  getAllBidsSorted(): Bid[] {
    const list: Bid[] = [];
    Object.values(this.bids).forEach((arr) => {
      list.push(...arr);
    });
    return list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  // --- Mutations ---

  addListing(newListing: Omit<Listing, 'id' | 'createdAt' | 'bidCount' | 'currentHighestBid'>): Listing {
    const id = `lst-${Date.now().toString().slice(-4)}`;
    const created: Listing = {
      ...newListing,
      id,
      createdAt: new Date().toISOString(),
      bidCount: 0,
      currentHighestBid: (newListing.askingPricePerTon || 30) * newListing.weightTons,
    };
    this.listings.unshift(created);
    this.notifyListings();
    return created;
  }

  addBid(listingId: string, bidData: { buyerId: string; buyerName: string; buyerIndustry: string; bidAmount: number; pricePerTon: number }): Bid {
    const listing = this.listings.find((l) => l.id === listingId);
    const bidId = `bid-${Date.now().toString().slice(-4)}`;

    const newBid: Bid = {
      id: bidId,
      listingId,
      buyerId: bidData.buyerId,
      buyerName: bidData.buyerName,
      buyerIndustry: bidData.buyerIndustry,
      bidAmount: bidData.bidAmount,
      pricePerTon: bidData.pricePerTon,
      timestamp: new Date().toISOString(),
      status: 'pending',
      cropType: listing?.cropType || 'Agricultural Biomass',
      weightTons: listing?.weightTons || 50,
    };

    if (!this.bids[listingId]) {
      this.bids[listingId] = [];
    }

    // Mark previous bids on this listing as outbid if this is higher
    this.bids[listingId] = this.bids[listingId].map((b) => ({
      ...b,
      status: b.bidAmount < newBid.bidAmount ? 'outbid' : b.status,
    }));

    this.bids[listingId].unshift(newBid);

    // Update listing high bid and count
    if (listing) {
      listing.bidCount = (listing.bidCount || 0) + 1;
      if (!listing.currentHighestBid || newBid.bidAmount > listing.currentHighestBid) {
        listing.currentHighestBid = newBid.bidAmount;
      }
      this.notifyListings();
    }

    this.notifyBids(listingId);
    return newBid;
  }

  updateListingStatus(listingId: string, status: Listing['status']) {
    const l = this.listings.find((item) => item.id === listingId);
    if (l) {
      l.status = status;
      this.notifyListings();
    }
  }

  updateJobStatus(jobId: string, status: Job['pickupStatus']) {
    if (status === 'delivered') {
      return this.confirmDeliveryAndAwardCredits(jobId);
    }
    const j = this.jobs.find((item) => item.id === jobId);
    if (j) {
      j.pickupStatus = status;
      this.notifyJobs();
    }
  }

  confirmDeliveryAndAwardCredits(jobId: string): { success: boolean; farmerId: string; creditsEarned: number; newTotalCredits: number } | null {
    const job = this.jobs.find((j) => j.id === jobId);
    if (!job) return null;

    job.pickupStatus = 'delivered';
    job.estimatedDelivery = 'Delivered & Weighbridge Verified';

    const listing = this.listings.find((l) => l.id === job.listingId);
    let farmerId = 'farmer-1';
    let weightTons = job.weightTons || 100;

    if (listing) {
      listing.status = 'sold';
      listing.deliveredAt = new Date().toISOString();
      farmerId = listing.farmerId;
      weightTons = listing.weightTons;
    }

    // Predefined conversion rate: 1.35 MT CO2e avoided burning per ton of biomass
    const CONVERSION_RATE = 1.35;
    const creditsEarned = Math.round(weightTons * CONVERSION_RATE * 10) / 10;

    if (listing) {
      listing.carbonCreditsAwarded = creditsEarned;
    }

    this.updateCarbonCredits(farmerId, creditsEarned);
    this.notifyJobs();
    this.notifyListings();

    const user = this.getUser(farmerId);
    return {
      success: true,
      farmerId,
      creditsEarned,
      newTotalCredits: user?.carbonCredits || creditsEarned,
    };
  }

  createJob(jobData: Omit<Job, 'id'>): Job {
    const id = `job-${Date.now().toString().slice(-4)}`;
    const created: Job = { ...jobData, id };
    this.jobs.unshift(created);
    this.notifyJobs();
    return created;
  }

  getUser(uid: string): UserProfile | undefined {
    return this.users[uid];
  }

  setUser(user: UserProfile) {
    this.users[user.uid] = { ...user };
    this.saveToStorage();
    this.notifyUser(user.uid);
    this.notifyStats();
  }

  updateCarbonCredits(uid: string, delta: number) {
    if (this.users[uid]) {
      this.users[uid].carbonCredits = Math.round((this.users[uid].carbonCredits + delta) * 10) / 10;
      this.notifyUser(uid);
    }
  }

  getStats(): MarketplaceStats {
    const baseTons = 3820;
    const totalTons = this.listings.reduce((sum, l) => sum + (l.weightTons || 0), baseTons);
    // Calculate total carbon credits including all verified user credits
    const totalUserCredits = Object.values(this.users).reduce((sum, u) => sum + (u.carbonCredits || 0), 0);
    const carbonCredits = Math.round(totalUserCredits + (totalTons - baseTons) * 1.35);
    const totalBids = Object.values(this.bids).reduce((acc, curr) => acc + curr.length, 48);
    const volume = Object.values(this.bids)
      .flat()
      .reduce((sum, b) => sum + (b.bidAmount || 0), 14250000);

    return {
      tonsUpcycled: totalTons,
      carbonCreditsGenerated: Math.max(5157, carbonCredits),
      activeListingsCount: this.listings.filter((l) => l.status === 'open').length,
      activeBidsCount: totalBids,
      totalTradingVolumeUsd: volume,
      participatingFarmersCount: 1240,
      partnerPlantsCount: 88,
    };
  }

  // Trigger a simulated incoming competitor bid to test live bidding in demo mode!
  simulateIncomingBid(): Bid | null {
    const openListings = this.listings.filter((l) => l.status === 'open');
    if (openListings.length === 0) return null;
    const target = openListings[Math.floor(Math.random() * openListings.length)];
    const currentHigh = target.currentHighestBid || target.weightTons * (target.askingPricePerTon || 2400);
    const bumpPerTon = 50 + Math.floor(Math.random() * 4) * 50; // bump by ₹50, ₹100, ₹150, or ₹200 / Ton
    const bump = Math.round(target.weightTons * bumpPerTon);
    const newTotal = currentHigh + bump;
    const pricePerTon = Math.round(newTotal / target.weightTons);

    const competitorIndustries = [
      { name: 'Kansal Paper Mills Ltd.', type: 'Recycled Kraft Paper' },
      { name: 'BioUrja Bio-Gas Infrastructure', type: 'Compressed Bio-Gas (CBG)' },
      { name: 'Punjab Biomass Power Generating Co.', type: 'Co-generation Energy' },
      { name: 'EcoPulp Biodegradable Moulds', type: 'Eco Packaging' },
      { name: 'Himalayan Organic Bio-Char', type: 'Pyrolysis & Biochar' },
    ];

    const pick = competitorIndustries[Math.floor(Math.random() * competitorIndustries.length)];

    return this.addBid(target.id, {
      buyerId: `buyer-comp-${Date.now().toString().slice(-3)}`,
      buyerName: pick.name,
      buyerIndustry: pick.type,
      bidAmount: newTotal,
      pricePerTon,
    });
  }
}

export const mockStore = new MockFirestoreStore();
