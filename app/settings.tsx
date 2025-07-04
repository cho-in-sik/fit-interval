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
} from 'react-native';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/FontAwesome6';
import { Ionicons } from '@expo/vector-icons';
import Drawer from '@/components/Drawer';
import { useSettingsStore } from '@/store/settingsStore';
import { permissionService } from '@/services/permissionService';
import { audioService } from '@/services/audioService';

interface SettingsScreenProps {}

const SettingsScreen: React.FC<SettingsScreenProps> = () => {
  const {
    audio,
    setSoundEnabled,
    setVolume,
    setVoiceEnabled,
    setVibrationEnabled,
  } = useSettingsStore();

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [soundEnabled, setSoundEnabledLocal] = useState(audio.soundEnabled);
  const [voiceEnabled, setVoiceEnabledLocal] = useState(audio.voiceEnabled);
  const [volume, setVolumeLocal] = useState(audio.volume);
  const [vibrationEnabled, setVibrationEnabledLocal] = useState(audio.vibrationEnabled);

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

    const subscription = AppState.addEventListener('change', handleAppStateChange);
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
        alert('오디오 권한이 필요합니다. 앱을 재시작하면 권한을 다시 요청합니다.');
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
        alert('진동 권한이 필요합니다. 앱을 재시작하면 권한을 다시 요청합니다.');
        return;
      }
      await audioService.triggerHapticFeedback(true, 'medium');
    }
    setVibrationEnabledLocal(value);
    setVibrationEnabled(value);
  };


  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View className="flex-1 bg-white">
          {/* Settings Header */}

          <View className="flex-row items-center justify-between px-4 pb-4 bg-white border-b border-gray-200">
            <View className="flex-row items-center">
              <Image
                source={require('../assets/images/fitinterval.png')}
                style={{ width: 50, height: 50 }}
                resizeMode="cover"
              />
              <Text className="text-xl font-bold ml-2 text-gray-800">
                FitInterval
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setDrawerVisible(true)}
              className="w-10 h-10 items-center justify-center rounded-full "
            >
              <Ionicons name="menu" size={20} color="#374151" />
            </TouchableOpacity>
          </View>

          {/* Settings Content */}
          <View className="px-4 py-6 flex-1">
            {/* Audio Section */}
            <View className="mb-8">
              <Text className="text-lg font-semibold text-neutral-800 mb-4">
                Audio
              </Text>

              {/* Sound Toggle */}
              <View className="bg-white rounded-xl shadow-sm border border-neutral-200 p-4 mb-4">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center flex-1">
                    <View className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mr-4">
                      <Icon
                        name={soundEnabled ? "volume-high" : "volume-xmark"}
                        size={16}
                        color="#007AFF"
                        solid
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="text-base font-medium text-neutral-800">
                        Sound
                      </Text>
                      <Text className="text-sm text-neutral-600">
                        샘플 오디오 및 음성 안내 활성화
                      </Text>
                    </View>
                  </View>
                  <Switch
                    value={soundEnabled}
                    onValueChange={handleSoundToggle}
                    trackColor={{ false: '#D1D5DB', true: '#007AFF' }}
                    thumbColor="#FFFFFF"
                  />
                </View>
              </View>

              {/* Voice Toggle */}
              <View className={`bg-white rounded-xl shadow-sm border border-neutral-200 p-4 mb-4 ${
                !soundEnabled ? 'opacity-50' : 'opacity-100'
              }`}>
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center flex-1">
                    <View className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mr-4">
                      <Icon
                        name="microphone"
                        size={16}
                        color={!soundEnabled ? "#9CA3AF" : "#007AFF"}
                        solid
                      />
                    </View>
                    <View className="flex-1">
                      <Text className={`text-base font-medium ${!soundEnabled ? 'text-neutral-500' : 'text-neutral-800'}`}>
                        Voice Guidance
                      </Text>
                      <Text className={`text-sm ${!soundEnabled ? 'text-neutral-400' : 'text-neutral-600'}`}>
                        운동/휴식 전환 시 음성 안내
                      </Text>
                    </View>
                  </View>
                  <Switch
                    value={voiceEnabled && soundEnabled}
                    onValueChange={handleVoiceToggle}
                    trackColor={{ false: '#D1D5DB', true: '#007AFF' }}
                    thumbColor="#FFFFFF"
                    disabled={!soundEnabled}
                  />
                </View>
              </View>

              {/* Volume Control */}
              <View
                className={`bg-white rounded-xl shadow-sm border border-neutral-200 p-4 ${
                  !soundEnabled ? 'opacity-50' : 'opacity-100'
                }`}
              >
                <View className="flex-row items-center mb-4">
                  <View className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mr-4">
                    <Icon name="volume-low" size={16} color={!soundEnabled ? "#9CA3AF" : "#007AFF"} solid />
                  </View>
                  <View className="flex-1">
                    <Text className={`text-base font-medium ${!soundEnabled ? 'text-neutral-500' : 'text-neutral-800'}`}>
                      Volume
                    </Text>
                    <Text className={`text-sm ${!soundEnabled ? 'text-neutral-400' : 'text-neutral-600'}`}>
                      샘플 오디오 볼륨 (음성은 시스템 볼륨 사용)
                    </Text>
                  </View>
                  <Text className={`text-lg font-semibold ${!soundEnabled ? 'text-neutral-400' : 'text-blue-600'}`}>
                    {volume}%
                  </Text>
                </View>

                <View className="flex-row items-center space-x-3">
                  <Icon name="volume-off" size={14} color={!soundEnabled ? "#D1D5DB" : "#9CA3AF"} solid />
                  <View className="flex-1 mx-3">
                    <Slider
                      style={{ width: '100%', height: 40 }}
                      minimumValue={0}
                      maximumValue={100}
                      value={volume}
                      onValueChange={handleVolumeChange}
                      onSlidingComplete={handleVolumeTest}
                      minimumTrackTintColor={!soundEnabled ? "#D1D5DB" : "#007AFF"}
                      maximumTrackTintColor="#E5E7EB"
                      thumbTintColor={!soundEnabled ? "#D1D5DB" : "#007AFF"}
                      disabled={!soundEnabled}
                    />
                  </View>
                  <Icon name="volume-high" size={14} color={!soundEnabled ? "#D1D5DB" : "#9CA3AF"} solid />
                </View>
              </View>
            </View>

            {/* Haptic Section */}
            <View className="mb-8">
              <Text className="text-lg font-semibold text-neutral-800 mb-4">
                Haptic Feedback
              </Text>

              {/* Vibration Toggle */}
              <View className="bg-white rounded-xl shadow-sm border border-neutral-200 p-4">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center flex-1">
                    <View className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mr-4">
                      <Icon
                        name="mobile-screen-button"
                        size={16}
                        color="#007AFF"
                        solid
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="text-base font-medium text-neutral-800">
                        Vibration
                      </Text>
                      <Text className="text-sm text-neutral-600">
                        Tactile feedback for intervals
                      </Text>
                    </View>
                  </View>
                  <Switch
                    value={vibrationEnabled}
                    onValueChange={handleVibrationToggle}
                    trackColor={{ false: '#D1D5DB', true: '#007AFF' }}
                    thumbColor="#FFFFFF"
                  />
                </View>
              </View>
            </View>

            {/* About Section */}
            <View className="mt-8 pt-6 border-t border-neutral-200 flex-1 justify-center">
              <View className="items-center">
                <View className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-3">
                  <Icon name="stopwatch" size={28} color="#007AFF" solid />
                </View>
                <Text className="text-lg font-semibold text-neutral-800 mb-1">
                  FitInterval
                </Text>
                <Text className="text-sm text-neutral-600 mb-2">
                  Version 1.0.0
                </Text>
                <Text className="text-xs text-neutral-500">
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
  );
};

export default SettingsScreen;
