export const INITIAL_TICKETS = [
  {
    id: "TKT-1021",
    userId: "USR-8821",
    userName: "Sarah Jenkins",
    userEmail: "sarah.j@enterprise.io",
    title: "Cloud Database Latency Spike during peak hours",
    description:
      "We observed a severe spike in query latency exceeding 4,500ms on the US-East replica between 09:00 and 10:30 UTC. Read replicas appear throttled.",
    status: "Processing",
    createdAt: "Today, 10:45 AM",
    attachment: null,
  },
  {
    id: "TKT-1022",
    userId: "USR-4309",
    userName: "David Kim",
    userEmail: "david.k@fintech.co",
    title: "Unable to export monthly analytics report to CSV",
    description:
      "Exporting large reports (over 50,000 records) results in a 504 Gateway Timeout error. Smaller exports under 5,000 records work properly.",
    status: "Pending",
    createdAt: "Today, 11:15 AM",
    attachment: null,
  },
  {
    id: "TKT-1023",
    userId: "USR-9122",
    userName: "Marcus Vance",
    userEmail: "m.vance@securitycorp.net",
    title: "SSO SAML redirect loop on Okta integration provider",
    description:
      "Team members attempting to sign in via Okta SAML 2.0 are getting stuck in an infinite redirect loop back to login. Session assertion claims need verification.",
    status: "Processing",
    createdAt: "Yesterday, 04:20 PM",
    attachment: null,
  },
  {
    id: "TKT-1024",
    userId: "USR-4309",
    userName: "David Kim",
    userEmail: "david.k@fintech.co",
    title: "Analytics export to CSV fails with 504 Gateway error",
    description:
      "Another report export attempt failed with the same 504 gateway timeout. Seems related to CSV generation size limits.",
    status: "Pending",
    createdAt: "Today, 01:20 PM",
    attachment: null,
  },
  {
    id: "TKT-1025",
    userId: "USR-5512",
    userName: "Rachel Zhang",
    userEmail: "rachel.z@globaltrade.net",
    title: "CSV export times out on quarterly sales summary",
    description:
      "Attempting to download sales summary report in CSV format triggers timeout after 60 seconds.",
    status: "Pending",
    createdAt: "Today, 02:05 PM",
    attachment: null,
  },
  {
    id: "TKT-1019",
    userId: "USR-7014",
    userName: "Elena Rostova",
    userEmail: "elena@devops-ops.io",
    title: "SSL Certificate renewal failed on staging domain",
    description:
      "Automated renewal script failed due to DNS challenge verification timeout. Staging cluster was temporarily showing certificate warnings.",
    status: "Resolved",
    createdAt: "Yesterday, 02:10 PM",
    attachment: null,
  },
  {
    id: "TKT-1018",
    userId: "USR-3291",
    userName: "Chris Evans",
    userEmail: "chris.e@designhub.org",
    title: "Feature request: Mobile viewport system theme auto-detection override",
    description:
      "Requested manual toggle for system theme override on mobile screens without checking OS preferences. Evaluated and closed in favor of unified theme engine.",
    status: "Reject",
    createdAt: "2026-09-06",
    attachment: null,
  },
  {
    id: "TKT-1015",
    userId: "USR-6542",
    userName: "Amara Okafor",
    userEmail: "amara@globalpay.com",
    title: "Payment webhook signature verification mismatch on sandbox",
    description:
      "Stripe webhook signature secret was rotated in sandbox environment but not updated in service secrets. Secret was synchronized and tested.",
    status: "Resolved",
    createdAt: "2026-09-05",
    attachment: null,
  },
];

export const INITIAL_FAQS = [
  {
    id: "faq-1",
    question: "How long does it typically take to resolve a support ticket?",
    answer:
      "Most standard tickets are reviewed within 2 to 4 hours. Critical issues receive higher priority, with a target resolution time of 24 hours.",
    category: "General",
  },
  {
    id: "faq-2",
    question: "Can I provide screenshots or additional files after submitting?",
    answer:
      "Yes. You can provide additional screenshots, logs, or other relevant files if our support team requests more information during the ticket review.",
    category: "Attachments",
  },
  {
    id: "faq-3",
    question: "What image formats and file sizes are supported?",
    answer:
      "PNG, JPG, and JPEG files are supported. Attachments can be up to 10MB each and should clearly show the issue whenever possible.",
    category: "Attachments",
  },
  {
    id: "faq-4",
    question: "How do I track the current progress of my ticket?",
    answer:
      "Use your assigned Ticket ID on the Ticket Status page. You can see whether your ticket is Pending, Processing, Resolved, or requires further action.",
    category: "Tracking",
  },
  {
    id: "faq-5",
    question: "What happens if my ticket is marked as rejected?",
    answer:
      "A ticket may be rejected if it is a duplicate, missing important information, or falls outside the scope of the support system. The reason will be provided so you can take the appropriate next step.",
    category: "Status",
  },
  {
    id: "faq-6",
    question: "How do I create a new support ticket?",
    answer:
      "Select New Ticket from the navigation menu, describe your issue, provide the relevant details, and submit the form. You will receive a Ticket ID after submission.",
    category: "Submission",
  },
];
