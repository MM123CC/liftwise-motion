import { NavLink, useLocation } from "react-router-dom";
import { Home, Dumbbell, TrendingUp, User, Camera } from "lucide-react";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Dumbbell, label: "Workouts", path: "/workouts" },
  { icon: TrendingUp, label: "Progress", path: "/progress" },
  { icon: Camera, label: "Body", path: "/body" },
  { icon: User, label: "Profile", path: "/profile" },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <div className="bottom-nav">
      <div className="flex items-center justify-around py-2 px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`touch-target flex flex-col items-center gap-1 px-2 py-1 rounded-lg transition-all duration-300 ${
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon 
                size={20} 
                className={`transition-all duration-300 ${
                  isActive ? "animate-bounce-in scale-110" : ""
                }`}
              />
              <span className={`text-xs font-medium transition-all duration-300 ${
                isActive ? "text-primary font-semibold" : ""
              }`}>
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}