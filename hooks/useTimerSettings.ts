import { useState, useEffect } from 'react';
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

  const [settings, setSettings] = useState<TimerSettings>({
    workTime: timer.workTime,
    restTime: timer.restTime,
    sets: timer.sets,
    soundEnabled: audio.soundEnabled,
    vibrationEnabled: audio.vibrationEnabled,
    keepScreenOn: timer.keepScreenOn,
  });

  useEffect(() => {
    setSettings(prev => ({
      ...prev,
      workTime: timer.workTime,
      restTime: timer.restTime,
      sets: timer.sets,
      soundEnabled: audio.soundEnabled,
      vibrationEnabled: audio.vibrationEnabled,
      keepScreenOn: timer.keepScreenOn,
    }));
  }, [audio.soundEnabled, audio.vibrationEnabled, timer.workTime, timer.restTime, timer.sets, timer.keepScreenOn]);

  const updateWorkTime = (time: { minutes: number; seconds: number }) => {
    setSettings((prev) => ({ ...prev, workTime: time }));
    setTimerSettings({ workTime: time });
  };

  const updateRestTime = (time: { minutes: number; seconds: number }) => {
    setSettings((prev) => ({ ...prev, restTime: time }));
    setTimerSettings({ restTime: time });
  };

  const updateSets = (sets: number) => {
    setSettings((prev) => ({ ...prev, sets }));
    setTimerSettings({ sets });
  };

  const updateSoundEnabled = (enabled: boolean) => {
    setSettings((prev) => ({ ...prev, soundEnabled: enabled }));
    setSoundEnabled(enabled);
  };

  const updateVibrationEnabled = (enabled: boolean) => {
    setSettings((prev) => ({ ...prev, vibrationEnabled: enabled }));
    setVibrationEnabled(enabled);
  };

  const updateKeepScreenOn = (enabled: boolean) => {
    setSettings((prev) => ({ ...prev, keepScreenOn: enabled }));
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