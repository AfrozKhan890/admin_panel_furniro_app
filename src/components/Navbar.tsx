"use client";
import Image from "next/image";
import React from "react";
import { Menu } from "lucide-react";
import { SidebarTrigger } from "./ui/sidebar";
import { useUser, UserButton } from "@clerk/nextjs";

const Navbar = () => {
  const { user, isSignedIn, isLoaded } = useUser();
  const sidebarTriggerRef = React.useRef<HTMLButtonElement>(null);

  const handleMenuClick = () => {
    sidebarTriggerRef.current?.click();
  };

  return (
    <div className="w-full bg-gray-800 fixed top-0 z-50">
      <div className="h-16 mx-4 flex items-center justify-between">
        {/* Left Side: Logo & Sidebar Menu */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Icon */}
          <Menu
            className="text-white block md:hidden cursor-pointer"
            size={30}
            onClick={handleMenuClick}
            aria-label="Open Sidebar"
          />
          <SidebarTrigger ref={sidebarTriggerRef} className="sr-only" />

          {/* Logo */}
          <Image
            src="/assets/main-logo.svg"
            alt="Furniro Logo"
            width={60}
            height={60}
            priority
            className="cursor-pointer"
          />
          <h1 className="text-white text-2xl font-semibold">Furniro</h1>
        </div>

        {/* Right Side: User Info & Profile Button */}
        {isLoaded && isSignedIn && user && (
          <div className="flex items-center space-x-3">
            <span className="text-black text-lg font-bold bg-yellow-50  px-3 py-1 rounded-lg">
              {String(user.publicMetadata?.role)}
            </span>

            <UserButton afterSwitchSessionUrl="/sign-in" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
