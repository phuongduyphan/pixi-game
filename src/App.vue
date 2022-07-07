<template>
  <div id="pixi-container">
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import * as PIXI from 'pixi.js';
import { randomInt } from './utils';

export default defineComponent({
  name: 'App',
  data (): { renderer: PIXI.AbstractRenderer, loader: PIXI.Loader, stage: PIXI.Container } {
    return {
      renderer: PIXI.autoDetectRenderer({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: 0x000000,
        antialias: false,
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
        .add('girl', './pixie96x48.png')
        .add('cat', './cat64x64.png')
        .add('tileset', './tileset.png')
        .add('treasureHunter', './treasureHunter.json')

      this.loader.onProgress.add((loader, resource) => {
        console.log(`loading: ${resource.url}`);
        console.log(`progress: ${loader.progress}%`);
      });
    },
    render () {
      const sprites: { [key: string]: PIXI.Sprite } = {};
      this.loader.load((loader, resources) => {
        // this.renderGirl(resources.girl.texture!);
        // this.renderCat(resources.cat.texture!);
        // this.extractSpriteFromSpritesheet(resources.tileset.texture!);
        this.extractSpriteFromSpritesheetJson(resources.treasureHunter);

        this.renderer.render(this.stage);
      });
    },
    renderGirl (girlTexture: PIXI.Texture) {
      const girl = new PIXI.Sprite(girlTexture);
      this.stage.addChild(girl);
      // stage.removeChild(sprites.girl);
      // sprites.girl.visible = false;
      // The only time you’ll ever have to use destroy is in extreme cases in which
      // your game is creating and destroying a lot of sprites, and you notice unusually high GPU
      // memory usage.
      // sprites.girl.destroy(true); // destroy texture and base texture
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
    onWindowResize () {
      window.addEventListener('resize', () => {
        this.renderer.view.width = window.innerWidth;
        this.renderer.view.height = window.innerHeight;
        this.render();
      });
    }
  },
  mounted () {
    this.loadPixi();
    this.render();
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
