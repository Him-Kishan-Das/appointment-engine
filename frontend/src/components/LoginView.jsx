import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  Mail, 
  ArrowRight, 
  Building2, 
  Eye, 
  EyeOff, 
  Loader2
} from 'lucide-react';

export default function LoginView({ 
  onLogin, 
  loading, 
  error, 
  defaultEmail = 'sarah.connor@apexhealth.com',
  onNavigateToPublicBooking = () => {} 
}) {
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState('Password123!');
  const [showPassword, setShowPassword] = useState(false);
  const [tenantSlug, setTenantSlug] = useState('apex-health');
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({ email, password, tenantSlug });
  };

  const handleQuickFill = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('Password123!');
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-slate-900 text-slate-100 antialiased">
      
      {/* Left Column: SaaS Platform Presentation */}
      <div className="relative flex-1 hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950/80 border-r border-slate-800/80 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        
        {/* Brand Header */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold tracking-wide uppercase mb-6">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            Multi-Tenant Appointment Engine
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">Appointment Engine</h1>
              <p className="text-xs text-slate-400">Enterprise Scheduling Platform</p>
            </div>
          </div>
        </div>

        {/* Feature showcase */}
        <div className="relative z-10 max-w-lg my-auto space-y-6">
          <div className="space-y-3">
            <h2 className="text-3xl font-extrabold tracking-tight text-white leading-tight">
              High-precision scheduling for healthcare, consulting, and host teams.
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Complete multi-tenant isolation, real-time weekly interval partitioning, buffer-time enforcement, and zero-conflict booking engine.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold mb-1">
                <Clock className="w-4 h-4" />
                Dynamic Slot Slicing
              </div>
              <p className="text-xs text-slate-400">Configurable 15m to 60m slots with automated buffer intervals.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold mb-1">
                <ShieldCheck className="w-4 h-4" />
                Tenant Scoped Data
              </div>
              <p className="text-xs text-slate-400">Isolated database schemas per tenant with sub-slug routing.</p>
            </div>
          </div>

          {/* Test Credentials Reference Card */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-2.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Test Accounts (Password: Password123!)
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div 
                onClick={() => handleQuickFill('sarah.connor@apexhealth.com')}
                className="p-2 rounded-lg bg-slate-800/70 border border-slate-700/80 cursor-pointer hover:border-blue-500/50 transition-colors"
                title="Click to fill Host email"
              >
                <div className="font-bold text-blue-400 text-[10px] uppercase">Host</div>
                <div className="font-semibold text-white truncate text-[11px]">Dr. Sarah Connor</div>
                <div className="text-[10px] text-slate-400 truncate">sarah.connor@...</div>
              </div>

              <div 
                onClick={() => handleQuickFill('staff@apexhealth.com')}
                className="p-2 rounded-lg bg-slate-800/70 border border-slate-700/80 cursor-pointer hover:border-emerald-500/50 transition-colors"
                title="Click to fill Staff email"
              >
                <div className="font-bold text-emerald-400 text-[10px] uppercase">Staff</div>
                <div className="font-semibold text-white truncate text-[11px]">Jessica Alba</div>
                <div className="text-[10px] text-slate-400 truncate">staff@apexhealth...</div>
              </div>

              <div 
                onClick={() => handleQuickFill('michael.vance@gmail.com')}
                className="p-2 rounded-lg bg-slate-800/70 border border-slate-700/80 cursor-pointer hover:border-indigo-500/50 transition-colors"
                title="Click to fill Client email"
              >
                <div className="font-bold text-indigo-400 text-[10px] uppercase">Client</div>
                <div className="font-semibold text-white truncate text-[11px]">Michael Vance</div>
                <div className="text-[10px] text-slate-400 truncate">michael.vance@...</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-500 border-t border-slate-800/80 pt-6">
          <span>Engine v2.4 • Active Tenant: apex-health</span>
          <span className="flex items-center gap-1.5 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> End-to-end encrypted
          </span>
        </div>
      </div>

      {/* Right Column: Standard Clean Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 lg:p-16 bg-slate-950">
        <div className="w-full max-w-md space-y-6">
          
          {/* Mobile branding */}
          <div className="lg:hidden flex items-center gap-2.5 mb-2">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Appointment Engine</h2>
              <p className="text-xs text-slate-400">Portal Authentication</p>
            </div>
          </div>

          {/* Tenant Indicator Badge */}
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-200">Apex Health & Wellness</div>
                <div className="text-[11px] text-slate-400">Tenant slug: <span className="font-mono text-blue-400 font-medium">apex-health</span></div>
              </div>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-600/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full">
              PRO
            </span>
          </div>

          {/* Form Header */}
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight text-white">Sign in to your account</h2>
            <p className="text-xs text-slate-400">Enter your credentials to access your dashboard.</p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
              <span className="w-2 h-2 rounded-full bg-red-400 mt-1 shrink-0" />
              <div className="flex-1">{error}</div>
            </div>
          )}

          {/* Clean Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@apexhealth.com"
                  required
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-900/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-slate-300">
                  Password
                </label>
                <span className="text-[11px] text-slate-400 font-mono">Password123!</span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-900/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-blue-500/40"
                />
                Remember this device
              </label>
              <span className="text-slate-500">Multi-Role Portal</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick link to public client booking */}
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={onNavigateToPublicBooking}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer underline transition-colors"
            >
              Looking to book an appointment as a patient? Visit Public Booking Page →
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
