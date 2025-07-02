import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface WorkoutCompleteModalProps {
  visible: boolean;
  onDone: () => void;
  onClose: () => void;
  workoutData: {
    totalTime: number;
    sets: number;
    workTime: number;
    restTime: number;
  };
}

const { height } = Dimensions.get('window');

const WorkoutCompleteModal: React.FC<WorkoutCompleteModalProps> = ({
  visible,
  onDone,
  onClose,
  workoutData,
}) => {
  const formatTime = (seconds: number): string => {
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
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <LinearGradient
            colors={['#10B981', '#059669']}
            style={styles.gradient}
          >
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>

            {/* Success Icon */}
            <View style={styles.iconContainer}>
              <View style={styles.successIcon}>
                <Ionicons name="checkmark" size={48} color="white" />
              </View>
            </View>

            {/* Title */}
            <Text style={styles.title}>Workout Complete!</Text>
            <Text style={styles.subtitle}>Great job! You've finished your workout.</Text>

            {/* Stats */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Ionicons name="time" size={20} color="rgba(255,255,255,0.8)" />
                <Text style={styles.statLabel}>Total Time</Text>
                <Text style={styles.statValue}>{formatTime(workoutData.totalTime)}</Text>
              </View>

              <View style={styles.statItem}>
                <Ionicons name="repeat" size={20} color="rgba(255,255,255,0.8)" />
                <Text style={styles.statLabel}>Sets</Text>
                <Text style={styles.statValue}>{workoutData.sets}</Text>
              </View>

              <View style={styles.statItem}>
                <Ionicons name="flash" size={20} color="rgba(255,255,255,0.8)" />
                <Text style={styles.statLabel}>Work</Text>
                <Text style={styles.statValue}>{formatTimeText(workoutData.workTime)}</Text>
              </View>

              <View style={styles.statItem}>
                <Ionicons name="pause" size={20} color="rgba(255,255,255,0.8)" />
                <Text style={styles.statLabel}>Rest</Text>
                <Text style={styles.statValue}>{formatTimeText(workoutData.restTime)}</Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={onDone}
                style={styles.doneButton}
                activeOpacity={0.8}
              >
                <Text style={styles.doneButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    height: height * 0.7,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 20,
    marginBottom: 20,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  successIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginBottom: 32,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  statItem: {
    width: '48%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 8,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  buttonContainer: {
    paddingBottom: 40,
  },
  doneButton: {
    backgroundColor: 'white',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  doneButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#059669',
  },
});

export default WorkoutCompleteModal;