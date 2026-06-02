/**
 * Represents the user's personal information and aggregated statistics.
 */
export interface UserProfile {
  profile: {
    firstName: string;
    lastName: string;
    age: number;
    createdAt: string;
    height: number;
    weight: number;
    profilePicture?: string;
    gender?: string;
  };
  statistics: {
    totalDistance: number | string;
    totalDuration: number;
    totalSessions: number;
    calories?: number;
    restDays?: number;
  };
}

/**
 * Represents daily heart rate metrics.
 */
export interface HeartRateData {
  min: number;
  max: number;
  average: number;
}

/**
 * Represents daily training activity details.
 */
export interface ActivityDetail {
  date: string;
  distance: number;
  duration: number;
  heartRate: HeartRateData;
  caloriesBurned: number;
}