import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, StatusBar } from 'react-native';
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
          {/* Intro Section */}
          <View className="mb-8">
            <Text className="text-2xl font-bold text-gray-800 mb-2">
              Set Your Interval Timer
            </Text>
            <Text className="text-gray-700">
              Configure your workout intervals and tap start when ready.
            </Text>
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

      <BottomButton title="Start Timer" onPress={startTimer} />

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
