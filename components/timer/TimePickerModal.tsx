import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PanGestureHandler, State, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';

interface TimePickerModalProps {
  visible: boolean;
  type: 'work' | 'rest';
  minutes: number;
  seconds: number;
  onClose: () => void;
  onConfirm: () => void;
  onAdjustTime: (type: 'minutes' | 'seconds', direction: 'up' | 'down') => void;
  onDragTime: (type: 'minutes' | 'seconds', value: number) => void;
}

export const TimePickerModal: React.FC<TimePickerModalProps> = ({
  visible,
  type,
  minutes,
  seconds,
  onClose,
  onConfirm,
  onAdjustTime,
  onDragTime,
}) => {
  const minutesStartY = useRef(0);
  const secondsStartY = useRef(0);
  const minutesCurrentValue = useRef(minutes);
  const secondsCurrentValue = useRef(seconds);

  const handleMinutesDrag = (event: PanGestureHandlerGestureEvent) => {
    const { translationY, state } = event.nativeEvent;
    
    if (state === State.BEGAN) {
      minutesStartY.current = 0;
      minutesCurrentValue.current = minutes;
    } else if (state === State.ACTIVE) {
      const sensitivity = 15;
      const change = Math.round(-translationY / sensitivity);
      const newValue = Math.max(0, Math.min(59, minutesCurrentValue.current + change));
      onDragTime('minutes', newValue);
    }
  };

  const handleSecondsDrag = (event: PanGestureHandlerGestureEvent) => {
    const { translationY, state } = event.nativeEvent;
    
    if (state === State.BEGAN) {
      secondsStartY.current = 0;
      secondsCurrentValue.current = seconds;
    } else if (state === State.ACTIVE) {
      const sensitivity = 15;
      const change = Math.round(-translationY / sensitivity);
      const newValue = Math.max(0, Math.min(59, secondsCurrentValue.current + change));
      onDragTime('seconds', newValue);
    }
  };
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-2xl p-5">
          <View className="flex-row justify-between items-center mb-5">
            <Text className="text-lg font-semibold text-gray-800">
              Set {type === 'work' ? 'Work' : 'Rest'} Time
            </Text>
            <TouchableOpacity
              onPress={onClose}
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
                  onPress={() => onAdjustTime('minutes', 'up')}
                  className="w-12 h-12 rounded-full bg-gray-100 items-center justify-center mb-2"
                >
                  <Ionicons name="chevron-up" size={16} color="#374151" />
                </TouchableOpacity>
                <PanGestureHandler onGestureEvent={handleMinutesDrag}>
                  <View className="w-16 h-16 items-center justify-center bg-gray-50 rounded-xl">
                    <Text className="text-3xl font-bold">
                      {minutes.toString().padStart(2, '0')}
                    </Text>
                  </View>
                </PanGestureHandler>
                <TouchableOpacity
                  onPress={() => onAdjustTime('minutes', 'down')}
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
                  onPress={() => onAdjustTime('seconds', 'up')}
                  className="w-12 h-12 rounded-full bg-gray-100 items-center justify-center mb-2"
                >
                  <Ionicons name="chevron-up" size={16} color="#374151" />
                </TouchableOpacity>
                <PanGestureHandler onGestureEvent={handleSecondsDrag}>
                  <View className="w-16 h-16 items-center justify-center bg-gray-50 rounded-xl">
                    <Text className="text-3xl font-bold">
                      {seconds.toString().padStart(2, '0')}
                    </Text>
                  </View>
                </PanGestureHandler>
                <TouchableOpacity
                  onPress={() => onAdjustTime('seconds', 'down')}
                  className="w-12 h-12 rounded-full bg-gray-100 items-center justify-center mt-2"
                >
                  <Ionicons name="chevron-down" size={16} color="#374151" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View className="w-full rounded-xl overflow-hidden">
            <LinearGradient
              colors={['#EC4899', '#8B5CF6']}
              style={{
                borderRadius: 12,
              }}
            >
              <TouchableOpacity
                onPress={onConfirm}
                className="w-full py-4"
              >
                <Text className="text-white font-semibold text-center">
                  Confirm
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      </View>
    </Modal>
  );
};