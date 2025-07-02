import { Audio, AVPlaybackSource } from 'expo-av';
import * as Haptics from 'expo-haptics';
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

    const hasPermission = await permissionService.requestAudioPermission();
    if (!hasPermission) return;

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

    const hasPermission = await permissionService.requestAudioPermission();
    if (!hasPermission) return;

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

    const hasPermission = await permissionService.requestAudioPermission();
    if (!hasPermission) return;

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

    const hasPermission = await permissionService.requestAudioPermission();
    if (!hasPermission) return;

    try {
      if (text.toLowerCase().includes('work') || text.toLowerCase().includes('start')) {
        await this.playWorkSound(volume, soundEnabled);
      } else if (text.toLowerCase().includes('rest') || text.toLowerCase().includes('break')) {
        await this.playRestSound(volume, soundEnabled);
      } else if (text.toLowerCase().includes('end') || text.toLowerCase().includes('finish')) {
        await this.playEndSound(volume, soundEnabled);
      }
    } catch (error) {
      console.error('Failed to play voice guidance:', error);
    }
  }

  async triggerHapticFeedback(
    vibrationEnabled: boolean = true,
    intensity: 'light' | 'medium' | 'heavy' = 'medium'
  ) {
    if (!vibrationEnabled) return;

    const hasPermission = await permissionService.requestHapticsPermission();
    if (!hasPermission) return;

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