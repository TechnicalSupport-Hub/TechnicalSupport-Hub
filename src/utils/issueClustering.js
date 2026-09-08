/**
 * Utility to cluster tickets by issue similarity and compute frequency across unique users.
 * This empowers Admins to identify recurring customer problems and convert them directly into FAQs.
 */

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'in', 'on', 'at', 'to', 'for', 'with', 'from',
  'by', 'about', 'is', 'was', 'are', 'were', 'be', 'been', 'being', 'have', 'has',
  'had', 'do', 'does', 'did', 'not', 'no', 'of', 'during', 'when', 'my', 'we',
  'our', 'user', 'users', 'issue', 'problem', 'unable', 'failed', 'failing'
]);

function extractKeywords(text = '') {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word));
}

export function clusterTicketsByIssue(tickets = []) {
  if (!tickets || tickets.length === 0) return [];

  const clusters = [];

  tickets.forEach((ticket) => {
    const title = ticket.title || '';
    const desc = ticket.description || '';
    const words = extractKeywords(`${title} ${desc}`);
    const userId = ticket.userId || ticket.userEmail || 'anonymous';

    let matchedCluster = null;

    // Check if this ticket shares significant keywords with an existing cluster
    for (const cluster of clusters) {
      const intersection = words.filter((w) => cluster.keywords.has(w));
      // If 2 or more meaningful keywords match or >35% overlap
      if (
        intersection.length >= 2 ||
        (words.length > 0 && intersection.length / Math.min(words.length, cluster.keywords.size) >= 0.4)
      ) {
        matchedCluster = cluster;
        break;
      }
    }

    if (matchedCluster) {
      matchedCluster.tickets.push(ticket);
      matchedCluster.uniqueUsers.add(userId);
      words.forEach((w) => matchedCluster.keywords.add(w));
    } else {
      clusters.push({
        id: `cluster-${ticket.id}`,
        title: title,
        keywords: new Set(words),
        tickets: [ticket],
        uniqueUsers: new Set([userId]),
        sampleDescription: desc,
      });
    }
  });

  // Format and sort clusters by unique user impact descending
  return clusters
    .map((c) => ({
      id: c.id,
      title: c.title,
      ticketCount: c.tickets.length,
      uniqueUserCount: c.uniqueUsers.size,
      tickets: c.tickets,
      suggestedQuestion: c.title.endsWith('?')
        ? c.title
        : `How to resolve ${c.title.toLowerCase()}?`,
      suggestedAnswer:
        c.sampleDescription ||
        'Our technical team has analyzed this recurring issue. Please follow standard troubleshooting procedures or verify environment configuration.',
    }))
    .sort((a, b) => b.uniqueUserCount - a.uniqueUserCount || b.ticketCount - a.ticketCount);
}
