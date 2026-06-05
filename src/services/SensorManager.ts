import { Accelerometer, DeviceMotion, Gyroscope } from "expo-sensors";

class SensorManager {
  accelSubscription: any = null;
  gyroSubscription: any = null;
  motionSubscription: any = null;

  start() {
    this.accelSubscription = Accelerometer.addListener((data) => {
      console.log("ACCEL:", data);
    });

    this.gyroSubscription = Gyroscope.addListener((data) => {
      console.log("GYRO:", data);
    });

    this.motionSubscription = DeviceMotion.addListener((data) => {
      console.log("MOTION:", data);
    });
  }

  stop() {
    this.accelSubscription?.remove();
    this.gyroSubscription?.remove();
    this.motionSubscription?.remove();
  }
}

export default new SensorManager();
