import React, { useState } from 'react';
import { Product, SampleItem, StudentReview, OrderStatus, FaqItem, AnalyticsStats, SampleCategory } from '../types';
import { X, Upload, Plus, Trash2, Edit, BarChart3, Image, FileText, ShoppingBag, FolderCheck, MessageSquare, HelpCircle, Eye, Check } from 'lucide-react';

interface AdminPanelModalProps {
  analytics: AnalyticsStats;
  products: Product[];
  samples: SampleItem[];
  reviews: StudentReview[];
  orders: OrderStatus[];
  faqs: FaqItem[];
  onAddSample: (sample: SampleItem) => void;
  onAddProduct: (product: Product) => void;
  onClose: () => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  analytics,
  products,
  samples,
  reviews,
  orders,
  faqs,
  onAddSample,
  onAddProduct,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'upload_sample' | 'add_product' | 'manage_orders' | 'reviews'>('analytics');

  // Sample Upload state
  const [sampleTitle, setSampleTitle] = useState('');
  const [sampleCategory, setSampleCategory] = useState<SampleCategory>('Assignment Samples');
  const [sampleProgram, setSampleProgram] = useState('BAG');
  const [sampleSubjectCode, setSampleSubjectCode] = useState('');
  const [sampleLanguage, setSampleLanguage] = useState<'Hindi' | 'English'>('Hindi');
  const [sampleImageUrl, setSampleImageUrl] = useState('');
  const [samplePdfUrl, setSamplePdfUrl] = useState('');
  const [sampleDesc, setSampleDesc] = useState('');
  const [sampleAddedSuccess, setSampleAddedSuccess] = useState(false);

  // New Product state
  const [prodTitle, setProdTitle] = useState('');
  const [prodType, setProdType] = useState<any>('handwritten');
  const [prodProgram, setProdProgram] = useState('BAG');
  const [prodSubjectCode, setProdSubjectCode] = useState('');
  const [prodPrice, setProdPrice] = useState(180);
  const [prodOrigPrice, setProdOrigPrice] = useState(350);
  const [prodLanguage, setProdLanguage] = useState<any>('Hindi');
  const [prodImg, setProdImg] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodAddedSuccess, setProdAddedSuccess] = useState(false);

  const handleSampleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (sampleTitle && sampleSubjectCode) {
      const newSample: SampleItem = {
        id: 'sample_' + Date.now(),
        title: sampleTitle,
        category: sampleCategory,
        program: sampleProgram,
        subjectCode: sampleSubjectCode,
        language: sampleLanguage,
        previewImageUrl: sampleImageUrl || 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&q=80',
        pdfUrl: samplePdfUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        downloadCount: 1,
        dateAdded: new Date().toISOString().split('T')[0],
        description: sampleDesc || 'Uploaded via Guru Nanak Photostat Admin Panel',
      };
      onAddSample(newSample);
      setSampleAddedSuccess(true);
      setTimeout(() => setSampleAddedSuccess(false), 3000);
      setSampleTitle('');
      setSampleSubjectCode('');
      setSampleImageUrl('');
      setSamplePdfUrl('');
      setSampleDesc('');
    }
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prodTitle && prodSubjectCode) {
      const newProduct: Product = {
        id: 'prod_' + Date.now(),
        title: prodTitle,
        type: prodType,
        program: prodProgram,
        subjectCode: prodSubjectCode,
        price: prodPrice,
        originalPrice: prodOrigPrice,
        language: prodLanguage,
        deliveryTime: '2-4 Days Home Delivery',
        rating: 5.0,
        reviewsCount: 1,
        image: prodImg || 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=600&q=80',
        description: prodDesc || 'Official IGNOU Assignment File by Guru Nanak Photostat',
        features: ['100% Center Approved', 'Neat Handwriting', 'Includes Cover Page'],
        samplePdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        isBestseller: true,
      };
      onAddProduct(newProduct);
      setProdAddedSuccess(true);
      setTimeout(() => setProdAddedSuccess(false), 3000);
      setProdTitle('');
      setProdSubjectCode('');
      setProdImg('');
      setProdDesc('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full h-[85vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0A66C2] text-white font-black flex items-center justify-center">
              🔐
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Guru Nanak Photostat Admin Dashboard</h2>
              <p className="text-xs text-slate-400">Fatehabad HQ • Content, Samples & Analytics Management</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-100 border-b border-slate-200 px-4 flex items-center gap-2 overflow-x-auto text-xs font-bold text-slate-700">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`py-3 px-4 flex items-center gap-1.5 border-b-2 cursor-pointer ${
              activeTab === 'analytics' ? 'border-[#0A66C2] text-[#0A66C2] bg-white' : 'border-transparent hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-4 h-4" /> Analytics
          </button>
          <button
            onClick={() => setActiveTab('upload_sample')}
            className={`py-3 px-4 flex items-center gap-1.5 border-b-2 cursor-pointer ${
              activeTab === 'upload_sample' ? 'border-[#0A66C2] text-[#0A66C2] bg-white' : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Upload className="w-4 h-4" /> Upload Sample PDF/Image
          </button>
          <button
            onClick={() => setActiveTab('add_product')}
            className={`py-3 px-4 flex items-center gap-1.5 border-b-2 cursor-pointer ${
              activeTab === 'add_product' ? 'border-[#0A66C2] text-[#0A66C2] bg-white' : 'border-transparent hover:text-slate-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4" /> Add Product
          </button>
          <button
            onClick={() => setActiveTab('manage_orders')}
            className={`py-3 px-4 flex items-center gap-1.5 border-b-2 cursor-pointer ${
              activeTab === 'manage_orders' ? 'border-[#0A66C2] text-[#0A66C2] bg-white' : 'border-transparent hover:text-slate-900'
            }`}
          >
            <FolderCheck className="w-4 h-4" /> Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-3 px-4 flex items-center gap-1.5 border-b-2 cursor-pointer ${
              activeTab === 'reviews' ? 'border-[#0A66C2] text-[#0A66C2] bg-white' : 'border-transparent hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-4 h-4" /> Reviews ({reviews.length})
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 flex-1 overflow-y-auto">
          
          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h3 className="font-extrabold text-base text-slate-900">Live Website Visitors & Activity Counts</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-2xl border border-blue-200">
                  <span className="text-xs font-bold text-blue-700 uppercase">Total Visitors</span>
                  <p className="text-2xl font-black text-slate-900 mt-1">{analytics.visitorCount.toLocaleString()}</p>
                </div>
                <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200">
                  <span className="text-xs font-bold text-emerald-700 uppercase">Sample Downloads</span>
                  <p className="text-2xl font-black text-slate-900 mt-1">{analytics.downloadCount.toLocaleString()}</p>
                </div>
                <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200">
                  <span className="text-xs font-bold text-amber-700 uppercase">WhatsApp Clicks</span>
                  <p className="text-2xl font-black text-slate-900 mt-1">{analytics.whatsappClickCount.toLocaleString()}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-2xl border border-purple-200">
                  <span className="text-xs font-bold text-purple-700 uppercase">Orders Delivered</span>
                  <p className="text-2xl font-black text-slate-900 mt-1">{analytics.totalOrdersCount.toLocaleString()}</p>
                </div>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-extrabold text-xs text-slate-700 uppercase tracking-wider">Top Searched Subject Codes Today</h4>
                <div className="flex flex-wrap gap-2 text-xs font-bold">
                  <span className="bg-white px-3 py-1 rounded border">BEVAE-181 (1,240 searches)</span>
                  <span className="bg-white px-3 py-1 rounded border">BSOC-131 (890 searches)</span>
                  <span className="bg-white px-3 py-1 rounded border">DECE-04 (750 searches)</span>
                  <span className="bg-white px-3 py-1 rounded border">MMPP-001 (510 searches)</span>
                  <span className="bg-white px-3 py-1 rounded border">BHDLA-135 (480 searches)</span>
                </div>
              </div>
            </div>
          )}

          {/* Upload Sample Tab */}
          {activeTab === 'upload_sample' && (
            <form onSubmit={handleSampleSubmit} className="space-y-4 max-w-xl text-xs">
              <h3 className="font-extrabold text-base text-slate-900">Upload Unlimited Sample Images & PDFs</h3>

              {sampleAddedSuccess && (
                <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl font-bold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  Sample uploaded successfully! It is now live in the Free Sample Gallery.
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">Sample Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BEVAE-181 Environment Assignment Sample"
                  value={sampleTitle}
                  onChange={(e) => setSampleTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={sampleCategory}
                    onChange={(e) => setSampleCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-semibold"
                  >
                    <option value="Assignment Samples">Assignment Samples</option>
                    <option value="Project Samples">Project Samples</option>
                    <option value="PDF Samples">PDF Samples</option>
                    <option value="Notes Samples">Notes Samples</option>
                    <option value="Guess Papers">Guess Papers</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Program</label>
                  <input
                    type="text"
                    placeholder="e.g. BAG / BCOMG"
                    value={sampleProgram}
                    onChange={(e) => setSampleProgram(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subject Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BEVAE-181"
                    value={sampleSubjectCode}
                    onChange={(e) => setSampleSubjectCode(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Language</label>
                  <select
                    value={sampleLanguage}
                    onChange={(e) => setSampleLanguage(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="Hindi">Hindi Medium</option>
                    <option value="English">English Medium</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Preview Image URL / File Link</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={sampleImageUrl}
                  onChange={(e) => setSampleImageUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">PDF Download Link URL</label>
                <input
                  type="text"
                  placeholder="https://.../sample.pdf"
                  value={samplePdfUrl}
                  onChange={(e) => setSamplePdfUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Short Description</label>
                <textarea
                  rows={2}
                  placeholder="Sample handwriting features, paper layout..."
                  value={sampleDesc}
                  onChange={(e) => setSampleDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <button
                type="submit"
                className="bg-[#0A66C2] text-white font-extrabold px-6 py-2.5 rounded-xl shadow hover:bg-blue-700"
              >
                Upload & Add Sample
              </button>
            </form>
          )}

          {/* Add Product Tab */}
          {activeTab === 'add_product' && (
            <form onSubmit={handleProductSubmit} className="space-y-4 max-w-xl text-xs">
              <h3 className="font-extrabold text-base text-slate-900">Add New IGNOU Service Product</h3>

              {prodAddedSuccess && (
                <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl font-bold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  Product added successfully!
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BSOC-131 Introduction to Sociology Handwritten Assignment"
                  value={prodTitle}
                  onChange={(e) => setProdTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Type</label>
                  <select
                    value={prodType}
                    onChange={(e) => setProdType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="handwritten">Handwritten Assignment</option>
                    <option value="project_file">Project File</option>
                    <option value="assignment_pdf">Assignment PDF</option>
                    <option value="project_pdf">Project PDF</option>
                    <option value="notes">IGNOU Notes</option>
                    <option value="guess_paper">Guess Papers</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subject Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BSOC-131"
                    value={prodSubjectCode}
                    onChange={(e) => setProdSubjectCode(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Discount Price (₹) *</label>
                  <input
                    type="number"
                    value={prodPrice}
                    onChange={(e) => setProdPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold text-[#0A66C2]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    value={prodOrigPrice}
                    onChange={(e) => setProdOrigPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Description</label>
                <textarea
                  rows={2}
                  placeholder="Details about pages, pen color, paper weight..."
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <button
                type="submit"
                className="bg-[#FF7A00] text-white font-extrabold px-6 py-2.5 rounded-xl shadow hover:bg-orange-600"
              >
                Publish New Product
              </button>
            </form>
          )}

          {/* Manage Orders Tab */}
          {activeTab === 'manage_orders' && (
            <div className="space-y-4 text-xs">
              <h3 className="font-extrabold text-base text-slate-900">Manage Active Student Orders</h3>
              <div className="space-y-3">
                {orders.map((ord) => (
                  <div key={ord.orderId} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-[#0A66C2]">{ord.orderId}</span>
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                          {ord.status}
                        </span>
                      </div>
                      <p className="font-bold text-slate-900 mt-1">{ord.studentName} ({ord.phone})</p>
                      <p className="text-slate-600">{ord.program} • {ord.productType}</p>
                    </div>

                    <div className="text-right">
                      <p className="text-slate-500 text-[10px]">Ordered: {ord.orderDate}</p>
                      {ord.trackingNumber && <p className="font-mono text-[11px] text-emerald-700">AWB: {ord.trackingNumber}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="space-y-4 text-xs">
              <h3 className="font-extrabold text-base text-slate-900">Manage Published Student Reviews</h3>
              <div className="space-y-2">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900">{rev.studentName}</span> ({rev.program}): "{rev.comment}"
                    </div>
                    <span className="text-amber-500 font-bold shrink-0">{rev.rating}★</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
