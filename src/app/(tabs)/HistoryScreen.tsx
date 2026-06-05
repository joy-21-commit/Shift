import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import Ionicons from "@expo/vector-icons/Ionicons";

import { clearSessions, getSessions } from "@/storage/sessionStorage";

import { DriveSession } from "@/types/DriveSession";
import { getDriverRating } from "@/utils/driverRating";

export default function HistoryScreen() {
  const [sessions, setSessions] = useState<DriveSession[]>([]);

  const loadSessions = async () => {
    const data = await getSessions();
    setSessions(data);
  };

  useFocusEffect(
    useCallback(() => {
      loadSessions();
    }, []),
  );

  const handleClearHistory = async () => {
    await clearSessions();
    setSessions([]);
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds}s`;
    }

    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${mins}m ${secs}s`;
  };

  const renderItem = ({ item }: { item: DriveSession }) => (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={() => router.push(`/trip/${item.id}`)}
    >
      <View style={styles.cardTop}>
        <View>
          <Text style={styles.date}>
            {new Date(item.startTime).toLocaleDateString()}
          </Text>

          <Text style={styles.time}>
            {new Date(item.startTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>

        <View style={styles.scoreContainer}>
          <Text style={styles.score}>{item.score}</Text>

          <Text style={styles.rating}>{getDriverRating(item.score)}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.statsRow}>
        <View>
          <Text style={styles.label}>Duration</Text>

          <Text style={styles.value}>{formatDuration(item.duration)}</Text>
        </View>

        <View>
          <Text style={styles.label}>Events</Text>

          <Text style={styles.value}>{item.events.length}</Text>
        </View>

        <View>
          <Text style={styles.label}>Distance</Text>

          <Text style={styles.value}>
            {item.distance ? (item.distance / 1000).toFixed(1) : "0.0"} km
          </Text>
        </View>
      </View>

      {item.events.length > 0 && (
        <>
          <View
            style={[
              styles.divider,
              {
                marginTop: 14,
              },
            ]}
          />

          <Text style={styles.eventsTitle}>Recent Events</Text>

          {item.events.slice(0, 3).map((event, index) => (
            <Text key={`${item.id}-${index}`} style={styles.event}>
              • {event}
            </Text>
          ))}

          {item.events.length > 3 && (
            <Text style={styles.moreEvents}>
              +{item.events.length - 3} more
            </Text>
          )}
        </>
      )}
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Drive History</Text>

        <Pressable
          style={({ pressed }) => [
            styles.clearButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleClearHistory}
        >
          <View style={styles.clearButtonContent}>
            <Ionicons name="trash-outline" size={16} color="#F2C8B2" />

            <Text style={styles.clearButtonText}>Clear</Text>
          </View>
        </Pressable>
      </View>

      <FlatList
        data={[...sessions].reverse()}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          sessions.length === 0
            ? styles.emptyContainer
            : {
                paddingBottom: 20,
              }
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📋</Text>

            <Text style={styles.emptyTitle}>No Drives Yet</Text>

            <Text style={styles.emptyText}>
              Complete your first drive and your history will appear here.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F1110",
    paddingHorizontal: 16,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "700",
  },

  clearButton: {
    backgroundColor: "#1A1C1A",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },

  clearButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  clearButtonText: {
    color: "#F2C8B2",
    fontWeight: "600",
  },

  buttonPressed: {
    opacity: 0.8,
  },

  card: {
    backgroundColor: "#1A1C1A",
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
  },

  cardPressed: {
    opacity: 0.9,
    transform: [
      {
        scale: 0.98,
      },
    ],
  },

  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  date: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },

  time: {
    color: "#999999",
    marginTop: 4,
  },

  scoreContainer: {
    alignItems: "flex-end",
  },

  score: {
    color: "#F2C8B2",
    fontSize: 32,
    fontWeight: "700",
  },

  rating: {
    color: "#BBBBBB",
    fontSize: 13,
  },

  divider: {
    height: 1,
    backgroundColor: "#2A2D2A",
    marginVertical: 14,
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  label: {
    color: "#888888",
    fontSize: 12,
  },

  value: {
    color: "#FFFFFF",
    marginTop: 4,
    fontWeight: "600",
  },

  eventsTitle: {
    color: "#FFFFFF",
    fontWeight: "700",
    marginBottom: 8,
  },

  event: {
    color: "#BBBBBB",
    marginBottom: 4,
  },

  moreEvents: {
    color: "#F2C8B2",
    marginTop: 6,
  },

  emptyContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },

  emptyState: {
    alignItems: "center",
  },

  emptyIcon: {
    fontSize: 60,
    marginBottom: 16,
  },

  emptyTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 10,
  },

  emptyText: {
    color: "#999999",
    textAlign: "center",
    lineHeight: 22,
  },
});
