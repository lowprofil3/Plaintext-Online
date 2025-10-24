export function minutesBetween(earlier: Date, later: Date): number {
  return Math.max(0, (later.getTime() - earlier.getTime()) / 1000 / 60);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function toDate(input: string | Date): Date {
  return input instanceof Date ? input : new Date(input);
}
