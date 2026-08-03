export type ProductCategory = 
  | 'handwritten'
  | 'project_file'
  | 'assignment_pdf'
  | 'project_pdf'
  | 'notes'
  | 'guess_paper';

export type SampleCategory = 
  | 'Assignment Samples'
  | 'Project Samples'
  | 'PDF Samples'
  | 'Notes Samples'
  | 'Guess Papers';

export type Language = 'Hindi' | 'English' | 'Both';

export interface Product {
  id: string;
  title: string;
  type: ProductCategory;
  program: string; // e.g. 'BAG', 'BCOMG', 'BSCG', 'MAH', 'MBA', 'BCA', 'MCA'
  subjectCode: string; // e.g. 'BEVAE-181'
  semester?: string;
  price: number;
  originalPrice: number;
  language: Language;
  pages?: number;
  deliveryTime: string;
  rating: number;
  reviewsCount: number;
  image: string;
  description: string;
  features: string[];
  samplePdfUrl?: string;
  isBestseller?: boolean;
}

export interface SampleItem {
  id: string;
  title: string;
  category: SampleCategory;
  program: string;
  subjectCode: string;
  language: Language;
  previewImageUrl: string;
  pdfUrl: string;
  downloadCount: number;
  dateAdded: string;
  description?: string;
}

export interface StudentReview {
  id: string;
  studentName: string;
  program: string;
  location: string;
  rating: number;
  comment: string;
  verified: boolean;
  date: string;
  avatar?: string;
  subjectCode?: string;
}

export interface OrderStatus {
  orderId: string;
  phone: string;
  studentName: string;
  subjectCodes: string[];
  program: string;
  productType: string;
  status: 'Order Received' | 'Assignment Writing' | 'Quality Checking' | 'Courier Dispatched' | 'Delivered';
  courierName?: string;
  trackingNumber?: string;
  estimatedDelivery: string;
  orderDate: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'Orders' | 'Delivery' | 'Payment' | 'Quality' | 'General';
}

export interface AnalyticsStats {
  visitorCount: number;
  downloadCount: number;
  whatsappClickCount: number;
  totalOrdersCount: number;
}
