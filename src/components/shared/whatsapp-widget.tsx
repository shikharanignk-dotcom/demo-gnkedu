"use client";

import { useEffect, useState } from "react";
import { MessageSquare } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export function WhatsAppWidget() {
  const [phone, setPhone] = useState("919352483446");
  const [message, setMessage] = useState("Hello Guru Nanak Photostat, I am interested in assignments/projects and saw your demo portfolio.");

  useEffect(() => {
    supabase
      .from("site_settings")
      .select("*")
      .eq("key", "whatsapp_config")
      .maybeSingle()
      .then(({ data }) => {
        if (data && data.value) {
          let num = data.value.phone || "919352483446";
          if (num.length === 10 && !num.startsWith("91")) {
            num = "91" + num;
          }
          setPhone(num);
          if (data.value.message) {
            setMessage(data.value.message);
          }
        }
      });
  }, []);

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
