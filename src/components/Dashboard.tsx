
import React, { useState } from "react";
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
import { mlInsights, products, getMetrics, getFilteredProducts, FilterState } from "@/utils/mockData";
import { subDays, endOfDay } from "date-fns";

export const Dashboard = () => {
  // State for time range
  const [startDate, setStartDate] = useState(subDays(new Date(), 14));
  const [endDate, setEndDate] = useState(endOfDay(new Date()));
  
  // State for filters
  const [filters, setFilters] = useState<FilterState>({
    plantId: null,
    lineId: null,
    stationId: null,
    programId: null,
    partId: null,
  });
  
  // Get filtered products based on time range and filters
  const filteredProducts = getFilteredProducts(
    startDate,
    endDate,
    filters.plantId || undefined,
    filters.lineId || undefined,
    filters.stationId || undefined,
    filters.programId || undefined,
    filters.partId || undefined
  );
  
  // Generate metrics from filtered products
  const metrics = getMetrics(filteredProducts);
  
  // Handle time range changes
  const handleTimeRangeChange = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
  };
  
  // Handle filter changes
  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };
  
  // Handle product selection
  const handleProductSelect = (productId: string) => {
    console.log(`Selected product: ${productId}`);
    // Navigate to product details page
    window.location.href = `/product/${productId}`;
  };

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
            <MetricsOverview metrics={metrics} />
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <MLInsights insights={mlInsights} />
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardContent>
          <FilterPanel onFilterChange={handleFilterChange} />
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardContent>
          <TimeRangeSelector 
            startDate={startDate}
            endDate={endDate}
            onRangeChange={handleTimeRangeChange}
          />
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardContent>
          <ProductsList 
            products={filteredProducts} 
            onSelectProduct={handleProductSelect} 
          />
        </CardContent>
      </Card>
    </div>
  );
};
