import { Mat4 } from "./Mat4.js";

export class Camera {
    constructor() {
        this.pos = { x: 0.0, y: 0.0, z: 3.0 };
        this.yaw = 0.0;
        this.pitch = 0.0;
    }
    move_forward(distance) {
        this.pos.x += Math.sin(this.yaw) * distance;
        this.pos.z += Math.cos(this.yaw) * distance;
    }
    move_right(distance) {
        this.pos.x += Math.sin(this.yaw + Math.PI / 2.0) * distance;
        this.pos.z += Math.cos(this.yaw + Math.PI / 2.0) * distance;
    }
    move_up(distance) {
        this.pos.y += distance;
    }
    turn(d_yaw, d_pitch) {
        this.yaw += d_yaw;
        this.pitch += d_pitch;
    }
    get_viewMatrix() {
        const rot_x = Mat4.rotX(-this.pitch);
        const rot_y = Mat4.rotY(-this.yaw);
        const translation = Mat4.translate(-this.pos.x, -this.pos.y, -this.pos.z);
        return Mat4.mul(rot_x, Mat4.mul(rot_y, translation));
    }
}
