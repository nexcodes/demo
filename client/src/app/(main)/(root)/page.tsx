import { getUserProfile } from "@/data/get-user-profile";
import { notFound } from "next/navigation";
import { ProfileContent } from "./profile-content";

export default async function ProfilePage() {
  const profile = await getUserProfile();

  if (!profile) {
    return notFound();
  }

  return <ProfileContent profile={profile} />;
}
