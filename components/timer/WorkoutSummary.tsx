import React from 'react';
import { View, Text } from 'react-native';
import { TimeCalculation } from '@/utils/timerCalculator';

interface WorkoutSummaryProps {
  timeData: TimeCalculation;
}

export const WorkoutSummary: React.FC<WorkoutSummaryProps> = ({ timeData }) => {
  return (
    <View className="bg-gray-50 rounded-xl p-4 mb-20">
      <Text className="text-sm font-medium text-gray-700 mb-3">
        Workout Summary
      </Text>
      <View className="flex-row justify-around">
        <View className="items-center">
          <Text className="text-xs text-gray-600">Total Time</Text>
          <Text className="text-lg font-semibold text-gray-800">
            {timeData.total}
          </Text>
        </View>
        <View className="items-center">
          <Text className="text-xs text-gray-600">Work</Text>
          <Text className="text-lg font-semibold text-gray-800">
            {timeData.work}
          </Text>
        </View>
        <View className="items-center">
          <Text className="text-xs text-gray-600">Rest</Text>
          <Text className="text-lg font-semibold text-gray-800">
            {timeData.rest}
          </Text>
        </View>
      </View>
    </View>
  );
};