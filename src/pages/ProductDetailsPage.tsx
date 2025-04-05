
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { ProductDetail as ProductDetailType } from "@/utils/mockData";
import { TimeSeriesEChart } from "@/components/TimeSeriesEChart";
import { ImageViewer } from "@/components/ImageViewer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MLInsights } from "@/components/MLInsights";

const ProductDetailsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showMLAnalytics, setShowMLAnalytics] = useState(false);
  const product = location.state?.product as ProductDetailType;

  if (!product) {
    // Redirect back to dashboard if no product data
    navigate("/");
    return null;
  }

  const renderStatusIndicator = (status: 'ok' | 'warning' | 'error') => {
    const statusClass = 
      status === 'ok' 
        ? 'bg-green-500' 
        : status === 'warning' 
          ? 'bg-yellow-500' 
          : 'bg-red-500';
    
    return (
      <span className={`inline-block w-3 h-3 mr-2 rounded-full ${statusClass}`}></span>
    );
  };

  const handleBackClick = () => {
    navigate("/");
  };

  const toggleMLAnalytics = () => {
    setShowMLAnalytics(!showMLAnalytics);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center mb-6">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleBackClick} 
          className="mr-2"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Product Details: {product.serialNumber}</h1>
      </div>

      {/* Summary section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Timestamp</p>
            <p className="font-medium">{format(new Date(product.timestamp), "MMM d, yyyy HH:mm")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Location</p>
            <p className="font-medium">
              {product.plantId.replace('p', 'Plant ')} - {product.lineId.replace('l', 'Line ')}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Controller Status</p>
            <p className="flex items-center font-medium">
              {renderStatusIndicator(product.controllerStatus)}
              <span className="capitalize">{product.controllerStatus}</span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">AI Status</p>
            <p className="flex items-center font-medium">
              {renderStatusIndicator(product.aiStatus)}
              <span className="capitalize">{product.aiStatus}</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Parameters section */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Parameters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(product.parameters).map(([key, value]) => (
              <div key={key}>
                <p className="text-sm text-muted-foreground capitalize">{key.replace('_', ' ')}</p>
                <p className="font-medium">{value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Time series chart */}
      <Card className="mb-6">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-medium">Sensor Readings</CardTitle>
          <Button onClick={toggleMLAnalytics} variant="outline" size="sm">
            {showMLAnalytics ? "Hide ML Analytics" : "Show ML Analytics"}
          </Button>
        </CardHeader>
        <CardContent>
          {/* Pass initial data from product, but the component will also try to fetch from API */}
          <TimeSeriesEChart data={product.timeSeries} />
        </CardContent>
      </Card>

      {/* ML Analytics */}
      {showMLAnalytics && (
        <Card className="mb-6">
          <MLInsights />
        </Card>
      )}

      {/* Images */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Product Images</CardTitle>
        </CardHeader>
        <CardContent>
          <ImageViewer images={product.images} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductDetailsPage;
