import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSettings } from '@/contexts/SettingsContext';
import { useToast } from '@/hooks/use-toast';
import { Settings as SettingsIcon } from 'lucide-react';

const SettingsPage = () => {
  const { settings, updateSettings } = useSettings();
  const { toast } = useToast();
  const [localSettings, setLocalSettings] = React.useState(settings);

  const handleSave = () => {
    updateSettings(localSettings);
    toast({
      title: 'Settings saved',
      description: 'Your preferences have been updated successfully.',
    });
  };

  const handleReset = () => {
    const defaults = { autoRefreshInterval: 30, trendThreshold: 5, trendWatchPeriod: 24 };
    setLocalSettings(defaults);
    updateSettings(defaults);
    toast({
      title: 'Settings reset',
      description: 'All settings have been restored to defaults.',
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center gap-3">
            <SettingsIcon className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Settings</h1>
              <p className="text-muted-foreground">Customize your dashboard preferences</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Auto-Refresh Interval</CardTitle>
              <CardDescription>
                Set how frequently the dashboard updates automatically (in seconds)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Refresh every {localSettings.autoRefreshInterval} seconds</Label>
                  <Input
                    type="number"
                    min="5"
                    max="300"
                    value={localSettings.autoRefreshInterval}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        autoRefreshInterval: parseInt(e.target.value) || 30,
                      })
                    }
                    className="w-24"
                  />
                </div>
                <Slider
                  value={[localSettings.autoRefreshInterval]}
                  onValueChange={([value]) =>
                    setLocalSettings({ ...localSettings, autoRefreshInterval: value })
                  }
                  min={5}
                  max={300}
                  step={5}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Range: 5 to 300 seconds (5 minutes)
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Trend Threshold</CardTitle>
              <CardDescription>
                Set the percentage change required to highlight trends
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Threshold: {localSettings.trendThreshold}%</Label>
                  <Input
                    type="number"
                    min="1"
                    max="50"
                    value={localSettings.trendThreshold}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        trendThreshold: parseInt(e.target.value) || 5,
                      })
                    }
                    className="w-24"
                  />
                </div>
                <Slider
                  value={[localSettings.trendThreshold]}
                  onValueChange={([value]) =>
                    setLocalSettings({ ...localSettings, trendThreshold: value })
                  }
                  min={1}
                  max={50}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Range: 1% to 50% - Lower values show more sensitive trends
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Trend Watch Period</CardTitle>
              <CardDescription>
                Set the time period in hours for trend analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Watch last {localSettings.trendWatchPeriod} hours</Label>
                  <Input
                    type="number"
                    min="1"
                    max="168"
                    value={localSettings.trendWatchPeriod}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        trendWatchPeriod: parseInt(e.target.value) || 24,
                      })
                    }
                    className="w-24"
                  />
                </div>
                <Slider
                  value={[localSettings.trendWatchPeriod]}
                  onValueChange={([value]) =>
                    setLocalSettings({ ...localSettings, trendWatchPeriod: value })
                  }
                  min={1}
                  max={168}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Range: 1 to 168 hours (1 week)
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button onClick={handleSave} className="flex-1">
              Save Settings
            </Button>
            <Button onClick={handleReset} variant="outline">
              Reset to Defaults
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SettingsPage;
