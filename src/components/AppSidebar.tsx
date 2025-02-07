"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";


// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: "/assets/admin-assets/add_icon.png",
  },
  {
    title: "Add Item",
    url: "/add-item",
    icon: "/assets/admin-assets/add_icon.png",
  },
  {
    title: "List item",
    url: "/list-item",
    icon: "/assets/admin-assets/order_icon.png",
  },
  {
    title: "Customers",
    url: "/users",
    icon: "/assets/admin-assets/order_icon.png",
  },
  {
    title: "Orders",
    url: "/orders",
    icon: "/assets/admin-assets/order_icon.png",
  },
  
];


const AppSidebar = () => {
  const [active, setActive] = useState("");
  const pathname = usePathname()

  useEffect(() => {
    const activeItem = items.find((item) => item.url === pathname);
    if (activeItem) setActive(activeItem.title);
  }, [pathname]);

  return (
      <Sidebar className="mt-16 h-full  ">
        <SidebarContent className="mt-5">
          <SidebarGroup>
            <SidebarGroupContent className="p-0">
              <SidebarMenu className=""> 
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className={`rounded-none mb-2 w-full p-2   ${active === item.title ? "border-r-4 border-[#f0d786] bg-sidebar-accent" : ""} `}>
                      <Link href={item.url} >
                        <Image src={item.icon} alt="icons" width={20} height={20}/>
                        <span className="text-lg">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
  );
};

export default AppSidebar;
