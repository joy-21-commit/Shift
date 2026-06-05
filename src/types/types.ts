export interface SensorReading {
  x: number;
  y: number;
  z: number;
  timestamp?: number;
}

export interface DeviceMotionData {
  acceleration: SensorReading;
  rotationRate: SensorReading;
  attitude: {
    roll: number;
    pitch: number;
    yaw: number;
  };
  timestamp: number;
}

export enum EventType {
  HARSH_BRAKING = "HARSH_BRAKING",
  HARSH_ACCELERATION = "HARSH_ACCELERATION",
  SHARP_TURN = "SHARP_TURN",
  AGGRESSIVE_STEERING = "AGGRESSIVE_STEERING",
  EXCESSIVE_MOVEMENT = "EXCESSIVE_MOVEMENT",
  PHONE_HANDLING = "PHONE_HANDLING",
}

export interface DetectedEvent {
  type: EventType;
  severity: number;
  timestamp: number;
  data: SensorReading | DeviceMotionData;
}

export enum SafetyRatingLevel {
  EXCELLENT = "EXCELLENT",
  GOOD = "GOOD",
  FAIR = "FAIR",
  POOR = "POOR",
  DANGEROUS = "DANGEROUS",
}

export interface SafetyRating {
  level: SafetyRatingLevel;
  label: string;
  color: string;
  minScore: number;
  maxScore: number;
}

export interface ScoreResult {
  newScore: number;
  penalty: number;
  totalPenalty: number;
}

export type EventBreakdown = {
  [key in EventType]?: number;
};

export interface DrivingSession {
  id: string;
  startTime: string;
  endTime?: string;
  durationSeconds: number;
  finalScore: number;
  safetyRating: SafetyRating;
  totalEvents: number;
  eventBreakdown: EventBreakdown;
  totalPenalty: number;
  eventHistory: DetectedEvent[];
  sensorReadings?: SensorReading[];
  savedAt: string;
}

export interface SessionSummary {
  finalScore: number;
  safetyRating: SafetyRating;
  totalEvents: number;
  eventBreakdown: EventBreakdown;
  totalPenalty: number;
  eventHistory: DetectedEvent[];
}

export interface SensorManagerCallbacks {
  onAccelerometerData?: (data: SensorReading) => void;
  onGyroscopeData?: (data: SensorReading) => void;
  onDeviceMotionData?: (data: DeviceMotionData) => void;
  onError?: (message: string, error: Error) => void;
}

export interface SensorInitStatus {
  accelAvailable: boolean;
  gyroAvailable: boolean;
  motionAvailable: boolean;
}
