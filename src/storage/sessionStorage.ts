import AsyncStorage from "@react-native-async-storage/async-storage";
import { DriveSession } from "../types/DriveSession";

const STORAGE_KEY = "SAFE_DRIVE_SESSIONS";

export const saveSession = async (session: DriveSession): Promise<void> => {
  try {
    const existingSessions = await getSessions();

    const updatedSessions = [session, ...existingSessions];

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSessions));
  } catch (error) {
    console.error("Error saving session:", error);
  }
};

export const getSessions = async (): Promise<DriveSession[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);

    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error loading sessions:", error);
    return [];
  }
};

export const deleteSession = async (id: string): Promise<void> => {
  try {
    const sessions = await getSessions();

    const filtered = sessions.filter((session) => session.id !== id);

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Error deleting session:", error);
  }
};

export const clearSessions = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing sessions:", error);
  }
};
