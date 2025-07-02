import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  SafeAreaView,
  StatusBar,
  Switch,
  Vibration,
  Animated,
  Dimensions,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Drawer from '@/components/Drawer';
import { useSettingsStore } from '@/store/settingsStore';
import { permissionService } from '@/services/permissionService';

interface TimerSettings {
  workTime: { minutes: number; seconds: number };
  restTime: { minutes: number; seconds: number };
  sets: number;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  keepScreenOn: boolean;
}

const FitIntervalApp: React.FC = () => {
  const router = useRouter();
  const { audio, timer, setTimerSettings } = useSettingsStore();
  
  const [settings, setSettings] = useState<TimerSettings>({
    workTime: timer.workTime,
    restTime: timer.restTime,
    sets: timer.sets,
    soundEnabled: audio.soundEnabled,
    vibrationEnabled: audio.vibrationEnabled,
    keepScreenOn: timer.keepScreenOn,
  });

  // Sync settings with global store when they change
  useEffect(() => {
    setSettings({
      workTime: timer.workTime,
      restTime: timer.restTime,
      sets: timer.sets,
      soundEnabled: audio.soundEnabled,
      vibrationEnabled: audio.vibrationEnabled,
      keepScreenOn: timer.keepScreenOn,
    });
  }, [audio, timer]);

  const [drawerVisible, setDrawerVisible] = useState(false);

  const [showOptions, setShowOptions] = useState(false);
  const [timePickerModal, setTimePickerModal] = useState({
    visible: false,
    type: 'work' as 'work' | 'rest',
    minutes: 0,
    seconds: 0,
  });

  const formatTime = (minutes: number, seconds: number): string => {
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  };

  const calculateTotalTime = () => {
    const workSeconds =
      settings.workTime.minutes * 60 + settings.workTime.seconds;
    const restSeconds =
      settings.restTime.minutes * 60 + settings.restTime.seconds;
    const totalSeconds = (workSeconds + restSeconds) * settings.sets;

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return {
      total: formatTime(minutes, seconds),
      work: formatTime(
        Math.floor((workSeconds * settings.sets) / 60),
        (workSeconds * settings.sets) % 60,
      ),
      rest: formatTime(
        Math.floor((restSeconds * settings.sets) / 60),
        (restSeconds * settings.sets) % 60,
      ),
    };
  };

  const openTimePicker = (type: 'work' | 'rest') => {
    const time = type === 'work' ? settings.workTime : settings.restTime;
    setTimePickerModal({
      visible: true,
      type,
      minutes: time.minutes,
      seconds: time.seconds,
    });
  };

  const confirmTimePicker = () => {
    const newTime = {
      minutes: timePickerModal.minutes,
      seconds: timePickerModal.seconds,
    };
    
    if (timePickerModal.type === 'work') {
      setSettings((prev) => ({ ...prev, workTime: newTime }));
      setTimerSettings({ workTime: newTime });
    } else {
      setSettings((prev) => ({ ...prev, restTime: newTime }));
      setTimerSettings({ restTime: newTime });
    }
    setTimePickerModal((prev) => ({ ...prev, visible: false }));
  };

  const adjustTime = (
    type: 'minutes' | 'seconds',
    direction: 'up' | 'down',
  ) => {
    setTimePickerModal((prev) => {
      const newValue = prev[type] + (direction === 'up' ? 1 : -1);
      const min = 0;
      const max = type === 'minutes' ? 59 : 59;

      return {
        ...prev,
        [type]: Math.max(min, Math.min(max, newValue)),
      };
    });
  };

  const adjustSets = (direction: 'up' | 'down') => {
    const newSets = Math.max(
      1,
      Math.min(99, settings.sets + (direction === 'up' ? 1 : -1)),
    );
    setSettings((prev) => ({ ...prev, sets: newSets }));
    setTimerSettings({ sets: newSets });
  };

  const startTimer = async () => {
    let canProceed = true;
    
    if (audio.soundEnabled) {
      const hasAudioPermission = await permissionService.requestAudioPermission();
      if (!hasAudioPermission) {
        canProceed = false;
      }
    }
    
    if (audio.vibrationEnabled) {
      const hasHapticsPermission = await permissionService.requestHapticsPermission();
      if (!hasHapticsPermission) {
        canProceed = false;
      }
      Vibration.vibrate(100);
    }
    
    if (!canProceed) {
      return;
    }
    
    const workSeconds =
      timer.workTime.minutes * 60 + timer.workTime.seconds;
    const restSeconds =
      timer.restTime.minutes * 60 + timer.restTime.seconds;

    router.push({
      pathname: '/counter',
      params: {
        workTime: workSeconds,
        restTime: restSeconds,
        sets: timer.sets,
        soundEnabled: audio.soundEnabled.toString(),
        vibrationEnabled: audio.vibrationEnabled.toString(),
        keepScreenOn: timer.keepScreenOn.toString(),
      },
    });
  };

  const timeData = calculateTotalTime();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
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

        {/* Main Content */}
        <View className="px-4 py-6">
          {/* Intro Section */}
          <View className="mb-8">
            <Text className="text-2xl font-bold text-gray-800 mb-2">
              Set Your Interval Timer
            </Text>
            <Text className="text-gray-700">
              Configure your workout intervals and tap start when ready.
            </Text>
          </View>

          {/* Timer Settings */}
          <View className="space-y-5 mb-8 flex gap-5">
            {/* Work Time Setting */}
            <TouchableOpacity
              onPress={() => openTimePicker('work')}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
            >
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-1">
                    Work Time
                  </Text>
                  <View className="flex-row items-center">
                    <Text className="text-2xl font-semibold text-gray-800">
                      {formatTime(
                        settings.workTime.minutes,
                        settings.workTime.seconds,
                      )}
                    </Text>
                    <Text className="ml-1 text-gray-700 text-sm">sec</Text>
                  </View>
                </View>
                <View className="w-12 h-12 rounded-full bg-blue-50 items-center justify-center">
                  <Ionicons name="chevron-forward" size={16} color="#3B82F6" />
                </View>
              </View>
            </TouchableOpacity>

            {/* Rest Time Setting */}
            <TouchableOpacity
              onPress={() => openTimePicker('rest')}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
            >
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-1">
                    Rest Time
                  </Text>
                  <View className="flex-row items-center">
                    <Text className="text-2xl font-semibold text-gray-800">
                      {formatTime(
                        settings.restTime.minutes,
                        settings.restTime.seconds,
                      )}
                    </Text>
                    <Text className="ml-1 text-gray-700 text-sm">sec</Text>
                  </View>
                </View>
                <View className="w-12 h-12 rounded-full bg-blue-50 items-center justify-center">
                  <Ionicons name="chevron-forward" size={16} color="#3B82F6" />
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
                      {settings.sets}
                    </Text>
                    <Text className="ml-1 text-gray-700 text-sm">sets</Text>
                  </View>
                </View>
                <View className="flex-row items-center">
                  <TouchableOpacity
                    onPress={() => adjustSets('down')}
                    className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mr-2"
                  >
                    <Ionicons name="remove" size={16} color="#374151" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => adjustSets('up')}
                    className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center"
                  >
                    <Ionicons name="add" size={16} color="#374151" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          {/* Additional Options */}
          <View className="mb-6">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-sm font-medium text-gray-700">
                Additional Options
              </Text>
              <TouchableOpacity
                onPress={() => setShowOptions(!showOptions)}
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
                    value={settings.soundEnabled}
                    onValueChange={(value) =>
                      setSettings((prev) => ({ ...prev, soundEnabled: value }))
                    }
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
                    value={settings.vibrationEnabled}
                    onValueChange={(value) =>
                      setSettings((prev) => ({
                        ...prev,
                        vibrationEnabled: value,
                      }))
                    }
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
                    value={settings.keepScreenOn}
                    onValueChange={(value) =>
                      setSettings((prev) => ({ ...prev, keepScreenOn: value }))
                    }
                    trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
                    thumbColor="#FFFFFF"
                  />
                </View>
              </View>
            )}
          </View>

          {/* Workout Summary */}
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
        </View>
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 pb-8">
        <TouchableOpacity
          onPress={startTimer}
          className="w-full py-4 bg-[#007AFF] rounded-xl shadow-md flex-row items-center justify-center active:bg-blue-700"
        >
          <Ionicons name="play" size={20} color="white" />
          <Text className="text-white font-semibold ml-2">Start Timer</Text>
        </TouchableOpacity>
      </View>

      {/* Time Picker Modal */}
      <Modal
        visible={timePickerModal.visible}
        transparent={true}
        animationType="slide"
        onRequestClose={() =>
          setTimePickerModal((prev) => ({ ...prev, visible: false }))
        }
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-2xl p-5">
            <View className="flex-row justify-between items-center mb-5">
              <Text className="text-lg font-semibold text-gray-800">
                Set {timePickerModal.type === 'work' ? 'Work' : 'Rest'} Time
              </Text>
              <TouchableOpacity
                onPress={() =>
                  setTimePickerModal((prev) => ({ ...prev, visible: false }))
                }
                className="w-8 h-8 items-center justify-center rounded-full bg-gray-100"
              >
                <Ionicons name="close" size={16} color="#374151" />
              </TouchableOpacity>
            </View>

            <View className="flex-row justify-center items-center space-x-4 mb-8">
              {/* Minutes */}
              <View className="items-center">
                <Text className="text-xs text-gray-600 mb-1">Minutes</Text>
                <View className="items-center">
                  <TouchableOpacity
                    onPress={() => adjustTime('minutes', 'up')}
                    className="w-12 h-12 rounded-full bg-gray-100 items-center justify-center mb-2"
                  >
                    <Ionicons name="chevron-up" size={16} color="#374151" />
                  </TouchableOpacity>
                  <View className="w-16 h-16 items-center justify-center">
                    <Text className="text-3xl font-bold">
                      {timePickerModal.minutes.toString().padStart(2, '0')}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => adjustTime('minutes', 'down')}
                    className="w-12 h-12 rounded-full bg-gray-100 items-center justify-center mt-2"
                  >
                    <Ionicons name="chevron-down" size={16} color="#374151" />
                  </TouchableOpacity>
                </View>
              </View>

              <Text className="text-4xl font-bold mt-8">:</Text>

              {/* Seconds */}
              <View className="items-center">
                <Text className="text-xs text-gray-600 mb-1">Seconds</Text>
                <View className="items-center">
                  <TouchableOpacity
                    onPress={() => adjustTime('seconds', 'up')}
                    className="w-12 h-12 rounded-full bg-gray-100 items-center justify-center mb-2"
                  >
                    <Ionicons name="chevron-up" size={16} color="#374151" />
                  </TouchableOpacity>
                  <View className="w-16 h-16 items-center justify-center">
                    <Text className="text-3xl font-bold">
                      {timePickerModal.seconds.toString().padStart(2, '0')}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => adjustTime('seconds', 'down')}
                    className="w-12 h-12 rounded-full bg-gray-100 items-center justify-center mt-2"
                  >
                    <Ionicons name="chevron-down" size={16} color="#374151" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <TouchableOpacity
              onPress={confirmTimePicker}
              className="w-full py-4 bg-blue-600 rounded-xl"
            >
              <Text className="text-white font-semibold text-center">
                Confirm
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Drawer Menu Modal */}
      <Drawer
        drawerVisible={drawerVisible}
        setDrawerVisible={setDrawerVisible}
      />
    </SafeAreaView>
  );
};

export default FitIntervalApp;
