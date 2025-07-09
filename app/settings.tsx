import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  SafeAreaView,
  Image,
  AppState,
  Alert,
} from 'react-native';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/FontAwesome6';
import { Ionicons } from '@expo/vector-icons';
import Drawer from '@/components/Drawer';
import { useSettingsStore } from '@/store/settingsStore';
import { permissionService } from '@/services/permissionService';
import { audioService } from '@/services/audioService';
import { LinearGradient } from 'expo-linear-gradient';
import { getThemeColors } from '@/utils/themeColors';

const SettingsScreen: React.FC = () => {
  const {
    audio,
    theme,
    setSoundEnabled,
    setVolume,
    setVoiceEnabled,
    setVibrationEnabled,
    setColorScheme,
  } = useSettingsStore();

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [soundEnabled, setSoundEnabledLocal] = useState(audio.soundEnabled);
  const [voiceEnabled, setVoiceEnabledLocal] = useState(audio.voiceEnabled);
  const [volume, setVolumeLocal] = useState(audio.volume);
  const [vibrationEnabled, setVibrationEnabledLocal] = useState(
    audio.vibrationEnabled,
  );

  useEffect(() => {
    setSoundEnabledLocal(audio.soundEnabled);
    setVoiceEnabledLocal(audio.voiceEnabled);
    setVolumeLocal(audio.volume);
    setVibrationEnabledLocal(audio.vibrationEnabled);
  }, [audio]);

  // 컴포넌트 언마운트 시 모든 오디오 중단
  useEffect(() => {
    return () => {
      audioService.stopAllAudio();
    };
  }, []);

  // 앱 상태 변경 감지하여 오디오 중단
  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        audioService.stopAllAudio();
      }
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );
    return () => subscription?.remove();
  }, []);

  const handleSoundToggle = async (value: boolean) => {
    // 사운드를 끌 때 진행 중인 모든 오디오 중단
    if (!value) {
      await audioService.stopAllAudio();
    }

    // 권한이 없으면 토글 비활성화
    if (value) {
      const permissions = permissionService.getPermissionStatus();
      if (!permissions.audio) {
        Alert.alert(
          '권한 필요',
          '오디오 권한이 필요합니다. 앱을 재시작하면 권한을 다시 요청합니다.'
        );
        return;
      }
    }
    setSoundEnabledLocal(value);
    setSoundEnabled(value);
  };

  const handleVoiceToggle = (value: boolean) => {
    setVoiceEnabledLocal(value);
    setVoiceEnabled(value);
  };

  const handleVolumeChange = (value: number) => {
    const roundedValue = Math.round(value);
    setVolumeLocal(roundedValue);
    setVolume(roundedValue);
  };

  const handleVolumeTest = async () => {
    if (soundEnabled) {
      await audioService.initialize();
      await audioService.playWorkSound(volume, soundEnabled);

      // 3초 후 자동으로 중단
      setTimeout(() => {
        audioService.stopAllAudio();
      }, 3000);
    }
  };

  const handleVibrationToggle = async (value: boolean) => {
    if (value) {
      const permissions = permissionService.getPermissionStatus();
      if (!permissions.haptics) {
        Alert.alert(
          '권한 필요',
          '진동 권한이 필요합니다. 앱을 재시작하면 권한을 다시 요청합니다.'
        );
        return;
      }
      await audioService.triggerHapticFeedback(true, 'medium');
    }
    setVibrationEnabledLocal(value);
    setVibrationEnabled(value);
  };

  const handleColorSchemeChange = (colorScheme: 'purple' | 'blue' | 'green') => {
    setColorScheme(colorScheme);
  };

  const themeColors = getThemeColors(theme.colorScheme);

  return (
    <LinearGradient colors={themeColors.background} style={{ flex: 1 }}>
      <SafeAreaView className="flex-1">
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View className="flex-1">
            {/* Settings Header */}
            <View className="flex-row items-center justify-between px-4 pb-4 pt-4">
              <View className="flex-row items-center">
                <Image
                  source={require('../assets/images/newFitInterval.png')}
                  style={{ width: 50, height: 50 }}
                  resizeMode="cover"
                />
                <Text className="text-xl font-bold ml-2 text-white">
                  FitInterval
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setDrawerVisible(true)}
                className="w-10 h-10 items-center justify-center rounded-full"
              >
                <Ionicons name="menu" size={20} color="white" />
              </TouchableOpacity>
            </View>

            {/* Settings Content */}
            <View className="px-4 py-6 flex-1">
              {/* Audio Section */}
              <View className="mb-8">
                <Text className="text-lg font-semibold text-white mb-4">
                  Audio
                </Text>

                {/* Sound Toggle */}
                <View className="bg-white/15 rounded-xl border border-white/30 p-4 mb-4">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center flex-1">
                      <View className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-4">
                        <Icon
                          name={soundEnabled ? 'volume-high' : 'volume-xmark'}
                          size={16}
                          color={themeColors.accent}
                          solid
                        />
                      </View>
                      <View className="flex-1">
                        <Text className="text-base font-medium text-white">
                          Sound
                        </Text>
                        <Text className="text-sm text-white opacity-80">
                          샘플 오디오 및 음성 안내 활성화
                        </Text>
                      </View>
                    </View>
                    <Switch
                      value={soundEnabled}
                      onValueChange={handleSoundToggle}
                      trackColor={{ false: '#D1D5DB', true: themeColors.accent }}
                      thumbColor="#FFFFFF"
                    />
                  </View>
                </View>

                {/* Voice Toggle */}
                <View
                  className={`bg-white/15 rounded-xl border border-white/30 p-4 mb-4 ${
                    !soundEnabled ? 'opacity-50' : 'opacity-100'
                  }`}
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center flex-1">
                      <View className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-4">
                        <Icon
                          name="microphone"
                          size={16}
                          color={!soundEnabled ? '#9CA3AF' : themeColors.accent}
                          solid
                        />
                      </View>
                      <View className="flex-1">
                        <Text
                          className={`text-base font-medium ${
                            !soundEnabled
                              ? 'text-white opacity-50'
                              : 'text-white'
                          }`}
                        >
                          Voice Guidance
                        </Text>
                        <Text
                          className={`text-sm ${
                            !soundEnabled
                              ? 'text-white opacity-40'
                              : 'text-white opacity-80'
                          }`}
                        >
                          운동/휴식 전환 시 음성 안내
                        </Text>
                      </View>
                    </View>
                    <Switch
                      value={voiceEnabled && soundEnabled}
                      onValueChange={handleVoiceToggle}
                      trackColor={{ false: '#D1D5DB', true: themeColors.accent }}
                      thumbColor="#FFFFFF"
                      disabled={!soundEnabled}
                    />
                  </View>
                </View>

                {/* Volume Control */}
                <View
                  className={`bg-white/15 rounded-xl border border-white/30 p-4 ${
                    !soundEnabled ? 'opacity-50' : 'opacity-100'
                  }`}
                >
                  <View className="flex-row items-center mb-4">
                    <View className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mr-4">
                      <Icon
                        name="volume-low"
                        size={16}
                        color={!soundEnabled ? '#9CA3AF' : themeColors.accent}
                        solid
                      />
                    </View>
                    <View className="flex-1">
                      <Text
                        className={`text-base font-medium ${
                          !soundEnabled ? 'text-white opacity-50' : 'text-white'
                        }`}
                      >
                        Volume
                      </Text>
                      <Text
                        className={`text-sm ${
                          !soundEnabled
                            ? 'text-white opacity-40'
                            : 'text-white opacity-80'
                        }`}
                      >
                        샘플 오디오 볼륨 (음성은 시스템 볼륨 사용)
                      </Text>
                    </View>
                    <Text
                      className={`text-lg font-semibold ${
                        !soundEnabled ? 'text-white opacity-40' : 'text-white'
                      }`}
                    >
                      {volume}%
                    </Text>
                  </View>

                  <View className="flex-row items-center space-x-3">
                    <Icon
                      name="volume-off"
                      size={14}
                      color={!soundEnabled ? '#D1D5DB' : '#9CA3AF'}
                      solid
                    />
                    <View className="flex-1 mx-3">
                      <Slider
                        style={{ width: '100%', height: 40 }}
                        minimumValue={0}
                        maximumValue={100}
                        value={volume}
                        onValueChange={handleVolumeChange}
                        onSlidingComplete={handleVolumeTest}
                        minimumTrackTintColor={
                          !soundEnabled ? '#D1D5DB' : themeColors.accent
                        }
                        maximumTrackTintColor="#E5E7EB"
                        thumbTintColor={!soundEnabled ? '#D1D5DB' : themeColors.accent}
                        disabled={!soundEnabled}
                      />
                    </View>
                    <Icon
                      name="volume-high"
                      size={14}
                      color={!soundEnabled ? '#D1D5DB' : '#9CA3AF'}
                      solid
                    />
                  </View>
                </View>
              </View>

              {/* Haptic Section */}
              <View className="mb-8">
                <Text className="text-lg font-semibold text-white mb-4">
                  Haptic Feedback
                </Text>

                {/* Vibration Toggle */}
                <View className="bg-white/15 rounded-xl border border-white/30 p-4">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center flex-1">
                      <View className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-4">
                        <Icon
                          name="mobile-screen-button"
                          size={16}
                          color={themeColors.accent}
                          solid
                        />
                      </View>
                      <View className="flex-1">
                        <Text className="text-base font-medium text-white">
                          Vibration
                        </Text>
                        <Text className="text-sm text-white opacity-80">
                          Tactile feedback for intervals
                        </Text>
                      </View>
                    </View>
                    <Switch
                      value={vibrationEnabled}
                      onValueChange={handleVibrationToggle}
                      trackColor={{ false: '#D1D5DB', true: themeColors.accent }}
                      thumbColor="#FFFFFF"
                    />
                  </View>
                </View>
              </View>

              {/* Theme Section */}
              <View className="mb-8">
                <Text className="text-lg font-semibold text-white mb-4">
                  Theme
                </Text>

                {/* Color Scheme Selection */}
                <View className="bg-white/15 rounded-xl border border-white/30 p-4">
                  <View className="flex-row items-center mb-4">
                    <View className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-4">
                      <Icon
                        name="palette"
                        size={16}
                        color={themeColors.accent}
                        solid
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="text-base font-medium text-white">
                        Color Scheme
                      </Text>
                      <Text className="text-sm text-white opacity-80">
                        Choose your preferred color theme
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row justify-between px-2">
                    {/* Purple Theme */}
                    <TouchableOpacity
                      onPress={() => handleColorSchemeChange('purple')}
                      className="flex-1 items-center mr-2"
                    >
                      <View className="w-12 h-12 rounded-full mb-2 border-2 border-white/30"
                        style={{ backgroundColor: '#EC4899' }}
                      >
                        {theme.colorScheme === 'purple' && (
                          <View className="w-full h-full rounded-full flex items-center justify-center">
                            <Icon name="check" size={16} color="white" solid />
                          </View>
                        )}
                      </View>
                      <Text className="text-xs text-white opacity-80">Purple</Text>
                    </TouchableOpacity>

                    {/* Blue Theme */}
                    <TouchableOpacity
                      onPress={() => handleColorSchemeChange('blue')}
                      className="flex-1 items-center mx-2"
                    >
                      <View className="w-12 h-12 rounded-full mb-2 border-2 border-white/30"
                        style={{ backgroundColor: '#3B82F6' }}
                      >
                        {theme.colorScheme === 'blue' && (
                          <View className="w-full h-full rounded-full flex items-center justify-center">
                            <Icon name="check" size={16} color="white" solid />
                          </View>
                        )}
                      </View>
                      <Text className="text-xs text-white opacity-80">Blue</Text>
                    </TouchableOpacity>

                    {/* Green Theme */}
                    <TouchableOpacity
                      onPress={() => handleColorSchemeChange('green')}
                      className="flex-1 items-center ml-2"
                    >
                      <View className="w-12 h-12 rounded-full mb-2 border-2 border-white/30"
                        style={{ backgroundColor: '#10B981' }}
                      >
                        {theme.colorScheme === 'green' && (
                          <View className="w-full h-full rounded-full flex items-center justify-center">
                            <Icon name="check" size={16} color="white" solid />
                          </View>
                        )}
                      </View>
                      <Text className="text-xs text-white opacity-80">Green</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* About Section */}
              <View className="mt-8 pt-6 border-t border-white/30 flex-1 justify-center">
                <View className="items-center">
                  <View className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-3">
                    <Icon name="stopwatch" size={28} color="white" solid />
                  </View>
                  <Text className="text-lg font-semibold text-white mb-1">
                    FitInterval
                  </Text>
                  <Text className="text-sm text-white opacity-80 mb-2">
                    Version 1.0.0
                  </Text>
                  <Text className="text-xs text-white opacity-60">
                    Simple interval training timer
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
        <Drawer
          drawerVisible={drawerVisible}
          setDrawerVisible={setDrawerVisible}
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

export default SettingsScreen;
