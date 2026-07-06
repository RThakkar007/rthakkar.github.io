// Internationalization (i18n) system for ArcticAC
// Supports: English (en), Hindi (hi), Gujarati (gu)

export type Language = "en" | "hi" | "gu";

export interface Translations {
  // Navbar
  nav_home: string;
  nav_services: string;
  nav_technicians: string;
  nav_book: string;
  nav_about: string;
  nav_contact: string;
  nav_login: string;
  nav_logout: string;
  nav_get_started: string;
  nav_my_bookings: string;
  nav_admin: string;
  nav_tech_portal: string;
  // Hero
  hero_badge: string;
  hero_title_1: string;
  hero_title_2: string;
  hero_subtitle: string;
  hero_book_cta: string;
  hero_track_cta: string;
  hero_customers: string;
  hero_technicians: string;
  hero_rating: string;
  hero_response: string;
  // Services
  services_title: string;
  services_subtitle: string;
  services_book_now: string;
  services_view_all: string;
  services_starting: string;
  services_per_unit: string;
  services_per_year: string;
  // How it works
  how_title: string;
  how_subtitle: string;
  how_step1_title: string;
  how_step1_desc: string;
  how_step2_title: string;
  how_step2_desc: string;
  how_step3_title: string;
  how_step3_desc: string;
  how_step4_title: string;
  how_step4_desc: string;
  // Trust
  trust_title: string;
  trust_verified: string;
  trust_verified_desc: string;
  trust_same_day: string;
  trust_same_day_desc: string;
  trust_tracking: string;
  trust_tracking_desc: string;
  trust_warranty: string;
  trust_warranty_desc: string;
  // Testimonials
  testimonials_title: string;
  testimonials_subtitle: string;
  // FAQ
  faq_title: string;
  faq_subtitle: string;
  faq_q1: string;
  faq_a1: string;
  faq_q2: string;
  faq_a2: string;
  faq_q3: string;
  faq_a3: string;
  faq_q4: string;
  faq_a4: string;
  faq_q5: string;
  faq_a5: string;
  faq_q6: string;
  faq_a6: string;
  // CTA
  cta_title: string;
  cta_subtitle: string;
  cta_book: string;
  cta_call: string;
  // Booking
  booking_title: string;
  booking_subtitle: string;
  booking_step1: string;
  booking_step2: string;
  booking_step3: string;
  booking_step4: string;
  booking_select_service: string;
  booking_continue: string;
  booking_back: string;
  booking_confirm: string;
  booking_name: string;
  booking_phone: string;
  booking_address: string;
  booking_notes: string;
  booking_payment: string;
  booking_cod: string;
  booking_online: string;
  // Track
  track_title: string;
  track_subtitle: string;
  track_enter_ref: string;
  track_search: string;
  track_assigned: string;
  track_on_way: string;
  track_completed: string;
  // Footer
  footer_tagline: string;
  footer_services: string;
  footer_company: string;
  footer_about: string;
  footer_contact: string;
  footer_terms: string;
  footer_privacy: string;
  footer_cancellation: string;
  footer_rights: string;
  // Common
  common_loading: string;
  common_error: string;
  common_save: string;
  common_cancel: string;
  common_close: string;
  common_submit: string;
  common_call_now: string;
  // Services
  services_page_title: string;
  services_page_subtitle: string;
  services_all_brands: string;
  services_book_service: string;
  services_features: string;
  // Booking
  booking_choose_date: string;
  booking_choose_time: string;
  booking_guest_note: string;
  booking_create_account: string;
  booking_success_title: string;
  booking_success_subtitle: string;
  booking_ref_number: string;
  booking_view_bookings: string;
  booking_track_booking: string;
  // Track
  track_status: string;
  track_technician: string;
  track_service: string;
  track_scheduled: string;
  track_address: string;
  track_not_found: string;
  track_contact_support: string;
  // MyBookings
  mybookings_title: string;
  mybookings_subtitle: string;
  mybookings_no_bookings: string;
  mybookings_book_first: string;
  mybookings_status_pending: string;
  mybookings_status_assigned: string;
  mybookings_status_on_way: string;
  mybookings_status_completed: string;
  mybookings_status_cancelled: string;
  mybookings_track: string;
  mybookings_view: string;
  // About
  about_title: string;
  about_subtitle: string;
  about_mission_title: string;
  about_mission_text: string;
  about_stat1: string;
  about_stat2: string;
  about_stat3: string;
  about_stat4: string;
  // Contact
  contact_title: string;
  contact_subtitle: string;
  contact_name: string;
  contact_email_label: string;
  contact_phone_label: string;
  contact_message: string;
  contact_send: string;
  contact_success: string;
  contact_hours_title: string;
  contact_hours_weekday: string;
  contact_hours_weekend: string;
  // Auth
  login_title: string;
  login_subtitle: string;
  login_email: string;
  login_password: string;
  login_submit: string;
  login_no_account: string;
  login_register_link: string;
  login_forgot: string;
  register_title: string;
  register_subtitle: string;
  register_name: string;
  register_email: string;
  register_phone: string;
  register_password: string;
  register_submit: string;
  register_have_account: string;
  register_login_link: string;
  // Footer
  footer_quick_links: string;
  footer_book_now: string;
  footer_track: string;
  footer_emergency: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    nav_home: "Home",
    nav_services: "Services",
    nav_technicians: "Find Technician",
    nav_book: "Book Now",
    nav_about: "About",
    nav_contact: "Contact",
    nav_login: "Login",
    nav_logout: "Logout",
    nav_get_started: "Get Started",
    nav_my_bookings: "My Bookings",
    nav_admin: "Admin",
    nav_tech_portal: "Tech Portal",
    hero_badge: "On-Demand AC Services",
    hero_title_1: "Your AC Fixed,",
    hero_title_2: "Fast & Reliable",
    hero_subtitle: "Professional AC repair, installation & maintenance with real-time technician tracking. Book in 60 seconds — get service today.",
    hero_book_cta: "Book a Service",
    hero_track_cta: "Track Booking",
    hero_customers: "Happy Customers",
    hero_technicians: "Expert Technicians",
    hero_rating: "Average Rating",
    hero_response: "Avg Response Time",
    services_title: "Our Services",
    services_subtitle: "Transparent pricing, no hidden charges. All services include a 30-day workmanship warranty.",
    services_book_now: "Book Now",
    services_view_all: "View All Services",
    services_starting: "Starting price",
    services_per_unit: "Per unit",
    services_per_year: "Per year",
    how_title: "How It Works",
    how_subtitle: "From booking to job done in 4 simple steps.",
    how_step1_title: "Book in 60 Seconds",
    how_step1_desc: "Select your service, pick a date & time, and enter your address.",
    how_step2_title: "Technician Assigned",
    how_step2_desc: "Our nearest verified technician is auto-assigned to your job.",
    how_step3_title: "Track in Real Time",
    how_step3_desc: "Get live updates — Assigned → On the Way → Completed.",
    how_step4_title: "Job Done & Paid",
    how_step4_desc: "Pay on delivery COD or online. Rate your experience.",
    trust_title: "Why Customers Trust ArcticAC",
    trust_verified: "Verified Technicians",
    trust_verified_desc: "Every technician is background-checked, trained, and carries a photo ID.",
    trust_same_day: "Same-Day Service",
    trust_same_day_desc: "We'll get your AC serviced the same day in most areas.",
    trust_tracking: "Real-Time Tracking",
    trust_tracking_desc: "Track every step — from assignment to arrival to job completion.",
    trust_warranty: "30-Day Warranty",
    trust_warranty_desc: "All repairs come with a 30-day workmanship warranty. We stand behind our work.",
    testimonials_title: "What Our Customers Say",
    testimonials_subtitle: "Real reviews from real customers.",
    faq_title: "Frequently Asked Questions",
    faq_subtitle: "Everything you need to know before booking.",
    faq_q1: "How quickly can a technician arrive?",
    faq_a1: "In most areas, we can dispatch a technician within 2–4 hours of booking. Same-day service is available for bookings made before 4 PM.",
    faq_q2: "What brands do you service?",
    faq_a2: "We service all major brands including Daikin, Voltas, LG, Samsung, Blue Star, Hitachi, Carrier, Panasonic, Whirlpool, and O General.",
    faq_q3: "Is there a service charge if the problem isn't fixed?",
    faq_a3: "A minimal diagnostic fee applies if the issue cannot be resolved. We'll inform you before any additional charges.",
    faq_q4: "How do I track my technician?",
    faq_a4: "After booking confirmation, you'll receive a tracking link. You can also track at arcticac.in/track using your booking reference number.",
    faq_q5: "What payment methods are accepted?",
    faq_a5: "We accept Cash on Delivery (COD) as default. Online payment via Razorpay (UPI, cards, net banking) is also available.",
    faq_q6: "Can I reschedule or cancel my booking?",
    faq_a6: "Yes, you can reschedule or cancel up to 2 hours before the scheduled time at no charge. See our Cancellation Policy for details.",
    cta_title: "Ready to Fix Your AC?",
    cta_subtitle: "Book now and get a verified technician at your door — same day, every day.",
    cta_book: "Book a Service",
    cta_call: "Call Us Now",
    booking_title: "Book a Service",
    booking_subtitle: "Get a certified technician at your door today.",
    booking_step1: "Service",
    booking_step2: "Schedule",
    booking_step3: "Details",
    booking_step4: "Payment",
    booking_select_service: "Select a Service",
    booking_continue: "Continue",
    booking_back: "Back",
    booking_confirm: "Confirm Booking",
    booking_name: "Full Name",
    booking_phone: "Phone Number",
    booking_address: "Service Address",
    booking_notes: "Additional Notes",
    booking_payment: "Payment Method",
    booking_cod: "Cash on Delivery",
    booking_online: "Pay Online",
    track_title: "Track Your Booking",
    track_subtitle: "Enter your booking reference to get live status updates.",
    track_enter_ref: "Enter booking reference number",
    track_search: "Track",
    track_assigned: "Assigned",
    track_on_way: "On the Way",
    track_completed: "Completed",
    footer_tagline: "Professional AC installation, repair, and maintenance services. Available 24/7 with real-time technician tracking.",
    footer_services: "Services",
    footer_company: "Company",
    footer_about: "About Us",
    footer_contact: "Contact",
    footer_terms: "Terms of Service",
    footer_privacy: "Privacy Policy",
    footer_cancellation: "Cancellation Policy",
    footer_rights: "All rights reserved.",
    common_loading: "Loading...",
    common_error: "Something went wrong. Please try again.",
    common_save: "Save",
    common_cancel: "Cancel",
    common_close: "Close",
    common_submit: "Submit",
    common_call_now: "Call Now",
    services_page_title: "Our AC Services",
    services_page_subtitle: "Professional AC services with transparent pricing and a 30-day workmanship warranty.",
    services_all_brands: "We service all major brands",
    services_book_service: "Book This Service",
    services_features: "What's Included",
    booking_choose_date: "Choose Date",
    booking_choose_time: "Choose Time Slot",
    booking_guest_note: "Booking as guest. Create an account to track your bookings.",
    booking_create_account: "Create Account",
    booking_success_title: "Booking Confirmed!",
    booking_success_subtitle: "Your technician will be assigned shortly. You'll receive updates via SMS.",
    booking_ref_number: "Booking Reference",
    booking_view_bookings: "View My Bookings",
    booking_track_booking: "Track This Booking",
    track_status: "Current Status",
    track_technician: "Your Technician",
    track_service: "Service",
    track_scheduled: "Scheduled For",
    track_address: "Service Address",
    track_not_found: "Booking not found. Please check your reference number.",
    track_contact_support: "Contact Support",
    mybookings_title: "My Bookings",
    mybookings_subtitle: "Track and manage all your service bookings.",
    mybookings_no_bookings: "No bookings yet",
    mybookings_book_first: "Book your first AC service today.",
    mybookings_status_pending: "Pending",
    mybookings_status_assigned: "Assigned",
    mybookings_status_on_way: "On the Way",
    mybookings_status_completed: "Completed",
    mybookings_status_cancelled: "Cancelled",
    mybookings_track: "Track",
    mybookings_view: "View Details",
    about_title: "About ArcticAC",
    about_subtitle: "We're on a mission to make AC service fast, transparent, and reliable for every Indian home.",
    about_mission_title: "Our Mission",
    about_mission_text: "To deliver professional, on-demand AC services with real-time tracking, verified technicians, and transparent pricing.",
    about_stat1: "Happy Customers",
    about_stat2: "Expert Technicians",
    about_stat3: "Cities Covered",
    about_stat4: "Avg Response Time",
    contact_title: "Contact Us",
    contact_subtitle: "Have a question or need help? We're here for you.",
    contact_name: "Your Name",
    contact_email_label: "Email Address",
    contact_phone_label: "Phone Number",
    contact_message: "Your Message",
    contact_send: "Send Message",
    contact_success: "Message sent! We'll get back to you within 24 hours.",
    contact_hours_title: "Working Hours",
    contact_hours_weekday: "Monday – Saturday: 8:00 AM – 8:00 PM",
    contact_hours_weekend: "Sunday: 9:00 AM – 5:00 PM",
    login_title: "Welcome Back",
    login_subtitle: "Sign in to manage your bookings.",
    login_email: "Email Address",
    login_password: "Password",
    login_submit: "Sign In",
    login_no_account: "Don't have an account?",
    login_register_link: "Register",
    login_forgot: "Forgot password?",
    register_title: "Create Account",
    register_subtitle: "Join ArcticAC for faster bookings and real-time tracking.",
    register_name: "Full Name",
    register_email: "Email Address",
    register_phone: "Phone Number",
    register_password: "Password",
    register_submit: "Create Account",
    register_have_account: "Already have an account?",
    register_login_link: "Sign In",
    footer_quick_links: "Quick Links",
    footer_book_now: "Book a Service",
    footer_track: "Track Booking",
    footer_emergency: "Emergency? Call us",
  },
  hi: {
    nav_home: "होम",
    nav_services: "सेवाएं",
    nav_technicians: "तकनीशियन खोजें",
    nav_book: "बुक करें",
    nav_about: "हमारे बारे में",
    nav_contact: "संपर्क",
    nav_login: "लॉगिन",
    nav_logout: "लॉगआउट",
    nav_get_started: "शुरू करें",
    nav_my_bookings: "मेरी बुकिंग",
    nav_admin: "एडमिन",
    nav_tech_portal: "टेक पोर्टल",
    hero_badge: "ऑन-डिमांड AC सेवाएं",
    hero_title_1: "आपका AC ठीक हो,",
    hero_title_2: "तेज़ और भरोसेमंद",
    hero_subtitle: "रियल-टाइम टेक्नीशियन ट्रैकिंग के साथ प्रोफेशनल AC मरम्मत, इंस्टॉलेशन और रखरखाव। 60 सेकंड में बुक करें — आज ही सेवा पाएं।",
    hero_book_cta: "सेवा बुक करें",
    hero_track_cta: "बुकिंग ट्रैक करें",
    hero_customers: "खुश ग्राहक",
    hero_technicians: "विशेषज्ञ टेक्नीशियन",
    hero_rating: "औसत रेटिंग",
    hero_response: "औसत प्रतिक्रिया समय",
    services_title: "हमारी सेवाएं",
    services_subtitle: "पारदर्शी मूल्य निर्धारण, कोई छुपे शुल्क नहीं। सभी सेवाओं में 30-दिन की वारंटी शामिल है।",
    services_book_now: "अभी बुक करें",
    services_view_all: "सभी सेवाएं देखें",
    services_starting: "शुरुआती मूल्य",
    services_per_unit: "प्रति यूनिट",
    services_per_year: "प्रति वर्ष",
    how_title: "यह कैसे काम करता है",
    how_subtitle: "बुकिंग से काम पूरा होने तक 4 आसान चरण।",
    how_step1_title: "60 सेकंड में बुक करें",
    how_step1_desc: "सेवा चुनें, तारीख और समय चुनें, और अपना पता दर्ज करें।",
    how_step2_title: "टेक्नीशियन असाइन",
    how_step2_desc: "हमारा निकटतम सत्यापित टेक्नीशियन आपकी नौकरी के लिए स्वतः असाइन होता है।",
    how_step3_title: "रियल-टाइम ट्रैकिंग",
    how_step3_desc: "लाइव अपडेट पाएं — असाइन → रास्ते में → पूर्ण।",
    how_step4_title: "काम पूरा और भुगतान",
    how_step4_desc: "डिलीवरी पर नकद या ऑनलाइन भुगतान करें। अपना अनुभव रेट करें।",
    trust_title: "ग्राहक ArcticAC पर भरोसा क्यों करते हैं",
    trust_verified: "सत्यापित टेक्नीशियन",
    trust_verified_desc: "हर टेक्नीशियन की पृष्ठभूमि जांच, प्रशिक्षण और फोटो ID होती है।",
    trust_same_day: "उसी दिन सेवा",
    trust_same_day_desc: "हम अधिकांश क्षेत्रों में उसी दिन आपका AC सर्विस करेंगे।",
    trust_tracking: "रियल-टाइम ट्रैकिंग",
    trust_tracking_desc: "हर कदम ट्रैक करें — असाइनमेंट से आगमन तक।",
    trust_warranty: "30-दिन की वारंटी",
    trust_warranty_desc: "सभी मरम्मत के साथ 30-दिन की वारंटी आती है।",
    testimonials_title: "हमारे ग्राहक क्या कहते हैं",
    testimonials_subtitle: "वास्तविक ग्राहकों की वास्तविक समीक्षाएं।",
    faq_title: "अक्सर पूछे जाने वाले प्रश्न",
    faq_subtitle: "बुकिंग से पहले जानने योग्य सब कुछ।",
    faq_q1: "टेक्नीशियन कितनी जल्दी आ सकता है?",
    faq_a1: "अधिकांश क्षेत्रों में, हम बुकिंग के 2-4 घंटे के भीतर टेक्नीशियन भेज सकते हैं।",
    faq_q2: "आप कौन से ब्रांड सर्विस करते हैं?",
    faq_a2: "हम Daikin, Voltas, LG, Samsung, Blue Star, Hitachi, Carrier, Panasonic, Whirlpool और O General सहित सभी प्रमुख ब्रांड सर्विस करते हैं।",
    faq_q3: "अगर समस्या ठीक नहीं हुई तो क्या शुल्क लगेगा?",
    faq_a3: "यदि समस्या हल नहीं हो सकती तो न्यूनतम डायग्नोस्टिक शुल्क लागू होता है।",
    faq_q4: "मैं अपने टेक्नीशियन को कैसे ट्रैक करूं?",
    faq_a4: "बुकिंग पुष्टि के बाद, आपको एक ट्रैकिंग लिंक मिलेगा।",
    faq_q5: "कौन से भुगतान तरीके स्वीकार किए जाते हैं?",
    faq_a5: "हम डिफ़ॉल्ट रूप से कैश ऑन डिलीवरी (COD) स्वीकार करते हैं। Razorpay के माध्यम से ऑनलाइन भुगतान भी उपलब्ध है।",
    faq_q6: "क्या मैं अपनी बुकिंग पुनर्निर्धारित या रद्द कर सकता हूं?",
    faq_a6: "हां, आप निर्धारित समय से 2 घंटे पहले तक बिना किसी शुल्क के पुनर्निर्धारित या रद्द कर सकते हैं।",
    cta_title: "अपना AC ठीक करने के लिए तैयार हैं?",
    cta_subtitle: "अभी बुक करें और उसी दिन अपने दरवाजे पर सत्यापित टेक्नीशियन पाएं।",
    cta_book: "सेवा बुक करें",
    cta_call: "अभी कॉल करें",
    booking_title: "सेवा बुक करें",
    booking_subtitle: "आज अपने दरवाजे पर एक प्रमाणित टेक्नीशियन पाएं।",
    booking_step1: "सेवा",
    booking_step2: "समय-सारणी",
    booking_step3: "विवरण",
    booking_step4: "भुगतान",
    booking_select_service: "सेवा चुनें",
    booking_continue: "जारी रखें",
    booking_back: "वापस",
    booking_confirm: "बुकिंग की पुष्टि करें",
    booking_name: "पूरा नाम",
    booking_phone: "फोन नंबर",
    booking_address: "सेवा पता",
    booking_notes: "अतिरिक्त नोट्स",
    booking_payment: "भुगतान विधि",
    booking_cod: "कैश ऑन डिलीवरी",
    booking_online: "ऑनलाइन भुगतान",
    track_title: "अपनी बुकिंग ट्रैक करें",
    track_subtitle: "लाइव स्टेटस अपडेट के लिए अपना बुकिंग रेफरेंस दर्ज करें।",
    track_enter_ref: "बुकिंग रेफरेंस नंबर दर्ज करें",
    track_search: "ट्रैक करें",
    track_assigned: "असाइन किया गया",
    track_on_way: "रास्ते में",
    track_completed: "पूर्ण",
    footer_tagline: "प्रोफेशनल AC इंस्टॉलेशन, मरम्मत और रखरखाव सेवाएं। रियल-टाइम ट्रैकिंग के साथ 24/7 उपलब्ध।",
    footer_services: "सेवाएं",
    footer_company: "कंपनी",
    footer_about: "हमारे बारे में",
    footer_contact: "संपर्क",
    footer_terms: "सेवा की शर्तें",
    footer_privacy: "गोपनीयता नीति",
    footer_cancellation: "रद्दीकरण नीति",
    footer_rights: "सर्वाधिकार सुरक्षित।",
    common_loading: "लोड हो रहा है...",
    common_error: "कुछ गलत हुआ। कृपया पुनः प्रयास करें।",
    common_save: "सहेजें",
    common_cancel: "रद्द करें",
    common_close: "बंद करें",
    common_submit: "सबमिट करें",
    common_call_now: "अभी कॉल करें",
    services_page_title: "हमारी AC सेवाएं",
    services_page_subtitle: "पारदर्शी मूल्य और 30-दिन की वारंटी के साथ प्रोफेशनल AC सेवाएं।",
    services_all_brands: "हम सभी प्रमुख ब्रांड सर्विस करते हैं",
    services_book_service: "यह सेवा बुक करें",
    services_features: "क्या शामिल है",
    booking_choose_date: "तारीख चुनें",
    booking_choose_time: "समय स्लॉट चुनें",
    booking_guest_note: "अतिथि के रूप में बुकिंग। ट्रैक करने के लिए खाता बनाएं।",
    booking_create_account: "खाता बनाएं",
    booking_success_title: "बुकिंग की पुष्टि हो गई!",
    booking_success_subtitle: "आपका टेक्नीशियन जल्द ही असाइन किया जाएगा।",
    booking_ref_number: "बुकिंग संदर्भ",
    booking_view_bookings: "मेरी बुकिंग देखें",
    booking_track_booking: "इस बुकिंग को ट्रैक करें",
    track_status: "वर्तमान स्थिति",
    track_technician: "आपका टेक्नीशियन",
    track_service: "सेवा",
    track_scheduled: "निर्धारित समय",
    track_address: "सेवा पता",
    track_not_found: "बुकिंग नहीं मिली। कृपया संदर्भ नंबर जांचें।",
    track_contact_support: "सहायता से संपर्क करें",
    mybookings_title: "मेरी बुकिंग",
    mybookings_subtitle: "अपनी सभी सेवा बुकिंग ट्रैक और प्रबंधित करें।",
    mybookings_no_bookings: "अभी तक कोई बुकिंग नहीं",
    mybookings_book_first: "आज ही अपनी पहली AC सेवा बुक करें।",
    mybookings_status_pending: "लंबित",
    mybookings_status_assigned: "असाइन किया गया",
    mybookings_status_on_way: "रास्ते में",
    mybookings_status_completed: "पूर्ण",
    mybookings_status_cancelled: "रद्द",
    mybookings_track: "ट्रैक करें",
    mybookings_view: "विवरण देखें",
    about_title: "ArcticAC के बारे में",
    about_subtitle: "हम हर भारतीय घर के लिए AC सेवा को तेज़, पारदर्शी और विश्वसनीय बनाने के मिशन पर हैं।",
    about_mission_title: "हमारा मिशन",
    about_mission_text: "रियल-टाइम ट्रैकिंग, सत्यापित टेक्नीशियन और पारदर्शी मूल्य के साथ प्रोफेशनल AC सेवाएं।",
    about_stat1: "खुश ग्राहक",
    about_stat2: "विशेषज्ञ टेक्नीशियन",
    about_stat3: "शहर कवर",
    about_stat4: "औसत प्रतिक्रिया समय",
    contact_title: "हमसे संपर्क करें",
    contact_subtitle: "कोई सवाल है या मदद चाहिए? हम आपके लिए यहाँ हैं।",
    contact_name: "आपका नाम",
    contact_email_label: "ईमेल पता",
    contact_phone_label: "फोन नंबर",
    contact_message: "आपका संदेश",
    contact_send: "संदेश भेजें",
    contact_success: "संदेश भेजा गया! हम 24 घंटे के भीतर संपर्क करेंगे।",
    contact_hours_title: "कार्य समय",
    contact_hours_weekday: "सोमवार – शनिवार: सुबह 8:00 – शाम 8:00",
    contact_hours_weekend: "रविवार: सुबह 9:00 – शाम 5:00",
    login_title: "वापस स्वागत है",
    login_subtitle: "अपनी बुकिंग प्रबंधित करने के लिए साइन इन करें।",
    login_email: "ईमेल पता",
    login_password: "पासवर्ड",
    login_submit: "साइन इन करें",
    login_no_account: "खाता नहीं है?",
    login_register_link: "रजिस्टर करें",
    login_forgot: "पासवर्ड भूल गए?",
    register_title: "खाता बनाएं",
    register_subtitle: "तेज़ बुकिंग और रियल-टाइम ट्रैकिंग के लिए ArcticAC से जुड़ें।",
    register_name: "पूरा नाम",
    register_email: "ईमेल पता",
    register_phone: "फोन नंबर",
    register_password: "पासवर्ड",
    register_submit: "खाता बनाएं",
    register_have_account: "पहले से खाता है?",
    register_login_link: "साइन इन करें",
    footer_quick_links: "त्वरित लिंक",
    footer_book_now: "सेवा बुक करें",
    footer_track: "बुकिंग ट्रैक करें",
    footer_emergency: "आपातकाल? हमें कॉल करें",
  },
  gu: {
    nav_home: "હોમ",
    nav_services: "સેવાઓ",
    nav_technicians: "ટેકનિશિયન શોધો",
    nav_book: "બુક કરો",
    nav_about: "અમારા વિશે",
    nav_contact: "સંપર્ક",
    nav_login: "લૉગિન",
    nav_logout: "લૉગઆઉટ",
    nav_get_started: "શરૂ કરો",
    nav_my_bookings: "મારી બુકિંગ",
    nav_admin: "એડમિન",
    nav_tech_portal: "ટેક પોર્ટલ",
    hero_badge: "ઓન-ડિમાન્ડ AC સેવાઓ",
    hero_title_1: "તમારો AC ઠીક થઈ જાય,",
    hero_title_2: "ઝડપી અને વિશ્વસનીય",
    hero_subtitle: "રિયલ-ટાઇમ ટેકનિશિયન ટ્રેકિંગ સાથે વ્યાવસાયિક AC રિપેર, ઇન્સ્ટોલેશન અને જાળવણી. 60 સેકન્ડમાં બુક કરો — આજે જ સેવા મેળવો.",
    hero_book_cta: "સેવા બુક કરો",
    hero_track_cta: "બુકિંગ ટ્રૅક કરો",
    hero_customers: "ખુશ ગ્રાહકો",
    hero_technicians: "નિષ્ણાત ટેકનિશિયન",
    hero_rating: "સરેરાશ રેટિંગ",
    hero_response: "સરેરાશ પ્રતિભાવ સમય",
    services_title: "અમારી સેવાઓ",
    services_subtitle: "પારદર્શક ભાવ, કોઈ છુપા શુલ્ક નહીં. તમામ સેવાઓ 30-દિવસની વોરંટી સાથે આવે છે.",
    services_book_now: "હવે બુક કરો",
    services_view_all: "તમામ સેવાઓ જુઓ",
    services_starting: "શરૂઆતી ભાવ",
    services_per_unit: "પ્રતિ યુનિટ",
    services_per_year: "પ્રતિ વર્ષ",
    how_title: "તે કેવી રીતે કામ કરે છે",
    how_subtitle: "બુકિંગથી કામ પૂર્ણ સુધી 4 સરળ પગલાં.",
    how_step1_title: "60 સેકન્ડમાં બુક કરો",
    how_step1_desc: "સેવા પસંદ કરો, તારીખ અને સમય પસંદ કરો, અને તમારું સરનામું દાખલ કરો.",
    how_step2_title: "ટેકનિશિયન સોંપાયો",
    how_step2_desc: "અમારો સૌથી નજીકનો ચકાસાયેલ ટેકનિશિયન આપોઆપ તમારી નોકરી માટે સોંપાય છે.",
    how_step3_title: "રિયલ-ટાઇમ ટ્રેકિંગ",
    how_step3_desc: "લાઇવ અપડેટ મેળવો — સોંપ્યો → રસ્તામાં → પૂર્ણ.",
    how_step4_title: "કામ પૂર્ણ અને ચૂકવણી",
    how_step4_desc: "ડિલિવરી પર રોકડ અથવા ઓનલાઇન ચૂકવો. તમારો અનુભવ રેટ કરો.",
    trust_title: "ગ્રાહકો ArcticAC પર ભરોસો કેમ કરે છે",
    trust_verified: "ચકાસાયેલ ટેકનિશિયન",
    trust_verified_desc: "દરેક ટેકનિશિયનની પૃષ્ઠભૂમિ તપાસ, તાલીમ અને ફોટો ID હોય છે.",
    trust_same_day: "તે જ દિવસે સેવા",
    trust_same_day_desc: "અમે મોટાભાગના વિસ્તારોમાં તે જ દિવસે AC સર્વિસ કરીશું.",
    trust_tracking: "રિયલ-ટાઇમ ટ્રેકિંગ",
    trust_tracking_desc: "દરેક પગલું ટ્રૅક કરો — સોંપણીથી આગમન સુધી.",
    trust_warranty: "30-દિવસની વોરંટી",
    trust_warranty_desc: "તમામ રિપેર સાથે 30-દિવસની વોરંટી આવે છે.",
    testimonials_title: "અમારા ગ્રાહકો શું કહે છે",
    testimonials_subtitle: "વાસ્તવિક ગ્રાહકોની વાસ્તવિક સમીક્ષાઓ.",
    faq_title: "વારંવાર પૂછાતા પ્રશ્નો",
    faq_subtitle: "બુકિંગ પહેલા જાણવા જેવી બધી બાબતો.",
    faq_q1: "ટેકનિશિયન કેટલી ઝડપથી આવી શકે?",
    faq_a1: "મોટાભાગના વિસ્તારોમાં, અમે બુકિંગના 2-4 કલાકની અંદર ટેકનિશિયન મોકલી શકીએ છીએ.",
    faq_q2: "તમે કયા બ્રાન્ડ સર્વિસ કરો છો?",
    faq_a2: "અમે Daikin, Voltas, LG, Samsung, Blue Star, Hitachi, Carrier, Panasonic, Whirlpool અને O General સહિત તમામ મુખ્ય બ્રાન્ડ સર્વિસ કરીએ છીએ.",
    faq_q3: "જો સમસ્યા ઠીક ન થઈ તો શું ચાર્જ લાગશે?",
    faq_a3: "જો સમસ્યા ઉકેલી ન શકાય તો ન્યૂનતમ ડાયગ્નોસ્ટિક ફી લાગુ પડે છે.",
    faq_q4: "હું મારા ટેકનિશિયનને કેવી રીતે ટ્રૅક કરું?",
    faq_a4: "બુકિંગ પુષ્ટિ પછી, તમને ટ્રેકિંગ લિંક મળશે.",
    faq_q5: "કઈ ચૂકવણી પદ્ધતિઓ સ્વીકારવામાં આવે છે?",
    faq_a5: "અમે ડિફૉલ્ટ રૂપે કૅશ ઓન ડિલિવરી (COD) સ્વીકારીએ છીએ. Razorpay દ્વારા ઓનલાઇન ચૂકવણી પણ ઉપલબ્ધ છે.",
    faq_q6: "શું હું મારી બુકિંગ ફરીથી શેડ્યૂલ અથવા રદ કરી શકું?",
    faq_a6: "હા, તમે નિર્ધારિત સમયના 2 કલાક પહેલા સુધી કોઈ ચાર્જ વિના ફરીથી શેડ્યૂલ અથવા રદ કરી શકો છો.",
    cta_title: "તમારો AC ઠીક કરવા તૈયાર છો?",
    cta_subtitle: "હવે બુક કરો અને તે જ દિવસે તમારા દ્વારે ચકાસાયેલ ટેકનિશિયન મેળવો.",
    cta_book: "સેવા બુક કરો",
    cta_call: "હવે ફોન કરો",
    booking_title: "સેવા બુક કરો",
    booking_subtitle: "આજે તમારા દ્વારે પ્રમાણિત ટેકનિશિયન મેળવો.",
    booking_step1: "સેવા",
    booking_step2: "સમયપત્રક",
    booking_step3: "વિગતો",
    booking_step4: "ચૂકવણી",
    booking_select_service: "સેવા પસંદ કરો",
    booking_continue: "ચાલુ રાખો",
    booking_back: "પાછળ",
    booking_confirm: "બુકિંગ કન્ફર્મ કરો",
    booking_name: "પૂરું નામ",
    booking_phone: "ફોન નંબર",
    booking_address: "સેવા સરનામું",
    booking_notes: "વધારાની નોંધ",
    booking_payment: "ચૂકવણી પદ્ધતિ",
    booking_cod: "કૅશ ઓન ડિલિવરી",
    booking_online: "ઓનલાઇન ચૂકવો",
    track_title: "તમારી બુકિંગ ટ્રૅક કરો",
    track_subtitle: "લાઇવ સ્ટેટસ અપડેટ માટે તમારો બુકિંગ રેફરન્સ દાખલ કરો.",
    track_enter_ref: "બુકિંગ રેફરન્સ નંબર દાખલ કરો",
    track_search: "ટ્રૅક કરો",
    track_assigned: "સોંપ્યો",
    track_on_way: "રસ્તામાં",
    track_completed: "પૂર્ણ",
    footer_tagline: "વ્યાવસાયિક AC ઇન્સ્ટોલેશન, રિપેર અને જાળવણી સેવાઓ. રિયલ-ટાઇમ ટ્રેકિંગ સાથે 24/7 ઉપલબ્ધ.",
    footer_services: "સેવાઓ",
    footer_company: "કંપની",
    footer_about: "અમારા વિશે",
    footer_contact: "સંપર્ક",
    footer_terms: "સેવાની શરતો",
    footer_privacy: "ગોપનીયતા નીતિ",
    footer_cancellation: "રદ્દ નીતિ",
    footer_rights: "સર્વ અધિકાર સુરક્ષિત.",
    common_loading: "લોડ થઈ રહ્યું છે...",
    common_error: "કંઈક ખોટું થયું. કૃપા કરીને ફરી પ્રયાસ કરો.",
    common_save: "સાચવો",
    common_cancel: "રદ કરો",
    common_close: "બંધ કરો",
    common_submit: "સબમિટ કરો",
    common_call_now: "હવે ફોન કરો",
    services_page_title: "અમારી AC સેવાઓ",
    services_page_subtitle: "પારદર્શક ભાવ અને 30-દિવસની વોરંટી સાથે વ્યાવસાયિક AC સેવાઓ.",
    services_all_brands: "અમે તમામ મુખ્ય બ્રાન્ડ સર્વિસ કરીએ છીએ",
    services_book_service: "આ સેવા બુક કરો",
    services_features: "શું સામેલ છે",
    booking_choose_date: "તારીખ પસંદ કરો",
    booking_choose_time: "સમય સ્લૉટ પસંદ કરો",
    booking_guest_note: "અતિથિ તરીકે બુકિંગ. ટ્રૅક કરવા ખાતું બનાવો.",
    booking_create_account: "ખાતું બનાવો",
    booking_success_title: "બુકિંગ કન્ફર્મ થઈ!",
    booking_success_subtitle: "ટેકનિશિયન ટૂંક સમયમાં સોંપવામાં આવશે.",
    booking_ref_number: "બુકિંગ સંદર્ભ",
    booking_view_bookings: "મારી બુકિંગ જુઓ",
    booking_track_booking: "આ બુકિંગ ટ્રૅક કરો",
    track_status: "વર્તમાન સ્થિતિ",
    track_technician: "તમારો ટેકનિશિયન",
    track_service: "સેવા",
    track_scheduled: "નિર્ધારિત સમય",
    track_address: "સેવા સરનામું",
    track_not_found: "બુકિંગ મળ્યું નહીં. સંદર્ભ નંબર તપાસો.",
    track_contact_support: "સહાય સંપર્ક કરો",
    mybookings_title: "મારી બુકિંગ",
    mybookings_subtitle: "તમારી તમામ સેવા બુકિંગ ટ્રૅક અને મેનેજ કરો.",
    mybookings_no_bookings: "હજુ કોઈ બુકિંગ નહીં",
    mybookings_book_first: "આજે પ્રથમ AC સેવા બુક કરો.",
    mybookings_status_pending: "બાકી",
    mybookings_status_assigned: "સોંપ્યો",
    mybookings_status_on_way: "રસ્તામાં",
    mybookings_status_completed: "પૂર્ણ",
    mybookings_status_cancelled: "રદ",
    mybookings_track: "ટ્રૅક કરો",
    mybookings_view: "વિગત જુઓ",
    about_title: "ArcticAC વિશે",
    about_subtitle: "અમે દરેક ભારતીય ઘર માટે AC સેવાને ઝડપી, પારદર્શક અને વિશ્વસનીય બનાવવાના મિશન પર છીએ.",
    about_mission_title: "અમારું મિશન",
    about_mission_text: "રિયલ-ટાઇમ ટ્રેકિંગ, ચકાસાયેલ ટેકનિશિયન અને પારદર્શક ભાવ સાથે AC સેવાઓ.",
    about_stat1: "ખુશ ગ્રાહકો",
    about_stat2: "નિષ્ણાત ટેકનિશિયન",
    about_stat3: "શહેરો આવરી",
    about_stat4: "સરેરાશ પ્રતિભાવ સમય",
    contact_title: "અમારો સંપર્ક કરો",
    contact_subtitle: "કોઈ પ્રશ્ન છે? અમે અહીં છીએ.",
    contact_name: "તમારું નામ",
    contact_email_label: "ઈ-મેઈલ",
    contact_phone_label: "ફોન નંબર",
    contact_message: "તમારો સંદેશ",
    contact_send: "સંદેશ મોકલો",
    contact_success: "સંદેશ મોકલ્યો! 24 કલાકમાં સંપર્ક કરીશું.",
    contact_hours_title: "કામના કલાકો",
    contact_hours_weekday: "સોમ – શનિ: સવારે 8:00 – સાંજે 8:00",
    contact_hours_weekend: "રવિ: સવારે 9:00 – સાંજે 5:00",
    login_title: "પાછા સ્વાગત છે",
    login_subtitle: "બુકિંગ મેનેજ કરવા સાઇન ઇન કરો.",
    login_email: "ઈ-મેઈલ",
    login_password: "પાસવર્ડ",
    login_submit: "સાઇન ઇન કરો",
    login_no_account: "ખાતું નથી?",
    login_register_link: "નોંધણી કરો",
    login_forgot: "પાસવર્ડ ભૂલ્યા?",
    register_title: "ખાતું બનાવો",
    register_subtitle: "ઝડપી બુકિંગ માટે ArcticAC સાથે જોડાઓ.",
    register_name: "પૂરું નામ",
    register_email: "ઈ-મેઈલ",
    register_phone: "ફોન નંબર",
    register_password: "પાસવર્ડ",
    register_submit: "ખાતું બનાવો",
    register_have_account: "પહેલેથી ખાતું છે?",
    register_login_link: "સાઇન ઇન કરો",
    footer_quick_links: "ઝડપી લિંક",
    footer_book_now: "સેવા બુક કરો",
    footer_track: "બુકિંગ ટ્રૅક કરો",
    footer_emergency: "કટોકટી? અમને ફોન કરો",
  },
};

export function getTranslation(lang: Language): Translations {
  return translations[lang] ?? translations.en;
}
