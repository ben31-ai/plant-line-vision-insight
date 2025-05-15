
import React from "react";
import { MetricsOverview } from "./MetricsOverview";
import { ProductsList } from "./ProductsList";
import { MLInsights } from "./MLInsights";
import { ProductDetail } from "./ProductDetail";
import { productDetails } from "@/utils/mockData";

interface DashboardContentProps {
  products: any[];
  metrics: any;
  onSelectProduct: (productId: string) => void;
  selectedProductId: string | null;
  onCloseProductDetail: () => void;
}

export const DashboardContent: React.FC<DashboardContentProps> = ({
  products,
  metrics,
  onSelectProduct,
  selectedProductId,
  onCloseProductDetail
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
          <h2 className="text-lg font-medium mb-3">Product List</h2>
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
