import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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
  Star,
  GripVertical,
  Save,
  X
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

type WorkoutState = 'selection' | 'exerciseList' | 'exerciseDetails' | 'activeWorkout';
type ExerciseSet = {
  setNumber: number;
  weight: string;
  reps: string;
  completed: boolean;
};
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
  sets?: ExerciseSet[];
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
  const [showCustomExerciseDialog, setShowCustomExerciseDialog] = useState(false);
  const [newExercise, setNewExercise] = useState({
    name: '',
    instructions: '',
    defaultSets: 3,
    lastWeight: '0kg'
  });

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  const handleEditExercise = (exercise: Exercise, index: number) => {
    const exerciseWithSets = {
      ...exercise,
      sets: Array.from({ length: exercise.currentSets || exercise.defaultSets }, (_, i) => ({
        setNumber: i + 1,
        weight: exercise.lastWeight.replace('kg', '').replace('Bodyweight', '0'),
        reps: '10',
        completed: false
      }))
    };
    setSelectedExercise(exerciseWithSets);
    setCurrentExerciseIndex(index);
    setWorkoutState('exerciseDetails');
  };

  const handleSaveExerciseDetails = () => {
    if (!selectedExercise) return;
    
    // Update the exercise in the exercises array
    setExercises(prev => prev.map(ex => 
      ex.id === selectedExercise.id ? selectedExercise : ex
    ));
    
    setWorkoutState('exerciseList');
  };

  const handleUpdateExerciseName = (name: string) => {
    if (!selectedExercise) return;
    setSelectedExercise(prev => prev ? { ...prev, name } : null);
  };

  const handleUpdateExerciseInstructions = (instructions: string) => {
    if (!selectedExercise) return;
    setSelectedExercise(prev => prev ? { ...prev, instructions } : null);
  };

  const handleUpdateSet = (setIndex: number, field: 'weight' | 'reps', value: string) => {
    if (!selectedExercise) return;
    const updatedSets = [...(selectedExercise.sets || [])];
    updatedSets[setIndex] = { ...updatedSets[setIndex], [field]: value };
    setSelectedExercise(prev => prev ? { ...prev, sets: updatedSets } : null);
  };

  const handleAddSet = () => {
    if (!selectedExercise) return;
    const newSet: ExerciseSet = {
      setNumber: (selectedExercise.sets?.length || 0) + 1,
      weight: selectedExercise.lastWeight.replace('kg', '').replace('Bodyweight', '0'),
      reps: '10',
      completed: false
    };
    setSelectedExercise(prev => prev ? { 
      ...prev, 
      sets: [...(prev.sets || []), newSet],
      currentSets: (prev.sets?.length || 0) + 1
    } : null);
  };

  const handleRemoveSet = (setIndex: number) => {
    if (!selectedExercise || !selectedExercise.sets) return;
    const updatedSets = selectedExercise.sets.filter((_, index) => index !== setIndex);
    setSelectedExercise(prev => prev ? { 
      ...prev, 
      sets: updatedSets,
      currentSets: updatedSets.length
    } : null);
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

  // Custom exercise functions
  const handleCreateCustomExercise = () => {
    if (!newExercise.name.trim()) return;
    
    const customExercise: Exercise = {
      id: Date.now(), // Simple ID generation
      name: newExercise.name,
      instructions: newExercise.instructions,
      defaultSets: newExercise.defaultSets,
      lastWeight: newExercise.lastWeight,
      currentSets: newExercise.defaultSets,
      completedSets: new Set()
    };
    
    setExercises(prev => [...prev, customExercise]);
    setNewExercise({ name: '', instructions: '', defaultSets: 3, lastWeight: '0kg' });
    setShowCustomExerciseDialog(false);
  };

  // Drag and drop function
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setExercises((exercises) => {
        const oldIndex = exercises.findIndex((exercise) => exercise.id === active.id);
        const newIndex = exercises.findIndex((exercise) => exercise.id === over.id);

        return arrayMove(exercises, oldIndex, newIndex);
      });
    }
  };

  const currentMuscleGroup = muscleGroups.find(g => g.id === selectedGroup);

  // Sortable Exercise Card Component
  const SortableExerciseCard = ({ exercise, index, onEdit, onStart, onShowInstructions, onAdjustSets }: {
    exercise: Exercise;
    index: number;
    onEdit: (exercise: Exercise, index: number) => void;
    onStart: (exercise: Exercise, index: number) => void;
    onShowInstructions: (exercise: Exercise) => void;
    onAdjustSets: (exercise: Exercise, delta: number) => void;
  }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
    } = useSortable({ id: exercise.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    return (
      <Card 
        ref={setNodeRef}
        style={style}
        className="exercise-card hover:shadow-glow transition-all duration-300"
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded"
            >
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{exercise.name}</h3>
              <p className="text-sm text-muted-foreground">Last: {exercise.lastWeight}</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onShowInstructions(exercise)}
              >
                <Info className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(exercise, index)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Sets Controls */}
          <div className="flex items-center gap-3 mb-3">
            <span className="text-sm font-medium">Sets:</span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAdjustSets(exercise, -1)}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="min-w-[2rem] text-center">{exercise.currentSets || exercise.defaultSets}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAdjustSets(exercise, 1)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline"
              onClick={() => onShowInstructions(exercise)}
              className="h-10"
            >
              View Instructions
            </Button>
            <Button 
              onClick={() => onStart(exercise, index)}
              className="h-10 btn-primary"
            >
              <Play className="h-4 w-4 mr-2" />
              Start
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

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

        {/* Exercise List with Drag and Drop */}
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={exercises.map(ex => ex.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {exercises.map((exercise, index) => (
                <SortableExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  index={index}
                  onEdit={handleEditExercise}
                  onStart={handleStartExercise}
                  onShowInstructions={handleShowInstructions}
                  onAdjustSets={handleAdjustSets}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {/* Add Custom Exercise */}
        <Button 
          variant="outline" 
          className="w-full h-12"
          onClick={() => setShowCustomExerciseDialog(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Custom Exercise
        </Button>
      </div>
    );
  }

  // Exercise Details Screen
  if (workoutState === 'exerciseDetails' && selectedExercise) {
    return (
      <div className="p-4 space-y-6 pb-24">
        {/* Header */}
        <div className="flex items-center gap-3 pt-4">
          <Button variant="ghost" size="sm" onClick={() => setWorkoutState('exerciseList')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Edit Exercise</h1>
            <p className="text-sm text-muted-foreground">Customize your workout details</p>
          </div>
          <Button onClick={handleSaveExerciseDetails} className="btn-primary">
            Save
          </Button>
        </div>

        {/* Exercise Name */}
        <Card className="exercise-card">
          <CardHeader>
            <CardTitle className="text-lg">Exercise Name</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              value={selectedExercise.name}
              onChange={(e) => handleUpdateExerciseName(e.target.value)}
              className="text-lg"
              placeholder="Exercise name"
            />
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="exercise-card">
          <CardHeader>
            <CardTitle className="text-lg">Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={selectedExercise.instructions}
              onChange={(e) => handleUpdateExerciseInstructions(e.target.value)}
              placeholder="Enter exercise instructions..."
              className="min-h-[100px]"
            />
          </CardContent>
        </Card>

        {/* Sets Configuration */}
        <Card className="exercise-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              Sets Configuration
              <Button onClick={handleAddSet} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                Add Set
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {selectedExercise.sets?.map((set, index) => (
              <Card key={index} className="bg-muted/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                      {set.setNumber}
                    </div>
                    <div className="flex-1 grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Weight (kg)</label>
                        <Input
                          type="number"
                          value={set.weight}
                          onChange={(e) => handleUpdateSet(index, 'weight', e.target.value)}
                          className="h-8 text-center"
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Reps</label>
                        <Input
                          type="number"
                          value={set.reps}
                          onChange={(e) => handleUpdateSet(index, 'reps', e.target.value)}
                          className="h-8 text-center"
                          placeholder="0"
                        />
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveSet(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {(!selectedExercise.sets || selectedExercise.sets.length === 0) && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No sets configured</p>
                <p className="text-sm">Click "Add Set" to create your first set</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button 
            variant="outline"
            onClick={() => {
              handleSaveExerciseDetails();
              handleStartExercise(selectedExercise, currentExerciseIndex);
            }}
            className="h-12"
          >
            <Play className="h-4 w-4 mr-2" />
            Save & Start
          </Button>
          <Button 
            onClick={handleSaveExerciseDetails}
            className="h-12 btn-primary"
          >
            <Check className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
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

      {/* Custom Exercise Dialog */}
      <Dialog open={showCustomExerciseDialog} onOpenChange={setShowCustomExerciseDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Custom Exercise</DialogTitle>
            <DialogDescription>
              Add your own exercise with personalized instructions
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="exercise-name">Exercise Name</Label>
              <Input
                id="exercise-name"
                value={newExercise.name}
                onChange={(e) => setNewExercise(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Romanian Deadlifts"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="exercise-instructions">Instructions</Label>
              <Textarea
                id="exercise-instructions"
                value={newExercise.instructions}
                onChange={(e) => setNewExercise(prev => ({ ...prev, instructions: e.target.value }))}
                placeholder="Describe proper form and technique..."
                className="min-h-[80px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="default-sets">Default Sets</Label>
                <Input
                  id="default-sets"
                  type="number"
                  value={newExercise.defaultSets}
                  onChange={(e) => setNewExercise(prev => ({ ...prev, defaultSets: parseInt(e.target.value) || 3 }))}
                  min="1"
                  max="10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="starting-weight">Starting Weight</Label>
                <Input
                  id="starting-weight"
                  value={newExercise.lastWeight}
                  onChange={(e) => setNewExercise(prev => ({ ...prev, lastWeight: e.target.value }))}
                  placeholder="e.g., 20kg"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowCustomExerciseDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreateCustomExercise}
                disabled={!newExercise.name.trim()}
                className="flex-1 btn-primary"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Exercise
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}