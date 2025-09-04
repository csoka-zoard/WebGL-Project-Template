
export class InputHandler {
    constructor(window, canvas, document, camera) {
        this.keys = {};
        this.mouseSensitivity = 0.01;
        this.window = window;
        this.canvas = canvas;
        this.document = document;
        this.camera = camera;
        this.setUpKeys();
        this.setUpMouse();
    }
    setUpKeys() {
        this.window.addEventListener("keydown", (e) => {
            this.keys[e.key.toLowerCase()] = true;
        });
        this.window.addEventListener("keyup", (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
    }
    setUpMouse() {
        this.canvas.addEventListener("mousedown", (e) => {
            this.keys["click"] = true;
        });
        this.canvas.addEventListener("mouseup", (e) => {
            this.keys["click"] = false;
        });
        this.canvas.addEventListener("mouseleave", (e) => {
            this.keys["click"] = false;
        });
        this.document.addEventListener("mousemove", (e) => {
            if (this.keys["click"]) {
                this.camera.turn(-e.movementX * this.mouseSensitivity, -e.movementY * this.mouseSensitivity);
            }
        });
    }
    update(dt) {
        const speed = 2.0 * dt;
        if (this.keys["w"]) this.camera.move_forward(-speed);
        if (this.keys["s"]) this.camera.move_forward(speed);
        if (this.keys["a"]) this.camera.move_right(-speed);
        if (this.keys["d"]) this.camera.move_right(speed);
        if (this.keys["q"]) this.camera.move_up(speed);
        if (this.keys["e"]) this.camera.move_up(-speed);
    }
}
