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
  X,
  ChevronRight,
  ShieldCheck,
  User,
  Share2,
  Users
} from 'lucide-react';

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  user, 
  tenant, 
  onLogout, 
  bookingsCount = 0,
  isOpen = false,
  onClose = () => {},
  onOpenPublicBooking = () => {}
}) {
  const [copied, setCopied] = useState(false);
  const isStaff = user?.role === 'staff';

  const bookingLink = `https://book.engine/${tenant?.slug || 'apex-health'}/sarah-connor`;

  const handleCopy = () => {
    navigator.clipboard.writeText(bookingLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const navGroups = [
    {
      group: isStaff ? 'CLINIC OPERATIONS & FRONT DESK' : 'HOST PRACTICE MANAGEMENT',
      items: isStaff
        ? [
            { id: 'overview', label: 'Front Desk Overview', icon: Building2 },
            { id: 'appointments', label: 'All Patient Bookings', icon: CalendarCheck, badge: bookingsCount },
          ]
        : [
            { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
            { id: 'appointments', label: 'Appointments Manager', icon: CalendarCheck, badge: bookingsCount },
            { id: 'availability', label: 'Working Hours & Slots', icon: Clock },
          ],
    },
  ];

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    onClose();
  };

  const userInitials = user?.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2) : (isStaff ? 'JA' : 'SC');

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs md:hidden animate-in fade-in duration-200"
        />
      )}

      {/* Main Sidebar Container */}
      <aside className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-300 ease-in-out md:translate-x-0 md:static ${
        isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
      }`}>
        
        {/* Top Header: Brand & Tenant Card */}
        <div className="p-5 border-b border-slate-100 space-y-4">
          
          {/* Logo with Close button on Mobile */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-sm text-slate-900 tracking-tight block">
                  Appointment Engine
                </span>
                <span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase block">
                  {isStaff ? 'Staff Reception Workspace' : 'Host Practice Workspace'}
                </span>
              </div>
            </div>

            {/* Mobile close toggle */}
            <button
              onClick={onClose}
              className="md:hidden p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Active Tenant Box */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Building2 className="w-3 h-3 text-blue-500" />
                Active Organization
              </span>
              <span className="text-[9px] font-extrabold uppercase bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-md">
                Pro
              </span>
            </div>
            <div className="font-bold text-xs text-slate-900 truncate">
              {tenant?.name || 'Apex Health & Wellness'}
            </div>
            <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>{tenant?.slug || 'apex-health'}</span>
            </div>
          </div>
        </div>

        {/* Center: Dynamic Role Navigation Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-none">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                {group.group}
              </div>

              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer group ${
                      isActive
                        ? isStaff 
                          ? 'bg-emerald-50 text-emerald-800 font-bold border-l-4 border-emerald-600 rounded-l-none'
                          : 'bg-blue-50 text-blue-700 font-bold border-l-4 border-blue-600 rounded-l-none'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 transition-colors ${
                        isActive 
                          ? isStaff ? 'text-emerald-700' : 'text-blue-600'
                          : 'text-slate-400 group-hover:text-slate-600'
                      }`} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge !== undefined && item.badge > 0 && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isActive
                          ? isStaff ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-700'
                          : 'bg-slate-200 text-slate-700'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}

          {/* Shareable Link Widget Card */}
          <div className="pt-4">
            <div className="p-3.5 rounded-xl bg-gradient-to-br from-slate-900 to-slate-950 text-white shadow-md space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                  <Share2 className="w-3 h-3 text-blue-400" />
                  Clinic Booking URL
                </span>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.2 rounded font-semibold">
                  Live
                </span>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                Send to patients for online self-service booking.
              </p>
              <p className="text-[11px] text-slate-300 font-mono truncate bg-slate-800/80 p-2 rounded-lg border border-slate-700/60">
                {bookingLink.replace('https://', '')}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-300" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={onOpenPublicBooking}
                  title="View Public Booking Page"
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors cursor-pointer border border-slate-700"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Dynamic Identity Badge & Sign Out */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative">
                <div className={`w-9 h-9 rounded-xl font-bold text-xs flex items-center justify-center text-white shadow-xs ${
                  isStaff 
                    ? 'bg-gradient-to-tr from-emerald-600 to-teal-600' 
                    : 'bg-gradient-to-tr from-blue-600 to-indigo-600'
                }`}>
                  {userInitials}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
              </div>
              <div className="min-w-0 text-left">
                <div className="text-xs font-bold text-slate-900 truncate">
                  {user?.name || (isStaff ? 'Jessica Alba' : 'Dr. Sarah Connor')}
                </div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider font-medium truncate">
                  {isStaff ? 'Clinic Front Desk & Reception' : 'Host Practitioner'}
                </div>
              </div>
            </div>

            {/* Logout button */}
            <button
              onClick={onLogout}
              title="Sign Out"
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

      </aside>
    </>
  );
}
