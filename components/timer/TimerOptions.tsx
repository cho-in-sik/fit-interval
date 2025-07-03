import React from 'react';
import { View, Text, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface TimerOptionsProps {
  showOptions: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  keepScreenOn: boolean;
  onToggleOptions: () => void;
  onSoundToggle: (value: boolean) => void;
  onVibrationToggle: (value: boolean) => void;
  onKeepScreenOnToggle: (value: boolean) => void;
}

export const TimerOptions: React.FC<TimerOptionsProps> = ({
  showOptions,
  soundEnabled,
  vibrationEnabled,
  keepScreenOn,
  onToggleOptions,
  onSoundToggle,
  onVibrationToggle,
  onKeepScreenOnToggle,
}) => {
  return (
    <View className="mb-6">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-sm font-medium text-gray-700">
          Additional Options
        </Text>
        <TouchableOpacity
          onPress={onToggleOptions}
          className="flex-row items-center"
        >
          <Text className="text-blue-600 text-sm font-medium mr-1">
            {showOptions ? 'Hide' : 'Show'}
          </Text>
          <Ionicons
            name={showOptions ? 'chevron-up' : 'chevron-down'}
            size={12}
            color="#3B82F6"
          />
        </TouchableOpacity>
      </View>

      {showOptions && (
        <View className="bg-gray-50 rounded-xl p-4 space-y-4 flex gap-3">
          {/* Sound Toggle */}
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Ionicons name="volume-high" size={20} color="#374151" />
              <Text className="ml-3 text-gray-800">Sound</Text>
            </View>
            <Switch
              value={soundEnabled}
              onValueChange={onSoundToggle}
              trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Vibration Toggle */}
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Ionicons name="notifications" size={20} color="#374151" />
              <Text className="ml-3 text-gray-800">Vibration</Text>
            </View>
            <Switch
              value={vibrationEnabled}
              onValueChange={onVibrationToggle}
              trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Keep Screen On Toggle */}
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Ionicons name="phone-portrait" size={20} color="#374151" />
              <Text className="ml-3 text-gray-800">Keep Screen On</Text>
            </View>
            <Switch
              value={keepScreenOn}
              onValueChange={onKeepScreenOnToggle}
              trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>
      )}
    </View>
  );
};