export interface UserProfile {
  id: number | string;
  userInfos: {
    firstName: string;
    lastName: string;
    age: number;
  };
  todayScore?: number;
  score?: number;
  keyData: {
    calorieCount: number;
    proteinCount: number;
    carbohydrateCount: number;
    lipidCount: number;
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


// Obsolète, a supprimer
export interface UserActivity {
  userId: number | string;
  sessions: {
    day: string;
    kilogram: number;
    calories: number;
  }[];
}