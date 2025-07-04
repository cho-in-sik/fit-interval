import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TextInput,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Drawer from '@/components/Drawer';
import { TimerHeader } from '@/components/timer/TimerHeader';
import { TimerSettings } from '@/components/timer/TimerSettings';
import { TimerOptions } from '@/components/timer/TimerOptions';
import { WorkoutSummary } from '@/components/timer/WorkoutSummary';
import { TimePickerModal } from '@/components/timer/TimePickerModal';
import { BottomButton } from '@/components/common/BottomButton';
import { useTimerSettings } from '@/hooks/useTimerSettings';
import { useTimePicker } from '@/hooks/useTimePicker';
import { useTimer } from '@/hooks/useTimer';
import { calculateTotalTime } from '@/utils/timerCalculator';
import { permissionService } from '@/services/permissionService';

const FitIntervalApp: React.FC = () => {
  const {
    settings,
    updateWorkTime,
    updateRestTime,
    updateSets,
    updateSoundEnabled,
    updateVibrationEnabled,
    updateKeepScreenOn,
  } = useTimerSettings();

  const {
    timePickerModal,
    openTimePicker,
    closeTimePicker,
    adjustTime,
    dragTime,
  } = useTimePicker();

  const { startTimer } = useTimer();

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [workoutTitle, setWorkoutTitle] = useState('Work');

  // 앱 최초 실행 시 권한 요청
  useEffect(() => {
    const requestPermissions = async () => {
      await permissionService.requestAllPermissionsOnFirstLaunch();
    };
    requestPermissions();
  }, []);

  const handleWorkTimePress = () => {
    openTimePicker('work', settings.workTime);
  };

  const handleRestTimePress = () => {
    openTimePicker('rest', settings.restTime);
  };

  const handleSetsAdjust = (direction: 'up' | 'down') => {
    const newSets = Math.max(
      1,
      Math.min(99, settings.sets + (direction === 'up' ? 1 : -1)),
    );
    updateSets(newSets);
  };

  const handleTimePickerConfirm = () => {
    const newTime = {
      minutes: timePickerModal.minutes,
      seconds: timePickerModal.seconds,
    };

    if (timePickerModal.type === 'work') {
      updateWorkTime(newTime);
    } else {
      updateRestTime(newTime);
    }
    closeTimePicker();
  };

  const timeData = calculateTotalTime(
    settings.workTime,
    settings.restTime,
    settings.sets,
  );

  return (
    <GestureHandlerRootView className="flex-1">
      <SafeAreaView className="flex-1 bg-white">
        <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <TimerHeader onMenuPress={() => setDrawerVisible(true)} />

          {/* Main Content */}
          <View className="px-4 py-6">
            {/* Workout Title Section */}
            <View className="mb-8">
              <Text className="text-2xl font-bold text-gray-800 mb-2">
                어떤 운동인가요?
              </Text>
              <Text className="text-gray-700 mb-3">
                이번 운동의 제목을 정해주세요.
              </Text>
              <TextInput
                value={workoutTitle}
                onChangeText={setWorkoutTitle}
                placeholder="운동 제목을 입력하세요"
                className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-base text-gray-800"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <TimerSettings
              workTime={settings.workTime}
              restTime={settings.restTime}
              sets={settings.sets}
              onWorkTimePress={handleWorkTimePress}
              onRestTimePress={handleRestTimePress}
              onSetsAdjust={handleSetsAdjust}
            />

            <TimerOptions
              showOptions={showOptions}
              soundEnabled={settings.soundEnabled}
              vibrationEnabled={settings.vibrationEnabled}
              keepScreenOn={settings.keepScreenOn}
              onToggleOptions={() => setShowOptions(!showOptions)}
              onSoundToggle={updateSoundEnabled}
              onVibrationToggle={updateVibrationEnabled}
              onKeepScreenOnToggle={updateKeepScreenOn}
            />

            <WorkoutSummary timeData={timeData} />
          </View>
        </ScrollView>

        <BottomButton title="Start Timer" onPress={() => startTimer(workoutTitle)} />

        <TimePickerModal
          visible={timePickerModal.visible}
          type={timePickerModal.type}
          minutes={timePickerModal.minutes}
          seconds={timePickerModal.seconds}
          onClose={closeTimePicker}
          onConfirm={handleTimePickerConfirm}
          onAdjustTime={adjustTime}
          onDragTime={dragTime}
        />

        <Drawer
          drawerVisible={drawerVisible}
          setDrawerVisible={setDrawerVisible}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default FitIntervalApp;
