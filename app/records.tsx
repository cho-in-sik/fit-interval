import React, { useState, useEffect } from 'react';
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
import { workoutStorage, WorkoutRecord } from '@/utils/workoutStorage';
import { LinearGradient } from 'expo-linear-gradient';

const WorkoutHistoryScreen: React.FC = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [workoutRecords, setWorkoutRecords] = useState<WorkoutRecord[]>([]);
  const [stats, setStats] = useState({ totalTime: 0, totalWorkouts: 0 });

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = async () => {
    try {
      const records = await workoutStorage.getWorkouts();
      setWorkoutRecords(records);
      const workoutStats = workoutStorage.getTotalStats(records);
      setStats(workoutStats);
    } catch (error) {
      console.error('Error loading workouts:', error);
    }
  };

  const handleUpgradePress = () => {
    Alert.alert('업그레이드', '업그레이드 기능이 곧 출시됩니다!');
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
      .toString()
      .padStart(2, '0')}`;
  };

  const formatTimeText = (seconds: number): string => {
    if (seconds < 60) {
      return `${seconds}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0
      ? `${minutes}m ${remainingSeconds}s`
      : `${minutes}m`;
  };

  const getIconForWorkout = (index: number) => {
    const icons = ['barbell', 'flame', 'flash', 'heart', 'walk'] as const;
    return icons[index % icons.length];
  };

  const getBgColorForWorkout = (index: number) => {
    const colors = [
      'bg-blue-50',
      'bg-green-50',
      'bg-orange-50',
      'bg-purple-50',
      'bg-indigo-50',
    ];
    return colors[index % colors.length];
  };

  const getIconColorForWorkout = (index: number) => {
    const colors = ['#2563EB', '#059669', '#EA580C', '#9333EA', '#4F46E5'];
    return colors[index % colors.length];
  };

  return (
    <LinearGradient colors={['#667eea', '#764ba2']} style={{ flex: 1 }}>
      <SafeAreaView className="flex-1">
        <StatusBar barStyle="light-content" />

        {/* Header */}
        <View className="flex-row items-center justify-between px-4 pb-4 pt-4">
          <View className="flex-row items-center">
            <Image
              source={require('../assets/images/newFitInterval.png')}
              style={{ width: 50, height: 50 }}
              resizeMode="cover"
            />
            <Text className="text-xl font-bold ml-2 text-white">
              FitInterval
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setDrawerVisible(true)}
            className="w-10 h-10 items-center justify-center rounded-full bg-white/20"
          >
            <Ionicons name="menu" size={20} color="white" />
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
              <View className="flex-1 bg-white/15 rounded-xl border border-white/30 p-4 items-center">
                <View className="flex items-center justify-center mb-2">
                  <Ionicons name="time" size={20} color="#EC4899" />
                </View>
                <Text className="text-xs text-white opacity-80 mb-1">Total Time</Text>
                <Text className="text-2xl font-bold text-white">
                  {formatDuration(stats.totalTime)}
                </Text>
              </View>

              {/* Completed Workouts */}
              <View className="flex-1 bg-white/15 rounded-xl border border-white/30 p-4 items-center">
                <View className="flex items-center justify-center mb-2">
                  <Ionicons name="trophy" size={20} color="#10B981" />
                </View>
                <Text className="text-xs text-white opacity-80 mb-1">Completed</Text>
                <Text className="text-2xl font-bold text-white">
                  {stats.totalWorkouts}
                </Text>
              </View>
            </View>
          </View>

          {/* Workout History */}
          <View className="mb-6">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-semibold text-white">
                Recent Workouts
              </Text>
              <View className="bg-white/20 px-2 py-1 rounded-full">
                <Text className="text-xs text-white opacity-80">Free Plan</Text>
              </View>
            </View>

            <View className="space-y-3">
              {workoutRecords.length === 0 ? (
                <View className="bg-white/10 rounded-xl p-8 items-center">
                  <Ionicons name="fitness" size={48} color="white" />
                  <Text className="text-white text-center mt-4 text-base">
                    No workouts yet
                  </Text>
                  <Text className="text-white opacity-80 text-center mt-2 text-sm">
                    Complete your first workout to see it here!
                  </Text>
                </View>
              ) : (
                workoutRecords.map((workout, index) => (
                  <View
                    key={workout.id}
                    className="bg-white/15 rounded-xl border border-white/30 p-4 mb-3"
                  >
                    <View className="flex-row items-center justify-between mb-3">
                      <View className="flex-row items-center flex-1">
                        <View
                          className={`w-10 h-10 ${getBgColorForWorkout(
                            index,
                          )} rounded-full flex items-center justify-center mr-3`}
                        >
                          <Ionicons
                            name={getIconForWorkout(index)}
                            size={16}
                            color={getIconColorForWorkout(index)}
                          />
                        </View>
                        <View className="flex-1">
                          <Text className="font-medium text-white">
                            {workout.title}
                          </Text>
                          <Text className="text-xs text-white opacity-80">
                            {workout.date}
                          </Text>
                        </View>
                      </View>
                      <View className="items-end">
                        <Text className="text-sm font-semibold text-white">
                          {formatDuration(workout.duration)}
                        </Text>
                        <Text className="text-xs text-white opacity-80">
                          {workout.sets} sets
                        </Text>
                      </View>
                    </View>
                    <View className="flex-row items-center">
                      <Text className="text-xs text-white opacity-80 mr-4">
                        Work: {formatTimeText(workout.workTime)}
                      </Text>
                      <Text className="text-xs text-white opacity-80">
                        Rest: {formatTimeText(workout.restTime)}
                      </Text>
                    </View>
                  </View>
                ))
              )}
            </View>
          </View>

          {/* Free Plan Limitation */}
          <LinearGradient
            colors={['#EC4899', '#8B5CF6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ borderRadius: 12, padding: 16, alignItems: 'center' }}
          >
            <Ionicons
              name="star"
              size={24}
              color="#FDE047"
              style={{ marginBottom: 8 }}
            />
            <Text className="font-semibold text-white mb-1">
              Upgrade to Pro
            </Text>
            <Text className="text-sm text-white opacity-90 mb-3 text-center">
              View unlimited workout history and detailed analytics
            </Text>
            <TouchableOpacity
              onPress={handleUpgradePress}
              className="bg-white px-4 py-2 rounded-lg"
              activeOpacity={0.8}
            >
              <Text className="text-purple-600 font-semibold text-sm">
                Upgrade Now
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </ScrollView>
      <Drawer
        drawerVisible={drawerVisible}
        setDrawerVisible={setDrawerVisible}
      />
      </SafeAreaView>
    </LinearGradient>
  );
};

export default WorkoutHistoryScreen;
