export const branchBookingUrls = {
  "nusa-lembongan":
    "https://booking.chope.co/booking_index?rid=acalalembongan2408bal&source=rest_acalabarbistro.com&adults=2&email=acalabarbistro@gmail.com&lang=en_US&country_code=BALI&time=12:30%20pm&select_location=0&date=7%20Jul%202026&",
  "nusa-dua":
    "https://booking.chope.co/booking_index?rid=acalabar2406bal&source=rest_acalabarbistro.com&adults=2&email=acalabarbistro@gmail.com&lang=en_US&country_code=BALI&time=12:30%20pm&select_location=0&date=7%20Jul%202026&",
} as const;

export const contactLinks = {
  whatsapp:
    "https://wa.me/6282339757775?text=Hi%20Acala%2C%20I%27d%20like%20to%20ask%20about%20your%20locations%20and%20table%20availability.",
  reservationEmail:
    "mailto:acalabarbistro@gmail.com?subject=Table%20Reservation%20Request%20-%20Acala%20Bar%20%26%20Bistro&body=Hi%20Acala%2C%0A%0AI%27d%20like%20to%20reserve%20a%20table.%0A%0ABranch%3A%0ADate%3A%0ATime%3A%0AGuests%3A%0AName%3A%0APhone%3A%0A%0AThank%20you.",
  chope: branchBookingUrls["nusa-lembongan"],
} as const;

export const bookingActions = {
  contactUs: {
    id: "contact-us",
    title: "Contact Us",
    label: "Contact Us",
    channel: "WhatsApp",
    href: contactLinks.whatsapp,
    copy: "Ask about branches, table availability, or dining plans through WhatsApp.",
    external: true,
  },
  reserveTable: {
    id: "reserve-table",
    title: "Reserve a Table",
    label: "Reserve a Table",
    channel: "Email",
    href: contactLinks.reservationEmail,
    copy: "Send your preferred branch, date, time, and guest count by email.",
    external: false,
  },
  bookTable: {
    id: "book-table",
    title: "Book a Table",
    label: "Book a Table",
    channel: "Chope",
    href: contactLinks.chope,
    copy: "Book directly through Chope for online table availability.",
    external: true,
  },
} as const;

export const bookingActionCards = [
  bookingActions.contactUs,
  bookingActions.reserveTable,
  bookingActions.bookTable,
] as const;
