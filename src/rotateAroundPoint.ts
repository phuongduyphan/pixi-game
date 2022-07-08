export function rotateAroundPoint (pointX: number, pointY: number, distanceX: number, distanceY: number, angle: number): { x: number, y: number } {
  return {
    x: pointX + Math.cos(angle) * distanceX,
    y: pointY + Math.sin(angle) * distanceY
  }
}
