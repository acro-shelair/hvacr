import {
  Clock, Wrench, ShieldCheck, Thermometer, BarChart3, Snowflake,
  Phone, Search, CheckCircle, Monitor, FileText, Bell, Wifi, Zap,
  Settings, Shield, Star, Building2, Truck, Package, Layers,
  AlertTriangle, Activity,
  HeartPulse, UtensilsCrossed, GraduationCap, Factory, Tent, Store,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const ICON_OPTIONS: { name: string; icon: LucideIcon }[] = [
  { name: "HeartPulse",       icon: HeartPulse },
  { name: "UtensilsCrossed",  icon: UtensilsCrossed },
  { name: "GraduationCap",    icon: GraduationCap },
  { name: "Building2",        icon: Building2 },
  { name: "Factory",          icon: Factory },
  { name: "Tent",             icon: Tent },
  { name: "Store",            icon: Store },
  { name: "Clock",            icon: Clock },
  { name: "Wrench",           icon: Wrench },
  { name: "ShieldCheck",      icon: ShieldCheck },
  { name: "Thermometer",      icon: Thermometer },
  { name: "BarChart3",        icon: BarChart3 },
  { name: "Snowflake",        icon: Snowflake },
  { name: "Phone",            icon: Phone },
  { name: "Search",           icon: Search },
  { name: "CheckCircle",      icon: CheckCircle },
  { name: "Monitor",          icon: Monitor },
  { name: "FileText",         icon: FileText },
  { name: "Bell",             icon: Bell },
  { name: "Wifi",             icon: Wifi },
  { name: "Zap",              icon: Zap },
  { name: "Settings",         icon: Settings },
  { name: "Shield",           icon: Shield },
  { name: "Star",             icon: Star },
  { name: "Truck",            icon: Truck },
  { name: "Package",          icon: Package },
  { name: "Layers",           icon: Layers },
  { name: "AlertTriangle",    icon: AlertTriangle },
  { name: "Activity",         icon: Activity },
];

export function getIcon(name: string): LucideIcon {
  return ICON_OPTIONS.find((o) => o.name === name)?.icon ?? Wrench;
}
