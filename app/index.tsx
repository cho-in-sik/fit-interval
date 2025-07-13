import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Animated,
  Modal,
  StyleSheet,
  Image,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
// import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import Drawer from '@/components/Drawer';
import { TimePickerModal } from '@/components/timer/TimePickerModal';
import { useTimerSettings } from '@/hooks/useTimerSettings';
import { useTimePicker } from '@/hooks/useTimePicker';
import { useTimer } from '@/hooks/useTimer';
import { permissionService } from '@/services/permissionService';
import { getThemeColors } from '@/utils/themeColors';
import { useSettingsStore } from '@/store/settingsStore';

interface Template {
  id: number;
  name: string;
  icon: string;
  work: number;
  rest: number;
  sets: number;
  difficulty: number;
  color: string;
}

const FitIntervalApp: React.FC = () => {
  const { settings, updateWorkTime, updateRestTime, updateSets } =
    useTimerSettings();
  const { theme } = useSettingsStore();
  const themeColors = getThemeColors(theme.colorScheme);

  const {
    timePickerModal,
    openTimePicker,
    closeTimePicker,
    adjustTime,
    dragTime,
  } = useTimePicker();

  const { startTimer } = useTimer();

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [workoutTitle, setWorkoutTitle] = useState('Work');
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);

  // Animated values
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;
  const floatAnim3 = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const spinAnim = useRef(new Animated.Value(0)).current;

  // 앱 최초 실행 시 권한 요청
  useEffect(() => {
    const requestPermissions = async () => {
      await permissionService.requestAllPermissionsOnFirstLaunch();
    };
    requestPermissions();
  }, []);

  useEffect(() => {
    // Float animations
    const createFloatAnimation = (animValue: Animated.Value) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(animValue, {
            toValue: -10,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
        ]),
        { iterations: -1 },
      );
    };

    // Start float animations with delays
    setTimeout(() => createFloatAnimation(floatAnim1).start(), 0);
    setTimeout(() => createFloatAnimation(floatAnim2).start(), 1000);
    setTimeout(() => createFloatAnimation(floatAnim3).start(), 2000);

    // Glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ]),
    ).start();

    // Spin animation
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 10000,
        useNativeDriver: true,
      }),
    ).start();
  }, [floatAnim1, floatAnim2, floatAnim3, glowAnim, spinAnim]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const handleWorkTimePress = () => {
    openTimePicker('work', settings.workTime);
  };

  const handleRestTimePress = () => {
    openTimePicker('rest', settings.restTime);
  };

  const handleTimePickerConfirm = () => {
    if (timePickerModal.type === 'sets') {
      updateSets(timePickerModal.minutes);
    } else {
      const newTime = {
        minutes: timePickerModal.minutes,
        seconds: timePickerModal.seconds,
      };

      if (timePickerModal.type === 'work') {
        updateWorkTime(newTime);
      } else {
        updateRestTime(newTime);
      }
    }
    closeTimePicker();
  };

  const templates: Template[] = useMemo(
    () => [
      {
        id: 1,
        name: 'Beginner',
        icon: '🌱',
        work: 40,
        rest: 30,
        sets: 6,
        difficulty: 0.3,
        color: themeColors.workColors[0],
      },
      {
        id: 2,
        name: 'HIIT Beast',
        icon: '🔥',
        work: 45,
        rest: 15,
        sets: 10,
        difficulty: 0.8,
        color: themeColors.accent,
      },
      {
        id: 3,
        name: 'Tabata',
        icon: '⚡',
        work: 20,
        rest: 10,
        sets: 8,
        difficulty: 0.6,
        color: themeColors.warningColors[0],
      },
      {
        id: 4,
        name: 'Custom',
        icon: '⚙️',
        work: settings.workTime.minutes * 60 + settings.workTime.seconds,
        rest: settings.restTime.minutes * 60 + settings.restTime.seconds,
        sets: settings.sets,
        difficulty: 0.5,
        color: themeColors.restColors[0],
      },
    ],
    [settings.workTime, settings.restTime, settings.sets, themeColors],
  );

  const WorkoutCard: React.FC<{ template: Template }> = ({ template }) => {
    const handleTemplatePress = () => {
      setSelectedTemplate(template.id);

      // 템플릿의 값들로 설정 업데이트
      if (template.id !== 4) {
        // Custom 템플릿이 아닌 경우에만 업데이트
        const workMinutes = Math.floor(template.work / 60);
        const workSeconds = template.work % 60;
        const restMinutes = Math.floor(template.rest / 60);
        const restSeconds = template.rest % 60;

        updateWorkTime({ minutes: workMinutes, seconds: workSeconds });
        updateRestTime({ minutes: restMinutes, seconds: restSeconds });
        updateSets(template.sets);
      }
    };

    return (
      <TouchableOpacity
        onPress={handleTemplatePress}
        style={[
          styles.workoutCard,
          selectedTemplate === template.id && styles.workoutCardSelected,
        ]}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{template.name}</Text>
          <Text style={styles.cardIcon}>{template.icon}</Text>
        </View>
        <Text style={styles.cardSubtitle}>
          {template.work}s work • {template.rest}s rest • {template.sets} sets
        </Text>
        <View style={styles.progressContainer}>
          <View
            style={[
              styles.progressBar,
              {
                width: `${template.difficulty * 100}%`,
                backgroundColor: template.color,
              },
            ]}
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <LinearGradient colors={themeColors.background} style={styles.container}>
        <StatusBar barStyle="light-content" />
        <SafeAreaView style={styles.safeArea}>
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerContent}>
                <View style={styles.userInfo}>
                  <View style={styles.logoContainer}>
                    <Image
                      source={require('../assets/images/newFitInterval.png')}
                      style={styles.logo}
                    />
                  </View>
                  <View style={styles.userDetails}>
                    <Text style={styles.appName}>FITINTERVAL</Text>
                    {/* <Text style={styles.greeting}>운동을 시작해보세요!</Text> */}
                  </View>
                </View>
                <View style={styles.profileButton}>
                  <TouchableOpacity
                    style={styles.profileButtonInner}
                    onPress={() => setDrawerVisible(true)}
                  >
                    <Ionicons name="menu" size={20} color="#ffffff" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Workout Title Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Title</Text>
              <TextInput
                value={workoutTitle}
                onChangeText={setWorkoutTitle}
                placeholder="운동 제목을 입력하세요"
                style={styles.titleInput}
                placeholderTextColor="rgba(255, 255, 255, 0.7)"
              />
            </View>

            {/* Interactive Timer Setup */}
            <View style={styles.section}>
              <View style={styles.timerHeader}>
                <Text style={styles.timerTitle}>Settings</Text>
                <Text style={styles.timerSubtitle}>
                  탭하여 시간을 설정하세요
                </Text>
              </View>

              {/* Central Interactive Timer */}
              <View style={styles.timerContainer}>
                <View style={styles.timerWrapper}>
                  <Animated.View
                    style={[
                      styles.timerRing,
                      {
                        transform: [{ rotate: spin }],
                      },
                    ]}
                  >
                    <LinearGradient
                      colors={
                        theme.colorScheme === 'purple'
                          ? ['#6366F1', '#8B5CF6', '#EC4899', '#6366F1']
                          : [
                              themeColors.restColors[0],
                              themeColors.restColors[1],
                              themeColors.accent,
                              themeColors.restColors[0],
                            ]
                      }
                      style={styles.timerGradient}
                    />
                  </Animated.View>

                  <View style={styles.timerContent}>
                    <View style={styles.timerInfo}>
                      <Text style={styles.timerTime}>
                        {String(settings.workTime.minutes).padStart(2, '0')}:
                        {String(settings.workTime.seconds).padStart(2, '0')}
                      </Text>
                      <Text style={styles.timerLabel}>운동 시간</Text>
                      <Text style={styles.timerTotal}>
                        {settings.sets} 세트 •{' '}
                        {Math.round(
                          ((settings.workTime.minutes * 60 +
                            settings.workTime.seconds +
                            settings.restTime.minutes * 60 +
                            settings.restTime.seconds) *
                            settings.sets) /
                            60,
                        )}{' '}
                        분 예상
                      </Text>
                    </View>
                  </View>

                  {/* Floating Action Buttons */}
                  <Animated.View
                    style={[
                      styles.floatingButton,
                      styles.floatingButtonTop,
                      {
                        transform: [{ translateY: floatAnim1 }],
                      },
                    ]}
                  >
                    <TouchableOpacity
                      onPress={handleWorkTimePress}
                      style={styles.floatingButtonInner}
                    >
                      <Ionicons
                        name="fitness"
                        size={20}
                        color={themeColors.accent}
                      />
                      <Text style={styles.floatingButtonText}>운동시간</Text>
                    </TouchableOpacity>
                  </Animated.View>

                  <Animated.View
                    style={[
                      styles.floatingButton,
                      styles.floatingButtonBottom,
                      {
                        transform: [{ translateY: floatAnim2 }],
                      },
                    ]}
                  >
                    <TouchableOpacity
                      onPress={handleRestTimePress}
                      style={styles.floatingButtonInner}
                    >
                      <Ionicons
                        name="pause"
                        size={20}
                        color={themeColors.restColors[1]}
                      />
                      <Text style={styles.floatingButtonText}>휴식시간</Text>
                    </TouchableOpacity>
                  </Animated.View>

                  <Animated.View
                    style={[
                      styles.floatingButton,
                      styles.floatingButtonRight,
                      {
                        transform: [{ translateY: floatAnim3 }],
                      },
                    ]}
                  >
                    <TouchableOpacity
                      onPress={() =>
                        openTimePicker('sets', { sets: settings.sets })
                      }
                      style={styles.floatingButtonInner}
                    >
                      <Ionicons
                        name="repeat"
                        size={20}
                        color={themeColors.workColors[0]}
                      />
                      <Text style={styles.floatingButtonText}>세트</Text>
                    </TouchableOpacity>
                  </Animated.View>
                </View>
              </View>
            </View>

            {/* Quick Workout Templates */}
            <View style={styles.section}>
              <Text style={styles.templatesTitle}>Templates</Text>
              <View style={styles.templatesGrid}>
                <View style={styles.templateRow}>
                  <View style={styles.templateColumn}>
                    <WorkoutCard template={templates[0]} />
                  </View>
                  <View style={styles.templateColumn}>
                    <WorkoutCard template={templates[1]} />
                  </View>
                </View>
                <View style={styles.templateRow}>
                  <View style={styles.templateColumn}>
                    <WorkoutCard template={templates[2]} />
                  </View>
                  <View style={styles.templateColumn}>
                    <WorkoutCard template={templates[3]} />
                  </View>
                </View>
              </View>
            </View>

            {/* Achievement & Motivation */}

            {/* <Text className="mx-6" style={styles.templatesTitle}>
              Today&apos;s Goal
            </Text> */}
            <View className="mx-6 mb-32 rounded-3xl bg-white/15 border-white/30">
              {/* <View className="rounded-2xl p-5">
                <View className="flex-row items-center space-x-4">
                  <View className="flex-1">
                    <View className="flex-row justify-between mb-2 mr-5">
                      <Text className="text-sm text-white">Workouts</Text>
                      <Text className="text-sm text-white">2/3</Text>
                    </View>
                    <View className="w-[95%] bg-white bg-opacity-20 rounded-full h-3 ">
                      <LinearGradient
                        colors={[themeColors.workColors[0], themeColors.accent]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        className="h-3 rounded-full"
                        style={{ width: '100%' }}
                      />
                    </View>
                  </View>
                  <View className="items-end">
                    <Text className="text-lg font-bold text-white">67%</Text>
                    <Text className="text-xs text-white opacity-80">
                      Complete
                    </Text>
                  </View>
                </View>
              </View> */}
            </View>
          </ScrollView>

          {/* Fixed Bottom CTA */}
          <View style={styles.bottomCTA}>
            <LinearGradient
              colors={
                theme.colorScheme === 'purple'
                  ? ['#EC4899', '#8B5CF6']
                  : [themeColors.accent, themeColors.restColors[1]]
              }
              style={[
                styles.startButton,
                {
                  shadowColor:
                    theme.colorScheme === 'purple'
                      ? '#EC4899'
                      : themeColors.accent,
                },
              ]}
            >
              <TouchableOpacity
                style={styles.startButtonInner}
                onPress={() => startTimer(workoutTitle)}
              >
                <View style={styles.startButtonIcon}>
                  <Ionicons name="play" size={20} color="white" />
                </View>
                <Text style={styles.startButtonText}>Start Workout</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>

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
      </LinearGradient>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 12,
  },
  titleInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: 'white',
  },
  motivationSection: {
    marginBottom: 128,
  },

  // Header
  header: {
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  logoContainer: {
    position: 'relative',
  },
  logo: {
    width: 48,
    height: 48,
  },
  userDetails: {
    gap: 4,
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  greeting: {
    fontSize: 14,
    color: 'white',
    opacity: 0.8,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  profileButtonInner: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Glass Morphism
  glassContainer: {
    borderRadius: 16,
  },
  glassInner: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
  },

  // Timer Setup
  timerHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  timerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  timerSubtitle: {
    color: 'white',
    opacity: 0.8,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  timerWrapper: {
    width: 256,
    height: 256,
    position: 'relative',
  },
  timerRing: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 128,
  },
  timerGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 128,
    padding: 4,
  },
  timerContent: {
    position: 'absolute',
    top: 4,
    left: 4,
    right: 4,
    bottom: 4,
    borderRadius: 124,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 10px rgba(255, 255, 255, 0.1)',
  },
  timerInfo: {
    alignItems: 'center',
  },
  timerTime: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  timerLabel: {
    fontSize: 14,
    color: 'white',
    opacity: 0.8,
  },
  timerTotal: {
    fontSize: 12,
    color: 'white',
    opacity: 0.6,
    marginTop: 4,
  },

  // Floating Buttons
  floatingButton: {
    position: 'absolute',
    width: 64,
    height: 64,
  },
  floatingButtonTop: {
    top: 16,
    left: '50%',
    marginLeft: -32,
  },
  floatingButtonBottom: {
    bottom: 16,
    left: '50%',
    marginLeft: -32,
  },
  floatingButtonRight: {
    right: 16,
    top: '50%',
    marginTop: -32,
  },
  floatingButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingButtonText: {
    fontSize: 12,
    color: 'white',
    marginTop: 4,
  },

  // Templates
  templatesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 16,
  },
  templatesGrid: {
    gap: 16,
  },
  templateRow: {
    flexDirection: 'row',
    gap: 16,
  },
  templateColumn: {
    flex: 1,
  },
  workoutCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 12,
    padding: 16,
  },
  workoutCardSelected: {
    borderColor: 'white',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardTitle: {
    fontWeight: '600',
    fontSize: 14,
    color: 'white',
  },
  cardIcon: {
    fontSize: 18,
  },
  cardSubtitle: {
    fontSize: 12,
    color: 'white',
    opacity: 0.8,
    marginBottom: 12,
  },
  progressContainer: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    height: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },

  // Motivation
  motivationCard: {
    padding: 20,
  },
  motivationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  motivationTitle: {
    fontWeight: '600',
    color: 'white',
  },
  motivationEmoji: {
    fontSize: 24,
  },
  motivationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  motivationProgress: {
    flex: 1,
  },
  motivationStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  motivationLabel: {
    fontSize: 14,
    color: 'white',
  },
  motivationCount: {
    fontSize: 14,
    color: 'white',
  },
  motivationBar: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 6,
    height: 12,
  },
  motivationFill: {
    height: 12,
    borderRadius: 6,
    width: '67%',
  },
  motivationPercentage: {
    alignItems: 'flex-end',
  },
  motivationPercent: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  motivationComplete: {
    fontSize: 12,
    color: 'white',
    opacity: 0.8,
  },

  // Bottom CTA
  bottomCTA: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
  },
  startButton: {
    borderRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  startButtonInner: {
    width: '100%',
    paddingVertical: 18,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  startButtonIcon: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  modalCloseButton: {
    width: 40,
    height: 40,
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButton: {
    borderRadius: 12,
    marginTop: 24,
  },
  confirmButtonInner: {
    width: '100%',
    paddingVertical: 16,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default FitIntervalApp;
