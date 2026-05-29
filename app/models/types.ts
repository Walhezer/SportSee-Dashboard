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

export interface HeartRateData {
  min: number;
  max: number;
  average: number;
}

export interface ActivityDetail {
  date: string;
  distance: number;
  duration: number;
  heartRate: HeartRateData;
  caloriesBurned: number;
}