import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Camera, 
  Scale, 
  Ruler, 
  TrendingUp,
  Calendar,
  Target,
  Plus,
  Image,
  Eye
} from "lucide-react";

const bodyStats = {
  weight: {
    current: 78.5,
    goal: 82,
    change: +1.2,
    trend: "up",
    lastWeek: 77.3
  },
  measurements: [
    { part: "Chest", current: 102, goal: 105, unit: "cm", change: +2 },
    { part: "Waist", current: 84, goal: 80, unit: "cm", change: -1.5 },
    { part: "Arms", current: 36, goal: 38, unit: "cm", change: +0.8 },
    { part: "Thighs", current: 58, goal: 60, unit: "cm", change: +1.2 }
  ],
  photos: [
    { date: "Today", type: "Front", hasPhoto: true },
    { date: "Today", type: "Side", hasPhoto: true },
    { date: "Today", type: "Back", hasPhoto: false },
    { date: "1 week ago", type: "Front", hasPhoto: true }
  ]
};

export default function Body() {
  const [selectedTab, setSelectedTab] = useState<"weight" | "measurements" | "photos">("weight");

  const getGoalProgress = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100);
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2 pt-4">
        <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
          <Scale className="h-7 w-7 text-primary" />
          <span className="text-gradient-primary">Body Tracking</span>
        </h1>
        <p className="text-muted-foreground">
          Monitor your physical transformation
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 p-1 bg-muted/30 rounded-lg">
        {[
          { id: "weight", label: "Weight", icon: Scale },
          { id: "measurements", label: "Measurements", icon: Ruler },
          { id: "photos", label: "Photos", icon: Camera }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <Button
              key={tab.id}
              variant={selectedTab === tab.id ? "default" : "ghost"}
              className={`flex-1 gap-2 transition-all duration-300 ${
                selectedTab === tab.id 
                  ? "btn-primary shadow-glow" 
                  : "hover:bg-muted/50"
              }`}
              onClick={() => setSelectedTab(tab.id as any)}
            >
              <Icon className="h-4 w-4" />
              <span className="text-sm">{tab.label}</span>
            </Button>
          );
        })}
      </div>

      {/* Weight Tracking */}
      {selectedTab === "weight" && (
        <div className="space-y-4">
          <Card className="workout-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-primary" />
                Current Weight
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className="text-4xl font-bold text-gradient-primary">
                  {bodyStats.weight.current} kg
                </div>
                <div className="flex items-center justify-center gap-4">
                  <Badge 
                    variant="default" 
                    className="bg-success/20 text-success"
                  >
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +{bodyStats.weight.change} kg this week
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress to goal</span>
                    <span className="font-semibold">{bodyStats.weight.current}/{bodyStats.weight.goal} kg</span>
                  </div>
                  <Progress 
                    value={getGoalProgress(bodyStats.weight.current, bodyStats.weight.goal)} 
                    className="h-3"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card">
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-lg font-bold text-success">+{bodyStats.weight.change}</p>
                  <p className="text-xs text-muted-foreground">This Week</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-primary">{bodyStats.weight.goal - bodyStats.weight.current}</p>
                  <p className="text-xs text-muted-foreground">To Goal</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button className="btn-primary w-full h-12">
            <Plus className="h-5 w-5 mr-2" />
            Log Today's Weight
          </Button>
        </div>
      )}

      {/* Measurements */}
      {selectedTab === "measurements" && (
        <div className="space-y-4">
          <Card className="workout-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ruler className="h-5 w-5 text-primary" />
                Body Measurements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bodyStats.measurements.map((measurement) => (
                  <div key={measurement.part} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm">{measurement.part}</span>
                      <div className="text-right">
                        <span className="text-lg font-bold text-primary">
                          {measurement.current} {measurement.unit}
                        </span>
                        <Badge 
                          variant={measurement.change > 0 ? "default" : "secondary"}
                          className={measurement.change > 0 ? "bg-success/20 text-success ml-2" : "ml-2"}
                        >
                          {measurement.change > 0 ? "+" : ""}{measurement.change}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Goal: {measurement.goal} {measurement.unit}</span>
                        <span>{Math.round(getGoalProgress(measurement.current, measurement.goal))}%</span>
                      </div>
                      <Progress 
                        value={getGoalProgress(measurement.current, measurement.goal)} 
                        className="h-2"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Button className="btn-primary w-full h-12">
            <Plus className="h-5 w-5 mr-2" />
            Update Measurements
          </Button>
        </div>
      )}

      {/* Progress Photos */}
      {selectedTab === "photos" && (
        <div className="space-y-4">
          <Card className="workout-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-primary" />
                Progress Photos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {bodyStats.photos.map((photo, index) => (
                  <Card 
                    key={index}
                    className={`border-2 transition-all duration-300 ${
                      photo.hasPhoto 
                        ? "border-success/30 bg-success/5 hover:shadow-glow cursor-pointer" 
                        : "border-dashed border-muted-foreground/30 hover:border-primary/50"
                    }`}
                  >
                    <CardContent className="p-4 text-center space-y-2">
                      {photo.hasPhoto ? (
                        <>
                          <div className="w-full h-32 bg-gradient-primary rounded-lg flex items-center justify-center">
                            <Image className="h-8 w-8 text-primary-foreground" />
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{photo.type}</p>
                            <p className="text-xs text-muted-foreground">{photo.date}</p>
                          </div>
                          <Button size="sm" variant="outline" className="w-full">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </>
                      ) : (
                        <>
                          <div className="w-full h-32 border-2 border-dashed border-muted-foreground/30 rounded-lg flex items-center justify-center">
                            <Plus className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{photo.type}</p>
                            <p className="text-xs text-muted-foreground">No photo yet</p>
                          </div>
                          <Button size="sm" className="btn-primary w-full">
                            <Camera className="h-4 w-4 mr-1" />
                            Take Photo
                          </Button>
                        </>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Button className="btn-primary h-12">
              <Camera className="h-5 w-5 mr-2" />
              Take Photos
            </Button>
            <Button variant="outline" className="h-12 border-border hover:border-accent/50">
              <Eye className="h-5 w-5 mr-2" />
              Compare
            </Button>
          </div>
        </div>
      )}

      {/* Quick Tips */}
      <Card className="stat-card">
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Target className="h-5 w-5 text-accent" />
            <span className="font-semibold text-accent">Pro Tip</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {selectedTab === "weight" && "Weigh yourself at the same time each day for consistency"}
            {selectedTab === "measurements" && "Measure in the morning before eating for best accuracy"}
            {selectedTab === "photos" && "Use the same lighting and pose for better comparisons"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}