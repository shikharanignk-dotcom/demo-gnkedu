import React, { useState, useEffect, useRef } from 'react';
import { StudentReview } from '../types';
import { Star, CheckCircle2, Plus, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

interface StudentReviewsProps {
  reviews: StudentReview[];
  onAddReview: (review: Omit<StudentReview, 'id' | 'date'>) => void;
}

export const StudentReviews: React.FC<StudentReviewsProps> = ({ reviews, onAddReview }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [program, setProgram] = useState('');
  const [location, setLocation] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [subjectCode, setSubjectCode] = useState('');

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);

  // IntersectionObserver to detect if Reviews section is actually visible in viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // Auto swipe every 3.5 seconds ONLY when section is visible in viewport
  useEffect(() => {
    if (!isAutoPlaying || !isVisible || reviews.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [isAutoPlaying, isVisible, reviews.length]);

  // Scroll carousel horizontally inside its container ONLY when visible and index > 0 or user interacts
  useEffect(() => {
    if (carouselRef.current && isVisible) {
      const container = carouselRef.current;
      const card = container.children[currentIndex] as HTMLElement;
      if (card) {
        container.scrollLeft = card.offsetLeft;
      }
    }
  }, [currentIndex, isVisible]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (studentName && comment) {
      onAddReview({
        studentName,
        program: program || 'IGNOU Student',
        location: location || 'India',
        rating,
        comment,
        verified: true,
        subjectCode: subjectCode || 'BEVAE-181',
      });
      setShowAddModal(false);
      setStudentName('');
      setComment('');
      setProgram('');
      setLocation('');
      setSubjectCode('');
    }
  };

  return (
    <section ref={sectionRef} id="reviews" className="py-8 sm:py-12 bg-slate-50 border-t border-slate-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              Real Student Reviews
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Student Reviews & Testimonials
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-xl">
              Read authentic feedback and reviews from IGNOU students across Delhi, Bihar, UP, Punjab, Haryana, Rajasthan & all India.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            {/* Auto Play Toggle */}
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-300 transition-colors cursor-pointer text-xs flex items-center gap-1 font-semibold"
              title={isAutoPlaying ? "Pause Auto-swipe" : "Play Auto-swipe"}
            >
              {isAutoPlaying ? <Pause className="w-4 h-4 text-amber-600" /> : <Play className="w-4 h-4 text-emerald-600" />}
              <span className="hidden sm:inline">{isAutoPlaying ? 'Pause' : 'Auto Swipe'}</span>
            </button>

            {/* Carousel Nav Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrev}
                className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-[#0A66C2] hover:text-white transition-colors shadow-2xs cursor-pointer"
                title="Previous Review"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-[#0A66C2] hover:text-white transition-colors shadow-2xs cursor-pointer"
                title="Next Review"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center justify-center gap-1.5 bg-[#0A66C2] hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow transition-colors cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Write Review</span>
            </button>
          </div>
        </div>

        {/* Auto-Swiping Single Line Horizontal Row */}
        <div 
          className="relative group"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <div
            ref={carouselRef}
            className="flex items-stretch gap-4 sm:gap-5 overflow-x-auto scrollbar-none pb-4 pt-1"
            style={{ scrollBehavior: 'smooth' }}
          >
            {reviews.map((rev, index) => (
              <div
                key={rev.id}
                onClick={() => setCurrentIndex(index)}
                className={`w-[280px] sm:w-[340px] md:w-[380px] shrink-0 bg-white rounded-xl p-4 sm:p-5 border transition-all duration-300 flex flex-col justify-between cursor-pointer ${
                  index === currentIndex
                    ? 'border-blue-400 ring-2 ring-blue-400/20 shadow-md scale-[1.01]'
                    : 'border-slate-200/90 shadow-2xs hover:border-blue-300'
                }`}
              >
                <div>
                  {/* Rating Stars & Badge */}
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
                        />
                      ))}
                      <span className="text-xs font-extrabold text-slate-800 ml-1">{rev.rating}.0</span>
                    </div>

                    {rev.subjectCode && (
                      <span className="bg-blue-50 text-[#0A66C2] text-[10px] font-bold px-2 py-0.5 rounded border border-blue-100 shrink-0">
                        {rev.subjectCode}
                      </span>
                    )}
                  </div>

                  {/* Comment quote */}
                  <p className="text-slate-700 text-xs sm:text-sm italic font-medium leading-relaxed line-clamp-3">
                    "{rev.comment}"
                  </p>
                </div>

                {/* Reviewer Details */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {rev.avatar ? (
                      <img
                        src={rev.avatar}
                        alt={rev.studentName}
                        className="w-8 h-8 rounded-full object-cover border border-slate-200"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-[#0A66C2] flex items-center justify-center font-bold text-xs">
                        {rev.studentName.charAt(0)}
                      </div>
                    )}

                    <div>
                      <h4 className="font-extrabold text-xs text-slate-900 flex items-center gap-1">
                        <span>{rev.studentName}</span>
                        {rev.verified && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100" title="Verified IGNOU Student" />
                        )}
                      </h4>
                      <p className="text-[10px] text-slate-500 truncate max-w-[150px]">
                        {rev.program} • {rev.location}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] text-slate-400 shrink-0">{rev.date}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Indicators */}
          <div className="flex items-center justify-center gap-1.5 mt-3">
            {reviews.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  i === currentIndex ? 'w-6 bg-[#0A66C2]' : 'w-1.5 bg-slate-300 hover:bg-slate-400'
                }`}
                title={`Go to review ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Add Review Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
              <h3 className="text-xl font-extrabold text-slate-900 mb-1">Write a Review</h3>
              <p className="text-xs text-slate-500 mb-4">Share your feedback about Guru Nanak Photostat assignment service.</p>

              <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Gurpreet Singh"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A66C2]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">IGNOU Program</label>
                    <input
                      type="text"
                      placeholder="e.g. BAG 2nd Year"
                      value={program}
                      onChange={(e) => setProgram(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">City / State</label>
                    <input
                      type="text"
                      placeholder="e.g. Fatehabad, Haryana"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subject Codes Ordered</label>
                  <input
                    type="text"
                    placeholder="e.g. BEVAE-181, BSOC-131"
                    value={subjectCode}
                    onChange={(e) => setSubjectCode(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Star Rating</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold text-amber-600"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5.0 - Excellent)</option>
                    <option value={4}>⭐⭐⭐⭐ (4.0 - Very Good)</option>
                    <option value={3}>⭐⭐⭐ (3.0 - Good)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Your Review Comment *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Tell other IGNOU students about handwriting quality, paper delivery, and approval experience..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A66C2]"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#0A66C2] text-white rounded-lg font-extrabold shadow hover:bg-blue-700"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

