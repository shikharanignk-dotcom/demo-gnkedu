import React, { useState, useEffect } from 'react';
import { Product, SampleItem, StudentReview, OrderStatus, FaqItem, AnalyticsStats } from './types';
import {
  PRODUCTS_DATA,
  SAMPLE_ITEMS_DATA,
  STUDENT_REVIEWS,
  FAQ_ITEMS,
  INITIAL_ORDER_STATUSES,
  INITIAL_ANALYTICS,
} from './data/ignouData';

import { AnnouncementBar } from './components/AnnouncementBar';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { DeceShowcaseSection } from './components/DeceShowcaseSection';
import { ProductsSection } from './components/ProductsSection';
import { WhyChooseUs } from './components/WhyChooseUs';
import { HowItWorks } from './components/HowItWorks';
import { StudentReviews } from './components/StudentReviews';
import { LiveCounter } from './components/LiveCounter';
import { FaqSection } from './components/FaqSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { PdfPreviewModal } from './components/PdfPreviewModal';
import { AiAssistantModal } from './components/AiAssistantModal';
import { StickyFloatingCTA } from './components/StickyFloatingCTA';
import { BackgroundAudioPlayer } from './components/BackgroundAudioPlayer';
import { OfferPopupModal } from './components/OfferPopupModal';

export function App() {
  const [products, setProducts] = useState<Product[]>(PRODUCTS_DATA);
  const [samples, setSamples] = useState<SampleItem[]>(SAMPLE_ITEMS_DATA);
  const [reviews, setReviews] = useState<StudentReview[]>(STUDENT_REVIEWS);
  const [orders, setOrders] = useState<OrderStatus[]>(INITIAL_ORDER_STATUSES);
  const [faqs, setFaqs] = useState<FaqItem[]>(FAQ_ITEMS);
  const [analytics, setAnalytics] = useState<AnalyticsStats>(INITIAL_ANALYTICS);

  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [showOrderTrackingModal, setShowOrderTrackingModal] = useState<boolean>(false);
  const [showAdminModal, setShowAdminModal] = useState<boolean>(false);
  const [showAiAssistantModal, setShowAiAssistantModal] = useState<boolean>(false);
  const [showOfferModal, setShowOfferModal] = useState<boolean>(false); // Only popup when clicked
  const [pdfModalData, setPdfModalData] = useState<{ title: string; url?: string } | null>(null);

  // Increment visitor counter & reset scroll to top on initial load
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    setAnalytics((prev) => ({
      ...prev,
      visitorCount: prev.visitorCount + 1,
    }));
  }, []);

  const ORDER_NOW_MSG = 'I have taken a sample: book my order';
  const WHATSAPP_INQUIRY_MSG = 'I have seen the sample; now, please tell me how to place the order.';

  // WhatsApp click handler
  const handleWhatsAppClick = (customMsg?: string, isOrder: boolean = false) => {
    // Increment WhatsApp click counter
    setAnalytics((prev) => ({
      ...prev,
      whatsappClickCount: prev.whatsappClickCount + 1,
    }));

    const defaultMsg = isOrder ? ORDER_NOW_MSG : WHATSAPP_INQUIRY_MSG;
    const text = encodeURIComponent(customMsg || defaultMsg);

    const whatsappUrl = `https://wa.me/919518877939?text=${text}`;
    window.open(whatsappUrl, '_blank');
  };

  // Download Sample handler
  const handleDownloadSample = (sample: SampleItem) => {
    setAnalytics((prev) => ({
      ...prev,
      downloadCount: prev.downloadCount + 1,
    }));

    setSamples((prev) =>
      prev.map((s) => (s.id === sample.id ? { ...s, downloadCount: s.downloadCount + 1 } : s))
    );

    // Open PDF preview / download link
    setPdfModalData({
      title: `${sample.title} (${sample.subjectCode})`,
      url: sample.pdfUrl,
    });
  };

  // Toggle Wishlist
  const handleToggleWishlist = (product: Product) => {
    setWishlistIds((prev) =>
      prev.includes(product.id) ? prev.filter((id) => id !== product.id) : [...prev, product.id]
    );
  };

  // Add sample via Admin
  const handleAddSample = (newSample: SampleItem) => {
    setSamples((prev) => [newSample, ...prev]);
  };

  // Add product via Admin
  const handleAddProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  // Add review from student
  const handleAddReview = (newReview: Omit<StudentReview, 'id' | 'date'>) => {
    const revObj: StudentReview = {
      ...newReview,
      id: 'rev_' + Date.now(),
      date: 'Just now',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    };
    setReviews((prev) => [revObj, ...prev]);
  };

  const wishlistedProducts = products.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-[#0A66C2] selection:text-white">
      {/* Top Urgent Announcement Bar */}
      <AnnouncementBar onWhatsAppClick={() => handleWhatsAppClick(WHATSAPP_INQUIRY_MSG, false)} />

      {/* Main Sticky Navigation Bar */}
      <Navbar
        onOpenOrderTracking={() => setShowOrderTrackingModal(true)}
        onOpenAdmin={() => setShowAdminModal(true)}
        onOpenAiAssistant={() => setShowAiAssistantModal(true)}
        onOpenOffer={() => setShowOfferModal(true)}
        onWhatsAppClick={(msg) => handleWhatsAppClick(msg || ORDER_NOW_MSG, true)}
        wishlistCount={wishlistIds.length}
        onOpenWishlist={() => {}}
      />

      {/* HERO SECTION */}
      <HeroSection
        onWhatsAppClick={(msg) => handleWhatsAppClick(msg || ORDER_NOW_MSG, true)}
        onSearchSubmit={(q) => setSearchQuery(q)}
      />

      {/* SPECIAL DECE ASSIGNMENT & PROJECT SHOWCASE */}
      <DeceShowcaseSection onWhatsAppClick={(msg, isOrder) => handleWhatsAppClick(msg, isOrder ?? true)} />

      {/* UNIFIED CORE SERVICES & FREE SAMPLE GALLERY */}
      <ProductsSection
        products={products}
        onSelectProduct={(p) => handleWhatsAppClick(`I have taken a sample: book my order (${p.title})`, true)}
        onWhatsAppClick={(msg) => handleWhatsAppClick(msg, false)}
        onViewSamplePdf={(title, url) => setPdfModalData({ title, url })}
        onDownloadSample={handleDownloadSample}
        onToggleWishlist={handleToggleWishlist}
        wishlistIds={wishlistIds}
        searchQuery={searchQuery}
      />

      {/* WHY CHOOSE US */}
      <WhyChooseUs />

      {/* HOW IT WORKS */}
      <HowItWorks
        onWhatsAppClick={(msg) => handleWhatsAppClick(msg || WHATSAPP_INQUIRY_MSG, false)}
        onOpenOrderTracking={() => setShowOrderTrackingModal(true)}
      />

      {/* STUDENT REVIEWS */}
      <StudentReviews
        reviews={reviews}
        onAddReview={handleAddReview}
      />

      {/* LIVE COUNTER */}
      <LiveCounter />

      {/* FREQUENTLY ASKED QUESTIONS */}
      <FaqSection
        faqs={faqs}
        onWhatsAppClick={(msg) => handleWhatsAppClick(msg || WHATSAPP_INQUIRY_MSG, false)}
      />

      {/* CONTACT & LOCATION */}
      <ContactSection onWhatsAppClick={() => handleWhatsAppClick(WHATSAPP_INQUIRY_MSG, false)} />

      {/* FOOTER */}
      <Footer
        onOpenOrderTracking={() => setShowOrderTrackingModal(true)}
        onOpenAdmin={() => setShowAdminModal(true)}
        onWhatsAppClick={(msg) => handleWhatsAppClick(msg || WHATSAPP_INQUIRY_MSG, false)}
      />

      {/* STICKY FLOATING CTAS (WhatsApp, Call, Wishlist, Offer) */}
      <StickyFloatingCTA
        onWhatsAppClick={(msg) => handleWhatsAppClick(msg || ORDER_NOW_MSG, true)}
        onOpenOffer={() => setShowOfferModal(true)}
        wishlistProducts={wishlistedProducts}
        onRemoveWishlist={handleToggleWishlist}
      />

      {/* CONTINUOUS BACKGROUND MP3 AUDIO PLAYER */}
      <BackgroundAudioPlayer />

      {/* MODAL: Special Offer Banner Auto-Popup */}
      <OfferPopupModal
        isOpen={showOfferModal}
        onClose={() => setShowOfferModal(false)}
        onWhatsAppClick={handleWhatsAppClick}
      />

      {/* MODAL: Order Tracking */}
      {showOrderTrackingModal && (
        <OrderTrackingModal
          orderStatuses={orders}
          onClose={() => setShowOrderTrackingModal(false)}
          onWhatsAppClick={handleWhatsAppClick}
        />
      )}

      {/* MODAL: Admin Panel */}
      {showAdminModal && (
        <AdminPanelModal
          analytics={analytics}
          products={products}
          samples={samples}
          reviews={reviews}
          orders={orders}
          faqs={faqs}
          onAddSample={handleAddSample}
          onAddProduct={handleAddProduct}
          onClose={() => setShowAdminModal(false)}
        />
      )}

      {/* MODAL: PDF Preview */}
      {pdfModalData && (
        <PdfPreviewModal
          title={pdfModalData.title}
          pdfUrl={pdfModalData.url}
          onClose={() => setPdfModalData(null)}
          onWhatsAppOrder={() => {
            handleWhatsAppClick(`Hi, I checked the PDF sample for ${pdfModalData.title}. Please send order link.`);
            setPdfModalData(null);
          }}
        />
      )}

      {/* MODAL: AI Helper */}
      {showAiAssistantModal && (
        <AiAssistantModal
          onClose={() => setShowAiAssistantModal(false)}
          onWhatsAppOrder={(msg) => {
            handleWhatsAppClick(msg);
            setShowAiAssistantModal(false);
          }}
        />
      )}
    </div>
  );
}

export default App;
