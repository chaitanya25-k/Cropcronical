import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import {
  Sprout,
  Tractor,
  Factory,
  Mail,
  Lock,
  User,
  Building,
  Phone,
  MapPin,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Leaf,
  ShieldCheck,
  Award,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';

interface AuthPageProps {
  initialMode?: 'login' | 'register';
  initialRole?: 'farmer' | 'buyer';
  onNavigate: (view: 'landing' | 'farmer' | 'buyer' | 'logistics') => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  initialMode = 'login',
  initialRole = 'farmer',
  onNavigate,
}) => {
  const { login, register, authLoading } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [selectedRole, setSelectedRole] = useState<'farmer' | 'buyer'>(initialRole);

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [organization, setOrganization] = useState('');
  const [phone, setPhone] = useState('');
  const [locationName, setLocationName] = useState('');

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Quick Demo fill buttons
  const fillDemoAccount = (role: 'farmer' | 'buyer') => {
    setSelectedRole(role);
    setErrorMessage(null);
    if (role === 'farmer') {
      setEmail('ramesh.farmer@cropcronical.org');
      setPassword('kisan123');
      setFullName('Ramesh Patel');
      setOrganization('Patel Bio-Organic Agro Farm');
      setPhone('+91 98765 43210');
      setLocationName('Kurukshetra, Haryana');
    } else {
      setEmail('procurement@ecocng-biopower.com');
      setPassword('biogas2026');
      setFullName('Dr. Anita Sharma');
      setOrganization('EcoCNG & Green Biopower Ltd.');
      setPhone('+91 98111 22334');
      setLocationName('Greater Noida Industrial Zone');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please provide both email and password.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        const user = await login(email.trim(), password);
        setSuccessMessage(`Welcome back, ${user.fullName}! Redirecting to your dashboard...`);
        setTimeout(() => {
          if (user.role === 'farmer') {
            onNavigate('farmer');
          } else {
            onNavigate('buyer');
          }
        }, 800);
      } else {
        if (!fullName.trim()) {
          setErrorMessage('Please enter your full name or farm contact.');
          setIsSubmitting(false);
          return;
        }

        const newUser = await register({
          email: email.trim(),
          password,
          role: selectedRole,
          fullName: fullName.trim(),
          organization: organization.trim() || (selectedRole === 'farmer' ? `${fullName}'s Agro Enterprise` : 'BioEnergy Refining Corp'),
          phone: phone.trim(),
          locationName: locationName.trim(),
        });

        setSuccessMessage(`Account created successfully for ${newUser.fullName}! Redirecting...`);
        setTimeout(() => {
          if (newUser.role === 'farmer') {
            onNavigate('farmer');
          } else {
            onNavigate('buyer');
          }
        }, 900);
      }
    } catch (err: any) {
      console.error('Authentication submission failed:', err);
      setErrorMessage(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-8 sm:py-12 bg-zinc-50 dark:bg-zinc-950 transition-colors">
      <div className="w-full max-w-xl">
        
        {/* Navigation Back */}
        <button
          onClick={() => onNavigate('landing')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace Overview</span>
        </button>

        {/* Auth Card Container */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
          
          {/* Subtle brand glow behind card */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header & Logo */}
          <div className="text-center space-y-2 mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-500/20 mb-2">
              <Sprout className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white font-['Space_Grotesk']">
              {mode === 'login' ? 'Sign In to CropCronical' : 'Create Marketplace Account'}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-sm mx-auto">
              {mode === 'login'
                ? 'Access your agricultural biomass auctions, carbon wallet, and hauling contracts.'
                : 'Join the premier B2B/B2C agricultural residue marketplace & carbon credit network.'}
            </p>
          </div>

          {/* Mode Switcher: Sign In vs Create Account */}
          <div className="flex p-1 bg-zinc-100 dark:bg-zinc-800/80 rounded-2xl border border-zinc-200 dark:border-zinc-700/60 mb-6">
            <button
              type="button"
              id="tab-sign-in"
              onClick={() => {
                setMode('login');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                mode === 'login'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              id="tab-create-account"
              onClick={() => {
                setMode('register');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                mode === 'register'
                  ? 'bg-emerald-600 text-white shadow-xs shadow-emerald-600/30'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Role Selector Card Deck */}
          <div className="space-y-2 mb-6">
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Account Type / Role
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Farmer Option */}
              <button
                type="button"
                id="role-select-farmer"
                onClick={() => setSelectedRole('farmer')}
                className={`p-4 rounded-2xl text-left border-2 transition-all flex flex-col justify-between ${
                  selectedRole === 'farmer'
                    ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-100 ring-2 ring-emerald-500/20'
                    : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center text-emerald-700 dark:text-emerald-300">
                    <Tractor className="w-4 h-4" />
                  </div>
                  {selectedRole === 'farmer' && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                      Selected
                    </span>
                  )}
                </div>
                <div>
                  <div className="font-bold text-sm font-['Space_Grotesk']">
                    Agricultural Farmer
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                    List parali/straw, avoid open burning, and receive carbon credits & escrow funds.
                  </p>
                </div>
              </button>

              {/* Industrial Buyer Option */}
              <button
                type="button"
                id="role-select-buyer"
                onClick={() => setSelectedRole('buyer')}
                className={`p-4 rounded-2xl text-left border-2 transition-all flex flex-col justify-between ${
                  selectedRole === 'buyer'
                    ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-100 ring-2 ring-emerald-500/20'
                    : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-900/60 flex items-center justify-center text-amber-700 dark:text-amber-300">
                    <Factory className="w-4 h-4" />
                  </div>
                  {selectedRole === 'buyer' && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                      Selected
                    </span>
                  )}
                </div>
                <div>
                  <div className="font-bold text-sm font-['Space_Grotesk']">
                    Industrial Upcycler
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                    Bio-gas plants, paper mills & pelletizers bidding on bulk agro-byproducts.
                  </p>
                </div>
              </button>

            </div>
          </div>

          {/* Quick Demo Pre-fill Bar */}
          <div className="mb-6 p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Quick Test Credential:</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fillDemoAccount('farmer')}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white dark:bg-zinc-700 hover:bg-emerald-50 dark:hover:bg-emerald-950 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-600 transition-colors"
              >
                Farmer Demo
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount('buyer')}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white dark:bg-zinc-700 hover:bg-amber-50 dark:hover:bg-amber-950 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-600 transition-colors"
              >
                Buyer Demo
              </button>
            </div>
          </div>

          {/* Error & Success Banners */}
          {errorMessage && (
            <div className="mb-6 p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/60 text-red-800 dark:text-red-300 text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-500" />
              <div className="flex-1 font-medium leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-500" />
              <div className="flex-1 font-medium">{successMessage}</div>
            </div>
          )}

          {/* Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* If Registering, ask for Full Name */}
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Full Name / Contact Person <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={selectedRole === 'farmer' ? 'e.g. Ramesh Patel' : 'e.g. Dr. Anita Sharma'}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            )}

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Password <span className="text-red-500">*</span>
                </label>
                {mode === 'login' && (
                  <span className="text-[11px] text-zinc-400">
                    Min. 6 characters
                  </span>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Additional Registration Fields */}
            {mode === 'register' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      {selectedRole === 'farmer' ? 'Farm / Estate Name' : 'Company / Mill Name'}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                        <Building className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                        placeholder={selectedRole === 'farmer' ? 'e.g. Kisan Bio Farm' : 'e.g. EcoCNG Biofuels'}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 00000"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Operating District / Location
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={locationName}
                      onChange={(e) => setLocationName(e.target.value)}
                      placeholder="e.g. Kurukshetra, Haryana"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              id="btn-auth-submit"
              disabled={isSubmitting || authLoading}
              className="w-full mt-2 py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-sm transition-all shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Processing Authenticated Request...</span>
                </>
              ) : mode === 'login' ? (
                <>
                  <span>Sign In as {selectedRole === 'farmer' ? 'Farmer' : 'Industrial Buyer'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>Register {selectedRole === 'farmer' ? 'Farmer' : 'Buyer'} Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

          {/* Trust Guarantees */}
          <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800/80 grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
            <div className="flex flex-col items-center gap-1 text-[11px] text-zinc-500 dark:text-zinc-400">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Firebase Auth & Firestore</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-[11px] text-zinc-500 dark:text-zinc-400">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Verified Carbon Micro-Credits</span>
            </div>
            <div className="col-span-2 sm:col-span-1 flex flex-col items-center gap-1 text-[11px] text-zinc-500 dark:text-zinc-400">
              <Leaf className="w-4 h-4 text-emerald-600" />
              <span>1.35 MT CO2e / Ton Rate</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
