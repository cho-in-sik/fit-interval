import { formatTime } from './timeFormatter';

export interface TimeCalculation {
  total: string;
  work: string;
  rest: string;
}

export interface TimerTime {
  minutes: number;
  seconds: number;
}

export const calculateTotalTime = (
  workTime: TimerTime,
  restTime: TimerTime,
  sets: number
): TimeCalculation => {
  const workSeconds = workTime.minutes * 60 + workTime.seconds;
  const restSeconds = restTime.minutes * 60 + restTime.seconds;
  const totalSeconds = (workSeconds + restSeconds) * sets;

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return {
    total: formatTime(minutes, seconds),
    work: formatTime(
      Math.floor((workSeconds * sets) / 60),
      (workSeconds * sets) % 60
    ),
    rest: formatTime(
      Math.floor((restSeconds * sets) / 60),
      (restSeconds * sets) % 60
    ),
  };
};

export const convertToSeconds = (time: TimerTime): number => {
  return time.minutes * 60 + time.seconds;
};