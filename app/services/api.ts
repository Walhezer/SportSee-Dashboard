import type { ActivityDetail } from "../models/types";

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
 * Plus besoin d'ID dans l'URL, le token JWT suffit !
 */
export async function getUserMainData() {
  const response = await fetch(`${BASE_URL}/user-info`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error(`Failed to fetch main data: ${response.status}`);
  return await response.json();
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
 * ⚠️ ATTENTION : Cette route n'existe plus dans le nouveau backend officiel.
 * On renvoie un objet vide pour éviter que le composant React ne crashe.
 */
export async function getUserAverageSessions() {
  console.warn("La route average-sessions n'existe plus sur ce backend.");
  return { sessions: [] };
}

/**
 * ⚠️ ATTENTION : Cette route n'existe plus dans le nouveau backend officiel.
 * On renvoie un objet vide pour éviter que le composant React ne crashe.
 */
export async function getUserPerformance() {
  console.warn("La route performance n'existe plus sur ce backend.");
  return { data: [], kind: {} };
}

/**
 * Aggregates all separate user endpoints concurrently into a single dataset promise.
 */
export async function getAllUserData() {
  // Plus besoin de passer l'ID aux fonctions
  const [main, activity, sessions, performance] = await Promise.all([
    getUserMainData(),
    getUserActivity(),
    getUserAverageSessions(),
    getUserPerformance(),
  ]);

  return { main, activity, sessions, performance };
}