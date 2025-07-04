import { Audio } from 'expo-av';
import { Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface PermissionStatus {
  audio: boolean;
  haptics: boolean;
  speech: boolean;
}

class PermissionService {
  private permissionStatus: PermissionStatus = {
    audio: false,
    haptics: false,
    speech: false,
  };
  
  private readonly STORAGE_KEY = 'permissions-status';

  async loadPermissions(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const permissions = JSON.parse(stored);
        this.permissionStatus = { ...this.permissionStatus, ...permissions };
      }
    } catch (error) {
      console.error('Failed to load permissions:', error);
    }
  }

  async savePermissions(): Promise<void> {
    try {
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.permissionStatus));
    } catch (error) {
      console.error('Failed to save permissions:', error);
    }
  }

  async checkAudioPermission(): Promise<boolean> {
    try {
      const { status } = await Audio.getPermissionsAsync();
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
    try {
      const { status: currentStatus } = await Audio.getPermissionsAsync();
      
      if (currentStatus === 'granted') {
        this.permissionStatus.audio = true;
        await this.savePermissions();
        return true;
      }
      
      const { status } = await Audio.requestPermissionsAsync();
      this.permissionStatus.audio = status === 'granted';
      await this.savePermissions();
      return this.permissionStatus.audio;
    } catch (error) {
      console.error('Failed to request audio permission:', error);
      return false;
    }
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
              this.permissionStatus.haptics = granted;
              await this.savePermissions();
              resolve(granted);
            },
          },
        ]
      );
    });
  }

  async requestSpeechPermission(): Promise<boolean> {
    if (this.permissionStatus.speech) {
      return true;
    }

    return new Promise((resolve) => {
      Alert.alert(
        '음성 안내 권한 필요',
        '음성 안내 기능을 사용하려면 시스템 접근 권한이 필요합니다.',
        [
          {
            text: '취소',
            onPress: () => resolve(false),
            style: 'cancel',
          },
          {
            text: '허용',
            onPress: async () => {
              this.permissionStatus.speech = true;
              await this.savePermissions();
              resolve(true);
            },
          },
        ]
      );
    });
  }

  getPermissionStatus(): PermissionStatus {
    return { ...this.permissionStatus };
  }

  async requestAllPermissionsOnFirstLaunch(): Promise<PermissionStatus> {
    await this.loadPermissions();
    
    // 이미 권한을 요청했다면 다시 요청하지 않음
    const stored = await AsyncStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      return this.getPermissionStatus();
    }

    // 앱 최초 실행 시 모든 권한 한 번에 요청
    return new Promise((resolve) => {
      Alert.alert(
        '권한 요청',
        'FitInterval이 원활히 작동하려면 다음 권한들이 필요합니다:\n\n• 오디오: 음성 안내 및 알림음\n• 진동: 타이머 알림\n• 음성 합성: 운동 안내',
        [
          {
            text: '취소',
            onPress: async () => {
              this.permissionStatus = {
                audio: false,
                haptics: false,
                speech: false,
              };
              await this.savePermissions();
              resolve(this.getPermissionStatus());
            },
            style: 'cancel',
          },
          {
            text: '권한 허용',
            onPress: async () => {
              // 오디오 권한 요청
              try {
                const { status } = await Audio.requestPermissionsAsync();
                this.permissionStatus.audio = status === 'granted';
              } catch (error) {
                this.permissionStatus.audio = false;
              }

              // 진동과 음성은 시스템 권한이므로 true로 설정
              this.permissionStatus.haptics = true;
              this.permissionStatus.speech = true;

              await this.savePermissions();
              resolve(this.getPermissionStatus());
            },
          },
        ]
      );
    });
  }

  async initializePermissions(): Promise<PermissionStatus> {
    await this.loadPermissions();
    await Promise.all([
      this.checkAudioPermission(),
      this.checkHapticsPermission(),
    ]);
    return this.getPermissionStatus();
  }
}

export const permissionService = new PermissionService();