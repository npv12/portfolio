export interface Gradient {
  top: number;
  left: number;
  size: number;
  conic: boolean;
  small: boolean;
}

export interface props {
  maxGradients: number;
  heightMultiplier: number;
}
