import { Flame, Beef, Wheat, Droplet } from "lucide-react";

interface NutritionAveragesProps {
  avgCalories: number;
  avgProtein: number;
  avgCarbs: number;
  avgFat: number;
}

export default function NutritionAverages({ avgCalories, avgProtein, avgCarbs, avgFat }: NutritionAveragesProps) {
  const tiles = [
    { label: "Avg calories", value: avgCalories.toLocaleString("en-US"), icon: Flame, bg: "bg-yellow-bg", accent: "text-yellow-accent" },
    { label: "Avg protein", value: `${avgProtein}g`, icon: Beef, bg: "bg-pink-bg", accent: "text-pink-accent" },
    { label: "Avg carbs", value: `${avgCarbs}g`, icon: Wheat, bg: "bg-green-bg", accent: "text-green-accent" },
    { label: "Avg fat", value: `${avgFat}g`, icon: Droplet, bg: "bg-blue-bg", accent: "text-blue-accent" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {tiles.map((tile) => (
        <div key={tile.label} className={`rounded-2xl p-4 ${tile.bg} flex flex-col gap-2`}>
          <div className="h-8 w-8 rounded-full bg-white/60 flex items-center justify-center">
            <tile.icon size={15} className={tile.accent} />
          </div>
          <div>
            <p className="text-xs text-muted-2">{tile.label}</p>
            <p className="text-lg font-bold">{tile.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
