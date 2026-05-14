import type { UserProfile, UserActivity } from "../models/types";

export const USER_MAIN_DATA: UserProfile[] = [
  {
    id: "user123", 
    userInfos: {
      firstName: "Sophie",
      lastName: "Martin",
      age: 32,
    },
    todayScore: 0.42, 
    keyData: {
      calorieCount: 2500,
      proteinCount: 150,
      carbohydrateCount: 280,
      lipidCount: 80
    }
  }
];

export const USER_ACTIVITY: UserActivity[] = [
  {
    userId: "user123",
    sessions: [
      { day: '2025-07-01', kilogram: 60, calories: 240 },
      { day: '2025-07-02', kilogram: 60, calories: 220 },
      { day: '2025-07-03', kilogram: 61, calories: 280 },
      { day: '2025-07-04', kilogram: 61, calories: 290 },
      { day: '2025-07-05', kilogram: 60, calories: 390 },
      { day: '2025-07-06', kilogram: 59, calories: 162 },
      { day: '2025-07-07', kilogram: 59, calories: 390 },
    ]
  }
];