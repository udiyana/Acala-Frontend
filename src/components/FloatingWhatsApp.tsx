import { MessageCircle } from "lucide-react";
import { useSiteData } from "@/lib/site-data-store";

export default function FloatingWhatsApp() {
  const { bookingActions } = useSiteData();

  return (
    <a
      href={bookingActions.contactUs.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contact Us on WhatsApp"
      className="fixed right-5 bottom-5 z-50 w-14 h-14 rounded-full flex items-center justify-center transition-transform hover:-translate-y-1"
      style={{
        background: "#25D366",
        color: "#fff",
        boxShadow: "0 10px 30px rgba(0,0,0,0.22)",
      }}
    >
      <MessageCircle className="w-7 h-7" />
    </a>
  );
}
