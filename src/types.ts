import * as PIXI from 'pixi.js';

export interface MovementSprite extends PIXI.Sprite {
  vx?: number;
  vy?: number;
  accelerationX?: number;
  accelerationY?: number;
  frictionX?: number;
  frictionY?: number;
  speed?: number;
  drag?: number;
}

export interface LineWithAngle extends PIXI.Graphics {
  angleA?: number;
  angleB?: number;
}