// Shared mutable store — ParticleCanvas writes, HeroCursor reads
export type ParticlePoint = { x: number; y: number };

export const particleStore: { points: ParticlePoint[] } = {
  points: [],
};
