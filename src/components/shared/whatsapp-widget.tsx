"use client";

import { useMemo } from "react";
import { MessageSquare } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function WhatsAppWidget() {
  // Fetch settings from Convex
  const siteSettings = useQuery(api.site_settings.get) || [];
  
  const settingsObj = useMemo(() => {
    const obj: Record<string, any> = {};
    siteSettings.forEach((row: any) => {
      obj[row.key] = row.value;
    });
    return obj;
  }, [siteSettings]);

  const whatsappConfig = settingsObj.whatsapp_config || {};
  let phone = whatsappConfig.phone || "919518877939";
  if (phone.length === 10 && !phone.startsWith("91")) {
    phone = "91" + phone;
  }
  const message = whatsappConfig.message || "Hello Guru Nanak Photostat, I am interested in assignments/projects and saw your demo portfolio.";

  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-40 flex items-center justify-center h-12 w-12 rounded-full bg-[#25D366] text-white shadow-lg hover:scale-110 active:scale-95 transition-all duration-200 group"
      title="Inquire on WhatsApp"
    >
      {/* Pulse effect */}
      <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D366]/40 animate-ping opacity-75"></span>
      <MessageSquare className="h-5 w-5 relative z-10 fill-white stroke-none group-hover:scale-105" />
    </a>
  );
}
