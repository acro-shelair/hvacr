import {
  Activity, Award, BarChart2, BarChart3, Battery, Box, Building,
  Building2, CheckCircle, Cloud, CloudRain, CloudSnow, Computer,
  Cpu, Droplets, Factory, Filter, Flame, FlaskConical, Gauge,
  Globe, Hammer, HardHat, Hospital, Hotel, Layers, Leaf,
  Lightbulb, MonitorCog, Package, Plug, Power, Radio, RefreshCw,
  School, Server, Settings, Settings2, Shield, ShieldCheck,
  ShoppingCart, Snowflake, Star, Store, Sun, Tag, Thermometer,
  Timer, TrendingUp, Truck, Users, Utensils, Warehouse, Webhook,
  Wind, Wine, Wrench, Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  Activity, Award, BarChart2, BarChart3, Battery, Box, Building,
  Building2, CheckCircle, Cloud, CloudRain, CloudSnow, Computer,
  Cpu, Droplets, Factory, Filter, Flame, FlaskConical, Gauge,
  Globe, Hammer, HardHat, Hospital, Hotel, Layers, Leaf,
  Lightbulb, MonitorCog, Package, Plug, Power, Radio, RefreshCw,
  School, Server, Settings, Settings2, Shield, ShieldCheck,
  ShoppingCart, Snowflake, Star, Store, Sun, Tag, Thermometer,
  Timer, TrendingUp, Truck, Users, Utensils, Warehouse, Webhook,
  Wind, Wine, Wrench, Zap,
};

export function getIcon(name: string | null | undefined): LucideIcon {
  return (name && ICON_MAP[name]) ? ICON_MAP[name] : Package;
}
