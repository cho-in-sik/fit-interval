import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { Alert, Platform } from 'react-native';

export interface PermissionStatus {
  audio: boolean;
  haptics: boolean;
}

class PermissionService {
  private permissionStatus: PermissionStatus = {
    audio: false,
    haptics: false,
  };

  async checkAudioPermission(): Promise<boolean> {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      this.permissionStatus.audio = status === 'granted';
      return this.permissionStatus.audio;
    } catch (error) {
      console.error('Failed to check audio permission:', error);
      return false;
    }
  }

  async checkHapticsPermission(): Promise<boolean> {
    try {
      if (Platform.OS === 'ios') {
        this.permissionStatus.haptics = true;
      } else {
        this.permissionStatus.haptics = true;
      }
      return this.permissionStatus.haptics;
    } catch (error) {
      console.error('Failed to check haptics permission:', error);
      return false;
    }
  }

  async requestAudioPermission(): Promise<boolean> {
    if (this.permissionStatus.audio) {
      return true;
    }

    return new Promise((resolve) => {
      Alert.alert(
        '오디오 권한 필요',
        '타이머 알림음을 재생하려면 오디오 권한이 필요합니다.',
        [
          {
            text: '취소',
            onPress: () => resolve(false),
            style: 'cancel',
          },
          {
            text: '허용',
            onPress: async () => {
              const granted = await this.checkAudioPermission();
              resolve(granted);
            },
          },
        ]
      );
    });
  }

  async requestHapticsPermission(): Promise<boolean> {
    if (this.permissionStatus.haptics) {
      return true;
    }

    return new Promise((resolve) => {
      Alert.alert(
        '진동 권한 필요',
        '타이머 진동 알림을 사용하려면 진동 권한이 필요합니다.',
        [
          {
            text: '취소',
            onPress: () => resolve(false),
            style: 'cancel',
          },
          {
            text: '허용',
            onPress: async () => {
              const granted = await this.checkHapticsPermission();
              resolve(granted);
            },
          },
        ]
      );
    });
  }

  getPermissionStatus(): PermissionStatus {
    return { ...this.permissionStatus };
  }

  async initializePermissions(): Promise<PermissionStatus> {
    await Promise.all([
      this.checkAudioPermission(),
      this.checkHapticsPermission(),
    ]);
    return this.getPermissionStatus();
  }
}

export const permissionService = new PermissionService();