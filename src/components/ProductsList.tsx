
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Product } from "@/utils/mockData";
import { format } from "date-fns";

interface ProductsListProps {
  products: Product[];
  onSelectProduct: (productId: string) => void;
}

export const ProductsList: React.FC<ProductsListProps> = ({ products, onSelectProduct }) => {
  const renderStatusIndicator = (status: 'ok' | 'warning' | 'error') => {
    const statusClass = 
      status === 'ok' 
        ? 'status-ok' 
        : status === 'warning' 
          ? 'status-warning' 
          : 'status-error';
    
    return <span className={`status-indicator ${statusClass}`}></span>;
  };

  return (
    <Card className="bg-card shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Products ({products.length})</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[400px] overflow-auto scrollbar-thin">
          <Table>
            <TableHeader className="sticky top-0 bg-card z-10">
              <TableRow>
                <TableHead className="w-[180px]">Serial Number</TableHead>
                <TableHead className="w-[180px]">Timestamp</TableHead>
                <TableHead>Plant</TableHead>
                <TableHead>Line</TableHead>
                <TableHead>Controller Status</TableHead>
                <TableHead>AI Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No products found for the selected filters.
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow 
                    key={product.id}
                    className="cursor-pointer hover:bg-secondary/40"
                    onClick={() => onSelectProduct(product.id)}
                  >
                    <TableCell className="font-medium">{product.serialNumber}</TableCell>
                    <TableCell>{format(new Date(product.timestamp), "MMM d, yyyy HH:mm")}</TableCell>
                    <TableCell>{product.plantId.replace('p', 'Plant ')}</TableCell>
                    <TableCell>{product.lineId.replace('l', 'Line ')}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {renderStatusIndicator(product.controllerStatus)}
                        <span className="capitalize">{product.controllerStatus}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {renderStatusIndicator(product.aiStatus)}
                        <span className="capitalize">{product.aiStatus}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
