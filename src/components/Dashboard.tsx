import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";
import { ProductsList } from "./ProductsList";
import { TimeSeriesChart } from "./TimeSeriesChart";
import { TimeSeriesEChart } from "./TimeSeriesEChart";
import { MetricsOverview } from "./MetricsOverview";
import { FilterPanel } from "./FilterPanel";
import { TimeRangeSelector } from "./TimeRangeSelector";
import { MLInsights } from "./MLInsights";
import { mockMLInsights } from "@/utils/mockData";

export const Dashboard = () => {
  return (
    <div className="container mx-auto pb-16">
      <header className="py-6 mb-6 border-b">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold">Production Analytics</h1>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Dashboard
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Products</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <a
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                          href="/"
                        >
                          <div className="mb-2 text-lg font-medium">
                            Production Line Overview
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            View all production lines and their current status
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <Link
                        to="/product/1"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">
                          Production Line 1
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Active - Running at 94% efficiency
                        </p>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/product/2"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">
                          Production Line 2
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Active - Running at 87% efficiency
                        </p>
                      </Link>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/ai-modeling">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    AI Modeling
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardContent>
            <TimeSeriesEChart />
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <MetricsOverview />
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <MLInsights insights={mockMLInsights} />
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardContent>
          <FilterPanel />
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardContent>
          <TimeRangeSelector />
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardContent>
          <ProductsList />
        </CardContent>
      </Card>
    </div>
  );
};
