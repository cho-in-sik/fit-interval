import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  StatusBar,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Drawer from '@/components/Drawer';

const WorkoutHistoryScreen: React.FC = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const handleBackPress = () => {
    // 네비게이션 백 로직
    console.log('Back pressed');
  };

  const handleUpgradePress = () => {
    Alert.alert('업그레이드', '업그레이드 기능이 곧 출시됩니다!');
  };

  const workoutData = [
    {
      id: 1,
      title: "Today's Workout",
      date: 'Dec 22, 2024 • 3:45 PM',
      duration: '08:30',
      sets: '8 sets',
      work: '45s',
      rest: '15s',
      icon: 'barbell' as const,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      id: 2,
      title: 'HIIT Session',
      date: 'Dec 21, 2024 • 7:20 AM',
      duration: '06:15',
      sets: '6 sets',
      work: '30s',
      rest: '30s',
      icon: 'flame' as const,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      id: 3,
      title: 'Quick Burn',
      date: 'Dec 20, 2024 • 6:15 PM',
      duration: '04:45',
      sets: '5 sets',
      work: '20s',
      rest: '20s',
      icon: 'flash' as const,
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
    },
    {
      id: 4,
      title: 'Cardio Blast',
      date: 'Dec 19, 2024 • 8:30 AM',
      duration: '03:20',
      sets: '4 sets',
      work: '25s',
      rest: '25s',
      icon: 'heart' as const,
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      id: 5,
      title: 'Morning Run',
      date: 'Dec 18, 2024 • 6:45 AM',
      duration: '01:55',
      sets: '3 sets',
      work: '15s',
      rest: '15s',
      icon: 'walk' as const,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />

      {/* Header */}
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

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Main Content */}
        <View className="px-4 py-6">
          {/* Workout Stats */}
          <View className="mb-8">
            <View className="flex-row gap-4">
              {/* Total Workout Time */}
              <View className="flex-1 bg-blue-50 rounded-xl p-4 items-center">
                <View className="flex items-center justify-center mb-2">
                  <Ionicons name="time" size={20} color="#3B82F6" />
                </View>
                <Text className="text-xs text-gray-600 mb-1">Total Time</Text>
                <Text className="text-2xl font-bold text-blue-600">24:35</Text>
              </View>

              {/* Completed Workouts */}
              <View className="flex-1 bg-green-50 rounded-xl p-4 items-center">
                <View className="flex items-center justify-center mb-2">
                  <Ionicons name="trophy" size={20} color="#059669" />
                </View>
                <Text className="text-xs text-gray-600 mb-1">Completed</Text>
                <Text className="text-2xl font-bold text-green-600">5</Text>
              </View>
            </View>
          </View>

          {/* Workout History */}
          <View className="mb-6">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-semibold text-gray-800">
                Recent Workouts
              </Text>
              <View className="bg-gray-100 px-2 py-1 rounded-full">
                <Text className="text-xs text-gray-500">Free Plan</Text>
              </View>
            </View>

            <View className="space-y-3">
              {workoutData.map((workout) => (
                <View
                  key={workout.id}
                  className="bg-white rounded-xl border border-gray-200 p-4 mb-3"
                >
                  <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-row items-center flex-1">
                      <View
                        className={`w-10 h-10 ${workout.bgColor} rounded-full flex items-center justify-center mr-3`}
                      >
                        <Ionicons
                          name={workout.icon}
                          size={16}
                          color={
                            workout.iconColor.includes('blue')
                              ? '#2563EB'
                              : workout.iconColor.includes('green')
                              ? '#059669'
                              : workout.iconColor.includes('orange')
                              ? '#EA580C'
                              : workout.iconColor.includes('purple')
                              ? '#9333EA'
                              : '#2563EB'
                          }
                        />
                      </View>
                      <View className="flex-1">
                        <Text className="font-medium text-gray-800">
                          {workout.title}
                        </Text>
                        <Text className="text-xs text-gray-600">
                          {workout.date}
                        </Text>
                      </View>
                    </View>
                    <View className="items-end">
                      <Text className="text-sm font-semibold text-gray-800">
                        {workout.duration}
                      </Text>
                      <Text className="text-xs text-gray-600">
                        {workout.sets}
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row items-center">
                    <Text className="text-xs text-gray-600 mr-4">
                      Work: {workout.work}
                    </Text>
                    <Text className="text-xs text-gray-600">
                      Rest: {workout.rest}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Free Plan Limitation */}
          <View className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-4 items-center">
            <Ionicons
              name="star"
              size={24}
              color="#FDE047"
              style={{ marginBottom: 8 }}
            />
            <Text className="font-semibold text-white mb-1">
              Upgrade to Pro
            </Text>
            <Text className="text-sm text-blue-100 mb-3 text-center">
              View unlimited workout history and detailed analytics
            </Text>
            <TouchableOpacity
              onPress={handleUpgradePress}
              className="bg-white px-4 py-2 rounded-lg"
              activeOpacity={0.8}
            >
              <Text className="text-blue-600 font-semibold text-sm">
                Upgrade Now
              </Text>
            </TouchableOpacity>
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

export default WorkoutHistoryScreen;
