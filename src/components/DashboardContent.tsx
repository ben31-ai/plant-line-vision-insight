
import React, { useState, useRef, useEffect } from "react";
import { MetricsOverview } from "./MetricsOverview";
import { ProductsList } from "./ProductsList";
import { MLInsights } from "./MLInsights";
import { ProductDetail } from "./ProductDetail";
import { productDetails } from "@/utils/mockData";
import { Input } from "./ui/input";
import { Search, X } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";

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
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  
  // Filter suggestions based on search query
  const suggestions = searchQuery.trim() 
    ? products.filter(product => 
        product.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.serialNumber.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 8) // Limit to 8 suggestions
    : [];
  
  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  const handleSuggestionClick = (productId: string) => {
    onSelectProduct(productId);
    setShowSuggestions(false);
  };
  
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
            <div className="relative w-64" ref={searchRef}>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
              <Input
                type="text"
                placeholder="Search by ID or Serial Number"
                value={searchQuery}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                className="pl-9 pr-9"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    onSearchChange("");
                    setShowSuggestions(false);
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors z-10"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              
              {/* Suggestions dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full mt-1 w-full bg-popover border border-border rounded-md shadow-lg z-50">
                  <ScrollArea className="max-h-64">
                    <div className="p-1">
                      {suggestions.map((product) => (
                        <button
                          key={product.id}
                          onClick={() => handleSuggestionClick(product.id)}
                          className="w-full text-left px-3 py-2 hover:bg-accent rounded-sm transition-colors flex items-center justify-between group"
                        >
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{product.id}</span>
                            <span className="text-xs text-muted-foreground">{product.serialNumber}</span>
                          </div>
                          <Badge 
                            variant={product.status === 'ok' ? 'default' : product.status === 'warning' ? 'secondary' : 'destructive'}
                            className="ml-2"
                          >
                            {product.status}
                          </Badge>
                        </button>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
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
