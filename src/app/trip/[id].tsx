import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useLocalSearchParams } from "expo-router";

import { getSessions } from "@/storage/sessionStorage";
import { DriveSession } from "@/types/DriveSession";

import { deleteSession } from "@/storage/sessionStorage";
import { router } from "expo-router";

export default function TripDetailsScreen() {
  const { id } = useLocalSearchParams();

  const [trip, setTrip] = useState<DriveSession | null>(null);

  useEffect(() => {
    loadTrip();
  }, []);

  const loadTrip = async () => {
    const sessions = await getSessions();

    const foundTrip = sessions.find((session) => session.id === id) || null;

    setTrip(foundTrip);
  };

  const getDriverRating = (score: number) => {
    if (score >= 95) {
      return "Excellent Driver";
    }

    if (score >= 85) {
      return "Good Driver";
    }

    if (score >= 70) {
      return "Average Driver";
    }

    return "Needs Improvement";
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds} sec`;
    }

    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${mins} min ${secs} sec`;
  };

  const handleDelete = async () => {
    if (!trip) return;

    await deleteSession(trip.id);

    router.back();
  };

  if (!trip) {
    return (
      <View style={styles.center}>
        <Text>Trip not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Trip Details</Text>

      <View style={styles.heroCard}>
        <Text style={styles.heroLabel}>Driving Score</Text>

        <Text style={styles.heroScore}>{trip.score}</Text>

        <Text style={styles.heroRating}>{getDriverRating(trip.score)}</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.smallCard}>
          <Text style={styles.smallValue}>{formatDuration(trip.duration)}</Text>

          <Text style={styles.smallLabel}>Duration</Text>
        </View>

        <View style={styles.smallCard}>
          <Text style={styles.smallValue}>{trip.events.length}</Text>

          <Text style={styles.smallLabel}>Events</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>GPS Statistics</Text>

        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>Distance</Text>

          <Text style={styles.metricValue}>
            {trip.distance ? (trip.distance / 1000).toFixed(2) : "0.00"} km
          </Text>
        </View>

        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>Average Speed</Text>

          <Text style={styles.metricValue}>
            {trip.averageSpeed?.toFixed(1) ?? "0"} km/h
          </Text>
        </View>

        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>Maximum Speed</Text>

          <Text style={styles.metricValue}>
            {trip.maxSpeed?.toFixed(1) ?? "0"} km/h
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Trip Information</Text>

        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>Start</Text>

          <Text style={styles.metricValue}>
            {new Date(trip.startTime).toLocaleString()}
          </Text>
        </View>

        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>End</Text>

          <Text style={styles.metricValue}>
            {new Date(trip.endTime).toLocaleString()}
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Driving Events</Text>

        {trip.events.length === 0 ? (
          <Text style={styles.emptyText}>
            No risky driving events detected.
          </Text>
        ) : (
          trip.events.map((event, index) => (
            <View key={index} style={styles.eventRow}>
              <Text style={styles.eventBullet}>•</Text>

              <Text style={styles.eventText}>{event}</Text>
            </View>
          ))
        )}
      </View>

      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.deleteButtonText}>Delete Trip</Text>
      </TouchableOpacity>
    </ScrollView>
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

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0F1110",
  },

  title: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "700",
    marginBottom: 20,
  },

  heroCard: {
    backgroundColor: "#1A1C1A",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    marginBottom: 16,
  },

  heroLabel: {
    color: "#BBBBBB",
    fontSize: 16,
  },

  heroScore: {
    color: "#F2C8B2",
    fontSize: 64,
    fontWeight: "700",
    marginTop: 10,
  },

  heroRating: {
    color: "#F2C8B2",
    fontSize: 18,
    marginTop: 6,
  },

  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },

  smallCard: {
    flex: 1,
    backgroundColor: "#1A1C1A",
    borderRadius: 18,
    padding: 18,
    alignItems: "center",
  },

  smallValue: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "700",
  },

  smallLabel: {
    color: "#999999",
    marginTop: 6,
  },

  card: {
    backgroundColor: "#1A1C1A",
    borderRadius: 20,
    padding: 18,
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
    marginBottom: 14,
  },

  metricLabel: {
    color: "#AAAAAA",
    flex: 1,
  },

  metricValue: {
    color: "#FFFFFF",
    fontWeight: "600",
    flex: 1,
    textAlign: "right",
  },

  eventRow: {
    flexDirection: "row",
    marginBottom: 10,
  },

  eventBullet: {
    color: "#F2C8B2",
    marginRight: 8,
    fontSize: 18,
  },

  eventText: {
    color: "#FFFFFF",
    flex: 1,
  },

  emptyText: {
    color: "#999999",
  },

  deleteButton: {
    backgroundColor: "#8B1E1E",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 10,
  },

  deleteButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
});
