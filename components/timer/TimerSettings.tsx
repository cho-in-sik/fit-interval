import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatTime } from '@/utils/timeFormatter';

interface TimerSettingsProps {
  workTime: { minutes: number; seconds: number };
  restTime: { minutes: number; seconds: number };
  sets: number;
  onWorkTimePress: () => void;
  onRestTimePress: () => void;
  onSetsAdjust: (direction: 'up' | 'down') => void;
}

export const TimerSettings: React.FC<TimerSettingsProps> = ({
  workTime,
  restTime,
  sets,
  onWorkTimePress,
  onRestTimePress,
  onSetsAdjust,
}) => {
  return (
    <View className="space-y-5 mb-8 flex gap-5">
      {/* Work Time Setting */}
      <TouchableOpacity
        onPress={onWorkTimePress}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
      >
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1">
              Work Time
            </Text>
            <View className="flex-row items-center">
              <Text className="text-2xl font-semibold text-gray-800">
                {formatTime(workTime.minutes, workTime.seconds)}
              </Text>
              <Text className="ml-1 text-gray-700 text-sm">sec</Text>
            </View>
          </View>
          <View className="w-12 h-12 rounded-full bg-emerald-50 items-center justify-center">
            <Ionicons name="chevron-forward" size={16} color="#10B981" />
          </View>
        </View>
      </TouchableOpacity>

      {/* Rest Time Setting */}
      <TouchableOpacity
        onPress={onRestTimePress}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
      >
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1">
              Rest Time
            </Text>
            <View className="flex-row items-center">
              <Text className="text-2xl font-semibold text-gray-800">
                {formatTime(restTime.minutes, restTime.seconds)}
              </Text>
              <Text className="ml-1 text-gray-700 text-sm">sec</Text>
            </View>
          </View>
          <View className="w-12 h-12 rounded-full bg-emerald-50 items-center justify-center">
            <Ionicons name="chevron-forward" size={16} color="#10B981" />
          </View>
        </View>
      </TouchableOpacity>

      {/* Number of Sets */}
      <View className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1">
              Number of Sets
            </Text>
            <View className="flex-row items-center">
              <Text className="text-2xl font-semibold text-gray-800">
                {sets}
              </Text>
              <Text className="ml-1 text-gray-700 text-sm">sets</Text>
            </View>
          </View>
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => onSetsAdjust('down')}
              className="w-10 h-10 rounded-full bg-emerald-50 items-center justify-center mr-2"
            >
              <Ionicons name="remove" size={16} color="#10B981" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onSetsAdjust('up')}
              className="w-10 h-10 rounded-full bg-emerald-50 items-center justify-center"
            >
              <Ionicons name="add" size={16} color="#10B981" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};