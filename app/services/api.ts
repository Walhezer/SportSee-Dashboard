import type { ActivityDetail, UserProfile } from "../models/types";

const BASE_URL = "http://localhost:8000/api";

/**
 * Utility function to retrieve JWT from localStorage and configure Authorization header.
 * Only accessible on the client side (checks if localStorage exists).
 */
export function getAuthHeaders(): HeadersInit {
  const token = typeof window !== "undefined" ? localStorage.getItem("sportsee_token") : null;

  return {
    "Content-Type": "application/json",
    // Le backend exige le token pour débloquer l'accès aux données
    ...(token ? { "Authorization": `Bearer ${token}` } : {}),
  };
}

/**
 * Fetches core user profile overview data.
 * Inclut un Mapper pour structurer la donnée brute du backend vers l'interface UserProfile.
 */
export async function getUserMainData(): Promise<UserProfile> {
  const response = await fetch(`${BASE_URL}/user-info`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) throw new Error(`Failed to fetch main data: ${response.status}`);

  const rawData = await response.json();

  // On gère le cas où l'API englobe tout dans un objet "data" (très fréquent sur SportSee)
  const source = rawData.data ? rawData.data : rawData;

  // LE MAPPER BLINDÉ : Il cherche le nouveau format, OU l'ancien format en secours
  const profileData = source.profile || source.userInfos || {};
  const statsData = source.statistics || source.keyData || {};
  const firstName = profileData.firstName || "Utilisateur";
  const isFemale = ["Sophie", "Emma"].includes(firstName);
  const duration = statsData.totalDuration || 0;
  const fallbackCalories = statsData.calories || statsData.calorieCount || (duration * 10);

  return {
    profile: {
      firstName,
      lastName: profileData.lastName || "",
      age: profileData.age || 0,
      gender: profileData.gender || (isFemale ? "female" : "male"),
      profilePicture: profileData.profilePicture || "",
      height: profileData.height,
      weight: profileData.weight,
      createdAt: profileData.createdAt,
    },
    statistics: {
      totalDistance: statsData.totalDistance || 0,
      totalDuration: statsData.totalDuration || 0,
      totalSessions: statsData.totalSessions || 0,
      calories: fallbackCalories,
      restDays: statsData.restDays || 0,
    }
  };
}

/**
 * Fetches user daily activity data.
 * Le nouveau backend exige des dates de début et de fin.
 */
export async function getUserActivity(): Promise<ActivityDetail[]> {
  const startWeek = "2025-01-01";
  const endWeek = "2030-12-31";

  const response = await fetch(
    `${BASE_URL}/user-activity?startWeek=${startWeek}&endWeek=${endWeek}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch activity data: ${response.status}`);
  }

  const data = await response.json();

  return data as ActivityDetail[];
}

/**
 * Aggregates all separate user endpoints concurrently into a single dataset promise.
 * (Nettoyé des routes obsolètes)
 */
export async function getAllUserData() {
  const [main, activity] = await Promise.all([
    getUserMainData(),
    getUserActivity(),
  ]);

  return { main, activity };
}