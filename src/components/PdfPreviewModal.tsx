import React, { useState } from 'react';
import { X, Download, FileText, ZoomIn, ZoomOut, RotateCw, ExternalLink, ShieldCheck } from 'lucide-react';

interface PdfPreviewModalProps {
  title: string;
  pdfUrl?: string;
  onClose: () => void;
  onWhatsAppOrder: () => void;
}

export const PdfPreviewModal: React.FC<PdfPreviewModalProps> = ({
  title,
  pdfUrl,
  onClose,
  onWhatsAppOrder,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full h-[85vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-[#0A66C2] text-white flex items-center justify-center font-bold shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="truncate">
              <h3 className="font-extrabold text-sm sm:text-base text-white truncate">{title}</h3>
              <p className="text-[11px] text-emerald-400 font-medium">✓ Verified IGNOU Solved Sample PDF</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Controls Toolbar */}
        <div className="bg-slate-100 p-3 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-700">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setZoomLevel(Math.max(70, zoomLevel - 15))}
              className="p-1.5 bg-white rounded border hover:bg-slate-50 cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4 text-slate-600" />
            </button>
            <span className="w-12 text-center text-slate-900">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel(Math.min(150, zoomLevel + 15))}
              className="p-1.5 bg-white rounded border hover:bg-slate-50 cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4 text-slate-600" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={pdfUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-50 text-[#0A66C2] px-3 py-1.5 rounded-lg border border-blue-200 flex items-center gap-1 hover:bg-blue-100 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Download Sample PDF
            </a>
          </div>
        </div>

        {/* PDF Viewer Canvas Frame */}
        <div className="flex-1 bg-slate-200/80 p-3 sm:p-4 overflow-auto flex items-center justify-center">
          {pdfUrl ? (
            <iframe
              src={pdfUrl.includes('/view') ? pdfUrl.replace(/\/view(\?.*)?$/, '/preview') : pdfUrl}
              className="w-full h-full min-h-[450px] sm:min-h-[550px] rounded-xl border-0 shadow-lg bg-white"
              title={title}
              allow="autoplay"
            />
          ) : (
            <div
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
              className="transition-transform duration-200 w-full max-w-xl bg-white shadow-xl rounded-xl p-8 border border-slate-300 min-h-[500px] text-slate-900 space-y-4"
            >
            {/* Header Stamp */}
            <div className="border-b-2 border-slate-900 pb-4 text-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#0A66C2]">
                Guru Nanak Photostat • Fatehabad (Haryana)
              </span>
              <h1 className="text-xl font-black text-slate-900 mt-1">IGNOU SOLVED ASSIGNMENT SAMPLE</h1>
              <p className="text-xs text-slate-600 font-bold mt-0.5">{title}</p>
            </div>

            {/* Simulated Clean Handwritten / Printed Content Sample */}
            <div className="space-y-3 text-xs leading-relaxed font-sans">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 font-semibold text-[11px]">
                📌 Note: This is a official sample preview. Full completed handwritten assignment files contain 25-35 pages with complete answers, cover page, and questionnaire attached.
              </div>

              <div className="space-y-2">
                <p className="font-extrabold text-sm text-slate-900">Q1. Discuss the core concepts of environmental conservation as per IGNOU BEVAE-181 syllabus.</p>
                <p className="text-slate-700 italic border-l-2 border-[#0A66C2] pl-3">
                  <strong>Answer:</strong> Environmental conservation refers to the responsible management and protection of natural ecosystems and resources to ensure sustainable development for future generations...
                </p>
                <div className="h-28 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center text-slate-400 font-bold text-xs">
                  [Diagrammatic Illustration: Carbon Cycle & Ecosystem Pyramid]
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <p className="font-extrabold text-sm text-slate-900">Q2. Explain the fundamental rights and socio-economic equality measures in Indian society.</p>
                <p className="text-slate-700">
                  The Constitution of India provides six fundamental rights under Part III to guarantee social equality, dignity, and personal liberty...
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 font-semibold">
              <span>Page 1 of 28 (Sample Copy)</span>
              <span>Guru Nanak Photostat Helpline: +91 95188 77939</span>
            </div>
          </div>
          )}
        </div>

      </div>
    </div>
  );
};
