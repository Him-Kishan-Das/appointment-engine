import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  CalendarCheck, 
  LayoutDashboard, 
  ExternalLink, 
  Copy, 
  Check, 
  LogOut, 
  Building2, 
  Sparkles,
  ChevronDown
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, user, tenant, onLogout, bookingsCount = 0 }) {
  const [copied, setCopied] = useState(false);

  const bookingLink = `https://book.engine/${tenant?.slug || 'apex-health'}/${user?.name?.toLowerCase().replace(/\s+/g, '-') || 'sarah-connor'}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(bookingLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'appointments', label: 'Appointments', icon: CalendarCheck, badge: bookingsCount },
    { id: 'availability', label: 'Working Hours', icon: Clock },
    { id: 'client-view', label: 'Client Booking Page', icon: Sparkles, highlight: true },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Left: Brand & Tenant */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="hidden sm:block">
                <div className="font-bold text-slate-900 text-sm tracking-tight flex items-center gap-1.5">
                  Appointment Engine
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>{tenant?.name || 'Apex Health & Wellness'}</span>
                  <span className="text-slate-300">•</span>
                  <span className="font-mono text-slate-400">{tenant?.slug || 'apex-health'}</span>
                </div>
              </div>
            </div>

            {/* Nav Tabs */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? item.highlight 
                          ? 'bg-blue-600 text-white shadow-sm' 
                          : 'bg-slate-100 text-blue-600'
                        : item.highlight
                          ? 'text-blue-600 bg-blue-50/80 hover:bg-blue-100/80'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                        isActive ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right: Public Link, User & Logout */}
          <div className="flex items-center gap-3">
            
            {/* Copyable Share Link */}
            <div className="hidden lg:flex items-center gap-1.5 pl-3 pr-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs">
              <span className="text-slate-400 font-medium truncate max-w-[170px]">
                {bookingLink.replace('https://', '')}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                title="Copy public booking link"
                className="p-1 text-slate-500 hover:text-blue-600 rounded transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Host Profile Info */}
            <div className="flex items-center gap-2.5 pl-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 text-white font-semibold text-xs flex items-center justify-center shadow-sm">
                {user?.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'DR'}
              </div>
              <div className="hidden xl:block text-left">
                <div className="text-xs font-semibold text-slate-800 leading-tight">
                  {user?.name || 'Dr. Sarah Connor'}
                </div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">
                  {user?.role || 'Host'}
                </div>
              </div>
            </div>

            {/* Logout CTA */}
            <button
              onClick={onLogout}
              title="Sign Out"
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="md:hidden flex items-center justify-between border-t border-slate-100 py-2 overflow-x-auto gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}

