# Shift

Shift is a mobile driver monitoring application built using React Native, Expo, and TypeScript.

The application uses smartphone sensors and GPS data to monitor driving behavior in real time, detect unsafe driving events, calculate a driving score, and provide analytics through a modern dashboard.

This project was developed as part of a mobile application development learning journey to explore sensor integration, location tracking, data persistence, and mobile UI design.

---

# Features

## Driving Session Monitoring

- Start and stop driving sessions
- Real-time trip tracking
- Session duration tracking
- Driving score calculation

## Sensor-Based Event Detection

The application uses multiple smartphone sensors:

### Accelerometer

Detects:

- Harsh Braking
- Harsh Acceleration

### Gyroscope

Detects:

- Sharp Turns

### Device Motion

Provides:

- Yaw
- Pitch
- Roll

Used for understanding device orientation during a trip.

---

## GPS Tracking (GPS is not working for some reason for now)

The application uses Expo Location services to track:

- Distance travelled
- Average speed
- Maximum speed

Location updates are collected during active driving sessions.

---

## Driving Score System

Every trip starts with a score of:

```text
100
```

Points are deducted when unsafe driving events occur.

| Event              | Penalty |
| ------------------ | ------- |
| Harsh Braking      | -5      |
| Harsh Acceleration | -5      |
| Sharp Turn         | -3      |

The final score is saved with the trip.

---

## Driver Ratings

Scores are translated into driver ratings:

| Score Range | Rating            |
| ----------- | ----------------- |
| 95+         | Excellent Driver  |
| 85-94       | Good Driver       |
| 70-84       | Average Driver    |
| Below 70    | Needs Improvement |

---

## Dashboard Analytics

The dashboard provides:

- Average Score
- Best Score
- Worst Score
- Total Drives
- Total Events
- Total Driving Time
- Most Common Event
- Driver Rating

All analytics are generated from saved trip data.

---

## Trip History

Every completed drive is stored locally.

Features:

- View previous trips
- Open trip details
- View trip statistics
- Delete individual trips
- Clear entire history

---

## Trip Details

Each trip contains:

- Driving score
- Driver rating
- Duration
- Start time
- End time
- Distance travelled
- Average speed
- Maximum speed
- Detected driving events

---

# Tech Stack

## Frontend

- React Native
- Expo
- TypeScript

## Navigation

- Expo Router

## Sensors

- Expo Sensors
  - Accelerometer
  - Gyroscope
  - Device Motion

## Location Services

- Expo Location

## Local Storage

- AsyncStorage

## UI Components

- React Native Components
- Pressable
- SafeAreaView
- Expo Vector Icons

---

# Project Structure

```text
app/
│
├── (tabs)/
│   ├── DashboardScreen.tsx
│   ├── DriveScreen.tsx
│   ├── HistoryScreen.tsx
│   └── _layout.tsx
│
├── trip/
│   └── [id].tsx
│
storage/
│   └── sessionStorage.ts
│
types/
│   ├── DriveSession.ts
│   └── DashboardAnalytics.ts
│
utils/
│   ├── dashboardAnalytics.ts
│   └── driverRating.ts
```

---

# Data Persistence

Trip data is stored locally using AsyncStorage.

Each session contains:

```ts
{
  id: string;
  startTime: string;
  endTime: string;
  duration: number;

  score: number;

  distance: number;
  averageSpeed: number;
  maxSpeed: number;

  events: string[];
}
```

---

# Installation

Clone the repository:

```bash
git clone https://github.com/joy-21-commit/Shift.git
```

Install dependencies:

```bash
npm install
```

Run the project:

```bash
npx expo start
```

Launch on:

- Android Emulator
- iOS Simulator
- Physical Device using Expo Go

---

# How the Application Works

1. User starts a driving session.
2. Sensors begin collecting motion data.
3. GPS tracking begins collecting location data.
4. Unsafe driving events are detected.
5. Driving score is updated.
6. Session statistics are calculated.
7. User stops the drive.
8. Session data is saved locally.
9. Dashboard analytics are updated automatically.

---

# Learning Outcomes

This project helped in understanding:

- React Native fundamentals
- Expo ecosystem
- Sensor integration
- GPS tracking
- State management using hooks
- AsyncStorage data persistence
- Mobile navigation using Expo Router
- TypeScript interfaces and types
- Mobile UI design principles
- Data analytics and aggregation

---

# Future Improvements

Potential future enhancements:

- Route map visualization
- Weekly and monthly charts
- Cloud database integration
- User authentication
- Driver leaderboards
- AI-based driving recommendations
- Background trip tracking
- Export trip reports
- Dark/Light theme support

---

# Note from Author (^\_^)

Built as a learning project to explore mobile development, sensors, GPS tracking, and analytics using React Native and Expo.
