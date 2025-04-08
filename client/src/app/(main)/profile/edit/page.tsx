import { getUserProfile } from "@/data/get-user-profile";
import ClientEditProfilePage from "./client";
import { notFound } from "next/navigation";

export default async function EditProfilePage() {
  const profile = await getUserProfile();

  if (!profile) {
    return notFound();
  }

  return <ClientEditProfilePage profile={profile} />;
}
