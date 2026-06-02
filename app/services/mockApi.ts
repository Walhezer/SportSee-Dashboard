import { USER_MAIN_DATA, USER_ACTIVITY } from "~/mock/mockData";
import type { UserProfile, ActivityDetail } from "../models/types";

/**
 * Returns mock user profile data for development and testing.
 * @returns {Promise<UserProfile>} The first profile from the mock dataset.
 */
export async function getUserMainDataMock(): Promise<UserProfile> {
  return USER_MAIN_DATA[0];
}

/**
 * Returns mock daily activity data for development and testing.
 * @returns {Promise<ActivityDetail[]>} The full list of mock activities.
 */
export async function getUserActivityMock(): Promise<ActivityDetail[]> {
  return USER_ACTIVITY;
}