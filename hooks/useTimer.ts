import { useRouter } from 'expo-router';
import { Vibration } from 'react-native';
import { useSettingsStore } from '@/store/settingsStore';
import { permissionService } from '@/services/permissionService';
import { convertToSeconds } from '@/utils/timerCalculator';

export const useTimer = () => {
  const router = useRouter();
  const { audio, timer } = useSettingsStore();

  const startTimer = async () => {
    let canProceed = true;

    if (audio.soundEnabled) {
      const hasAudioPermission =
        await permissionService.requestAudioPermission();
      if (!hasAudioPermission) {
        canProceed = false;
      }
    }

    if (audio.vibrationEnabled) {
      const hasHapticsPermission =
        await permissionService.requestHapticsPermission();
      if (!hasHapticsPermission) {
        canProceed = false;
      }
      Vibration.vibrate(100);
    }

    if (!canProceed) {
      return;
    }

    const workSeconds = convertToSeconds(timer.workTime);
    const restSeconds = convertToSeconds(timer.restTime);

    router.push({
      pathname: '/counter',
      params: {
        workTime: workSeconds,
        restTime: restSeconds,
        sets: timer.sets,
        soundEnabled: audio.soundEnabled.toString(),
        vibrationEnabled: audio.vibrationEnabled.toString(),
        keepScreenOn: timer.keepScreenOn.toString(),
      },
    });
  };

  return {
    startTimer,
  };
};