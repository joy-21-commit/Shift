import { saveSession } from "@/storage/sessionStorage";
import { Accelerometer, DeviceMotion, Gyroscope } from "expo-sensors";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import * as Location from "expo-location";
import { LocationSubscription } from "expo-location";
import { useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DriveScreen() {
  const [accelerometer, setAccelerometer] = useState({
    x: 0,
    y: 0,
    z: 0,
  });

  const [gyroscope, setGyroscope] = useState({
    x: 0,
    y: 0,
    z: 0,
  });

  const [motion, setMotion] = useState({
    alpha: 0,
    beta: 0,
    gamma: 0,
  });

  const [events, setEvents] = useState<string[]>([]);
  const [score, setScore] = useState(100);

  const [isDriving, setIsDriving] = useState(false);
  const [tripDuration, setTripDuration] = useState(0);
  const [finalScore, setFinalScore] = useState<number | null>(null);

  const [tripStartTime, setTripStartTime] = useState<string>("");

  const [distance, setDistance] = useState(0);

  const [maxSpeed, setMaxSpeed] = useState(0);

  const [averageSpeed, setAverageSpeed] = useState(0);

  const radiansToDegrees = (radians: number) => {
    return radians * (180 / Math.PI);
  };

  const addEvent = (event: string) => {
    if (!isDriving) return;

    setEvents((prev) => {
      const lastEvent = prev[prev.length - 1];

      if (lastEvent === event) {
        return prev;
      }

      setScore((current) => {
        switch (event) {
          case "Sharp Turn":
            return Math.max(0, current - 3);

          case "Harsh Braking":
            return Math.max(0, current - 5);

          case "Harsh Acceleration":
            return Math.max(0, current - 5);

          default:
            return current;
        }
      });

      return [...prev, event];
    });
  };

  const startDrive = async () => {
    setScore(100);

    setEvents([]);

    setTripDuration(0);

    setFinalScore(null);

    setDistance(0);

    setAverageSpeed(0);

    setMaxSpeed(0);

    totalSpeed.current = 0;

    speedSamples.current = 0;

    previousLocation.current = null;

    setTripStartTime(new Date().toISOString());

    await startLocationTracking();

    setIsDriving(true);
  };

  const stopDrive = async () => {
    setIsDriving(false);

    setFinalScore(score);

    const session = {
      id: Date.now().toString(),

      startTime: tripStartTime,

      endTime: new Date().toISOString(),

      duration: tripDuration,

      score,

      events,
    };

    await saveSession(session);
  };

  const locationSubscription = useRef<LocationSubscription | null>(null);

  const totalSpeed = useRef(0);

  const speedSamples = useRef(0);

  const previousLocation = useRef<Location.LocationObject | null>(null);

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ) => {
    const R = 6371000;

    const dLat = ((lat2 - lat1) * Math.PI) / 180;

    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const startLocationTracking = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      return;
    }

    locationSubscription.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,

        distanceInterval: 5,

        timeInterval: 1000,
      },
      (location) => {
        const speed = Math.max(0, location.coords.speed ?? 0) * 3.6;

        setMaxSpeed((prev) => Math.max(prev, speed));

        totalSpeed.current += speed;

        speedSamples.current += 1;

        setAverageSpeed(totalSpeed.current / speedSamples.current);

        if (previousLocation.current) {
          const distanceTravelled = calculateDistance(
            previousLocation.current.coords.latitude,

            previousLocation.current.coords.longitude,

            location.coords.latitude,

            location.coords.longitude,
          );

          setDistance((prev) => prev + distanceTravelled);
        }

        previousLocation.current = location;
      },
    );
  };

  useEffect(() => {
    Accelerometer.setUpdateInterval(100);
    Gyroscope.setUpdateInterval(100);
    DeviceMotion.setUpdateInterval(100);

    const accelSub = Accelerometer.addListener((data) => {
      setAccelerometer(data);

      if (data.y < -1.5) {
        addEvent("Harsh Braking");
      }

      if (data.y > 1.5) {
        addEvent("Harsh Acceleration");
      }
    });

    const gyroSub = Gyroscope.addListener((data) => {
      setGyroscope(data);

      if (Math.abs(data.z) > 1.5) {
        addEvent("Sharp Turn");
      }
    });

    const motionSub = DeviceMotion.addListener((data) => {
      setMotion({
        alpha: radiansToDegrees(data.rotation?.alpha ?? 0),
        beta: radiansToDegrees(data.rotation?.beta ?? 0),
        gamma: radiansToDegrees(data.rotation?.gamma ?? 0),
      });
    });

    return () => {
      accelSub.remove();
      gyroSub.remove();
      motionSub.remove();
    };
  }, [isDriving]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;

    if (isDriving) {
      interval = setInterval(() => {
        setTripDuration((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isDriving]);

  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.title}>Drive</Text>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.container}
      >
        <View style={styles.statusRow}>
          <View
            style={[
              styles.statusDot,
              {
                backgroundColor: isDriving ? "#4CAF50" : "#777",
              },
            ]}
          />

          <Text style={styles.statusText}>
            {isDriving ? "Driving" : "Ready to Drive"}
          </Text>
        </View>

        <Text style={styles.timer}>
          {new Date(tripDuration * 1000).toISOString().substring(11, 19)}
        </Text>

        <View style={styles.scoreCard}>
          <Text style={styles.scoreLabel}>Current Score</Text>

          <Text style={styles.score}>{score}</Text>
        </View>

        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>
              {(distance / 1000).toFixed(2)}
            </Text>

            <Text style={styles.metricLabel}>KM</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{averageSpeed.toFixed(0)}</Text>

            <Text style={styles.metricLabel}>Avg KM/H</Text>
          </View>
        </View>

        <View style={styles.metricCardLarge}>
          <Text style={styles.metricValue}>{maxSpeed.toFixed(0)}</Text>

          <Text style={styles.metricLabel}>Max Speed</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Recent Events</Text>

          {events.length === 0 ? (
            <Text style={styles.emptyText}>No risky events detected.</Text>
          ) : (
            events
              .slice(-5)
              .reverse()
              .map((event, index) => (
                <Text key={index} style={styles.event}>
                  • {event}
                </Text>
              ))
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Sensor Debug</Text>

          <Text style={styles.debugText}>
            Accel:
            {accelerometer.x.toFixed(2)},{accelerometer.y.toFixed(2)},
            {accelerometer.z.toFixed(2)}
          </Text>

          <Text style={styles.debugText}>
            Gyro:
            {gyroscope.x.toFixed(2)},{gyroscope.y.toFixed(2)},
            {gyroscope.z.toFixed(2)}
          </Text>

          <Text style={styles.debugText}>
            Pitch:
            {motion.beta.toFixed(1)}°
          </Text>

          <Text style={styles.debugText}>
            Roll:
            {motion.gamma.toFixed(1)}°
          </Text>

          <Text style={styles.debugText}>
            Yaw:
            {motion.alpha.toFixed(1)}°
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <Pressable
            onPress={isDriving ? stopDrive : startDrive}
            style={({ pressed }) => [
              styles.button,
              isDriving ? styles.stopButton : styles.startButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.buttonText}>
              {isDriving ? "End Drive" : "Start Drive"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#0F1110",
  },

  container: {
    padding: 16,
    paddingBottom: 40,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "700",
    marginLeft: 20,
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },

  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 10,
    marginRight: 8,
  },

  statusText: {
    color: "#BBBBBB",
    fontSize: 16,
  },

  timer: {
    color: "#FFFFFF",
    fontSize: 42,
    fontWeight: "700",
    marginTop: 12,
    marginBottom: 20,
  },

  scoreCard: {
    backgroundColor: "#1A1C1A",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    marginBottom: 16,
  },

  scoreLabel: {
    color: "#BBBBBB",
  },

  score: {
    color: "#F2C8B2",
    fontSize: 60,
    fontWeight: "700",
    marginTop: 10,
  },

  metricsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },

  metricCard: {
    flex: 1,
    backgroundColor: "#1A1C1A",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
  },

  metricCardLarge: {
    backgroundColor: "#1A1C1A",
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
    marginBottom: 16,
  },

  metricValue: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "700",
  },

  metricLabel: {
    color: "#AAAAAA",
    marginTop: 6,
  },

  card: {
    backgroundColor: "#1A1C1A",
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
  },

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },

  event: {
    color: "#FFFFFF",
    marginBottom: 8,
    fontSize: 16,
  },

  emptyText: {
    color: "#AAAAAA",
  },

  debugText: {
    color: "#BBBBBB",
    marginBottom: 6,
    fontSize: 13,
  },

  buttonContainer: {
    marginTop: 10,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  startButton: {
    backgroundColor: "#4CAF50",
  },

  stopButton: {
    backgroundColor: "#E53935",
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  pressed: {
    opacity: 0.7,
  },
});
