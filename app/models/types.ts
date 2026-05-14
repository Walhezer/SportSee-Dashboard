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

export interface UserActivity {
  userId: number | string;
  sessions: {
    day: string;
    kilogram: number;
    calories: number;
  }[];
}