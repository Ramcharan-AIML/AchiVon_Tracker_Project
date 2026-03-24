import { 
  Activity, 
  BookOpen, 
  Terminal, 
  Heart, 
  Droplets, 
  Code, 
  Globe, 
  Sparkles, 
  Star,
  Briefcase,
  Dumbbell
} from "lucide-react";

export function HabitIcon({ name, className }: { name: string; className?: string }) {
  const icons: Record<string, React.ElementType> = {
    Activity,
    BookOpen,
    Terminal,
    Heart,
    Droplets,
    Code,
    Globe,
    Sparkles,
    Briefcase,
    Dumbbell
  };

  const IconComponent = icons[name] || Star;
  return <IconComponent className={className || "w-5 h-5"} />;
}
