export type SleepQuality = "goed" | "matig" | "slecht";

export type MorningCheckInRecord = {
  id: string;
  userId: string;
  checkInDate: string;
  energyScore: number;
  sleepQuality: SleepQuality;
  createdAt: string;
  updatedAt: string;
};

export type MorningCheckInSubmission = {
  energyScore: number;
  sleepQuality: SleepQuality;
};

export type MorningCheckInStatus = {
  timezone: string;
  todayDate: string;
  todayCheckIn: MorningCheckInRecord | null;
};
