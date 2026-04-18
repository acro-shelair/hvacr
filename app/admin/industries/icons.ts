import {
  Building2, Factory, Hospital, ShoppingCart, Wrench, Thermometer,
  Truck, Package, Layers, Zap, Settings, Shield, FlaskConical,
  Warehouse, Hotel, School, Utensils, Wine, Leaf, Hammer,
  Computer, BarChart3, Activity, Snowflake,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const ICON_OPTIONS: { name: string; icon: LucideIcon }[] = [
  { name: "Building2",     icon: Building2 },
  { name: "Factory",       icon: Factory },
  { name: "Hospital",      icon: Hospital },
  { name: "ShoppingCart",  icon: ShoppingCart },
  { name: "Wrench",        icon: Wrench },
  { name: "Thermometer",   icon: Thermometer },
  { name: "Truck",         icon: Truck },
  { name: "Package",       icon: Package },
  { name: "Layers",        icon: Layers },
  { name: "Zap",           icon: Zap },
  { name: "Settings",      icon: Settings },
  { name: "Shield",        icon: Shield },
  { name: "FlaskConical",  icon: FlaskConical },
  { name: "Warehouse",     icon: Warehouse },
  { name: "Hotel",         icon: Hotel },
  { name: "School",        icon: School },
  { name: "Utensils",      icon: Utensils },
  { name: "Wine",          icon: Wine },
  { name: "Leaf",          icon: Leaf },
  { name: "Hammer",        icon: Hammer },
  { name: "Computer",      icon: Computer },
  { name: "BarChart3",     icon: BarChart3 },
  { name: "Activity",      icon: Activity },
  { name: "Snowflake",     icon: Snowflake },
];

export function getIcon(name: string): LucideIcon {
  return ICON_OPTIONS.find((o) => o.name === name)?.icon ?? Building2;
}
