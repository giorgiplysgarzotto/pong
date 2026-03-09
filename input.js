export class InputManager {
constructor() {
this.keys = new Set();

this._onKeyDown = (event) => {
this.keys.add(event.code);
};

this._onKeyUp = (event) => {
this.keys.delete(event.code);
};

window.addEventListener("keydown", this._onKeyDown);
window.addEventListener("keyup", this._onKeyUp);
}

isPressed(code) {
return this.keys.has(code);
}

destroy() {
window.removeEventListener("keydown", this._onKeyDown);
window.removeEventListener("keyup", this._onKeyUp);
this.keys.clear();
}
}
