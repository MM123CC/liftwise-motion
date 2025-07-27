import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { 
  Dumbbell, 
  Timer, 
  Target,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Minus,
  TrendingUp,
  ArrowLeft,
  Check,
  Info,
  Award,
  Edit,
  Star
} from "lucide-react";

// Workout data structures
const todaysRecommendedWorkout = {
  muscleGroup: "CHEST",
  estimatedDuration: "45 min",
  isToday: true
};

const muscleGroups = [
  {
    id: "chest",
    name: "CHEST",
    icon: "💪",
    lastWorkout: "2 days ago",
    exercises: [
      { id: 1, name: "Bench Press", lastWeight: "60kg", defaultSets: 4, instructions: "Lie on bench, grip bar shoulder-width apart, lower to chest, press up." },
      { id: 2, name: "Incline Press", lastWeight: "50kg", defaultSets: 3, instructions: "Set bench to 30-45 degrees, press weight up and slightly forward." },
      { id: 3, name: "Chest Fly", lastWeight: "20kg", defaultSets: 3, instructions: "Arms wide, bring dumbbells together above chest in arc motion." },
      { id: 4, name: "Push-ups", lastWeight: "Bodyweight", defaultSets: 3, instructions: "Standard push-up form, keep body straight." }
    ]
  },
  {
    id: "back", 
    name: "BACK",
    icon: "🔥",
    lastWorkout: "3 days ago",
    exercises: [
      { id: 5, name: "Pull-ups", lastWeight: "Bodyweight", defaultSets: 4, instructions: "Hang from bar, pull up until chin over bar." },
      { id: 6, name: "Barbell Rows", lastWeight: "70kg", defaultSets: 4, instructions: "Bend over, pull bar to lower chest, squeeze shoulder blades." },
      { id: 7, name: "Lat Pulldown", lastWeight: "55kg", defaultSets: 3, instructions: "Pull bar down to upper chest, lean back slightly." }
    ]
  },
  {
    id: "shoulders",
    name: "SHOULDERS", 
    icon: "⚡",
    lastWorkout: "1 day ago",
    exercises: [
      { id: 8, name: "Shoulder Press", lastWeight: "40kg", defaultSets: 4, instructions: "Press weights overhead, keep core tight." },
      { id: 9, name: "Lateral Raises", lastWeight: "15kg", defaultSets: 3, instructions: "Raise arms out to sides until parallel to floor." },
      { id: 10, name: "Front Raises", lastWeight: "12kg", defaultSets: 3, instructions: "Raise weights forward to shoulder height." }
    ]
  },
  {
    id: "arms",
    name: "ARMS",
    icon: "💥", 
    lastWorkout: "2 days ago",
    exercises: [
      { id: 11, name: "Bicep Curls", lastWeight: "20kg", defaultSets: 3, instructions: "Curl weights up, keep elbows stationary." },
      { id: 12, name: "Tricep Dips", lastWeight: "Bodyweight", defaultSets: 3, instructions: "Lower body by bending arms, press back up." },
      { id: 13, name: "Hammer Curls", lastWeight: "18kg", defaultSets: 3, instructions: "Curl with neutral grip, thumbs up." }
    ]
  },
  {
    id: "legs",
    name: "LEGS",
    icon: "🚀",
    lastWorkout: "Today",
    exercises: [
      { id: 14, name: "Squats", lastWeight: "80kg", defaultSets: 4, instructions: "Squat down until thighs parallel, drive through heels." },
      { id: 15, name: "Leg Press", lastWeight: "120kg", defaultSets: 3, instructions: "Press weight up with legs, don't lock knees." },
      { id: 16, name: "Lunges", lastWeight: "25kg", defaultSets: 3, instructions: "Step forward, lower back knee, return to start." }
    ]
  }
];

type WorkoutState = 'selection' | 'exerciseList' | 'activeWorkout';
type Exercise = {
  id: number;
  name: string;
  lastWeight: string;
  defaultSets: number;
  instructions: string;
  currentSets?: number;
  completedSets?: Set<number>;
  currentWeight?: string;
  currentReps?: string;
};

export default function Workouts() {
  const [workoutState, setWorkoutState] = useState<WorkoutState>('selection');
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [currentWeight, setCurrentWeight] = useState("");
  const [currentReps, setCurrentReps] = useState("");
  const [isResting, setIsResting] = useState(false);
  const [restTimer, setRestTimer] = useState(60);
  const [completedSets, setCompletedSets] = useState<Set<string>>(new Set());
  const [workoutStats, setWorkoutStats] = useState({ totalSets: 0, totalWeight: 0, duration: 0 });
  const [showInstructions, setShowInstructions] = useState(false);
  const [instructionExercise, setInstructionExercise] = useState<Exercise | null>(null);
  const [showPRCelebration, setShowPRCelebration] = useState(false);
  const [workoutStartTime, setWorkoutStartTime] = useState<Date | null>(null);

  // Rest timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isResting && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer(prev => prev - 1);
      }, 1000);
    } else if (restTimer === 0) {
      setIsResting(false);
      setRestTimer(60);
    }
    return () => clearInterval(interval);
  }, [isResting, restTimer]);

  // Workout duration timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (workoutState === 'activeWorkout' && workoutStartTime) {
      interval = setInterval(() => {
        const duration = Math.floor((Date.now() - workoutStartTime.getTime()) / 1000 / 60);
        setWorkoutStats(prev => ({ ...prev, duration }));
      }, 60000);
    }
    return () => clearInterval(interval);
  }, [workoutState, workoutStartTime]);

  const handleStartTodaysWorkout = () => {
    const group = muscleGroups.find(g => g.id === todaysRecommendedWorkout.muscleGroup.toLowerCase());
    if (group) {
      setSelectedGroup(group.id);
      setExercises(group.exercises.map(ex => ({ ...ex, currentSets: ex.defaultSets, completedSets: new Set() })));
      setWorkoutState('exerciseList');
    }
  };

  const handleSelectMuscleGroup = (groupId: string) => {
    const group = muscleGroups.find(g => g.id === groupId);
    if (group) {
      setSelectedGroup(groupId);
      setExercises(group.exercises.map(ex => ({ ...ex, currentSets: ex.defaultSets, completedSets: new Set() })));
      setWorkoutState('exerciseList');
    }
  };

  const handleStartExercise = (exercise: Exercise, index: number) => {
    setSelectedExercise(exercise);
    setCurrentExerciseIndex(index);
    setCurrentSet(1);
    setCurrentWeight(exercise.lastWeight.replace('kg', '').replace('Bodyweight', '0'));
    setCurrentReps("");
    setWorkoutState('activeWorkout');
    if (!workoutStartTime) {
      setWorkoutStartTime(new Date());
    }
  };

  const handleSetComplete = () => {
    if (!selectedExercise || !currentWeight || !currentReps) return;

    const setKey = `${selectedExercise.id}-${currentSet}`;
    setCompletedSets(prev => new Set([...prev, setKey]));
    
    // Update workout stats
    const weight = parseFloat(currentWeight) || 0;
    const reps = parseInt(currentReps) || 0;
    setWorkoutStats(prev => ({
      ...prev,
      totalSets: prev.totalSets + 1,
      totalWeight: prev.totalWeight + (weight * reps)
    }));

    // Check for PR (simplified - just check if weight > last weight)
    const lastWeight = parseFloat(selectedExercise.lastWeight.replace('kg', '')) || 0;
    if (weight > lastWeight) {
      setShowPRCelebration(true);
      setTimeout(() => setShowPRCelebration(false), 3000);
    }

    // Start rest timer
    setIsResting(true);
    setRestTimer(60);

    // Move to next set or exercise
    if (currentSet < (selectedExercise.currentSets || selectedExercise.defaultSets)) {
      setCurrentSet(prev => prev + 1);
    } else {
      // Move to next exercise
      if (currentExerciseIndex < exercises.length - 1) {
        const nextExercise = exercises[currentExerciseIndex + 1];
        setSelectedExercise(nextExercise);
        setCurrentExerciseIndex(prev => prev + 1);
        setCurrentSet(1);
        setCurrentWeight(nextExercise.lastWeight.replace('kg', '').replace('Bodyweight', '0'));
        setCurrentReps("");
      }
    }
  };

  const handleAdjustSets = (exercise: Exercise, delta: number) => {
    setExercises(prev => prev.map(ex => 
      ex.id === exercise.id 
        ? { ...ex, currentSets: Math.max(1, (ex.currentSets || ex.defaultSets) + delta) }
        : ex
    ));
  };

  const handleShowInstructions = (exercise: Exercise) => {
    setInstructionExercise(exercise);
    setShowInstructions(true);
  };

  const handleEndWorkout = () => {
    setWorkoutState('selection');
    setSelectedGroup(null);
    setSelectedExercise(null);
    setExercises([]);
    setCurrentExerciseIndex(0);
    setCurrentSet(1);
    setIsResting(false);
    setCompletedSets(new Set());
    setWorkoutStats({ totalSets: 0, totalWeight: 0, duration: 0 });
    setWorkoutStartTime(null);
  };

  const currentMuscleGroup = muscleGroups.find(g => g.id === selectedGroup);

  // Selection Screen
  if (workoutState === 'selection') {
    return (
      <div className="p-4 space-y-6 pb-24">
        {/* Header */}
        <div className="text-center space-y-2 pt-4">
          <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
            <Dumbbell className="h-7 w-7 text-primary" />
            <span className="text-gradient-primary">Workouts</span>
          </h1>
          <p className="text-muted-foreground">Choose your muscle group and start training</p>
        </div>

        {/* Today's Recommended Workout */}
        <Card className="workout-card border-primary/30 bg-gradient-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold text-primary">Today's Workout</p>
                  <p className="text-sm text-muted-foreground">
                    {todaysRecommendedWorkout.muscleGroup} • {todaysRecommendedWorkout.estimatedDuration}
                  </p>
                </div>
              </div>
            </div>
            <Button onClick={handleStartTodaysWorkout} className="w-full btn-primary">
              <Play className="h-4 w-4 mr-2" />
              Start Today's Workout
            </Button>
          </CardContent>
        </Card>

        {/* Muscle Groups */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Choose Muscle Group
          </h2>
          
          <div className="grid gap-4">
            {muscleGroups.map((group) => (
              <Card 
                key={group.id}
                className="muscle-group-card cursor-pointer hover:shadow-glow transition-all duration-300"
                onClick={() => handleSelectMuscleGroup(group.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{group.icon}</span>
                      <div>
                        <h3 className="font-bold text-lg">{group.name}</h3>
                        <p className="text-muted-foreground text-sm">{group.exercises.length} exercises</p>
                      </div>
                    </div>
                    <Badge variant="secondary">{group.lastWorkout}</Badge>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {group.exercises.slice(0, 3).map((exercise) => (
                      <Badge key={exercise.id} variant="outline" className="text-xs">
                        {exercise.name}
                      </Badge>
                    ))}
                    {group.exercises.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{group.exercises.length - 3} more
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Exercise List Screen
  if (workoutState === 'exerciseList') {
    return (
      <div className="p-4 space-y-6 pb-24">
        {/* Header */}
        <div className="flex items-center gap-3 pt-4">
          <Button variant="ghost" size="sm" onClick={() => setWorkoutState('selection')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">{currentMuscleGroup?.name} WORKOUT</h1>
            <p className="text-sm text-muted-foreground">{exercises.length} exercises</p>
          </div>
        </div>

        {/* Exercise List */}
        <div className="space-y-4">
          {exercises.map((exercise, index) => (
            <Card key={exercise.id} className="exercise-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold">{exercise.name}</h3>
                    <p className="text-sm text-muted-foreground">Last: {exercise.lastWeight}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleShowInstructions(exercise)}
                  >
                    <Info className="h-4 w-4" />
                  </Button>
                </div>

                {/* Sets Controls */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-sm font-medium">Sets:</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAdjustSets(exercise, -1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="min-w-[2rem] text-center">{exercise.currentSets || exercise.defaultSets}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAdjustSets(exercise, 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <Button 
                  onClick={() => handleStartExercise(exercise, index)}
                  className="w-full btn-primary"
                >
                  Start Exercise
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add Custom Exercise */}
        <Button variant="outline" className="w-full h-12">
          <Plus className="h-4 w-4 mr-2" />
          Add Custom Exercise
        </Button>
      </div>
    );
  }

  // Active Workout Screen
  if (workoutState === 'activeWorkout' && selectedExercise) {
    const setKey = `${selectedExercise.id}-${currentSet}`;
    const isSetCompleted = completedSets.has(setKey);
    
    return (
      <div className="p-4 space-y-6 pb-24">
        {/* Header */}
        <div className="flex items-center justify-between pt-4">
          <Button variant="ghost" size="sm" onClick={() => setWorkoutState('exerciseList')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="text-center">
            <h1 className="text-lg font-bold">{selectedExercise.name}</h1>
            <p className="text-sm text-muted-foreground">
              Set {currentSet} of {selectedExercise.currentSets || selectedExercise.defaultSets}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleEndWorkout}>
            End
          </Button>
        </div>

        {/* Previous Weight Reference */}
        <Card className="bg-muted/50">
          <CardContent className="p-3">
            <p className="text-sm text-center">
              Last week: <span className="font-semibold">{selectedExercise.lastWeight}</span>
            </p>
          </CardContent>
        </Card>

        {/* Weight Suggestion */}
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-3">
            <p className="text-sm text-center text-primary">
              💡 Try {parseFloat(selectedExercise.lastWeight.replace('kg', '')) + 2.5}kg today?
            </p>
          </CardContent>
        </Card>

        {/* Set Input */}
        <Card className="workout-card">
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Weight (kg)</label>
                <Input
                  type="number"
                  value={currentWeight}
                  onChange={(e) => setCurrentWeight(e.target.value)}
                  className="text-lg text-center h-12"
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Reps</label>
                <Input
                  type="number"
                  value={currentReps}
                  onChange={(e) => setCurrentReps(e.target.value)}
                  className="text-lg text-center h-12"
                  placeholder="0"
                />
              </div>
            </div>
            
            <Button 
              onClick={handleSetComplete}
              disabled={!currentWeight || !currentReps || isSetCompleted}
              className="w-full h-12 btn-success"
            >
              {isSetCompleted ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Set Completed
                </>
              ) : (
                "Done"
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Rest Timer */}
        {isResting && (
          <Card className="workout-card border-warning/30 bg-gradient-energy/10">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-gradient-energy mb-4">
                {Math.floor(restTimer / 60)}:{(restTimer % 60).toString().padStart(2, '0')}
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setRestTimer(prev => prev + 30)}>
                  +30s
                </Button>
                <Button size="sm" variant="outline" onClick={() => setRestTimer(prev => Math.max(0, prev - 30))}>
                  -30s
                </Button>
                <Button size="sm" onClick={() => setIsResting(false)} className="btn-success">
                  Skip Rest
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Workout Stats */}
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground">Sets</p>
                <p className="font-bold">{workoutStats.totalSets}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Weight</p>
                <p className="font-bold">{workoutStats.totalWeight}kg</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="font-bold">{workoutStats.duration}min</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" onClick={() => setIsResting(false)}>
            <Pause className="h-4 w-4 mr-2" />
            Pause Workout
          </Button>
          <Button variant="outline" onClick={() => handleShowInstructions(selectedExercise)}>
            <Info className="h-4 w-4 mr-2" />
            Instructions
          </Button>
        </div>
      </div>
    );
  }

  // Exercise Instructions Dialog
  return (
    <>
      <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{instructionExercise?.name}</DialogTitle>
            <DialogDescription>{instructionExercise?.instructions}</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* PR Celebration */}
      {showPRCelebration && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="mx-4 text-center border-success bg-gradient-success/20">
            <CardContent className="p-6">
              <Award className="h-12 w-12 text-success mx-auto mb-2" />
              <h2 className="text-xl font-bold text-success mb-2">New Personal Record! 🎉</h2>
              <p className="text-sm">You've beaten your previous best!</p>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}