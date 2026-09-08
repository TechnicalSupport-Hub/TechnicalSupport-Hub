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
