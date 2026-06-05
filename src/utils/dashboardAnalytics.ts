import { DashboardAnalytics } from "@/types/DashboardAnalytics";
import { DriveSession } from "@/types/DriveSession";

export const calculateAnalytics = (
  sessions: DriveSession[],
): DashboardAnalytics => {
  if (sessions.length === 0) {
    return {
      averageScore: 0,
      bestScore: 0,
      worstScore: 0,

      totalDrives: 0,
      totalEvents: 0,
      totalTime: 0,

      mostCommonEvent: "None",
    };
  }

  const scores = sessions.map((session) => session.score);

  const averageScore =
    scores.reduce((sum, score) => sum + score, 0) / scores.length;

  const bestScore = Math.max(...scores);

  const worstScore = Math.min(...scores);

  const totalEvents = sessions.reduce(
    (sum, session) => sum + session.events.length,
    0,
  );

  const totalTime = sessions.reduce(
    (sum, session) => sum + session.duration,
    0,
  );

  const eventCounts: Record<string, number> = {};

  sessions.forEach((session) => {
    session.events.forEach((event) => {
      eventCounts[event] = (eventCounts[event] || 0) + 1;
    });
  });

  let mostCommonEvent = "None";
  let highestCount = 0;

  Object.entries(eventCounts).forEach(([event, count]) => {
    if (count > highestCount) {
      highestCount = count;
      mostCommonEvent = event;
    }
  });

  return {
    averageScore: Number(averageScore.toFixed(1)),

    bestScore,
    worstScore,

    totalDrives: sessions.length,

    totalEvents,

    totalTime,

    mostCommonEvent,
  };
};
