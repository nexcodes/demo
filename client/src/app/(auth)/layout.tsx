import Image from "next/image";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import Link from "next/link";

const legalPages = [
  {
    title: "How It Works",
    href: "/how-it-works",
    description: "Learn how our platform connects you with compatible matches",
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

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen">
      <div className="p-4 relative z-50">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="!bg-black !text-white border-0 hover:!bg-zinc-800 hover:!text-white focus:!bg-zinc-800 focus:!text-white data-[state=open]:!bg-zinc-800">
                Company
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-black border-none">
                  {legalPages.map((page) => (
                    <li key={page.title}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={page.href}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors bg-black text-white border-0 hover:bg-zinc-800 hover:text-white focus:bg-zinc-800 focus:text-white"
                        >
                          <div className="text-sm font-medium leading-none text-white">
                            {page.title}
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-gray-400">
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
      <div className="flex w-full items-center justify-center bg-black py-10 px-4">
        {/* Background Image with Parallax Effect */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src="/background.webp"
            alt="Background"
            fill
            className="object-cover transform-gpu animate-subtle-zoom"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/70" />
        </div>

        {children}
      </div>
    </div>
  );
}
