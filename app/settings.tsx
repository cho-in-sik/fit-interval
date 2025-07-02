import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  SafeAreaView,
  Image,
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

  const handleSoundToggle = async (value: boolean) => {
    if (value) {
      const hasPermission = await permissionService.requestAudioPermission();
      if (!hasPermission) {
        setSoundEnabledLocal(false);
        setSoundEnabled(false);
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
      await audioService.playWorkSound(volume, true);
    }
  };

  const handleVibrationToggle = async (value: boolean) => {
    if (value) {
      const hasPermission = await permissionService.requestHapticsPermission();
      if (!hasPermission) {
        setVibrationEnabledLocal(false);
        setVibrationEnabled(false);
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
                        Enable all audio sounds
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
                        color="#007AFF"
                        solid
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="text-base font-medium text-neutral-800">
                        Voice Guidance
                      </Text>
                      <Text className="text-sm text-neutral-600">
                        Audio cues for intervals
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
                    <Icon name="volume-low" size={16} color="#007AFF" solid />
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-medium text-neutral-800">
                      Voice Volume
                    </Text>
                    <Text className="text-sm text-neutral-600">
                      Adjust audio level
                    </Text>
                  </View>
                  <Text className="text-lg font-semibold text-blue-600">
                    {volume}%
                  </Text>
                </View>

                <View className="flex-row items-center space-x-3">
                  <Icon name="volume-off" size={14} color="#9CA3AF" solid />
                  <View className="flex-1 mx-3">
                    <Slider
                      style={{ width: '100%', height: 40 }}
                      minimumValue={0}
                      maximumValue={100}
                      value={volume}
                      onValueChange={handleVolumeChange}
                      onSlidingComplete={handleVolumeTest}
                      minimumTrackTintColor="#007AFF"
                      maximumTrackTintColor="#E5E7EB"
                      thumbTintColor="#007AFF"
                      disabled={!soundEnabled}
                    />
                  </View>
                  <Icon name="volume-high" size={14} color="#9CA3AF" solid />
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
