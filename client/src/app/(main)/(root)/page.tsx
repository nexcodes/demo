import { getUserProfile } from "@/data/get-user-profile";
import { notFound } from "next/navigation";
import ProfileContent from "./profile-content";
import { retryPromise } from "@/func/retry";

export default async function ProfilePage() {
  const profile = await retryPromise(getUserProfile, 3, 50);

  if (!profile) {
    return notFound();
  }

  return <ProfileContent profile={profile} />;
}
