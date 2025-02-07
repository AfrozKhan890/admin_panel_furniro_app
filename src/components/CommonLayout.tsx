"use client"
import React from "react";
import AppSidebar from "./AppSidebar";
import { SidebarProvider } from "./ui/sidebar";
import Navbar from "./Navbar";
import { usePathname } from "next/navigation";

export default function CommonLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const pathname = usePathname()
  if (pathname === "/sign-in" || pathname === "/sign-up") {
    return <>{children}</>;
  }
  return (
    <SidebarProvider className="flex flex-col">
      <Navbar />
      <div className="flex mt-16 flex-grow gap-2 ">
        <AppSidebar />
        <main className="flex-grow">{children}</main>
      </div>
    </SidebarProvider>
  );
}
