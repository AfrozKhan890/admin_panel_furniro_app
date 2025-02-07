"use client";
import CommonLayout from "@/components/CommonLayout";
import { usePathname } from "next/navigation"; // Import usePathname

export default function Authorizer({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); // Get the current path

  // Define the condition for excluding auth routes
  const isAuthPage = pathname.includes("/sign-in") || pathname.includes("/unauthorized") || pathname.includes("/factor-one");

  return<>{!isAuthPage ? <CommonLayout>{children}</CommonLayout> : children}</>
}
