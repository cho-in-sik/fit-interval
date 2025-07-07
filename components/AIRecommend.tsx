import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRef } from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';

export default function AIRecommend() {
  const glowAnim = useRef(new Animated.Value(0)).current;
  return (
    <View className="px-6 mb-8">
      <Animated.View
        style={{
          shadowColor: '#10B981',
          shadowOpacity: glowAnim,
          shadowRadius: 20,
          shadowOffset: { width: 0, height: 0 },
          elevation: 10,
        }}
      >
        <LinearGradient
          colors={['#10B981', '#059669']}
          className="rounded-2xl p-4 relative overflow-hidden"
        >
          <View className="absolute top-2 right-2">
            <Ionicons
              name="sparkles"
              size={20}
              color="white"
              style={{ opacity: 0.8 }}
            />
          </View>
          <Text className="text-sm font-semibold mb-1 text-white">
            🧠 AI Recommends
          </Text>
          <Text className="text-white text-sm opacity-90 mb-3">
            Based on your progress, try this power session!
          </Text>
          <View className="flex-row items-center justify-between">
            <Text className="text-xs text-white opacity-80">
              Work: 45s • Rest: 15s • Sets: 8
            </Text>
            <TouchableOpacity className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
              <Text className="text-xs font-medium text-white">Try Now</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Animated.View>
    </View>
  );
}
