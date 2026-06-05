export interface DriveSession {
  id: string;

  startTime: string;
  endTime: string;

  duration: number;

  score: number;

  events: string[];

  distance: number;

  averageSpeed: number;

  maxSpeed: number;
}
