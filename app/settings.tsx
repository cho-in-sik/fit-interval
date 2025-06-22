import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Vibration,
  SafeAreaView,
} from 'react-native';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/FontAwesome6';

interface SettingsScreenProps {
  onBack?: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack }) => {
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [volume, setVolume] = useState(75);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);

  const handleVoiceToggle = (value: boolean) => {
    setVoiceEnabled(value);
  };

  const handleVolumeChange = (value: number) => {
    setVolume(Math.round(value));
  };

  const handleVibrationToggle = (value: boolean) => {
    setVibrationEnabled(value);
    if (value) {
      Vibration.vibrate(50);
    }
  };

  const handleBackPress = () => {
    if (onBack) {
      onBack();
    }
    console.log('Navigate back to home screen');
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
          <View className="px-4 py-5 border-b border-neutral-200 flex-row items-center">
            <TouchableOpacity
              onPress={handleBackPress}
              className="w-10 h-10 flex items-center justify-center rounded-full active:bg-neutral-100 mr-3"
              activeOpacity={0.7}
            >
              <Icon name="chevron-left" size={16} color="#374151" solid />
            </TouchableOpacity>
            <View className="flex-row items-center">
              <Icon name="gear" size={20} color="#007AFF" solid />
              <Text className="text-xl font-bold ml-2 text-neutral-800">
                Settings
              </Text>
            </View>
          </View>

          {/* Settings Content */}
          <View className="px-4 py-6 flex-1">
            {/* Audio Section */}
            <View className="mb-8">
              <Text className="text-lg font-semibold text-neutral-800 mb-4">
                Audio
              </Text>

              {/* Voice Toggle */}
              <View className="bg-white rounded-xl shadow-sm border border-neutral-200 p-4 mb-4">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center flex-1">
                    <View className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mr-4">
                      <Icon
                        name="volume-high"
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
                    value={voiceEnabled}
                    onValueChange={handleVoiceToggle}
                    trackColor={{ false: '#D1D5DB', true: '#007AFF' }}
                    thumbColor="#FFFFFF"
                  />
                </View>
              </View>

              {/* Volume Control */}
              <View
                className={`bg-white rounded-xl shadow-sm border border-neutral-200 p-4 ${
                  !voiceEnabled ? 'opacity-50' : 'opacity-100'
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
                      minimumTrackTintColor="#007AFF"
                      maximumTrackTintColor="#E5E7EB"
                      thumbTintColor="#007AFF"
                      disabled={!voiceEnabled}
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
    </SafeAreaView>
  );
};

export default SettingsScreen;
