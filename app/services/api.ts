import type { ActivityDetail, UserProfile } from "../models/types";

const BASE_URL = "http://localhost:8000/api";

/**
 * Retrieves the JWT from localStorage and configures Authorization headers.
 * @returns {HeadersInit} The configured headers for API requests.
 */
export function getAuthHeaders(): HeadersInit {
  const token = typeof window !== "undefined" ? localStorage.getItem("sportsee_token") : null;

  return {
    "Content-Type": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {}),
  };
}

/**
 * Fetches core user profile and statistics.
 * Includes a mapper to normalize data from different backend versions.
 * @returns {Promise<UserProfile>} Normalized user profile and stats.
 */
export async function getUserMainData(): Promise<UserProfile> {
  const response = await fetch(`${BASE_URL}/user-info`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) throw new Error(`Failed to fetch main data: ${response.status}`);

  const rawData = await response.json();
  const source = rawData.data ? rawData.data : rawData;

  // Data mapping logic to handle backward compatibility
  const profileData = source.profile || source.userInfos || {};
  const statsData = source.statistics || source.keyData || {};
  
  const firstName = profileData.firstName || "User";
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
 * Fetches daily activity metrics for the user.
 * @returns {Promise<ActivityDetail[]>} List of activity sessions.
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
 * Aggregates user profile and activity data concurrently.
 * @returns {Promise<{main: UserProfile, activity: ActivityDetail[]}>} Combined user data.
 */
export async function getAllUserData() {
  const [main, activity] = await Promise.all([
    getUserMainData(),
    getUserActivity(),
  ]);

  return { main, activity };
}