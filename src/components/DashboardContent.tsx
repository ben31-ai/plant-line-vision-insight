
import React from "react";
import { MetricsOverview } from "./MetricsOverview";
import { ProductsList } from "./ProductsList";
import { MLInsights } from "./MLInsights";
import { ProductDetail } from "./ProductDetail";
import { productDetails } from "@/utils/mockData";
import { Input } from "./ui/input";
import { Search, X } from "lucide-react";

interface DashboardContentProps {
  products: any[];
  metrics: any;
  onSelectProduct: (productId: string) => void;
  selectedProductId: string | null;
  onCloseProductDetail: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const DashboardContent: React.FC<DashboardContentProps> = ({
  products,
  metrics,
  onSelectProduct,
  selectedProductId,
  onCloseProductDetail,
  searchQuery,
  onSearchChange
}) => {
  const selectedProduct = selectedProductId ? productDetails[selectedProductId] : null;
  
  return (
    <>
      {/* Metrics */}
      <div>
        <h2 className="text-lg font-medium mb-3">Process Metrics</h2>
        <MetricsOverview metrics={metrics} />
      </div>
      
      {/* Products and ML Insights section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-medium">Product List</h2>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by ID or Serial Number"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-9 pr-9"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
          <ProductsList products={products} onSelectProduct={onSelectProduct} />
        </div>
        
        <div className="lg:col-span-1">
          <h2 className="text-lg font-medium mb-3">ML Insights</h2>
          <MLInsights />
        </div>
      </div>

      {/* Product Detail Modal */}
      <ProductDetail 
        product={selectedProduct} 
        isOpen={selectedProductId !== null}
        onClose={onCloseProductDetail}
      />
    </>
  );
};
