import React, { useState } from 'react';
import { OrderStatus } from '../types';
import { X, Search, Truck, CheckCircle2, Clock, PackageCheck, MapPin, ExternalLink, ShieldCheck } from 'lucide-react';

interface OrderTrackingModalProps {
  orderStatuses: OrderStatus[];
  onClose: () => void;
  onWhatsAppClick: (msg: string) => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  orderStatuses,
  onClose,
  onWhatsAppClick,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedResult, setSearchedResult] = useState<OrderStatus | null>(orderStatuses[0] || null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const query = searchQuery.trim().toLowerCase();
    const found = orderStatuses.find(
      (o) => o.orderId.toLowerCase() === query || o.phone.includes(query)
    );

    if (found) {
      setSearchedResult(found);
      setErrorMsg('');
    } else {
      setSearchedResult(null);
      setErrorMsg('No order found with this Order ID / Mobile Number. Try searching "GNP-88492" or "9518877939" or contact us on WhatsApp.');
    }
  };

  const statusSteps = [
    'Order Received',
    'Assignment Writing',
    'Quality Checking',
    'Courier Dispatched',
    'Delivered',
  ];

  const getStepIndex = (status: string) => {
    return statusSteps.indexOf(status);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-900 to-[#0A66C2] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <Truck className="w-5 h-5 text-amber-300" />
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">Live Order Status</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black">Track Your IGNOU Order</h2>
          <p className="text-xs text-blue-100 mt-1">Enter your Order ID (e.g., GNP-88492) or 10-digit mobile number.</p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Order ID (GNP-88492) or Mobile No..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0A66C2]"
              />
            </div>
            <button
              type="submit"
              className="bg-[#0A66C2] hover:bg-blue-700 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition-colors cursor-pointer shrink-0"
            >
              Search
            </button>
          </form>

          {errorMsg && (
            <div className="p-4 bg-red-50 text-red-700 rounded-xl text-xs font-medium border border-red-200">
              {errorMsg}
            </div>
          )}

          {/* Searched Order Details */}
          {searchedResult && (
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 font-bold uppercase">Order ID:</span>
                  <span className="font-extrabold text-[#0A66C2] ml-1.5 text-sm">{searchedResult.orderId}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 font-bold">Ordered On:</span>
                  <span className="font-bold text-slate-800 ml-1">{searchedResult.orderDate}</span>
                </div>
              </div>

              <div>
                <h4 className="font-extrabold text-sm text-slate-900">{searchedResult.studentName}</h4>
                <p className="text-xs text-slate-600 font-medium">
                  {searchedResult.program} • {searchedResult.productType}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {searchedResult.subjectCodes.map((code) => (
                    <span key={code} className="bg-blue-100 text-[#0A66C2] font-bold text-[11px] px-2 py-0.5 rounded">
                      {code}
                    </span>
                  ))}
                </div>
              </div>

              {/* Progress Bar Timeline */}
              <div className="pt-2">
                <div className="flex items-center justify-between text-[10px] font-extrabold text-slate-500 mb-2">
                  <span>Current Status: <strong className="text-emerald-700 text-xs">{searchedResult.status}</strong></span>
                  <span>Est. Delivery: {searchedResult.estimatedDelivery}</span>
                </div>

                <div className="grid grid-cols-5 gap-1 text-center">
                  {statusSteps.map((step, idx) => {
                    const currentIdx = getStepIndex(searchedResult.status);
                    const isCompleted = idx <= currentIdx;

                    return (
                      <div key={step} className="flex flex-col items-center">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs mb-1 transition-colors ${
                            isCompleted ? 'bg-emerald-600 text-white shadow' : 'bg-slate-200 text-slate-400'
                          }`}
                        >
                          {isCompleted ? '✓' : idx + 1}
                        </div>
                        <span className={`text-[9px] font-bold leading-tight ${isCompleted ? 'text-slate-900' : 'text-slate-400'}`}>
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Courier Tracking Info if Dispatched */}
              {searchedResult.trackingNumber && (
                <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
                  <p className="font-bold">🚚 Dispatched via {searchedResult.courierName}</p>
                  <p className="font-mono text-xs">Tracking AWB: <strong>{searchedResult.trackingNumber}</strong></p>
                  <a
                    href="https://www.indiapost.gov.in/_layouts/15/dop.portal.tracking/trackconsignment.aspx"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#0A66C2] font-bold text-xs underline mt-1"
                  >
                    Track on SpeedPost Portal <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Quick Help Footer */}
          <div className="pt-2 text-center text-xs text-slate-500">
            Need help with your tracking?{' '}
            <button
              onClick={() => onWhatsAppClick(`Hi, I need assistance with tracking my Order ID ${searchedResult?.orderId || ''}`)}
              className="text-[#0A66C2] font-bold underline cursor-pointer"
            >
              Ask Support on WhatsApp
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
