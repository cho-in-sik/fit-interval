import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface AudioSettings {
  soundEnabled: boolean;
  volume: number; // 0-100
  voiceEnabled: boolean;
  vibrationEnabled: boolean;
}

export interface ThemeSettings {
  colorScheme: 'purple' | 'blue' | 'green';
}

export interface TimerSettings {
  workTime: { minutes: number; seconds: number };
  restTime: { minutes: number; seconds: number };
  sets: number;
  keepScreenOn: boolean;
}

interface SettingsState {
  audio: AudioSettings;
  timer: TimerSettings;
  theme: ThemeSettings;
  setAudioSettings: (settings: Partial<AudioSettings>) => void;
  setTimerSettings: (settings: Partial<TimerSettings>) => void;
  setThemeSettings: (settings: Partial<ThemeSettings>) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setVolume: (volume: number) => void;
  setVoiceEnabled: (enabled: boolean) => void;
  setVibrationEnabled: (enabled: boolean) => void;
  setColorScheme: (colorScheme: 'purple' | 'blue' | 'green') => void;
}

const defaultAudioSettings: AudioSettings = {
  soundEnabled: true,
  volume: 80,
  voiceEnabled: true,
  vibrationEnabled: true,
};

const defaultTimerSettings: TimerSettings = {
  workTime: { minutes: 0, seconds: 20 },
  restTime: { minutes: 0, seconds: 10 },
  sets: 8,
  keepScreenOn: true,
};

const defaultThemeSettings: ThemeSettings = {
  colorScheme: 'purple',
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      audio: defaultAudioSettings,
      timer: defaultTimerSettings,
      theme: defaultThemeSettings,

      setAudioSettings: (settings) =>
        set((state) => ({
          audio: { ...state.audio, ...settings },
        })),

      setTimerSettings: (settings) =>
        set((state) => ({
          timer: { ...state.timer, ...settings },
        })),

      setThemeSettings: (settings) =>
        set((state) => ({
          theme: { ...state.theme, ...settings },
        })),

      setSoundEnabled: (enabled) =>
        set((state) => ({
          audio: { ...state.audio, soundEnabled: enabled },
        })),

      setVolume: (volume) =>
        set((state) => ({
          audio: { ...state.audio, volume: Math.max(0, Math.min(100, volume)) },
        })),

      setVoiceEnabled: (enabled) =>
        set((state) => ({
          audio: { ...state.audio, voiceEnabled: enabled },
        })),

      setVibrationEnabled: (enabled) =>
        set((state) => ({
          audio: { ...state.audio, vibrationEnabled: enabled },
        })),

      setColorScheme: (colorScheme) =>
        set((state) => ({
          theme: { ...state.theme, colorScheme },
        })),
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);