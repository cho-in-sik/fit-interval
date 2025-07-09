import { useSettingsStore } from '@/store/settingsStore';

export interface TimerSettings {
  workTime: { minutes: number; seconds: number };
  restTime: { minutes: number; seconds: number };
  sets: number;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  keepScreenOn: boolean;
}

export const useTimerSettings = () => {
  const { 
    audio, 
    timer, 
    setTimerSettings, 
    setSoundEnabled, 
    setVibrationEnabled 
  } = useSettingsStore();

  const settings: TimerSettings = {
    workTime: timer.workTime,
    restTime: timer.restTime,
    sets: timer.sets,
    soundEnabled: audio.soundEnabled,
    vibrationEnabled: audio.vibrationEnabled,
    keepScreenOn: timer.keepScreenOn,
  };

  const updateWorkTime = (time: { minutes: number; seconds: number }) => {
    setTimerSettings({ workTime: time });
  };

  const updateRestTime = (time: { minutes: number; seconds: number }) => {
    setTimerSettings({ restTime: time });
  };

  const updateSets = (sets: number) => {
    setTimerSettings({ sets });
  };

  const updateSoundEnabled = (enabled: boolean) => {
    setSoundEnabled(enabled);
  };

  const updateVibrationEnabled = (enabled: boolean) => {
    setVibrationEnabled(enabled);
  };

  const updateKeepScreenOn = (enabled: boolean) => {
    setTimerSettings({ keepScreenOn: enabled });
  };

  return {
    settings,
    updateWorkTime,
    updateRestTime,
    updateSets,
    updateSoundEnabled,
    updateVibrationEnabled,
    updateKeepScreenOn,
  };
};