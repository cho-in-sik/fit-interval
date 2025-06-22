import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Vibration,
  Animated,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';

const { width, height } = Dimensions.get('window');

interface TimerState {
  isRunning: boolean;
  isPaused: boolean;
  currentPhase: 'work' | 'rest';
  timeRemaining: number;
  currentSet: number;
  totalSets: number;
  workTime: number;
  restTime: number;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  keepScreenOn: boolean;
}

const FitIntervalTimer: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const workTime = parseInt((params.workTime as string) || '45', 10);
  const restTime = parseInt((params.restTime as string) || '15', 10);
  const totalSets = parseInt((params.sets as string) || '8', 10);
  const soundEnabled = params.soundEnabled === 'true';
  const vibrationEnabled = params.vibrationEnabled === 'true';
  const keepScreenOn = params.keepScreenOn === 'true';

  const [state, setState] = useState<TimerState>({
    isRunning: true,
    isPaused: false,
    currentPhase: 'work',
    timeRemaining: workTime,
    currentSet: 1,
    totalSets: totalSets,
    workTime: workTime,
    restTime: restTime,
    soundEnabled: soundEnabled,
    vibrationEnabled: vibrationEnabled,
    keepScreenOn: keepScreenOn,
  });

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // keep screen on effect
  useEffect(() => {
    if (state.keepScreenOn) {
      activateKeepAwakeAsync();
    }
    return () => {
      if (state.keepScreenOn) {
        deactivateKeepAwake();
      }
    };
  }, [state.keepScreenOn]);

  // Pulse animation for timer
  const startPulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.02,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  };

  const stopPulse = () => {
    pulseAnim.setValue(1);
  };

  // Timer countdown effect
  useEffect(() => {
    if (state.isRunning && !state.isPaused && state.timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setState((prev) => {
          const newTimeRemaining = prev.timeRemaining - 1;

          if (newTimeRemaining === 0) {
            // Vibrate on phase completion
            if (prev.vibrationEnabled) {
              Vibration.vibrate([200, 100, 200]);
            }

            if (
              prev.currentSet < prev.totalSets ||
              prev.currentPhase === 'work'
            ) {
              // Switch phase
              if (prev.currentPhase === 'work') {
                return {
                  ...prev,
                  currentPhase: 'rest',
                  timeRemaining: prev.restTime,
                };
              } else {
                return {
                  ...prev,
                  currentPhase: 'work',
                  timeRemaining: prev.workTime,
                  currentSet: prev.currentSet + 1,
                };
              }
            } else {
              // Workout complete
              return {
                ...prev,
                isRunning: false,
                timeRemaining: 0,
              };
            }
          }

          return {
            ...prev,
            timeRemaining: newTimeRemaining,
          };
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state.isRunning, state.isPaused, state.timeRemaining]);

  // Pulse effect for last 3 seconds
  useEffect(() => {
    if (state.timeRemaining <= 3 && state.timeRemaining > 0) {
      startPulse();
    } else {
      stopPulse();
    }
  }, [state.timeRemaining]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
      .toString()
      .padStart(2, '0')}`;
  };

  const getProgressPercentage = (): number => {
    const totalTime =
      state.currentPhase === 'work' ? state.workTime : state.restTime;
    return ((totalTime - state.timeRemaining) / totalTime) * 100;
  };

  const getGradientColors = (): [string, string] => {
    if (state.timeRemaining <= 3 && state.timeRemaining > 0) {
      return ['#EF4444', '#DC2626']; // Warning colors
    }
    return state.currentPhase === 'work'
      ? ['#10B981', '#059669'] // Work colors
      : ['#3B82F6', '#1E40AF']; // Rest colors
  };

  const handlePausePlay = () => {
    setState((prev) => ({ ...prev, isPaused: !prev.isPaused }));
  };

  const handleReset = () => {
    const resetTime =
      state.currentPhase === 'work' ? state.workTime : state.restTime;
    setState((prev) => ({ ...prev, timeRemaining: resetTime }));
  };

  const handleSkip = () => {
    setState((prev) => ({ ...prev, timeRemaining: 0 }));
  };

  const renderSetDots = () => {
    return Array.from({ length: state.totalSets }, (_, index) => (
      <View
        key={index}
        style={[
          styles.dot,
          {
            backgroundColor:
              index < state.currentSet ? 'white' : 'rgba(255,255,255,0.4)',
          },
        ]}
      />
    ));
  };

  const circumference = 2 * Math.PI * 140;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference * (1 - getProgressPercentage() / 100);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <LinearGradient colors={getGradientColors()} style={styles.gradient}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.headerButton}
          >
            <Ionicons name="arrow-back" size={20} color="white" />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>FitInterval</Text>
          </View>

          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="ellipsis-horizontal" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Main Timer Area */}
        <View style={styles.mainContent}>
          {/* Phase Label */}
          <View style={styles.phaseContainer}>
            <Text style={styles.phaseText}>
              {state.currentPhase.toUpperCase()}
            </Text>
            <View style={styles.phaseUnderline} />
          </View>

          {/* Circular Progress Timer */}
          <View style={styles.timerContainer}>
            <Svg width={320} height={320} viewBox="0 0 320 320">
              {/* Background Circle */}
              <Circle
                cx="160"
                cy="160"
                r="140"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="8"
                fill="none"
              />
              {/* Progress Circle */}
              <Circle
                cx="160"
                cy="160"
                r="140"
                stroke="white"
                strokeWidth="8"
                fill="none"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform="rotate(-90 160 160)"
              />
            </Svg>

            {/* Timer Display */}
            <View style={styles.timerDisplay}>
              <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                <Text style={styles.timerText}>
                  {formatTime(state.timeRemaining)}
                </Text>
              </Animated.View>
              <Text style={styles.timerSubtext}>seconds remaining</Text>
            </View>
          </View>

          {/* Set Progress */}
          <View style={styles.setProgress}>
            <Text style={styles.setProgressText}>
              Set {state.currentSet} of {state.totalSets}
            </Text>
            <View style={styles.dotsContainer}>{renderSetDots()}</View>
          </View>
        </View>

        {/* Control Buttons */}
        <View style={styles.controlsContainer}>
          <View style={styles.controlsRow}>
            {/* Reset Button */}
            <TouchableOpacity
              onPress={handleReset}
              style={styles.controlButton}
              activeOpacity={0.7}
            >
              <Ionicons name="refresh" size={24} color="white" />
            </TouchableOpacity>

            {/* Pause/Play Button */}
            <TouchableOpacity
              onPress={handlePausePlay}
              style={styles.playButton}
              activeOpacity={0.7}
            >
              <Ionicons
                name={state.isPaused ? 'play' : 'pause'}
                size={28}
                color="white"
                style={{ marginLeft: state.isPaused ? 4 : 0 }}
              />
            </TouchableOpacity>

            {/* Skip Button */}
            <TouchableOpacity
              onPress={handleSkip}
              style={styles.controlButton}
              activeOpacity={0.7}
            >
              <Ionicons name="play-skip-forward" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 16,
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '500',
  },
  mainContent: {
    flex: 0.8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  phaseContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  phaseText: {
    fontSize: 36,
    fontWeight: '900',
    color: 'white',
    letterSpacing: 3,
  },
  phaseUnderline: {
    width: 64,
    height: 4,
    backgroundColor: 'white',
    marginTop: 8,
    borderRadius: 2,
  },
  timerContainer: {
    position: 'relative',
    marginBottom: 32,
  },
  timerDisplay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    fontSize: 72,
    fontWeight: '900',
    color: 'white',
  },
  timerSubtext: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 18,
    fontWeight: '500',
    marginTop: 8,
  },
  setProgress: {
    alignItems: 'center',
  },
  setProgressText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 18,
    fontWeight: '500',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButton: {
    width: 64,
    height: 64,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  playButton: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
  },
});

export default FitIntervalTimer;
