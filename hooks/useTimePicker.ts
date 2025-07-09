import { useState } from 'react';

export interface TimePickerState {
  visible: boolean;
  type: 'work' | 'rest' | 'sets';
  minutes: number;
  seconds: number;
}

export const useTimePicker = () => {
  const [timePickerModal, setTimePickerModal] = useState<TimePickerState>({
    visible: false,
    type: 'work',
    minutes: 0,
    seconds: 0,
  });

  const openTimePicker = (
    type: 'work' | 'rest' | 'sets',
    currentTime: { minutes: number; seconds: number } | { sets: number }
  ) => {
    if (type === 'sets') {
      const setsData = currentTime as { sets: number };
      setTimePickerModal({
        visible: true,
        type,
        minutes: setsData.sets,
        seconds: 0,
      });
    } else {
      const timeData = currentTime as { minutes: number; seconds: number };
      setTimePickerModal({
        visible: true,
        type,
        minutes: timeData.minutes,
        seconds: timeData.seconds,
      });
    }
  };

  const closeTimePicker = () => {
    setTimePickerModal((prev) => ({ ...prev, visible: false }));
  };

  const adjustTime = (
    type: 'minutes' | 'seconds',
    direction: 'up' | 'down'
  ) => {
    setTimePickerModal((prev) => {
      const newValue = prev[type] + (direction === 'up' ? 1 : -1);
      let min = 0;
      let max = type === 'minutes' ? 59 : 59;

      // 세트 모드일 때는 minutes 필드를 세트 수로 사용
      if (prev.type === 'sets' && type === 'minutes') {
        min = 1;
        max = 99;
      }

      return {
        ...prev,
        [type]: Math.max(min, Math.min(max, newValue)),
      };
    });
  };

  const dragTime = (
    type: 'minutes' | 'seconds',
    value: number
  ) => {
    setTimePickerModal((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  return {
    timePickerModal,
    openTimePicker,
    closeTimePicker,
    adjustTime,
    dragTime,
  };
};