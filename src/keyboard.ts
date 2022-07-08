export function keyboard (keyCode: number) {
  const key: {
    code: number,
    isDown: boolean,
    isUp: boolean,
    press?: () => void,
    release?: () => void,
    downHandler: (event: KeyboardEvent) => void,
    upHandler: (event: KeyboardEvent) => void
  } = {
    code: keyCode,
    isDown: false,
    isUp: true,
    downHandler: event => {
      if (event.keyCode === key.code) {
        if (key.isUp && key.press) key.press();
        key.isDown = true;
        key.isUp = false;
      }
      event.preventDefault();
    },
    upHandler: event => {
      if (event.keyCode === key.code) {
        if (key.isDown && key.release) key.release();
        key.isDown = false;
        key.isUp = true;
      }
      event.preventDefault();
    }
  };

  window.addEventListener('keydown', key.downHandler.bind(key), false);
  window.addEventListener('keyup', key.upHandler.bind(key), false);

  return key;
}