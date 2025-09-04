
export const Mat4 = {
    id() {
        return new Float32Array(
            [
                1,0,0,0,
                0,1,0,0,
                0,0,1,0,
                0,0,0,1
            ]);
    },
    mul(a, b) {
        const ret = new Float32Array(4 * 4);
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                let sum = 0;
                for (let k = 0; k < 4; k++)
                {
                    sum += a[k*4 + i] * b[j*4 + k];
                }
                ret[j*4 + i] = sum;
            }
        }
        return ret;
    },
    translate(x, y, z) {
        const ret = Mat4.id();
        ret[3 * 4 + 0] = x;
        ret[3 * 4 + 1] = y;
        ret[3 * 4 + 2] = z;
        return ret;
    },
    rotX(rad) {
        const s = Math.sin(rad);
        const c = Math.cos(rad);
        return new Float32Array([
            1, 0, 0, 0,
            0, c, s, 0,
            0,-s, c, 0,
            0, 0, 0, 1
        ]);
    },
    rotY(rad) {
        const s = Math.sin(rad);
        const c = Math.cos(rad);
        return new Float32Array([
            c, 0,-s, 0,
            0, 1, 0, 0,
            s, 0, c, 0,
            0, 0, 0, 1
        ]);
    },
    rotZ(rad) {
        const s = Math.sin(rad);
        const c = Math.cos(rad);
        return new Float32Array([
             c, s, 0, 0,
            -s, c, 0, 0,
             0, 0, 1, 0,
             0, 0, 0, 1
        ]);
    },
    perspective(fovy_rad, aspect, near, far) {
        const ret = Mat4.id();
        const  f  = 1.0 / Math.tan(fovy_rad / 2.0);
        const nf  = 1.0 / (near - far);
        ret[0 * 4 + 0] = f / aspect;
        ret[1 * 4 + 1] = f;
        ret[2 * 4 + 2] = (far + near) * nf;
        ret[2 * 4 + 3] = -1.0;
        ret[3 * 4 + 2] = (2.0 * far * near) * nf;
        return ret;
    }
};
