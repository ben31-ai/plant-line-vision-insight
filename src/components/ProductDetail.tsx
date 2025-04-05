
import React from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ProductDetail as ProductDetailType } from "@/utils/mockData";
import { TimeSeriesChart } from "./TimeSeriesChart";
import { ImageViewer } from "./ImageViewer";
import { format } from "date-fns";
import { X, ArrowRight } from "lucide-react";

interface ProductDetailProps {
  product: ProductDetailType | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ product, isOpen, onClose }) => {
  const navigate = useNavigate();
  
  if (!product) return null;

  const renderStatusIndicator = (status: 'ok' | 'warning' | 'error') => {
    const statusClass = 
      status === 'ok' 
        ? 'status-ok' 
        : status === 'warning' 
          ? 'status-warning' 
          : 'status-error';
    
    return <span className={`status-indicator ${statusClass}`}></span>;
  };
  
  const handleViewDetails = () => {
    onClose();
    navigate(`/product/${product.id}`, { state: { product } });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto scrollbar-thin">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Product Details: {product.serialNumber}</span>
            <Button variant="ghost" size="icon" onClick={onClose} className="-mt-2 -mr-2">
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        {/* Summary section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div>
            <p className="text-sm text-muted-foreground">Timestamp</p>
            <p className="font-medium">{format(new Date(product.timestamp), "MMM d, yyyy HH:mm")}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Location</p>
            <p className="font-medium">
              {product.plantId.replace('p', 'Plant ')} - {product.lineId.replace('l', 'Line ')}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Controller Status</p>
            <p className="flex items-center font-medium">
              {renderStatusIndicator(product.controllerStatus)}
              <span className="capitalize">{product.controllerStatus}</span>
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">AI Status</p>
            <p className="flex items-center font-medium">
              {renderStatusIndicator(product.aiStatus)}
              <span className="capitalize">{product.aiStatus}</span>
            </p>
          </div>
        </div>

        {/* Parameters section */}
        <div className="mb-6">
          <h4 className="text-base font-medium mb-3">Parameters</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-secondary/30 rounded-md">
            {Object.entries(product.parameters).map(([key, value]) => (
              <div key={key}>
                <p className="text-sm text-muted-foreground capitalize">{key.replace('_', ' ')}</p>
                <p className="font-medium">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Time series chart */}
        <div className="mb-6">
          <TimeSeriesChart data={product.timeSeries} title="Sensor Readings" />
        </div>

        {/* Images */}
        <div>
          <ImageViewer images={product.images} title="Product Images" />
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose} className="mr-2">
            Close
          </Button>
          <Button onClick={handleViewDetails}>
            View Complete Details
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
