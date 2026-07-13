"use client";

import { MessageSquare } from "lucide-react";

export function WhatsAppWidget() {
  const whatsappNumber = "919352483446";
  const defaultMessage = "Hello GNK Edusolution, I am interested in assignments/projects and saw your demo portfolio.";
  const encodedMessage = encodeURIComponent(defaultMessage);
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-40 flex items-center justify-center h-14 w-14 rounded-full bg-[#25D366] text-white shadow-lg hover:scale-110 active:scale-95 transition-all duration-200 group"
      title="Inquire on WhatsApp"
    >
      {/* Pulse effect */}
      <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D366]/40 animate-ping opacity-75"></span>
      <MessageSquare className="h-6 w-6 relative z-10 fill-white stroke-none group-hover:scale-105" />
    </a>
  );
}
