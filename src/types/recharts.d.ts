// src/types/recharts.d.ts
import "recharts";

declare module "recharts" {
  interface RadialBarProps {
    minAngle?: number;
    background?: boolean;
    clockWise?: boolean;
  }
}
