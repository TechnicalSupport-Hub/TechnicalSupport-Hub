/**
 * Simple, fundamental utility to group tickets by common issue themes
 * and calculate the number of tickets and unique users affected.
 */

// Common support problem topics to check against
const COMMON_TOPICS = [
  { key: 'export', title: 'Analytics & CSV Export Timeouts' },
  { key: 'database', title: 'Database Replica Latency & Query Spikes' },
  { key: 'sso', title: 'SSO & Okta Authentication Loops' },
  { key: 'ssl', title: 'SSL Certificate Renewal Failures' },
  { key: 'payment', title: 'Payment & Webhook Signature Mismatches' },
  { key: 'theme', title: 'Mobile Viewport System Theme Overrides' },
];

export function clusterTicketsByIssue(tickets = []) {
  if (!tickets || tickets.length === 0) return [];

  const clusters = [];
  const processedTicketIds = new Set();

  // 1. Group tickets matching known recurring topics
  COMMON_TOPICS.forEach((topic) => {
    const matchingTickets = tickets.filter((ticket) => {
      const text = `${ticket.title} ${ticket.description}`.toLowerCase();
      return text.includes(topic.key);
    });

    if (matchingTickets.length > 0) {
      // Find unique users in this group
      const uniqueUsers = new Set(matchingTickets.map((t) => t.userId || t.userEmail));

      matchingTickets.forEach((t) => processedTicketIds.add(t.id));

      clusters.push({
        id: `topic-${topic.key}`,
        title: topic.title,
        ticketCount: matchingTickets.length,
        uniqueUserCount: uniqueUsers.size,
        tickets: matchingTickets,
        suggestedQuestion: `How do I resolve ${topic.title.toLowerCase()}?`,
        suggestedAnswer: matchingTickets[0]?.description || 'Follow standard resolution steps.',
      });
    }
  });

  // 2. Add any remaining tickets that didn't match the predefined topics
  const remainingTickets = tickets.filter((t) => !processedTicketIds.has(t.id));
  if (remainingTickets.length > 0) {
    const uniqueUsers = new Set(remainingTickets.map((t) => t.userId || t.userEmail));
    clusters.push({
      id: 'topic-other',
      title: 'General Inquiries & Other Reports',
      ticketCount: remainingTickets.length,
      uniqueUserCount: uniqueUsers.size,
      tickets: remainingTickets,
      suggestedQuestion: 'How to handle general technical inquiries?',
      suggestedAnswer: 'Please review general support guidelines.',
    });
  }

  // Sort by highest unique users first
  return clusters.sort((a, b) => b.uniqueUserCount - a.uniqueUserCount);
}
