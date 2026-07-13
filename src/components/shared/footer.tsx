import Link from "next/link";
import { CheckSquare, MessageCircle, Mail, Phone, Clock } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-white/5 bg-bg-dark/40 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2 font-heading text-lg font-bold text-white">
              <CheckSquare className="h-5 w-5 text-brand-purple" />
              GNK <span className="text-gradient">Demos</span>
            </Link>
            <p className="text-sm text-text-muted max-w-sm leading-relaxed">
              Premium showcase of our handwriting assignments, academic projects, coding demos, and course reviews. Verified trust and quality service for students.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/assignments" className="text-sm text-text-muted hover:text-white transition-colors">
                  Assignments
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-sm text-text-muted hover:text-white transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/videos" className="text-sm text-text-muted hover:text-white transition-colors">
                  Video Demos
                </Link>
              </li>
              <li>
                <Link href="/reviews" className="text-sm text-text-muted hover:text-white transition-colors">
                  Student Reviews
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Contact Info</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-text-muted">
                <Phone className="h-4 w-4 text-brand-blue" />
                <span>+91 93524 83446</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-text-muted">
                <Mail className="h-4 w-4 text-brand-blue" />
                <span>onlineservicemart@gmail.com</span>
              </li>
              <li className="flex items-center gap-2 text-xs text-text-muted">
                <Clock className="h-4 w-4 text-brand-purple" />
                <span>Response in minutes (9 AM - 9 PM)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-muted">
            &copy; {new Date().getFullYear()} GNK Edusolution. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/admin/login" className="text-xs text-text-muted/60 hover:text-brand-purple transition-colors">
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
