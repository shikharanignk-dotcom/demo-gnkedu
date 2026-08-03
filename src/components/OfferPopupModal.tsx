import React from 'react';
import { X, Sparkles, MessageCircle, Gift } from 'lucide-react';

interface OfferPopupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWhatsAppClick: (customMsg?: string, isOrder?: boolean) => void;
}

export const OFFER_IMAGE_URL = 'https://res.cloudinary.com/u1pgidk7/image/upload/v1785752445/WhatsApp_Image_2026-07-06_at_1.44.52_PM_t1zkn9.jpg';

export const OfferPopupModal: React.FC<OfferPopupModalProps> = ({
  isOpen,
  onClose,
  onWhatsAppClick,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div
        className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-amber-300 relative flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white p-3.5 px-4 flex items-center justify-between shadow-md shrink-0">
          <div className="flex items-center gap-2">
            <span className="p-1 bg-white/20 rounded-full animate-bounce">
              <Gift className="w-4 h-4 text-white" />
            </span>
            <div>
              <h3 className="font-black text-sm sm:text-base tracking-wide flex items-center gap-1.5 leading-none">
                🔥 SPECIAL DISCOUNT OFFER
              </h3>
              <p className="text-[10px] sm:text-[11px] text-amber-100 font-semibold mt-0.5">
                Guru Nanak Photostat Exclusive Offer
              </p>
            </div>
          </div>

          {/* Top Right Close Button */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors cursor-pointer"
            title="Close Offer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Offer Image Container */}
        <div className="p-3 bg-slate-900 flex-1 overflow-auto flex items-center justify-center min-h-[220px]">
          <div className="relative rounded-2xl overflow-hidden border border-amber-400/30 shadow-xl w-full">
            <img
              src={OFFER_IMAGE_URL}
              alt="Special Discount Offer"
              className="w-full h-auto max-h-[58vh] object-contain mx-auto"
            />
          </div>
        </div>

        {/* Action Buttons & Below-Image Close Button */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex flex-col gap-2 shrink-0">
          {/* Claim on WhatsApp CTA */}
          <button
            onClick={() => {
              onWhatsAppClick('I saw the special offer on the website. Please tell me how to claim this offer.', false);
              onClose();
            }}
            className="w-full bg-[#00a884] hover:bg-emerald-600 text-white font-black py-3 px-4 rounded-xl text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
          >
            <MessageCircle className="w-5 h-5 fill-current shrink-0" />
            <span>Claim Offer on WhatsApp</span>
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
          </button>

          {/* Explicit "Close / Cut" Button Below Image as requested */}
          <button
            onClick={onClose}
            className="w-full bg-slate-200 hover:bg-slate-300 text-slate-800 font-extrabold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 text-slate-600" />
            <span>Close</span>
          </button>
        </div>
      </div>
    </div>
  );
};
