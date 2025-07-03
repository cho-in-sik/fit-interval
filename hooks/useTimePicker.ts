import { useState } from 'react';

export interface TimePickerState {
  visible: boolean;
  type: 'work' | 'rest';
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
    type: 'work' | 'rest',
    currentTime: { minutes: number; seconds: number }
  ) => {
    setTimePickerModal({
      visible: true,
      type,
      minutes: currentTime.minutes,
      seconds: currentTime.seconds,
    });
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
      const min = 0;
      const max = type === 'minutes' ? 59 : 59;

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