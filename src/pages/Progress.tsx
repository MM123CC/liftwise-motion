import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress as ProgressBar } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Award, 
  Target, 
  Calendar,
  Flame,
  Activity,
  Trophy,
  ArrowUp,
  ArrowDown
} from "lucide-react";

const progressData = {
  weeklyComparison: [
    { muscle: "CHEST", thisWeek: 320, lastWeek: 300, change: 6.7, trend: "up" },
    { muscle: "BACK", thisWeek: 280, lastWeek: 270, change: 3.7, trend: "up" },
    { muscle: "SHOULDERS", thisWeek: 180, lastWeek: 185, change: -2.7, trend: "down" },
    { muscle: "ARMS", thisWeek: 240, lastWeek: 230, change: 4.3, trend: "up" },
    { muscle: "LEGS", thisWeek: 450, lastWeek: 420, change: 7.1, trend: "up" }
  ],
  personalRecords: [
    { exercise: "Bench Press", weight: 85, date: "2 days ago", isNew: true },
    { exercise: "Squat", weight: 120, date: "1 week ago", isNew: false },
    { exercise: "Deadlift", weight: 140, date: "3 days ago", isNew: true },
    { exercise: "Pull-ups", reps: 12, date: "5 days ago", isNew: false }
  ],
  monthlyStats: {
    totalWorkouts: 16,
    totalWeight: 12800,
    avgWorkoutTime: 68,
    streakRecord: 14
  }
};

export default function Progress() {
  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2 pt-4">
        <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
          <TrendingUp className="h-7 w-7 text-primary" />
          <span className="text-gradient-primary">Progress</span>
        </h1>
        <p className="text-muted-foreground">
          Track your fitness journey and achievements
        </p>
      </div>

      {/* Monthly Overview */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-primary">
                <Activity className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">
                  {progressData.monthlyStats.totalWorkouts}
                </p>
                <p className="text-xs text-muted-foreground">Workouts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-success">
                <Trophy className="h-5 w-5 text-success-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-success">
                  {progressData.monthlyStats.totalWeight/1000}K
                </p>
                <p className="text-xs text-muted-foreground">Total kg</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Comparison */}
      <Card className="workout-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Weekly Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {progressData.weeklyComparison.map((data) => (
              <div key={data.muscle} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{data.muscle}</span>
                    <Badge 
                      variant={data.trend === "up" ? "default" : "destructive"}
                      className={data.trend === "up" ? "bg-success/20 text-success" : ""}
                    >
                      {data.trend === "up" ? (
                        <ArrowUp className="h-3 w-3 mr-1" />
                      ) : (
                        <ArrowDown className="h-3 w-3 mr-1" />
                      )}
                      {Math.abs(data.change)}%
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{data.thisWeek}kg</p>
                    <p className="text-xs text-muted-foreground">
                      vs {data.lastWeek}kg
                    </p>
                  </div>
                </div>
                <ProgressBar 
                  value={(data.thisWeek / Math.max(data.thisWeek, data.lastWeek)) * 100} 
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Personal Records */}
      <Card className="workout-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-accent" />
            Personal Records
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {progressData.personalRecords.map((record, index) => (
              <div 
                key={index} 
                className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-300 ${
                  record.isNew 
                    ? "border-accent/30 bg-accent/5 animate-pulse-glow" 
                    : "border-border bg-muted/20"
                }`}
              >
                <div className="flex items-center gap-3">
                  {record.isNew && (
                    <div className="p-1 rounded-full bg-gradient-energy animate-bounce-in">
                      <Trophy className="h-4 w-4 text-accent-foreground" />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-sm">{record.exercise}</p>
                    <p className="text-xs text-muted-foreground">{record.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-gradient-energy">
                    {record.weight ? `${record.weight}kg` : `${record.reps} reps`}
                  </p>
                  {record.isNew && (
                    <Badge className="bg-gradient-energy text-accent-foreground">
                      NEW PR! 🎉
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Goals */}
      <Card className="workout-card border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Monthly Goals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Workout Frequency</span>
                <span className="text-sm text-primary font-bold">16/20 days</span>
              </div>
              <ProgressBar value={80} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Weight Goal</span>
                <span className="text-sm text-success font-bold">12.8K/15K kg</span>
              </div>
              <ProgressBar value={85} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Consistency Streak</span>
                <span className="text-sm text-accent font-bold">7/14 days</span>
              </div>
              <ProgressBar value={50} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Button 
          variant="outline" 
          className="h-16 flex-col gap-2 border-border hover:border-primary/50"
        >
          <TrendingUp className="h-5 w-5" />
          <span className="text-sm">View Charts</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="h-16 flex-col gap-2 border-border hover:border-success/50"
        >
          <Calendar className="h-5 w-5" />
          <span className="text-sm">History</span>
        </Button>
      </div>

      {/* Achievement Message */}
      <Card className="stat-card text-center">
        <CardContent className="p-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Flame className="h-5 w-5 text-accent" />
            <span className="font-semibold text-accent">You're on fire!</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Keep pushing - you're {progressData.monthlyStats.streakRecord - 7} days away from beating your record! 🔥
          </p>
        </CardContent>
      </Card>
    </div>
  );
}