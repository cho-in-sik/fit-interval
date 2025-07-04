import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import * as Speech from 'expo-speech';
import { permissionService } from './permissionService';

class AudioService {
  private workSound: Audio.Sound | null = null;
  private restSound: Audio.Sound | null = null;
  private endSound: Audio.Sound | null = null;
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;

    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      // Load sounds
      const { sound: workSound } = await Audio.Sound.createAsync(
        require('../assets/sounds/sampleAudio.mp3')
      );
      this.workSound = workSound;

      const { sound: restSound } = await Audio.Sound.createAsync(
        require('../assets/sounds/sampleAudio.mp3')
      );
      this.restSound = restSound;

      const { sound: endSound } = await Audio.Sound.createAsync(
        require('../assets/sounds/sampleAudio.mp3')
      );
      this.endSound = endSound;

      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize audio service:', error);
    }
  }

  async playWorkSound(volume: number = 1.0, soundEnabled: boolean = true) {
    if (!soundEnabled || !this.workSound) return;

    // 저장된 권한 상태만 확인
    const permissions = permissionService.getPermissionStatus();
    if (!permissions.audio) return;

    try {
      await this.workSound.stopAsync();
      await this.workSound.setPositionAsync(0);
      await this.workSound.setVolumeAsync(volume / 100);
      await this.workSound.playAsync();
    } catch (error) {
      console.error('Failed to play work sound:', error);
    }
  }

  async playRestSound(volume: number = 1.0, soundEnabled: boolean = true) {
    if (!soundEnabled || !this.restSound) return;

    // 저장된 권한 상태만 확인
    const permissions = permissionService.getPermissionStatus();
    if (!permissions.audio) return;

    try {
      await this.restSound.stopAsync();
      await this.restSound.setPositionAsync(0);
      await this.restSound.setVolumeAsync(volume / 100);
      await this.restSound.playAsync();
    } catch (error) {
      console.error('Failed to play rest sound:', error);
    }
  }

  async playEndSound(volume: number = 1.0, soundEnabled: boolean = true) {
    if (!soundEnabled || !this.endSound) return;

    // 저장된 권한 상태만 확인
    const permissions = permissionService.getPermissionStatus();
    if (!permissions.audio) return;

    try {
      await this.endSound.stopAsync();
      await this.endSound.setPositionAsync(0);
      await this.endSound.setVolumeAsync(volume / 100);
      await this.endSound.playAsync();
    } catch (error) {
      console.error('Failed to play end sound:', error);
    }
  }

  async playVoiceGuidance(
    text: string,
    volume: number = 1.0,
    voiceEnabled: boolean = true,
    soundEnabled: boolean = true
  ) {
    if (!soundEnabled || !voiceEnabled) return;

    // 저장된 권한 상태만 확인 (권한 요청하지 않음)
    const permissions = permissionService.getPermissionStatus();
    if (!permissions.speech || !permissions.audio) return;

    try {
      // 볼륨에 따라 다른 속성으로 구분하여 재생
      const adjustedVolume = Math.max(0.1, Math.min(1.0, volume / 100));
      const pitch = 1.0 + (volume - 50) * 0.004; // 볼륨에 따라 피치 미세 조정
      const rate = 0.8 + (volume - 50) * 0.002; // 볼륨에 따라 속도 미세 조정
      
      Speech.speak(text, {
        language: 'ko-KR',
        pitch: Math.max(0.8, Math.min(1.2, pitch)),
        rate: Math.max(0.7, Math.min(1.0, rate)),
        volume: adjustedVolume,
      });
    } catch (error) {
      console.error('Failed to play voice guidance:', error);
    }
  }

  async playCountdown(
    count: number,
    volume: number = 1.0,
    voiceEnabled: boolean = true,
    soundEnabled: boolean = true
  ) {
    if (!soundEnabled || !voiceEnabled) return;

    // 저장된 권한 상태만 확인 (권한 요청하지 않음)
    const permissions = permissionService.getPermissionStatus();
    if (!permissions.speech || !permissions.audio) return;

    try {
      const countText = count.toString();
      // 볼륨에 따라 다른 속성으로 구분하여 재생
      const adjustedVolume = Math.max(0.1, Math.min(1.0, volume / 100));
      const pitch = 1.2 + (volume - 50) * 0.004; // 볼륨에 따라 피치 미세 조정
      const rate = 0.8 + (volume - 50) * 0.002; // 볼륨에 따라 속도 미세 조정
      
      Speech.speak(countText, {
        language: 'ko-KR',
        pitch: Math.max(1.0, Math.min(1.4, pitch)),
        rate: Math.max(0.7, Math.min(1.0, rate)),
        volume: adjustedVolume,
      });
    } catch (error) {
      console.error('Failed to play countdown:', error);
    }
  }

  async stopSpeech() {
    try {
      await Speech.stop();
    } catch (error) {
      console.error('Failed to stop speech:', error);
    }
  }

  async stopAllAudio() {
    try {
      // TTS 중단
      await Speech.stop();
    } catch (error) {
      console.error('Failed to stop TTS:', error);
    }
    
    // 모든 사운드 강제 중단 (초기화 상태와 관계없이)
    if (this.workSound) {
      try {
        await this.workSound.stopAsync();
      } catch (soundError) {
        // 개별 사운드 중단 실패는 무시
      }
    }
    if (this.restSound) {
      try {
        await this.restSound.stopAsync();
      } catch (soundError) {
        // 개별 사운드 중단 실패는 무시
      }
    }
    if (this.endSound) {
      try {
        await this.endSound.stopAsync();
      } catch (soundError) {
        // 개별 사운드 중단 실패는 무시
      }
    }
  }

  async triggerHapticFeedback(
    vibrationEnabled: boolean = true,
    intensity: 'light' | 'medium' | 'heavy' = 'medium'
  ) {
    if (!vibrationEnabled) return;

    // 저장된 권한 상태만 확인
    const permissions = permissionService.getPermissionStatus();
    if (!permissions.haptics) return;

    try {
      switch (intensity) {
        case 'light':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
        case 'medium':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          break;
        case 'heavy':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          break;
      }
    } catch (error) {
      console.error('Failed to trigger haptic feedback:', error);
    }
  }

  async cleanup() {
    try {
      if (this.workSound) {
        await this.workSound.unloadAsync();
        this.workSound = null;
      }
      if (this.restSound) {
        await this.restSound.unloadAsync();
        this.restSound = null;
      }
      if (this.endSound) {
        await this.endSound.unloadAsync();
        this.endSound = null;
      }
      this.isInitialized = false;
    } catch (error) {
      console.error('Failed to cleanup audio service:', error);
    }
  }
}

export const audioService = new AudioService();