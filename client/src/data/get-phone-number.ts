import { currentUser } from "@/lib/auth";
import { strapiClient } from "@/lib/strapi";

export const getPhoneNumber = async () => {
  try {
    const user = await currentUser();

    if (!user) {
      return null;
    }

    const result = await strapiClient.collection("phones");
    const response = await result.find({
      filters: { userId: user?.id },
    });

    if (response.data.length > 0) {
      return { ...response.data[0] };
    }

    return null;
  } catch (err) {
    console.log(err);
    return null;
  }
};
