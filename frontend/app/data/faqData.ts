export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: "general" | "users" | "companies" | "payments" | "emergency";
  tags: string[];
}

export const faqData: FaqItem[] = [
  {
    id: "gen1",
    question: "How does PlumberFinder vet its professionals?",
    answer:
      "Every plumber listed on PlumberFinder undergoes a rigorous 5-step architectural screening process. This includes license verification, background checks, master technician interviews, and on-site performance reviews. We only partner with the top 3% of trade professionals.",
    category: "general",
    tags: ["verification", "screening", "trust"],
  },
  {
    id: "gen2",
    question: "Are emergency services available 24/7?",
    answer:
      "Yes, our network includes emergency plumbers available 24 hours a day, 7 days a week, including holidays. You can request emergency service directly through the platform and expect a response within 30 minutes.",
    category: "emergency",
    tags: ["emergency", "24/7", "response"],
  },
  {
    id: "gen3",
    question: "Can I schedule a consultation for large-scale architectural projects?",
    answer:
      "Absolutely. PlumberFinder partners with licensed master plumbers who specialize in commercial and large residential projects. You can request a consultation for new construction, renovations, or system design through the 'Projects' section.",
    category: "general",
    tags: ["consultation", "projects", "commercial"],
  },
  {
    id: "co1",
    question: "How do I list my plumbing firm on the directory?",
    answer:
      "To list your company, click 'Sign Up' and select 'I'm a Plumbing Company'. Complete the verification process, which includes providing your license, insurance, and references. Once approved, your profile will appear in search results.",
    category: "companies",
    tags: ["listing", "signup", "verification"],
  },
  {
    id: "co2",
    question: "What are the benefits of the Elite Partnership?",
    answer:
      "Elite Partners receive priority placement in search results, dedicated account manager, waived booking fees for 6 months, and access to premium leads. Contact our partnerships team for custom pricing.",
    category: "companies",
    tags: ["elite", "partnership", "benefits"],
  },
  {
    id: "co3",
    question: "How are leads delivered?",
    answer:
      "Leads are delivered in real‑time via email, SMS, and your dashboard. You can set your service radius and availability, and we'll match you with relevant customer requests.",
    category: "companies",
    tags: ["leads", "notifications", "matching"],
  },
  {
    id: "pay1",
    question: "Is there a commission fee on bookings?",
    answer:
      "For standard listings, we charge a 10% service fee on completed bookings. Elite Partners enjoy reduced fees (5%) and no commission for the first 3 months. There are no hidden charges – you see the exact amount before accepting a job.",
    category: "payments",
    tags: ["commission", "fees", "booking"],
  },
  {
    id: "pay2",
    question: "Can I cancel my monthly subscription anytime?",
    answer:
      "Yes, all subscription plans (including Premier Plan) are month‑to‑month. You can cancel from your billing settings with one click – no questions asked, no early termination fees.",
    category: "payments",
    tags: ["subscription", "cancellation", "premier"],
  },
  {
    id: "pay3",
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers. Customers can pay securely through the platform, and companies receive payouts within 2‑3 business days.",
    category: "payments",
    tags: ["payment", "methods", "payouts"],
  },
  {
    id: "emer1",
    question: "How fast can I get an emergency plumber?",
    answer:
      "Emergency requests are prioritized. In most urban areas, a plumber arrives within 60–90 minutes. You can track the technician's ETA in real‑time after booking.",
    category: "emergency",
    tags: ["emergency", "response", "ETA"],
  },
  {
    id: "emer2",
    question: "Is there an extra charge for after‑hours calls?",
    answer:
      "Emergency service includes a standard dispatch fee ($99). The hourly rate may be higher for nights/weekends, but the total is always shown before you confirm the booking – no surprises.",
    category: "emergency",
    tags: ["emergency", "pricing", "after-hours"],
  },
  {
    id: "success1",
    question: "How can I share my success story with PlumberFinder?",
    answer: "We love hearing from our community! You can submit your story via the contact form or email stories@plumberfinder.com. Selected stories may be featured on our blog and social media.",
    category: "general",
    tags: ["success", "story", "testimonial"],
  },
  {
    id: "success2",
    question: "Does PlumberFinder have case studies for large projects?",
    answer: "Yes, we publish detailed case studies of commercial and residential projects. Visit our Resources section or request a copy from our team.",
    category: "general",
    tags: ["case study", "commercial", "project"],
  },
];

export const tabs = [
  { id: "all", label: "All", filter: null },
  { id: "users", label: "For Users", filter: "users" },
  { id: "companies", label: "For Companies", filter: "companies" },
  { id: "payments", label: "Payments", filter: "payments" },
  { id: "emergency", label: "Emergency", filter: "emergency" },
];