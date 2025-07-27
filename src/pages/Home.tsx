import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Dumbbell, 
  TrendingUp, 
  Timer, 
  Target, 
  Flame,
  Award,
  Activity,
  Calendar
} from "lucide-react";

const muscleGroups = [
  { name: "CHEST", progress: 75, lastWorkout: "2 days ago", icon: "💪" },
  { name: "BACK", progress: 60, lastWorkout: "3 days ago", icon: "🔥" },
  { name: "SHOULDERS", progress: 85, lastWorkout: "1 day ago", icon: "⚡" },
  { name: "ARMS", progress: 70, lastWorkout: "2 days ago", icon: "💥" },
  { name: "LEGS", progress: 90, lastWorkout: "Today", icon: "🚀" },
];

const todayStats = {
  totalWorkouts: 42,
  streakDays: 7,
  totalWeight: 2840,
  nextWorkout: "Chest & Shoulders"
};

export default function Home() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header Section */}
      <div className="text-center space-y-2 pt-4">
        <h1 className="text-2xl font-bold text-gradient-primary">
          {getGreeting()}, Champion! 💪
        </h1>
        <p className="text-muted-foreground">
          Ready to crush your fitness goals?
        </p>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-primary">
                <Flame className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gradient-energy">
                  {todayStats.streakDays}
                </p>
                <p className="text-xs text-muted-foreground">Day Streak</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-success">
                <Award className="h-5 w-5 text-success-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-success">
                  {todayStats.totalWorkouts}
                </p>
                <p className="text-xs text-muted-foreground">Total Workouts</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Workout CTA */}
      <Card className="workout-card border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-primary animate-pulse-glow">
                <Dumbbell className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Today's Workout</h3>
                <p className="text-muted-foreground text-sm">
                  {todayStats.nextWorkout}
                </p>
              </div>
            </div>
            <Timer className="h-5 w-5 text-muted-foreground" />
          </div>
          
          <Button 
            className="btn-primary w-full h-12 text-lg font-bold animate-bounce-in"
            size="lg"
          >
            Start Workout 🚀
          </Button>
        </CardContent>
      </Card>

      {/* Progress Overview */}
      <Card className="workout-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Weekly Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {muscleGroups.map((group) => (
              <div key={group.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{group.icon}</span>
                    <span className="font-semibold text-sm">{group.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-primary">
                      {group.progress}%
                    </span>
                    <p className="text-xs text-muted-foreground">
                      {group.lastWorkout}
                    </p>
                  </div>
                </div>
                <Progress 
                  value={group.progress} 
                  className="h-2 bg-muted"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Button 
          variant="outline" 
          className="h-20 flex-col gap-2 border-border hover:border-primary/50 transition-all duration-300"
        >
          <Activity className="h-6 w-6" />
          <span className="text-sm font-medium">View Progress</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="h-20 flex-col gap-2 border-border hover:border-accent/50 transition-all duration-300"
        >
          <Calendar className="h-6 w-6" />
          <span className="text-sm font-medium">Workout History</span>
        </Button>
      </div>

      {/* Motivational Quote */}
      <Card className="stat-card text-center">
        <CardContent className="p-6">
          <blockquote className="text-lg font-medium text-gradient-primary italic">
            "The only bad workout is the one that didn't happen."
          </blockquote>
          <p className="text-sm text-muted-foreground mt-2">
            - Keep pushing forward! 💪
          </p>
        </CardContent>
      </Card>
    </div>
  );
}