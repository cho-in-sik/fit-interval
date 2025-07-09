import AsyncStorage from '@react-native-async-storage/async-storage';

export interface WorkoutRecord {
  id: string;
  title: string;
  date: string;
  duration: number;
  sets: number;
  workTime: number;
  restTime: number;
  timestamp: number;
}

const WORKOUT_STORAGE_KEY = 'workout_records';
const MAX_RECORDS = 4;

export const workoutStorage = {
  async saveWorkout(
    workout: Omit<WorkoutRecord, 'id' | 'timestamp'>,
  ): Promise<void> {
    try {
      const existingRecords = await this.getWorkouts();

      const newWorkout: WorkoutRecord = {
        ...workout,
        id: Date.now().toString(),
        timestamp: Date.now(),
      };

      const updatedRecords = [newWorkout, ...existingRecords];

      const limitedRecords = updatedRecords.slice(0, MAX_RECORDS);

      await AsyncStorage.setItem(
        WORKOUT_STORAGE_KEY,
        JSON.stringify(limitedRecords),
      );
    } catch (error) {
      console.error('Error saving workout:', error);
      throw new Error('Failed to save workout');
    }
  },

  async getWorkouts(): Promise<WorkoutRecord[]> {
    try {
      const stored = await AsyncStorage.getItem(WORKOUT_STORAGE_KEY);
      if (!stored) {
        return [];
      }

      const records: WorkoutRecord[] = JSON.parse(stored);
      return records.sort((a, b) => b.timestamp - a.timestamp);
    } catch (error) {
      console.error('Error getting workouts:', error);
      return [];
    }
  },

  async deleteWorkout(id: string): Promise<void> {
    try {
      const existingRecords = await this.getWorkouts();
      const filteredRecords = existingRecords.filter(
        (record) => record.id !== id,
      );

      await AsyncStorage.setItem(
        WORKOUT_STORAGE_KEY,
        JSON.stringify(filteredRecords),
      );
    } catch (error) {
      console.error('Error deleting workout:', error);
      throw new Error('Failed to delete workout');
    }
  },

  async clearAllWorkouts(): Promise<void> {
    try {
      await AsyncStorage.removeItem(WORKOUT_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing workouts:', error);
      throw new Error('Failed to clear workouts');
    }
  },

  formatWorkoutTitle(workTime: number, restTime: number, sets: number): string {
    const formatTime = (seconds: number): string => {
      if (seconds < 60) {
        return `${seconds}s`;
      }
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return remainingSeconds > 0
        ? `${minutes}m ${remainingSeconds}s`
        : `${minutes}m`;
    };

    return `${formatTime(workTime)}/${formatTime(restTime)} × ${sets}`;
  },

  formatDate(timestamp: number): string {
    const date = new Date(timestamp);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const recordDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    );

    if (recordDate.getTime() === today.getTime()) {
      return `Today • ${date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })}`;
    }

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (recordDate.getTime() === yesterday.getTime()) {
      return `Yesterday • ${date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })}`;
    }

    return (
      date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }) +
      ` • ${date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })}`
    );
  },

  getTotalStats(records: WorkoutRecord[]): {
    totalTime: number;
    totalWorkouts: number;
  } {
    return records.reduce(
      (stats, record) => ({
        totalTime: stats.totalTime + record.duration,
        totalWorkouts: stats.totalWorkouts + 1,
      }),
      { totalTime: 0, totalWorkouts: 0 },
    );
  },
};
