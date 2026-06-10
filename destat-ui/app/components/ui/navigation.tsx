import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "~/components/ui/navigation-menu";

import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { rabbykit } from "~/root";
import WalletButton from "../wallet-button";

// - navigation
//    - Dashboard
//    - Survey
//        - All surveys
//        - Create survey
//    - Archive
//        - Finished surveys
//    - Profile
//        - My surveys
//        - My responses

export default function Navigation() {
  return (
    <nav className="fixed top-0 right-0 left-0">
      <div className="flex w-screen items-center justify-between py-5 px-5">
        <Link to="/" className="text-lg font-bold">
          DESTAT
        </Link>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink render={<a href="/" />}>
                Dashboard
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Survey</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-2">
                    <NavigationMenuLink
                      render={
                        <a
                          className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-gradient-to-b p-6 no-underline outline-none select-none focus:shadow-md"
                          href="/"
                        >
                          <div className="mt-4 mb-2 text-lg font-medium">
                            shadcn/ui
                          </div>
                          <p className="text-muted-foreground text-sm leading-tight">
                            Easily collect reliable and trustworthy survey
                            results from your participants
                          </p>
                        </a>
                      }
                    />
                  </li>
                  <li>
                    <NavigationMenuLink
                      render={
                        <a href="/survey/all">
                          <div className="text-sm leading-none font-medium">
                            All Surveys
                          </div>
                          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                            Explore all existing ones and join the survey to get
                            the reward.
                          </p>
                        </a>
                      }
                    />
                  </li>
                  <li>
                    <NavigationMenuLink
                      render={
                        <a href="/survey/create">
                          <div className="text-sm leading-none font-medium">
                            Create survey
                          </div>
                          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                            Create a new survey.
                          </p>
                        </a>
                      }
                    />
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Archive</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-2 h-[150px]">
                    <NavigationMenuLink
                      render={
                        <a
                          className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-gradient-to-b p-6 no-underline outline-none select-none focus:shadow-md"
                          href="/"
                        >
                          <div className="mt-4 mb-2 text-lg font-medium">
                            shadcn/ui
                          </div>
                          <p className="text-muted-foreground text-sm leading-tight">
                            Beautifully designed components built with Tailwind
                            CSS.
                          </p>
                        </a>
                      }
                    />
                  </li>
                  <li>
                    <NavigationMenuLink
                      render={
                        <a href="/">
                          <div className="text-sm leading-none font-medium">
                            Finished surveys
                          </div>
                          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                            Finished surveys
                          </p>
                        </a>
                      }
                    />
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Profile</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-2">
                    <NavigationMenuLink
                      render={
                        <a
                          className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-gradient-to-b p-6 no-underline outline-none select-none focus:shadow-md"
                          href="/"
                        >
                          <div className="mt-4 mb-2 text-lg font-medium">
                            shadcn/ui
                          </div>
                          <p className="text-muted-foreground text-sm leading-tight">
                            Beautifully designed components built with Tailwind
                            CSS.
                          </p>
                        </a>
                      }
                    />
                  </li>
                  <li>
                    <NavigationMenuLink
                      render={
                        <a href="/">
                          <div className="text-sm leading-none font-medium">
                            My surveys
                          </div>
                          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                            My surveys
                          </p>
                        </a>
                      }
                    />
                  </li>
                  <li>
                    <NavigationMenuLink
                      render={
                        <a href="/">
                          <div className="text-sm leading-none font-medium">
                            My responses
                          </div>
                          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                            My responses
                          </p>
                        </a>
                      }
                    />
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <WalletButton />
      </div>
    </nav>
  );
}
