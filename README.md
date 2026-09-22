# CropCronical - Agricultural Biomass Marketplace & Carbon Credit Platform

CropCronical is a full-stack B2B/B2C agricultural marketplace connecting farmers with industrial bio-plants (Bio-CNG, 2G bio-ethanol, briquetting, paper pulp, and packaging manufacturers). The platform eliminates stubble burning by monetizing crop residue (paddy straw, sugarcane bagasse, corn stover, wheat straw, etc.) through real-time competitive auctions in **Indian Rupees (₹)**, automated carbon credit minting, and smart escrow-backed hauling logistics.

---

## 🌟 Key Features

1. **Role-Based Authentication (Farmer & Buyer)**
   - Secure email and password sign-up and sign-in for both **Farmers** and **Industrial Buyers**.
   - Profile management with persistent sessions and a dedicated **Log Out** button in the navigation header.
   - Instant guest demo accounts for quick evaluation.

2. **Real-Time Industrial Bidding Engine**
   - Live stream of competitive bids powered by Firestore `onSnapshot` real-time listeners (with offline reactive fallback).
   - One-click competitor simulation button (`Simulate Bid`) to test live auction reactivity without page reloads.
   - Audio chime notifications when new outbids arrive.

3. **Complete Indian Rupee (INR ₹) Architecture**
   - All biomass listings, reserve pricing, competitive bids, and freight estimates are denominated in **Indian Rupees (₹)**.
   - Localized Indian numbering formatting (e.g., `₹2,500/Ton`, `₹1.80 Lakh`, `₹2.84 Cr`).
   - Stubble reserve bases and quick-bump chips tuned specifically for Indian agricultural trade (increments of +₹50, +₹100, +₹250/Ton).

4. **Automated Carbon Credit Ledger & Wallet**
   - Automated greenhouse gas calculation based on **UNFCCC CDM ACM0006** methodology for open-field burn avoidance.
   - Real-time carbon bonus estimates (MT CO2e diverted & tree planting equivalents).
   - Digital Carbon Wallet with instant cash-out simulation to bank accounts at benchmark rates (~₹1,550 / Verified Carbon Standard credit).

5. **Logistics Tracker & Smart Escrow**
   - End-to-end dispatch workflow: *Scheduled → In-Transit → Delivered & Verified*.
   - Weighbridge slip verification that triggers escrow fund release and carbon credit minting.

6. **Regional Biomass Density Heatmap**
   - Visual map showing crop residue supply hotspots across Punjab, Haryana, and Western Uttar Pradesh.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Motion, Lucide React
- **Backend:** Node.js, Express, `tsx`, `esbuild`
- **Database & Auth:** Firebase Firestore & Firebase Auth (with automatic reactive local fallback)
- **AI Integration:** Google Gemini API (`@google/genai`)
- **Build Tool:** Vite 8

---

## 🚀 How to Run in VS Code Terminal

Follow these steps to set up and run the project locally on your machine using Visual Studio Code.

### Step 1: Open the Project in VS Code
1. Launch **Visual Studio Code**.
2. Go to **File → Open Folder...** and select the `CropCronical` project directory.

### Step 2: Open the Integrated Terminal
Open the terminal in VS Code using any of these methods:
- Press ``Ctrl + ` `` (Windows/Linux) or ``Cmd + ` `` (macOS)
- Or click the top menu: **Terminal → New Terminal**

### Step 3: Verify Node.js Installation
Ensure you have Node.js (version 18 or higher) installed:
```bash
node -v
npm -v
```
*(If Node.js is not installed, download the LTS version from [nodejs.org](https://nodejs.org/).)*

### Step 4: Install Dependencies
In the VS Code terminal, run:
```bash
npm install
```
This installs all client, server, and dev dependencies specified in `package.json`.

### Step 5: (Optional) Configure Environment Variables
The application works out-of-the-box with built-in reactive storage. If you want to connect your own live Gemini AI or Firebase credentials:
1. Copy `.env.example` to a new `.env` file:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` in VS Code and fill in your keys:
   - `GEMINI_API_KEY`: Your Google AI Studio API key
   - `VITE_FIREBASE_*`: Your Firebase Web App credentials (if using custom Firebase)

### Step 6: Start the Development Server
Run the following command in your terminal:
```bash
npm run dev
```

### Step 7: Open the App in Your Browser
Once the server starts, you will see output similar to:
```
Server running on http://localhost:3000
```
- Open your browser and navigate to: **`http://localhost:3000`**
- You can also `Ctrl + Click` (or `Cmd + Click`) the URL directly in the VS Code terminal.

---

## 💻 Available Scripts

In the VS Code terminal, you can execute:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Express + Vite full-stack server on `http://localhost:3000` |
| `npm run lint` | Runs TypeScript compiler checks (`tsc --noEmit`) to verify types |
| `npm run build` | Builds the client app into `dist/` and bundles `server.ts` into `dist/server.cjs` |
| `npm start` | Runs the compiled production build from `dist/server.cjs` |
| `npm run clean` | Cleans build artifacts (`dist/` directory) |

---

## 🔑 Demo Accounts

You can test either role immediately without filling out forms, or use the **Create Account** / **Sign In** pages:

- **Farmer Role:**
  - Email: `kulkarnichaitanya25092005@gmail.com`
  - Name: `Gurpreet Singh (Karnal Farms)`
  - Capabilities: List crop stubble, monitor incoming bids, accept highest bids, cash out carbon credits.

- **Buyer Role:**
  - Email: `procurement@greengasindia.com`
  - Name: `Aarav Mehta (GreenGas Bio-Refinery)`
  - Capabilities: Browse lots, view heatmaps, place live bids in INR, view freight estimates.

---

## 📁 Project Structure

```
├── server.ts                  # Express backend entry point with Vite middleware & APIs
├── index.html                 # Main HTML entry point
├── package.json               # NPM packages & build scripts
├── metadata.json              # Applet metadata & permission declarations
├── src/
│   ├── main.tsx               # React application root
│   ├── App.tsx                # Primary routing and view container
│   ├── types.ts               # Shared TypeScript models (Listing, Bid, User, Logistics)
│   ├── firebase/
│   │   ├── config.ts          # Firebase SDK client initialization
│   │   ├── authContext.tsx    # User authentication provider & state management
│   │   ├── firestoreService.ts# Real-time Firestore hooks (onSnapshot listeners)
│   │   └── mockStore.ts       # Reactive local mock store with INR defaults & migration
│   └── components/
│       ├── Navbar.tsx         # Responsive header with profile menu & logout
│       ├── LandingPage.tsx    # Hero section, INR telemetry tickers, and pipeline
│       ├── auth/
│       │   └── AuthPage.tsx   # Email/password Login & Registration tabs for Farmer/Buyer
│       ├── farmer/
│       │   ├── FarmerDashboard.tsx  # Farmer lot management & bid acceptance
│       │   ├── NewListingModal.tsx  # Stubble batch creation with carbon bounty preview
│       │   └── CarbonWalletCard.tsx # Carbon credit balance & INR bank payout
│       ├── buyer/
│       │   ├── BuyerDashboard.tsx   # Industrial procurement grid & filters
│       │   ├── BidModal.tsx         # Competitive bidding modal with INR increments
│       │   ├── LiveBiddingFeed.tsx  # Real-time auction event stream
│       │   └── WasteHeatmap.tsx     # Supply geography heatmap
│       └── logistics/
│           └── LogisticsTracker.tsx # Truck hauling status & escrow release
```

---

## 🌿 Environmental Standard

Crop avoidance emissions and carbon credits are calculated aligned with:
- **UNFCCC ACM0006**: *Consolidated baseline methodology for electricity and heat generation from biomass residues*
- **Avoidance factor**: ~1.35 – 1.45 MT CO2e avoided per dry metric ton of crop residue diverted from burning.
