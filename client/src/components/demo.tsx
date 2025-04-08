"use client";

import { useCurrentUser } from "@/hooks/use-current-user";

const Demo = () => {
  const { user } = useCurrentUser();

  return <div>{JSON.stringify(user)}</div>;
};

export default Demo;
