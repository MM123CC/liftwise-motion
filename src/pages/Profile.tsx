import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  Settings, 
  Target, 
  Award,
  Calendar,
  Download,
  Share2,
  Bell,
  Moon,
  Smartphone,
  Trophy,
  Activity
} from "lucide-react";

const userProfile = {
  name: "Alex Johnson",
  level: "Intermediate",
  joinDate: "January 2024",
  stats: {
    totalWorkouts: 42,
    streak: 7,
    personalRecords: 8,
    monthsActive: 6
  },
  goals: {
    primary: "Build Muscle",
    targetWeight: 82,
    weeklyWorkouts: 5,
    experience: "6 months"
  },
  achievements: [
    { name: "First Workout", icon: "🎯", earned: true },
    { name: "Week Warrior", icon: "🔥", earned: true },
    { name: "PR Crusher", icon: "💪", earned: true },
    { name: "Consistency King", icon: "👑", earned: false }
  ]
};

export default function Profile() {
  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2 pt-4">
        <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
          <User className="h-7 w-7 text-primary" />
          <span className="text-gradient-primary">Profile</span>
        </h1>
        <p className="text-muted-foreground">
          Your fitness journey dashboard
        </p>
      </div>

      {/* User Info Card */}
      <Card className="workout-card text-center">
        <CardContent className="p-6">
          <Avatar className="w-20 h-20 mx-auto mb-4 ring-4 ring-primary/20">
            <AvatarImage src="/placeholder-avatar.jpg" />
            <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xl font-bold">
              AJ
            </AvatarFallback>
          </Avatar>
          
          <h2 className="text-xl font-bold text-gradient-primary mb-2">
            {userProfile.name}
          </h2>
          
          <div className="flex items-center justify-center gap-4 mb-4">
            <Badge className="bg-gradient-primary text-primary-foreground">
              {userProfile.level}
            </Badge>
            <Badge variant="outline" className="border-accent/30 text-accent">
              {userProfile.goals.primary}
            </Badge>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Member since {userProfile.joinDate}
          </p>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="stat-card">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Activity className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold text-primary">
                {userProfile.stats.totalWorkouts}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Total Workouts</p>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Trophy className="h-5 w-5 text-accent" />
              <span className="text-2xl font-bold text-accent">
                {userProfile.stats.personalRecords}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Personal Records</p>
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      <Card className="workout-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-accent" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {userProfile.achievements.map((achievement, index) => (
              <div 
                key={index}
                className={`p-3 rounded-lg border text-center transition-all duration-300 ${
                  achievement.earned 
                    ? "border-accent/30 bg-accent/5 animate-pulse-glow" 
                    : "border-muted-foreground/20 bg-muted/10 opacity-50"
                }`}
              >
                <div className="text-2xl mb-1">{achievement.icon}</div>
                <p className="text-xs font-semibold">{achievement.name}</p>
                {achievement.earned && (
                  <Badge className="mt-1 bg-gradient-energy text-accent-foreground text-xs">
                    Earned!
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Goals */}
      <Card className="workout-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Current Goals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Primary Goal</span>
              <Badge className="bg-gradient-primary text-primary-foreground">
                {userProfile.goals.primary}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Target Weight</span>
              <span className="font-semibold text-success">{userProfile.goals.targetWeight} kg</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Weekly Workouts</span>
              <span className="font-semibold text-primary">{userProfile.goals.weeklyWorkouts} days</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Experience Level</span>
              <span className="font-semibold text-accent">{userProfile.goals.experience}</span>
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
          <Settings className="h-5 w-5" />
          <span className="text-sm">Settings</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="h-16 flex-col gap-2 border-border hover:border-accent/50"
        >
          <Target className="h-5 w-5" />
          <span className="text-sm">Edit Goals</span>
        </Button>
      </div>

      {/* App Actions */}
      <Card className="workout-card">
        <CardHeader>
          <CardTitle className="text-lg">App Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Button 
              variant="ghost" 
              className="w-full justify-start h-12"
            >
              <Bell className="h-5 w-5 mr-3" />
              Notifications
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full justify-start h-12"
            >
              <Download className="h-5 w-5 mr-3" />
              Export Data
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full justify-start h-12"
            >
              <Share2 className="h-5 w-5 mr-3" />
              Share App
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full justify-start h-12"
            >
              <Smartphone className="h-5 w-5 mr-3" />
              Add to Home Screen
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Motivation */}
      <Card className="stat-card text-center">
        <CardContent className="p-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Trophy className="h-5 w-5 text-accent animate-pulse" />
            <span className="font-semibold text-gradient-energy">Keep Going!</span>
          </div>
          <p className="text-sm text-muted-foreground">
            You're just {4 - userProfile.stats.personalRecords % 4} PRs away from the next achievement! 🏆
          </p>
        </CardContent>
      </Card>
    </div>
  );
}