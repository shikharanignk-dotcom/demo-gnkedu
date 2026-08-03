import React, { useState } from 'react';
import { Product } from '../types';
import { MessageCircle, Heart, ArrowUp, X, Gift } from 'lucide-react';

interface StickyFloatingCTAProps {
  onWhatsAppClick: (msg?: string) => void;
  onOpenOffer: () => void;
  wishlistProducts: Product[];
  onRemoveWishlist: (product: Product) => void;
}

export const StickyFloatingCTA: React.FC<StickyFloatingCTAProps> = ({
  onWhatsAppClick,
  onOpenOffer,
  wishlistProducts,
  onRemoveWishlist,
}) => {
  const [showWishlistDrawer, setShowWishlistDrawer] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Floating Buttons Stack on Bottom Right */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
        
        {/* Wishlist Floating Button */}
        {wishlistProducts.length > 0 && (
          <button
            onClick={() => setShowWishlistDrawer(true)}
            className="relative p-3.5 bg-white text-slate-800 rounded-full shadow-xl border border-slate-200 hover:bg-slate-50 transition-transform active:scale-95 cursor-pointer"
            title="Saved Wishlist Items"
          >
            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
            <span className="absolute -top-1 -right-1 bg-orange-500 text-white font-extrabold text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
              {wishlistProducts.length}
            </span>
          </button>
        )}

        {/* Special Offer Floating Button */}
        <button
          onClick={onOpenOffer}
          className="relative group bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:to-red-600 text-white px-3.5 py-2.5 rounded-full shadow-2xl flex items-center gap-2 font-black text-xs transition-all transform hover:scale-105 cursor-pointer border border-amber-300 animate-bounce"
          title="🔥 View Special Discount Offer"
        >
          <Gift className="w-4 h-4 text-white" />
          <span>🔥 Special Offer</span>
        </button>

        {/* Floating WhatsApp Sticky Button */}
        <button
          onClick={() => onWhatsAppClick()}
          className="relative group bg-[#FF7A00] hover:bg-orange-600 text-white px-4 py-3 rounded-full shadow-2xl flex items-center gap-2.5 font-black text-xs sm:text-sm transition-all transform hover:scale-105 cursor-pointer"
        >
          {/* Pulsing Ring */}
          <span className="absolute -inset-1 rounded-full bg-orange-400 opacity-75 animate-ping -z-10" />

          <MessageCircle className="w-6 h-6 fill-current" />
          <span className="hidden sm:inline">Order on WhatsApp</span>
          <span className="inline-block sm:hidden">WhatsApp</span>

          {/* Online badge */}
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border border-white" />
        </button>
      </div>

      {/* Wishlist Drawer Modal */}
      {showWishlistDrawer && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-md h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                  <h3 className="font-extrabold text-base text-slate-900">Your Saved Assignments</h3>
                </div>
                <button
                  onClick={() => setShowWishlistDrawer(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {wishlistProducts.map((p) => (
                  <div key={p.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="font-bold text-[#0A66C2]">{p.subjectCode}</span>
                      <h4 className="font-extrabold text-slate-900 line-clamp-1">{p.title}</h4>
                      <p className="font-black text-slate-800">₹{p.price}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onWhatsAppClick(`Hi, I saved ${p.title} in my wishlist. I want to order.`)}
                        className="bg-[#FF7A00] text-white px-3 py-1.5 rounded-lg font-bold"
                      >
                        Order
                      </button>
                      <button
                        onClick={() => onRemoveWishlist(p)}
                        className="text-slate-400 hover:text-red-500 p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <button
                onClick={() => {
                  const list = wishlistProducts.map(p => `${p.subjectCode} (${p.title})`).join(', ');
                  onWhatsAppClick(`Hi Guru Nanak Photostat, I want to order my wishlist items: ${list}`);
                  setShowWishlistDrawer(false);
                }}
                className="w-full bg-[#0A66C2] hover:bg-blue-700 text-white font-extrabold py-3 rounded-xl shadow text-center text-xs"
              >
                Order All Wishlist Items on WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
