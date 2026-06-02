import { USER_MAIN_DATA, USER_ACTIVITY } from "~/mock/mockData";
import type { UserProfile, ActivityDetail } from "../models/types";

/**
 * Retrieves mock user profile data for development and testing purposes.
 * It fetches the correct user based on the ID stored in localStorage.
 * * @async
 * @returns {Promise<UserProfile>} A promise that resolves to the user profile object.
 */
export async function getUserMainDataMock(): Promise<UserProfile> {
  const currentUserId = localStorage.getItem("sportsee_userId");

  const matchedUser = USER_MAIN_DATA.find((user: any) => user.id === Number(currentUserId));

  return matchedUser || USER_MAIN_DATA[0];
}

/**
 * Retrieves mock daily activity data for development and testing.
 * * @async
 * @returns {Promise<ActivityDetail[]>} A promise that resolves to an array of mock activities.
 */
export async function getUserActivityMock(): Promise<ActivityDetail[]> {
  return USER_ACTIVITY;
}