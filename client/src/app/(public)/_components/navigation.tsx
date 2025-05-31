import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Image from "next/image";

export function Navigation() {
  const legalPages = [
    {
      title: "How It Works",
      href: "/how-it-works",
      description:
        "Learn how our platform connects you with compatible matches",
    },
    {
      title: "FAQs",
      href: "/faqs",
      description: "Find answers to commonly asked questions",
    },
    {
      title: "About Us",
      href: "/about",
      description: "Our mission to help you find meaningful connections",
    },
    {
      title: "Privacy Policy",
      href: "/privacy-policy",
      description: "How we protect and use your personal information",
    },
    {
      title: "Terms & Conditions",
      href: "/terms",
      description: "Terms of service and user guidelines",
    },
    {
      title: "Refund Policy",
      href: "/refund-policy",
      description: "Our refund and cancellation policies",
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-2">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <div className="flex justify-start w-full">
            <div className="w-24 h-12 relative">
              <Image
                src="/logo.png"
                alt="Coxee"
                fill
                className="object-contain"
              />
            </div>
          </div>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Company</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {legalPages.map((page) => (
                      <li key={page.title}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={page.href}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">
                              {page.title}
                            </div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              {page.description}
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            {/* logo */}
            <div className="flex justify-start w-full">
              <div className="w-24 h-12 relative">
                <Image
                  src="/logo.png"
                  alt="Coxee"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
              <div className="flex flex-col space-y-3">
                {legalPages.map((page) => (
                  <Link
                    key={page.title}
                    href={page.href}
                    className="text-sm font-medium transition-colors hover:text-foreground/80"
                  >
                    {page.title}
                  </Link>
                ))}
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex flex-1 items-center justify-end space-x-2 md:justify-end">
          <nav className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/auth/login">Sign In</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/auth/login">Get Started</Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
