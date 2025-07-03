import { TimerSettings } from '@/hooks/useTimerSettings';

export interface TimerValidationResult {
  isValid: boolean;
  errors: string[];
}

export const timerService = {
  validateSettings: (settings: TimerSettings): TimerValidationResult => {
    const errors: string[] = [];

    // 워크 타임 검증
    if (settings.workTime.minutes === 0 && settings.workTime.seconds === 0) {
      errors.push('Work time cannot be zero');
    }

    // 레스트 타임 검증
    if (settings.restTime.minutes === 0 && settings.restTime.seconds === 0) {
      errors.push('Rest time cannot be zero');
    }

    // 세트 수 검증
    if (settings.sets < 1 || settings.sets > 99) {
      errors.push('Sets must be between 1 and 99');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  calculateWorkoutDuration: (settings: TimerSettings): number => {
    const workSeconds = settings.workTime.minutes * 60 + settings.workTime.seconds;
    const restSeconds = settings.restTime.minutes * 60 + settings.restTime.seconds;
    return (workSeconds + restSeconds) * settings.sets;
  },

  formatDurationForDisplay: (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      return `${remainingSeconds}s`;
    }
  },

  generateWorkoutPlan: (settings: TimerSettings) => {
    const workSeconds = settings.workTime.minutes * 60 + settings.workTime.seconds;
    const restSeconds = settings.restTime.minutes * 60 + settings.restTime.seconds;
    
    const plan = [];
    
    for (let i = 0; i < settings.sets; i++) {
      plan.push({
        type: 'work',
        duration: workSeconds,
        setNumber: i + 1,
      });
      
      if (i < settings.sets - 1) {
        plan.push({
          type: 'rest',
          duration: restSeconds,
          setNumber: i + 1,
        });
      }
    }
    
    return plan;
  },
};