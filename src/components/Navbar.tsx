import React, { useState } from 'react';
import { BookOpen, Menu, X, ShieldCheck, Heart, Truck, Gift } from 'lucide-react';

interface NavbarProps {
  onOpenOrderTracking: () => void;
  onOpenAdmin: () => void;
  onOpenAiAssistant: () => void;
  onOpenOffer: () => void;
  onWhatsAppClick: (subject?: string) => void;
  wishlistCount: number;
  onOpenWishlist: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenOrderTracking,
  onOpenAdmin,
  onOpenAiAssistant,
  onOpenOffer,
  onWhatsAppClick,
  wishlistCount,
  onOpenWishlist,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Services & Samples', href: '#products' },
    { name: 'Search Course', href: '#search' },
    { name: 'Why Choose Us', href: '#why-us' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Student Reviews', href: '#reviews' },
    { name: 'FAQ', href: '#faq' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand Name */}
          <a href="#" className="flex items-center gap-3 group">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg sm:text-xl text-slate-900 tracking-tight leading-none">
                  Guru Nanak <span className="text-[#0A66C2]">Photostat</span>
                </span>
                <span className="hidden xl:inline-block bg-orange-100 text-orange-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-orange-300">
                  IGNOU Helpline
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-500 font-medium tracking-tight mt-0.5">
                Trusted IGNOU Study Material & Assignment Hub
              </p>
            </div>
          </a>

          {/* Center: Open Book & Verified Badge */}
          <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 bg-blue-50/80 border border-blue-100 rounded-full text-xs font-semibold text-blue-900 shadow-xs">
            <BookOpen className="w-4 h-4 text-[#0A66C2]" />
            <span>Verified IGNOU Material</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex items-center gap-5">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-xs font-semibold text-slate-700 hover:text-[#0A66C2] transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-2 sm:gap-3">
            <button
              onClick={onOpenOffer}
              className="inline-flex items-center gap-1.5 text-xs font-black text-amber-900 bg-amber-100 hover:bg-amber-200 px-3 py-2 rounded-xl transition-all border border-amber-300 shadow-xs cursor-pointer animate-pulse"
              title="View Special Discount Offer"
            >
              <Gift className="w-4 h-4 text-orange-600" />
              <span>🔥 Offer</span>
            </button>

            <button
              onClick={onOpenWishlist}
              className="relative p-2 text-slate-600 hover:text-[#0A66C2] rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              title="Saved Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            <button
              onClick={onOpenAiAssistant}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition-colors border border-blue-200 cursor-pointer"
              title="IGNOU AI Helper"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#0A66C2]" />
              AI Helper
            </button>

            <button
              onClick={onOpenAdmin}
              className="text-xs text-slate-400 hover:text-slate-600 font-medium px-2 py-1 cursor-pointer"
              title="Admin Panel"
            >
              Admin
            </button>

            <button
              onClick={() => onWhatsAppClick()}
              className="inline-flex items-center gap-2 bg-[#FF7A00] hover:bg-orange-600 text-white text-xs sm:text-sm font-black px-4 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Truck className="w-4 h-4" />
              <span>Order Now</span>
            </button>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex md:hidden items-center gap-1.5">
            <button
              onClick={() => onWhatsAppClick()}
              className="bg-[#FF7A00] hover:bg-orange-600 text-white px-3 py-2 rounded-xl font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Order</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-900 hover:text-blue-600 rounded-lg focus:outline-none cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-100">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenOrderTracking();
              }}
              className="w-full text-center bg-blue-50 text-[#0A66C2] py-2 rounded-lg font-semibold text-xs border border-blue-200 flex items-center justify-center gap-1.5"
            >
              <Truck className="w-3.5 h-3.5" />
              Track Order
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAiAssistant();
              }}
              className="w-full text-center bg-slate-100 text-slate-800 py-2 rounded-lg font-semibold text-xs border border-slate-200 flex items-center justify-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#0A66C2]" />
              AI Assistant
            </button>
          </div>

          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-800 font-semibold text-sm py-1.5 hover:text-[#0A66C2]"
              >
                {link.name}
              </a>
            ))}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="text-left text-xs text-slate-500 py-1"
            >
              🔐 Admin Panel Login
            </button>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onWhatsAppClick();
              }}
              className="w-full bg-[#FF7A00] text-white font-bold py-3 rounded-xl shadow text-center text-sm flex items-center justify-center gap-2"
            >
              <Truck className="w-4 h-4" />
              <span>Order Now on WhatsApp</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
