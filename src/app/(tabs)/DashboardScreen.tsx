import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { getSessions } from "@/storage/sessionStorage";

import { DashboardAnalytics } from "@/types/DashboardAnalytics";

import { calculateAnalytics } from "@/utils/dashboardAnalytics";
import { getDriverRating } from "@/utils/driverRating";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DashboardScreen() {
  const [analytics, setAnalytics] = useState<DashboardAnalytics>({
    averageScore: 0,
    bestScore: 0,
    worstScore: 0,

    totalDrives: 0,
    totalEvents: 0,
    totalTime: 0,

    mostCommonEvent: "None",
  });

  const loadAnalytics = async () => {
    const sessions = await getSessions();

    const data = calculateAnalytics(sessions);

    setAnalytics(data);
  };

  useFocusEffect(
    useCallback(() => {
      loadAnalytics();
    }, []),
  );

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);

    const minutes = Math.floor((seconds % 3600) / 60);

    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }

    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }

    return `${remainingSeconds}s`;
  };

  if (analytics.totalDrives === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>SafeDrive Dashboard</Text>

        <View style={styles.card}>
          <Text style={styles.emptyText}>No driving data available yet.</Text>

          <Text style={styles.emptyText}>
            Complete your first drive to see analytics.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Drive</Text>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <View style={styles.scoreCard}>
          <Text style={styles.cardLabel}>Average Score</Text>

          <Text style={styles.bigScore}>{analytics.averageScore}</Text>

          <Text style={styles.rating}>
            {getDriverRating(analytics.averageScore)}
          </Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.smallCard}>
            <Text style={styles.smallValue}>{analytics.totalDrives}</Text>

            <Text style={styles.smallLabel}>Drives</Text>
          </View>

          <View style={styles.smallCard}>
            <Text style={styles.smallValue}>{analytics.bestScore}</Text>

            <Text style={styles.smallLabel}>Best</Text>
          </View>

          <View style={styles.smallCard}>
            <Text style={styles.smallValue}>{analytics.worstScore}</Text>

            <Text style={styles.smallLabel}>Worst</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Driving Activity</Text>

          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Total Drives</Text>

            <Text style={styles.metricValue}>{analytics.totalDrives}</Text>
          </View>

          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Total Events</Text>

            <Text style={styles.metricValue}>{analytics.totalEvents}</Text>
          </View>

          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Driving Time</Text>

            <Text style={styles.metricValue}>
              {formatDuration(analytics.totalTime)}
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Insights</Text>

          <Text style={styles.insightTitle}>Driver Rating</Text>

          <Text style={styles.insightValue}>
            {getDriverRating(analytics.averageScore)}
          </Text>

          <View style={styles.divider} />

          <Text style={styles.insightTitle}>Most Common Event</Text>

          <Text style={styles.insightValue}>{analytics.mostCommonEvent}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F1110",
  },

  content: {
    padding: 16,
    paddingBottom: 40,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "700",
  },

  subtitle: {
    color: "#BBBBBB",
    marginTop: 4,
    marginBottom: 24,
  },

  scoreCard: {
    backgroundColor: "#1A1C1A",
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
  },

  cardLabel: {
    color: "#CCCCCC",
    fontSize: 16,
  },

  bigScore: {
    color: "#F2C8B2",
    fontSize: 54,
    fontWeight: "700",
    marginTop: 10,
  },

  rating: {
    color: "#F2C8B2",
    fontSize: 18,
    marginTop: 6,
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  smallCard: {
    flex: 1,
    backgroundColor: "#1A1C1A",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 4,
  },

  smallValue: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
  },

  smallLabel: {
    color: "#AAAAAA",
    marginTop: 4,
  },

  card: {
    backgroundColor: "#1A1C1A",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
  },

  metricRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  metricLabel: {
    color: "#BBBBBB",
    fontSize: 16,
  },

  metricValue: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },

  insightTitle: {
    color: "#BBBBBB",
    fontSize: 14,
  },

  insightValue: {
    color: "#F2C8B2",
    fontSize: 24,
    fontWeight: "700",
    marginTop: 6,
  },

  divider: {
    height: 1,
    backgroundColor: "#333",
    marginVertical: 18,
  },

  emptyText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 16,
  },
});
