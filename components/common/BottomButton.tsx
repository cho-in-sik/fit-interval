import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface BottomButtonProps {
  title: string;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  disabled?: boolean;
}

export const BottomButton: React.FC<BottomButtonProps> = ({
  title,
  onPress,
  icon = 'play',
  disabled = false,
}) => {
  return (
    <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 pb-8">
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        className={`w-full py-4 rounded-xl shadow-md flex-row items-center justify-center ${
          disabled ? 'bg-gray-400' : 'bg-[#007AFF] active:bg-blue-700'
        }`}
      >
        <Ionicons name={icon} size={20} color="white" />
        <Text className="text-white font-semibold ml-2">{title}</Text>
      </TouchableOpacity>
    </View>
  );
};
