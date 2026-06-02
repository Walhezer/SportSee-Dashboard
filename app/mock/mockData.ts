import type { UserProfile, ActivityDetail } from "../models/types";

// Note: Si TypeScript souligne 'id' en rouge, c'est qu'il faut l'ajouter 
// dans ton interface UserProfile dans le fichier types.ts ! (ex: id: number;)

export const USER_MAIN_DATA: (UserProfile & { id: string })[] = [
 {
    id: "user123", 
    profile: {
      firstName: "Sophie",
      lastName: "Martin",
      age: 31,
      createdAt: "2022-04-10", 
      height: 180,
      weight: 80,
      profilePicture: "https://i.pravatar.cc/150?u=karl",
    },
    statistics: {
      totalDistance: 3120,
      totalDuration: 320,
      totalSessions: 412,
      calories: 198000,
    }
  },
 {
    id: "user789", 
    profile: {
      firstName: "Emma",
      lastName: "Leroy",
      age: 34,
      createdAt: "2023-01-22", 
      height: 165,
      weight: 60,
      profilePicture: "https://i.pravatar.cc/150?u=cecilia",
    },
    statistics: {
      totalDistance: 2250,
      totalDuration: 243,
      totalSessions: 348,
      calories: 146250,
    }
  }
];

export const USER_ACTIVITY: ActivityDetail[] = [
  {
    date: "2025-01-04",
    distance: 5.8,
    duration: 38,
    heartRate: { min: 140, max: 178, average: 163 },
    caloriesBurned: 422,
  },
  {
    date: "2025-01-05",
    distance: 3.2,
    duration: 20,
    heartRate: { min: 148, max: 184, average: 171 },
    caloriesBurned: 248,
  },
  {
    date: "2025-01-09",
    distance: 6.4,
    duration: 42,
    heartRate: { min: 140, max: 176, average: 163 },
    caloriesBurned: 468,
  },
  {
    date: "2025-01-12",
    distance: 7.5,
    duration: 50,
    heartRate: { min: 138, max: 178, average: 162 },
    caloriesBurned: 532,
  },
  {
    date: "2025-01-19",
    distance: 5.1,
    duration: 34,
    heartRate: { min: 141, max: 177, average: 165 },
    caloriesBurned: 378,
  },
  {
    date: "2025-01-25",
    distance: 4.8,
    duration: 32,
    heartRate: { min: 143, max: 179, average: 166 },
    caloriesBurned: 352,
  },
  {
    date: "2025-01-26",
    distance: 3.5,
    duration: 22,
    heartRate: { min: 146, max: 183, average: 170 },
    caloriesBurned: 265,
  },
];