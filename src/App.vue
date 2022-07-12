<template>
  <div id="pixi-container">
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import * as PIXI from 'pixi.js';
import { randomInt } from './utils';
import { LineWithAngle, MovingSprite } from './types';
import { keyboard } from './keyboard';
import { contain } from './contain';
import { rotateAroundPoint } from './rotateAroundPoint';
import { Bump } from './bump';
import { SpriteUtilities } from './spriteUtilities';
import { Dust } from './dust';
import { Charm } from './charm';

export default defineComponent({
  name: 'App',
  data (): { renderer: PIXI.AbstractRenderer, loader: PIXI.Loader, stage: PIXI.Container } {
    return {
      renderer: PIXI.autoDetectRenderer({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: 0x000000,
        antialias: true,
        transparent: false,
        resolution: 1
      }),
      loader: new PIXI.Loader(),
      stage: new PIXI.Container()
    }
  },
  methods: {
    loadPixi () {
      const pixiContainer = document.getElementById('pixi-container')!;
      pixiContainer.appendChild(this.renderer.view);

      // renderer.view.style.border = "1px dashed black";
      // renderer.resize(512, 512);

      // renderer.view.style.position = "absolute";
      // renderer.view.style.width = window.innerWidth + "px";
      // renderer.view.style.height = window.innerHeight + "px";
      // renderer.view.style.display = "block";

      // Loading images
      (this.loader as PIXI.Loader)
        .add('bunny', './bunny.png')
        .add('man', './man.png')
        .add('pixie', './pixie96x48.png')
        .add('cat', './cat64x64.png')
        .add('hedgehog', './hedgehog.png')
        .add('tiger', './tiger.png')
        .add('tileset', './tileset.png')
        .add('treasureHunter', './treasureHunter.json')
        .add('./fonts/disko.xml')
        .add('./pixieFrames.png')
        .add('./adventuress.png')
        .add('./star.png')
        .add('./tile.png')
        .add('./clouds.png')
        .add('./snake.png')

      this.loader.onProgress.add((loader, resource) => {
        console.log(`loading: ${resource.url}`);
        console.log(`progress: ${loader.progress}%`);
      });
    },
    render () {
      const sprites: { [key: string]: PIXI.Sprite } = {};
      this.loader.load((loader, resources) => {
        // this.renderGirl(resources.pixie.texture!);
        // this.renderCat(resources.cat.texture!);
        // this.extractSpriteFromSpritesheet(resources.tileset.texture!);
        // this.extractSpriteFromSpritesheetJson(resources.treasureHunter);
        // this.drawShape();
        // this.drawText();
        this.groupingSprites(resources);

        this.renderer.render(this.stage);
      });
    },
    renderGirl (girlTexture: PIXI.Texture): PIXI.Sprite {
      const girl = new PIXI.Sprite(girlTexture);
      this.stage.addChild(girl);
      return girl;
      // stage.removeChild(sprites.pixie);
      // sprites.pixie.visible = false;
      // The only time you’ll ever have to use destroy is in extreme cases in which
      // your game is creating and destroying a lot of sprites, and you notice unusually high GPU
      // memory usage.
      // sprites.pixie.destroy(true); // destroy texture and base texture
    },
    renderCat (catTexture: PIXI.Texture) {
      const cat = new PIXI.Sprite(catTexture);
      cat.position.set(96, 128);
      // cat.width = 100;
      // cat.height = 100;
      // cat.scale.x = 1.5;
      // cat.scale.y = 1.5;
      cat.scale.set(0.8, 0.8);

      cat.rotation = 0.5;
      cat.anchor.set(0.5, 0.5);
      this.stage.addChild(cat);
    },
    extractSpriteFromSpritesheet (tileset: PIXI.Texture) {
      tileset.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
      const rectangle = new PIXI.Rectangle(160, 256, 32, 32);
      tileset.frame = rectangle;
      const adventuress = new PIXI.Sprite(tileset);
      adventuress.x = 126;
      adventuress.y = 126;
      adventuress.scale.set(3, 3);

      this.stage.addChild(adventuress);
    },
    extractSpriteFromSpritesheetJson (textureAtlas: PIXI.LoaderResource) {
      // extract by accessing TextureCache directly
      const dungeonTexture = PIXI.utils.TextureCache['dungeon.png'];
      const dungeon = new PIXI.Sprite(dungeonTexture);
      this.stage.addChild(dungeon);

      // extract by using loader's resources
      const explorer = new PIXI.Sprite(textureAtlas.textures!['explorer.png']);
      explorer.x = 68;
      explorer.y = this.stage.height / 2 - explorer.height / 2;
      this.stage.addChild(explorer);

      const treasure = new PIXI.Sprite(textureAtlas.textures!['treasure.png']);
      treasure.x = this.stage.width - treasure.width - 48;
      treasure.y = this.stage.height / 2 - treasure.height / 2;
      this.stage.addChild(treasure);

      const door = new PIXI.Sprite(textureAtlas.textures!['door.png']);
      door.position.set(32, 0);
      this.stage.addChild(door);

      const numberOfBlobs = 6, spacing = 48, xOffset = 150;

      for (let i = 0; i < numberOfBlobs; i += 1) {
        const blob = new PIXI.Sprite(textureAtlas.textures!['blob.png']);
        const x = spacing * i + xOffset;
        const y = randomInt(0, this.stage.height - blob.height);

        blob.x = x;
        blob.y = y;
        this.stage.addChild(blob);
      }

    },
    drawShape () {
      const rectangle = new PIXI.Graphics();
      rectangle.beginFill(0x0033cc);
      rectangle.lineStyle(4, 0xff0000, 1);
      rectangle.drawRect(0, 0, 96, 96);
      // rectangle.drawRoundedRect(0, 0, 96, 96, 12);
      rectangle.endFill();
      rectangle.x = 64;
      rectangle.y = 64;
      rectangle.alpha = 0.5;
      this.stage.addChild(rectangle);

      const circle = new PIXI.Graphics();
      circle.beginFill(0xff9933);
      circle.lineStyle(4, 0x006600, 1);
      circle.drawCircle(0, 0, 48);
      circle.endFill();
      circle.x = 256;
      circle.y = 112;
      this.stage.addChild(circle);

      const ellipse = new PIXI.Graphics();
      ellipse.beginFill(0xffff00);
      ellipse.lineStyle(4, 0x000000, 1);
      ellipse.drawEllipse(0, 0, 64, 32);
      ellipse.endFill();
      ellipse.x = 416;
      ellipse.y = 112;
      this.stage.addChild(ellipse);

      const line = new PIXI.Graphics();
      line.lineStyle(4, 0x000000, 1);
      line.moveTo(0, 0);
      line.lineTo(100, 50);
      line.x = 64;
      line.y = 512;
      this.stage.addChild(line);

      const triangle = new PIXI.Graphics();
      triangle.beginFill(0xff3300);
      triangle.lineStyle(4, 0x336699, 1);
      triangle.moveTo(0, 0);
      triangle.lineTo(-64, 64);
      triangle.lineTo(64, 64);
      triangle.lineTo(0, 0);
      triangle.endFill();

      triangle.x = 320;
      triangle.y = 192;
      this.stage.addChild(triangle);

      const quadLine = new PIXI.Graphics();
      quadLine.lineStyle(4, 0x000000, 1);
      quadLine.moveTo(32, 128);
      quadLine.quadraticCurveTo(128, 20, 224, 128);
      quadLine.y = 128;
      this.stage.addChild(quadLine);

      const bezierLine = new PIXI.Graphics();
      bezierLine.lineStyle(4, 0x000000, 1);
      bezierLine.moveTo(32, 128);
      bezierLine.bezierCurveTo(32, 20, 224, 20, 224, 128);
      this.stage.addChild(bezierLine);
      bezierLine.x = 256;
      bezierLine.y = 256;

      const partialCircle = new PIXI.Graphics();
      partialCircle.lineStyle(4, 0x000000, 1);
      partialCircle.arc(64, 64, 64, 3.14, 5, false);
      partialCircle.x = 64;
      partialCircle.y = 416;
      this.stage.addChild(partialCircle);
    },
    drawText () {
      // const message = new PIXI.Text("Hello Pixi!", { fontFamily: "Arial", fontSize: 48, fill: "red" });
      // message.x = this.renderer.view.width / 2 - message.width / 2;
      // message.y = this.renderer.view.height / 2 - message.height / 2;
      // this.stage.addChild(message);

      const bitmapMsg = new PIXI.BitmapText("Hello Pixi!", { fontName: 'disko', fontSize: 48 });
      bitmapMsg.x = this.renderer.view.width / 2 - bitmapMsg.width / 2;
      bitmapMsg.y = this.renderer.view.height / 2 - bitmapMsg.height / 2;
      this.stage.addChild(bitmapMsg);
    },
    renderGame () {
      this.loader.load((loader, resources) => {
        const pixie: MovingSprite = this.renderGirl(resources.pixie.texture!);
        pixie.x = this.renderer.view.width / 2 - pixie.width / 2;
        pixie.y = this.renderer.view.height / 2 - pixie.height / 2;

        pixie.vx = 0;
        pixie.vy = 0;
        pixie.accelerationX = 0;
        pixie.accelerationY = 0;
        pixie.frictionX = 1;
        pixie.frictionY = 1;
        pixie.speed = 0.2;
        pixie.drag = 0.98;

        const left = keyboard(37),
          up = keyboard(38),
          right = keyboard(39),
          down = keyboard(40);

        left.press = () => {
          pixie.accelerationX = -pixie.speed!;
          pixie.frictionX = 1;
        }

        left.release = () => {
          if (!right.isDown) {
            pixie.accelerationX = 0;
            pixie.frictionX = pixie.drag;
          }
        }

        up.press = () => {
          pixie.accelerationY = -pixie.speed!;
          pixie.frictionY = 1;
        }

        up.release = () => {
          if (!down.isDown) {
            pixie.accelerationY = 0;
            pixie.frictionY = pixie.drag;
          }
        };
        //Right
        right.press = () => {
          pixie.accelerationX = pixie.speed;
          pixie.frictionX = 1;
        };
        right.release = () => {
          if (!left.isDown) {
            pixie.accelerationX = 0;
            pixie.frictionX = pixie.drag;
          }
        };
        //Down
        down.press = () => {
          pixie.accelerationY = pixie.speed;
          pixie.frictionY = 1;
        };
        down.release = () => {
          if (!up.isDown) {
            pixie.accelerationY = 0;
            pixie.frictionY = pixie.drag;
          }
        };

        const play = () => {
          //Apply acceleration by adding the acceleration to the sprite's velocity
          pixie.vx! += pixie.accelerationX!;
          pixie.vy! += pixie.accelerationY!;
          //Apply friction by multiplying sprite's velocity by the friction
          pixie.vx! *= pixie.frictionX!;
          pixie.vy! *= pixie.frictionY!;

          //Apply the velocity to the sprite's position to make it move
          pixie.x += pixie.vx!;
          pixie.y += pixie.vy!;

          const collision = contain(pixie, { x: 0, y: 0, width: this.renderer.view.width, height: this.renderer.view.height });

          //Check for a collision. If the value of `collision` isn't
          //`undefined` then you know the sprite hit a boundary
          if (collision) {
            //Reverse the sprite's `vx` value if it hits the left or right
            if (collision.has("left") || collision.has("right")) {
              pixie.vx = -pixie.vx!;
            }
            //Reverse the sprite's `vy` value if it hits the top or bottom
            if (collision.has("top") || collision.has("bottom")) {
              pixie.vy = -pixie.vy!;
            }
          }
        }

        const state = play;

        const gameLoop = () => {
          requestAnimationFrame(gameLoop);
          state();
          this.renderer.render(this.stage);
        }

        gameLoop();
      });
    },
    renderRotatingLine () {
      this.loader.load((loader, resources) => {
        const line: LineWithAngle = new PIXI.Graphics();
        this.stage.addChild(line);
        line.angleA = 0;
        line.angleB = 0;

        const play = () => {
          //Make the line's start point rotate clockwise around x/y point 64, 64
          line.angleA! += 0.02;
          let rotatingA = rotateAroundPoint(64, 64, 20, 20, line.angleA!);
          //Make the line's end point rotate counter-clockwise
          //around x/y point 192, 208
          line.angleB! -= 0.03;
          let rotatingB = rotateAroundPoint(192, 208, 20, 20, line.angleB!);
          //Clear the line to reset it from the previous frame
          line.clear();
          //Draw the line using the rotating points as start and end points
          line.lineStyle(4, 0x000000, 1);
          line.moveTo(rotatingA.x, rotatingA.y);
          line.lineTo(rotatingB.x, rotatingB.y);

        }

        const state = play;

        const gameLoop = () => {
          requestAnimationFrame(gameLoop);
          state();
          this.renderer.render(this.stage);
        }

        gameLoop();
      });
    },
    groupingSprites (resources: PIXI.utils.Dict<PIXI.LoaderResource>) {
      const cat = new PIXI.Sprite(resources.cat.texture);
      cat.position.set(0, 0);
      const hedgehog = new PIXI.Sprite(resources.hedgehog.texture);
      hedgehog.position.set(32, 32);
      const tiger = new PIXI.Sprite(resources.tiger.texture);
      tiger.position.set(64, 64);

      const animals = new PIXI.Container();
      animals.addChild(cat);
      animals.addChild(hedgehog);
      animals.addChild(tiger);
      // console.log(animals.children);
      animals.position.set(96, 96);

      this.stage.addChild(animals);
    },
    onWindowResize () {
      window.addEventListener('resize', () => {
        this.renderer.view.width = window.innerWidth;
        this.renderer.view.height = window.innerHeight;
        this.render();
      });
    },
    renderTreasureHunterGame () {
      this.loader.load((loader, resources) => {
        const b = new Bump(PIXI);
        // Game Scene
        const gameScene = new PIXI.Container();
        this.stage.addChild(gameScene);

        const textureCache = PIXI.utils.TextureCache;
        const dungeon = new PIXI.Sprite(textureCache['dungeon.png']);
        gameScene.addChild(dungeon);

        const door = new PIXI.Sprite(textureCache['door.png']);
        door.position.set(32, 0);
        gameScene.addChild(door);

        const explorer: MovingSprite = new PIXI.Sprite(textureCache['explorer.png']);
        explorer.x = 68;
        explorer.y = this.stage.height / 2 - explorer.height / 2;
        explorer.vx = 0;
        explorer.vy = 0;
        gameScene.addChild(explorer);

        const left = keyboard(37),
          up = keyboard(38),
          right = keyboard(39),
          down = keyboard(40);

        left.press = () => {
          explorer.vx = -5;
          explorer.vy = 0;
        }

        left.release = () => {
          if (!right.isDown && explorer.vy === 0) {
            explorer.vx = 0;
          }
        }

        up.press = () => {
          explorer.vy = -5;
          explorer.vx = 0;
        }

        up.release = () => {
          if (!down.isDown && explorer.vx === 0) {
            explorer.vy = 0;
          }
        };
        //Right
        right.press = () => {
          explorer.vx = 5;
          explorer.vy = 0;
        };
        right.release = () => {
          if (!left.isDown && explorer.vy === 0) {
            explorer.vx = 0;
          }
        };
        //Down
        down.press = () => {
          explorer.vy = 5;
          explorer.vx = 0;
        };
        down.release = () => {
          if (!up.isDown && explorer.vx === 0) {
            explorer.vy = 0;
          }
        };

        const treasure = new PIXI.Sprite(textureCache['treasure.png']);
        treasure.x = gameScene.width - treasure.width - 48;
        treasure.y = gameScene.height / 2 - treasure.height / 2;
        gameScene.addChild(treasure);

        const numberOfBlobs = 6,
          spacing = 48,
          xOffset = 150,
          speed = 2;
        let direction = 1;

        const blobs: MovingSprite[] = [];

        for (let i = 0; i < numberOfBlobs; i += 1) {
          const blob: MovingSprite = new PIXI.Sprite(textureCache['blob.png']);
          const x = spacing * i + xOffset;
          const y = randomInt(0, this.stage.height - blob.height);
          blob.x = x;
          blob.y = y;
          blob.vy = speed * direction;
          direction *= -1;
          blobs.push(blob);
          gameScene.addChild(blob);
        }

        // healthbar
        const healthbar: PIXI.Container & { outer?: PIXI.Graphics } = new PIXI.Container();
        healthbar.position.set(this.stage.width - 170, 4);
        gameScene.addChild(healthbar);

        const innerBar = new PIXI.Graphics();
        innerBar.beginFill(0x000000);
        innerBar.drawRect(0, 0, 128, 8);
        innerBar.endFill();
        healthbar.addChild(innerBar);

        const outerBar = new PIXI.Graphics();
        outerBar.beginFill(0xff3300);
        outerBar.drawRect(0, 0, 128, 8);
        outerBar.endFill();
        healthbar.addChild(outerBar);
        healthbar.outer = outerBar;

        // GameOver Scene
        const gameOverScene = new PIXI.Container();
        this.stage.addChild(gameOverScene);
        gameOverScene.visible = false;

        const message = new PIXI.Text('The End!', { fontFamily: 'Arial', fontSize: 48, fill: 'red' });
        message.x = 120;
        message.y = this.stage.height / 2 - 32;
        gameOverScene.addChild(message);


        // Game loop
        const play = () => {
          explorer.x += explorer.vx!;
          explorer.y += explorer.vy!;

          contain(explorer, { x: 28, y: 10, width: 488, height: 480 });
          let explorerHit = false;

          blobs.forEach(blob => {
            blob.y += blob.vy!;
            const blobHitsWall = contain(blob, { x: 28, y: 10, width: 488, height: 480 });
            if (blobHitsWall) {
              if (blobHitsWall.has('top') || blobHitsWall.has('bottom')) {
                blob.vy! *= -1;
              }
            }
            if (b.hitTestRectangle(explorer, blob)) {
              explorerHit = true;
            }
          });

          if (explorerHit) {
            explorer.alpha = 0.5;
            healthbar.outer!.width -= 1;
          } else {
            explorer.alpha = 1;
          }

          if (b.hitTestRectangle(explorer, treasure)) {
            treasure.x = explorer.x + 8;
            treasure.y = explorer.y + 8;
          }

          if (b.hitTestRectangle(treasure, door)) {
            state = end;
            message.text = "You won!";
          }

          if (healthbar.outer!.width < 0) {
            state = end;
            message.text = "You lost!";
          }
        }

        let state = play;

        const gameLoop = () => {
          requestAnimationFrame(gameLoop);
          state();
          this.renderer.render(this.stage);
        }

        const end = () => {
          gameScene.visible = false;
          gameOverScene.visible = true;
        };

        gameLoop();
      });
    },
    renderFilmStrip () {
      this.loader.load((loader, resources) => {
        const su = new SpriteUtilities(PIXI);
        const frames = su.filmstrip('./pixieFrames.png', 48, 32);
        const pixie = new PIXI.AnimatedSprite(frames);
        pixie.position.set(32, 32);
        this.stage.addChild(pixie);

        pixie.play();
        pixie.animationSpeed = 0.1;

        const d = new Dust(PIXI);
        const stars = d.create(
          128,
          128,
          () => su.sprite('./star.png'),
          this.stage,
          50
        );

        // Game loop
        const play = () => {

        }

        let state = play;

        const gameLoop = () => {
          requestAnimationFrame(gameLoop);
          state();
          d.update();
          this.renderer.render(this.stage);
        }

        gameLoop();
      });
    },
    renderTreasureHunterGameFull () {
      this.loader.load((loader, resources) => {
        const b = new Bump(PIXI);
        // Game Scene
        const gameScene = new PIXI.Container();
        this.stage.addChild(gameScene);

        const textureCache = PIXI.utils.TextureCache;
        const dungeon = new PIXI.Sprite(textureCache['dungeon.png']);
        gameScene.addChild(dungeon);

        const door = new PIXI.Sprite(textureCache['door.png']);
        door.position.set(32, 0);
        gameScene.addChild(door);

        const su = new SpriteUtilities(PIXI);
        const frames = su.filmstrip('./adventuress.png', 32, 32);
        const adventuress = su.sprite(frames);
        adventuress.vx = 0;
        adventuress.vy = 0;
        adventuress.position.set(32, 32);
        gameScene.addChild(adventuress);
        adventuress.fps = 12;

        adventuress.states = {
          down: 0,
          left: 3,
          right: 6,
          up: 9,
          walkDown: [0, 2],
          walkLeft: [3, 5],
          walkRight: [6, 8],
          walkUp: [9, 11]
        };

        const left = keyboard(37),
          up = keyboard(38),
          right = keyboard(39),
          down = keyboard(40);

        left.press = () => {
          //Play the sprite's `walkLeft` animation
          //sequence and set the sprite's velocity
          adventuress.playAnimation(adventuress.states.walkLeft);
          adventuress.vx = -5;
          adventuress.vy = 0;
        }

        left.release = () => {
          //If the left arrow has been released, and the right arrow isn't down,
          //and the sprite isn't moving vertically, stop the sprite from moving
          //by setting its velocity to zero. Then display the sprite's static
          //`left` state.
          if (!right.isDown && adventuress.vy === 0) {
            adventuress.vx = 0;
            adventuress.show(adventuress.states.left);
          }
        }

        up.press = () => {
          adventuress.playAnimation(adventuress.states.walkUp);
          adventuress.vy = -5;
          adventuress.vx = 0;
        }

        up.release = () => {
          if (!down.isDown && adventuress.vx === 0) {
            adventuress.vy = 0;
            adventuress.show(adventuress.states.up);
          }
        };
        //Right
        right.press = () => {
          adventuress.playAnimation(adventuress.states.walkRight);
          adventuress.vx = 5;
          adventuress.vy = 0;
        };
        right.release = () => {
          if (!left.isDown && adventuress.vy === 0) {
            adventuress.vx = 0;
            adventuress.show(adventuress.states.right);
          }
        };
        //Down
        down.press = () => {
          adventuress.playAnimation(adventuress.states.walkDown);
          adventuress.vy = 5;
          adventuress.vx = 0;
        };
        down.release = () => {
          if (!up.isDown && adventuress.vx === 0) {
            adventuress.vy = 0;
            adventuress.show(adventuress.states.down);
          }
        };

        const treasure = new PIXI.Sprite(textureCache['treasure.png']);
        treasure.x = gameScene.width - treasure.width - 48;
        treasure.y = gameScene.height / 2 - treasure.height / 2;
        gameScene.addChild(treasure);

        const numberOfBlobs = 6,
          spacing = 48,
          xOffset = 150,
          speed = 2;
        let direction = 1;

        const blobs: MovingSprite[] = [];

        for (let i = 0; i < numberOfBlobs; i += 1) {
          const blob: MovingSprite = new PIXI.Sprite(textureCache['blob.png']);
          const x = spacing * i + xOffset;
          const y = randomInt(0, this.stage.height - blob.height);
          blob.x = x;
          blob.y = y;
          blob.vy = speed * direction;
          direction *= -1;
          blobs.push(blob);
          gameScene.addChild(blob);
        }

        // healthbar
        const healthbar: PIXI.Container & { outer?: PIXI.Graphics } = new PIXI.Container();
        healthbar.position.set(this.stage.width - 170, 4);
        gameScene.addChild(healthbar);

        const innerBar = new PIXI.Graphics();
        innerBar.beginFill(0x000000);
        innerBar.drawRect(0, 0, 128, 8);
        innerBar.endFill();
        healthbar.addChild(innerBar);

        const outerBar = new PIXI.Graphics();
        outerBar.beginFill(0xff3300);
        outerBar.drawRect(0, 0, 128, 8);
        outerBar.endFill();
        healthbar.addChild(outerBar);
        healthbar.outer = outerBar;

        // GameOver Scene
        const c = new Charm(PIXI);
        const d = new Dust(PIXI);
        const gameOverScene = new PIXI.Container();
        this.stage.addChild(gameOverScene);
        gameOverScene.x = gameScene.width;
        gameOverScene.visible = false;

        const message = new PIXI.Text('The End!', { fontFamily: 'Arial', fontSize: 48, fill: 'red' });
        message.x = 120;
        message.y = this.stage.height / 2 - 32;
        gameOverScene.addChild(message);


        // Game loop
        const play = () => {
          adventuress.x += adventuress.vx;
          adventuress.y += adventuress.vy;

          contain(adventuress, { x: 28, y: 10, width: 488, height: 480 });
          let explorerHit = false;

          blobs.forEach(blob => {
            blob.y += blob.vy!;
            const blobHitsWall = contain(blob, { x: 28, y: 10, width: 488, height: 480 });
            if (blobHitsWall) {
              if (blobHitsWall.has('top') || blobHitsWall.has('bottom')) {
                blob.vy! *= -1;
              }
            }
            if (b.hitTestRectangle(adventuress, blob)) {
              explorerHit = true;
            }
          });

          if (explorerHit) {
            adventuress.alpha = 0.5;
            healthbar.outer!.width -= 1;
          } else {
            adventuress.alpha = 1;
          }

          if (b.hitTestRectangle(adventuress, treasure)) {
            treasure.x = adventuress.x + 8;
            treasure.y = adventuress.y + 8;
          }

          if (b.hitTestRectangle(treasure, door)) {
            state = end;
            message.text = "You won!";
            // star particles
            let stars = new PIXI.ParticleContainer(
              15000,
              {
                alpha: true,
                scale: true,
                rotation: true,
                uvs: true
              }
            );
            stars.position.set(160, this.stage.height / 2 - 40);
            gameOverScene.addChild(stars);

            //Create star particles
            const particleStream: any = d.emitter(
              500,
              () => d.create(
                0, 0,
                () => su.sprite("./star.png"),
                stars,
                30,
                0.1,
                false,
                3.14, 6.28,
                16, 32,
                2, 5
              )
            );

            particleStream.stop();
            particleStream.play();
          }

          if (healthbar.outer!.width < 0) {
            state = end;
            message.text = "You lost!";
          }
        }

        let state = play;

        const gameLoop = () => {
          requestAnimationFrame(gameLoop);
          state();
          d.update();
          c.update();
          this.renderer.render(this.stage);
        }

        const end = () => {
          gameOverScene.visible = true;
          c.slide(gameOverScene, 0, 0);
          c.slide(gameScene, -this.renderer.width, 0);
        };

        gameLoop();
      });
    },
    nodeTransition () {
      const drawCircle = (radius: number, color: number) => {
        const circle: PIXI.Graphics & { radius?: number, color?: number } = new PIXI.Graphics();
        circle.beginFill(color);
        // circle.lineStyle(4, 0x006600, 1);
        circle.drawCircle(0, 0, radius);
        circle.endFill();
        circle.x = 256;
        circle.y = 112;
        this.stage.addChild(circle);
        circle.radius = radius;
        circle.color = color;
        return circle;
      }

      let circle = drawCircle(10, 0xff9933);
      const duration = 3000;
      const startColor = 0xff9933;
      const endColor = 0x22ea62;

      const colorInterpolation = (colorA: number[] | Float32Array, colorB: number[] | Float32Array, t: number) => {
        return [
          colorA[0] + (colorB[0] - colorA[0]) * t,
          colorA[1] + (colorB[1] - colorA[1]) * t,
          colorA[2] + (colorB[2] - colorA[2]) * t,
        ]
      };
      let start = Date.now();

      const play = () => {
        const t = (Date.now() - start) / duration;
        if (t <= 1) {
          circle.clear();
          const color = colorInterpolation(PIXI.utils.hex2rgb(startColor), PIXI.utils.hex2rgb(endColor), t);
          circle = drawCircle(circle.radius! + 0.1, PIXI.utils.rgb2hex(color));
        }
        // circle = drawCircle(circle.radius! + 1, circle.color!);

      }

      const state = play;

      const gameLoop = () => {
        requestAnimationFrame(gameLoop);
        state();
        this.renderer.render(this.stage);
      }

      gameLoop();
    },
    visualEffectsAndTransitions () {
      this.loader.load((loader, resources) => {
        const tilingSprite = new PIXI.TilingSprite(PIXI.utils.TextureCache['./tile.png'], 192, 192);
        tilingSprite.x = 32;
        tilingSprite.y = 32;
        // tilingSprite.tilePosition.x = 32;
        // tilingSprite.tilePosition.y = 32;
        this.stage.addChild(tilingSprite);

        const play = () => {

        }

        const state = play;

        const gameLoop = () => {
          requestAnimationFrame(gameLoop);
          state();
          this.renderer.render(this.stage);
        }

        gameLoop();
      });
    },
    parallaxScrolling () {
      this.loader.load((loader, resources) => {
        const clouds = new PIXI.TilingSprite(PIXI.utils.TextureCache['./clouds.png'], 800, 800);
        this.stage.addChild(clouds);

        const play = () => {
          clouds.tilePosition.x -= 1;
        }

        const state = play;

        const gameLoop = () => {
          requestAnimationFrame(gameLoop);
          state();
          this.renderer.render(this.stage);
        }

        gameLoop();
      });
    },
    renderTexture () {
      this.loader.load((loader, resources) => {
        const spriteOne = new PIXI.TilingSprite(PIXI.utils.TextureCache['./tile.png'], 128, 128);
        spriteOne.position.set(16, 16);
        this.stage.addChild(spriteOne);

        const rTexture = PIXI.RenderTexture.create({ width: 128, height: 128 });
        const spriteTwo = new PIXI.Sprite(rTexture);
        spriteTwo.position.set(108, 108);
        this.stage.addChild(spriteTwo);


        const play = () => {
          spriteOne.tilePosition.x += 1;
          spriteOne.tilePosition.y += 1;
          this.renderer.render(spriteOne, { renderTexture: rTexture });
        }

        const state = play;

        const gameLoop = () => {
          requestAnimationFrame(gameLoop);
          state();
          this.renderer.render(this.stage);
        }

        gameLoop();
      });
    },
    tinting () {
      this.loader.load((loader, resources) => {
        const cat = new PIXI.Sprite(resources.cat.texture);
        cat.position.set(0, 0);
        cat.tint = 0xffff660;
        const hedgehog = new PIXI.Sprite(resources.hedgehog.texture);
        hedgehog.position.set(32, 32);
        hedgehog.tint = 0xff6666;
        const tiger = new PIXI.Sprite(resources.tiger.texture);
        tiger.position.set(64, 64);
        tiger.tint = 0x66ff66;

        const animals = new PIXI.Container();
        animals.addChild(cat);
        animals.addChild(hedgehog);
        animals.addChild(tiger);
        // console.log(animals.children);
        animals.position.set(96, 96);

        this.stage.addChild(animals);


        const play = () => {
        }

        const state = play;

        const gameLoop = () => {
          requestAnimationFrame(gameLoop);
          state();
          this.renderer.render(this.stage);
        }

        gameLoop();
      });
    },
    blendModes () {
      this.loader.load((loader, resources) => {
        this.renderer.backgroundColor = 0xffffff;
        const cat = new PIXI.Sprite(resources.cat.texture);
        cat.position.set(32, 32);
        cat.scale.set(2, 2);
        cat.alpha = 0.5;
        cat.blendMode = PIXI.BLEND_MODES.MULTIPLY;
        this.stage.addChild(cat);


        const hedgehog = new PIXI.Sprite(resources.hedgehog.texture);
        hedgehog.position.set(64, 64);
        hedgehog.scale.set(2, 2);
        hedgehog.alpha = 0.5;
        hedgehog.blendMode = PIXI.BLEND_MODES.MULTIPLY;
        this.stage.addChild(hedgehog);

        const tiger = new PIXI.Sprite(resources.tiger.texture);
        tiger.position.set(96, 96);
        tiger.scale.set(2, 2);
        tiger.alpha = 0.5;
        tiger.blendMode = PIXI.BLEND_MODES.MULTIPLY;
        this.stage.addChild(tiger);

        const play = () => {
        }

        const state = play;

        const gameLoop = () => {
          requestAnimationFrame(gameLoop);
          state();
          this.renderer.render(this.stage);
        }

        gameLoop();
      });
    },
    filters () {
      this.loader.load((loader, resources) => {
        const cat = new PIXI.Sprite(resources.cat.texture);
        cat.position.set(64, 64);
        cat.scale.set(2, 2);
        this.stage.addChild(cat);

        const filter = new PIXI.filters.BlurFilter();
        filter.blur = 20;
        cat.filters = [filter];

        const play = () => {
        }

        const state = play;

        const gameLoop = () => {
          requestAnimationFrame(gameLoop);
          state();
          this.renderer.render(this.stage);
        }

        gameLoop();
      });
    },
    ropeMesh () {
      this.loader.load((loader, resources) => {
        const numberOfSegments = 20;
        const imageWidth = 600;
        const ropeSegment = imageWidth / numberOfSegments;

        const points: PIXI.Point[] = [];
        for (let i = 0; i < numberOfSegments; i += 1) {
          points.push(new PIXI.Point(i * ropeSegment, 0));
        }

        const snake = new PIXI.SimpleRope(PIXI.utils.TextureCache['./snake.png'], points);
        const snakeContainer = new PIXI.Container();
        snakeContainer.addChild(snake);
        snakeContainer.position.set(64, 128);
        this.stage.addChild(snakeContainer);

        let counter = 0;

        const play = () => {
          counter += 0.1;

          for (let i = 0; i < points.length; i += 1) {
            points[i].y = (Math.sin(i * 0.5) + counter) * 30;
            points[i].x = i * ropeSegment + Math.cos((i * 0.3) + counter) * numberOfSegments;
          }
        }

        const state = play;

        const gameLoop = () => {
          requestAnimationFrame(gameLoop);
          state();
          this.renderer.render(this.stage);
        }

        gameLoop();
      });
    },
    tweenAndTransitions () {
      this.loader.load((loader, resources) => {
        const c = new Charm(PIXI);
        const cat = new PIXI.Sprite(resources.cat.texture);
        // cat.position.set(32, 32);
        this.stage.addChild(cat);
        c.slide(cat, 128, 128, 120, 'smoothstep', true);


        const play = () => {
        }

        const state = play;

        const gameLoop = () => {
          requestAnimationFrame(gameLoop);
          state();
          c.update();
          this.renderer.render(this.stage);
        }

        gameLoop();
      });
    }
  },
  mounted () {
    this.loadPixi();
    this.tweenAndTransitions();
    this.onWindowResize();
  }
})
</script>

<style>
body {
  margin: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
