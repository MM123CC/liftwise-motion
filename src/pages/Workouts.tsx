import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Dumbbell, 
  Timer, 
  Target,
  Play,
  Pause,
  RotateCcw,
  Plus,
  TrendingUp
} from "lucide-react";

const muscleGroups = [
  {
    id: "chest",
    name: "CHEST",
    icon: "💪",
    exercises: ["Bench Press", "Incline Press", "Chest Fly", "Push-ups"],
    lastWorkout: "2 days ago",
    nextSuggestion: "Increase bench press by 2.5kg"
  },
  {
    id: "back", 
    name: "BACK",
    icon: "🔥",
    exercises: ["Pull-ups", "Barbell Rows", "Lat Pulldown", "Deadlifts"],
    lastWorkout: "3 days ago",
    nextSuggestion: "Try adding 1 more pull-up rep"
  },
  {
    id: "shoulders",
    name: "SHOULDERS", 
    icon: "⚡",
    exercises: ["Shoulder Press", "Lateral Raises", "Front Raises", "Rear Delt Fly"],
    lastWorkout: "1 day ago",
    nextSuggestion: "Perfect form on lateral raises"
  },
  {
    id: "arms",
    name: "ARMS",
    icon: "💥", 
    exercises: ["Bicep Curls", "Tricep Dips", "Hammer Curls", "Close-Grip Press"],
    lastWorkout: "2 days ago",
    nextSuggestion: "Increase curl weight by 1kg"
  },
  {
    id: "legs",
    name: "LEGS",
    icon: "🚀",
    exercises: ["Squats", "Leg Press", "Lunges", "Calf Raises"],
    lastWorkout: "Today",
    nextSuggestion: "Add 5kg to squat next session"
  }
];

const activeWorkout = {
  isActive: false,
  muscleGroup: "CHEST",
  currentExercise: "Bench Press",
  currentSet: 2,
  totalSets: 4,
  restTimeLeft: 65,
  weight: 80,
  reps: 8
};

export default function Workouts() {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [isResting, setIsResting] = useState(false);
  const [restTimer, setRestTimer] = useState(60);

  const handleStartWorkout = (groupId: string) => {
    setSelectedGroup(groupId);
  };

  const handleStartRest = () => {
    setIsResting(true);
    setRestTimer(60);
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2 pt-4">
        <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
          <Dumbbell className="h-7 w-7 text-primary" />
          <span className="text-gradient-primary">Workouts</span>
        </h1>
        <p className="text-muted-foreground">
          Choose your muscle group and start training
        </p>
      </div>

      {/* Active Workout Status */}
      {activeWorkout.isActive && (
        <Card className="workout-card border-success/30 bg-gradient-success/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-success/20">
                  <Play className="h-4 w-4 text-success" />
                </div>
                <div>
                  <p className="font-semibold text-success">Workout in Progress</p>
                  <p className="text-sm text-muted-foreground">
                    {activeWorkout.muscleGroup} • {activeWorkout.currentExercise}
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-success/20 text-success">
                Set {activeWorkout.currentSet}/{activeWorkout.totalSets}
              </Badge>
            </div>
            
            <div className="flex gap-2">
              <Button size="sm" className="btn-success flex-1">
                <Play className="h-4 w-4 mr-1" />
                Continue
              </Button>
              <Button size="sm" variant="outline" className="border-success/30">
                <Pause className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rest Timer */}
      {isResting && (
        <Card className="workout-card border-warning/30 bg-gradient-energy/10 animate-pulse-glow">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Timer className="h-5 w-5 text-warning" />
              <span className="font-semibold text-warning">Rest Time</span>
            </div>
            <div className="text-3xl font-bold text-gradient-energy mb-2">
              {Math.floor(restTimer / 60)}:{(restTimer % 60).toString().padStart(2, '0')}
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="flex-1">
                <Plus className="h-4 w-4 mr-1" />
                +15s
              </Button>
              <Button size="sm" className="btn-success flex-1">
                Next Set
              </Button>
              <Button size="sm" variant="outline">
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Muscle Groups */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Select Muscle Group
        </h2>
        
        <div className="grid gap-4">
          {muscleGroups.map((group) => (
            <Card 
              key={group.id}
              className="muscle-group-card cursor-pointer hover:shadow-glow transition-all duration-300"
              onClick={() => handleStartWorkout(group.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{group.icon}</span>
                    <div>
                      <h3 className="font-bold text-lg text-primary-foreground">
                        {group.name}
                      </h3>
                      <p className="text-primary-foreground/80 text-sm">
                        {group.exercises.length} exercises
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground">
                      {group.lastWorkout}
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-primary-foreground/90">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-sm">{group.nextSuggestion}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {group.exercises.slice(0, 3).map((exercise) => (
                      <Badge 
                        key={exercise}
                        variant="outline" 
                        className="text-xs border-primary-foreground/30 text-primary-foreground/80"
                      >
                        {exercise}
                      </Badge>
                    ))}
                    {group.exercises.length > 3 && (
                      <Badge 
                        variant="outline" 
                        className="text-xs border-primary-foreground/30 text-primary-foreground/80"
                      >
                        +{group.exercises.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Button 
          variant="outline" 
          className="h-16 flex-col gap-2 border-border hover:border-primary/50"
        >
          <Plus className="h-5 w-5" />
          <span className="text-sm">Custom Exercise</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="h-16 flex-col gap-2 border-border hover:border-accent/50"
        >
          <Timer className="h-5 w-5" />
          <span className="text-sm">Quick Timer</span>
        </Button>
      </div>

      {/* Motivation */}
      <Card className="stat-card text-center">
        <CardContent className="p-4">
          <p className="text-sm font-medium text-gradient-energy">
            "Every rep counts, every set matters! 💪"
          </p>
        </CardContent>
      </Card>
    </div>
  );
}