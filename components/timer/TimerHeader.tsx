import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface TimerHeaderProps {
  onMenuPress: () => void;
}

export const TimerHeader: React.FC<TimerHeaderProps> = ({ onMenuPress }) => {
  return (
    <View className="flex-row items-center justify-between px-4 pb-4 bg-white border-b border-gray-200">
      <View className="flex-row items-center">
        <Image
          source={require('../../assets/images/fitinterval.png')}
          style={{ width: 50, height: 50 }}
          resizeMode="cover"
        />
        <Text className="text-xl font-bold ml-2 text-gray-800">
          FitInterval
        </Text>
      </View>
      <TouchableOpacity
        onPress={onMenuPress}
        className="w-10 h-10 items-center justify-center rounded-full"
      >
        <Ionicons name="menu" size={20} color="#374151" />
      </TouchableOpacity>
    </View>
  );
};
