"use client";

import { useCheck } from "@/func/check";
import React from "react";

export default function CheckProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useCheck();

  return children;
}
