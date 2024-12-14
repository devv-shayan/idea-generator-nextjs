"use client";

import * as React from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { useAuth, UserButton } from "@clerk/nextjs";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils"; // Import utility for conditional classes.
import { usePathname } from "next/navigation"; // Correct usePathname import
import { SettingsModal } from "./SettingsModal";

const navigationItems = [
  { title: "Videos", href: "/videos" },
  { title: "Ideas", href: "/ideas" },
];

export default function Navbar() {
  const pathname = usePathname(); // Correctly use pathname as a string
  const { isSignedIn } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4 md:px-6">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold">Logo</span>
          </Link>
        </div>

        {isSignedIn && (
          <div className="ml-auto flex items-center ">
            {/* Desktop Navigation */}
            <NavigationMenu className="hidden md:flex md:gap-10">
              <NavigationMenuList>
                {navigationItems.map((item) => (
                  <NavigationMenuItem key={item.title}>
                    <NavigationMenuLink
                      href={item.href}
                      className={cn(
                        "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
                        pathname.startsWith(item.href)
                          ? "bg-black text-white" // Active link styling
                          : "bg-white border text-black" // Non-active link padding
                      )}
                    >
                      {item.title}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
                <SettingsModal />

                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8",
                    },
                  }}
                />
              </NavigationMenuList>
            </NavigationMenu>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetHeader>
                <SheetTitle className="flex  flex-row-reverse gap-3 md:hidden">
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Menu className="h-6 w-6" />
                      <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                  </SheetTrigger>
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "w-8 h-8",
                      },
                    }}
                  />
                  <SettingsModal />
                </SheetTitle>
              </SheetHeader>
              <SheetContent side="right">
                <div className="grid gap-2 py-6">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.title}
                      href={item.href}
                      className="flex w-full items-center py-2 text-lg font-semibold"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        )}

        {!isSignedIn && (
          <div className="ml-auto flex items-center space-x-4">
            <Button variant="outline" asChild>
              <Link href="/videos">Get Started</Link>
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
