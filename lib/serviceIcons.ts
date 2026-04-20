import {
  Wind, Snowflake, Building2, Wrench, Thermometer, Zap,
  Clock, ShieldCheck, BarChart3, Phone, Search, CheckCircle,
  Monitor, FileText, Bell, Wifi, Settings, Shield, Star,
  Truck, Package, Layers, AlertTriangle, Activity,
  HeartPulse, UtensilsCrossed, GraduationCap, Factory, Tent, Store,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const SERVICE_ICON_MAP: Record<string, LucideIcon> = {
  Wind, Snowflake, Building2, Wrench, Thermometer, Zap,
  Clock, ShieldCheck, BarChart3, Phone, Search, CheckCircle,
  Monitor, FileText, Bell, Wifi, Settings, Shield, Star,
  Truck, Package, Layers, AlertTriangle, Activity,
  HeartPulse, UtensilsCrossed, GraduationCap, Factory, Tent, Store,
};

export function getServiceIcon(name: string): LucideIcon {
  return SERVICE_ICON_MAP[name] ?? Wrench;
}

export const SERVICE_ICON_OPTIONS = Object.keys(SERVICE_ICON_MAP).map((name) => ({
  name,
  icon: SERVICE_ICON_MAP[name],
}));
