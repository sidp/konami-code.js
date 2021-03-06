export type callbackFn = (this: KonamiCode) => void;

export class KonamiCode {
  sequence: number[] = [];
  code = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
  callback: callbackFn;

  constructor(callback: callbackFn) {
    if (!(this instanceof KonamiCode)) {
      throw new Error('Constructor called as a function');
    }

    if (typeof callback !== 'function') {
      throw new Error('KonamiCode expects a callback function as argument');
    }

    this.callback = callback;

    document.addEventListener('keydown', this.handleKeyDown);
  }

  private handleKeyDown = (ev: KeyboardEvent) => {
    this.capture(ev.keyCode);
    this.validate();
  };

  private capture(keyCode: number) {
    this.sequence.push(keyCode);
    if (this.sequence.length > this.code.length) {
      this.sequence.splice(0, 1);
    }
  }

  private validate() {
    if (sameSequence(this.sequence, this.code)) {
      this.fire();
    }
  }

  private fire() {
    this.callback.apply(this);
  }

  public remove() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }
}

/**
 * Attach a callback function that fires when the user enters the konami code.
 */

export default function konamiCode(callback: callbackFn) {
  return new KonamiCode(callback);
}

/**
 * Compare two arrays of numbers
 */

export function sameSequence(a: number[], b: number[]) {
  if (a.length !== b.length) {
    return false;
  }

  for (let i = 0; i < a.length; i += 1) {
    if (a[i] != b[i]) {
      return false;
    }
  }

  return true;
}
