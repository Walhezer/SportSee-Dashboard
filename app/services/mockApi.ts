import { USER_MAIN_DATA, USER_ACTIVITY } from "~/mock/mockData";
import type { UserProfile, ActivityDetail } from "../models/types";

export async function getUserMainDataMock(): Promise<UserProfile> {
  return USER_MAIN_DATA[0];
}

export async function getUserActivityMock(): Promise<ActivityDetail[]> {
  return USER_ACTIVITY;
}