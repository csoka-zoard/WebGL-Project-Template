import { Mat4 } from "./Mat4.js";
import { Camera } from "./Camera.js";
import { create_program, loadShaderSource } from "./ShaderUtils.js";
import { InputHandler } from "./InputHandler.js";
import { Geometries } from "./Geometries.js";


class App {
    constructor(canvas) {
        this.window = window;
        this.canvas = canvas;
        this.document = document;
        // Bind the render method
        this.render = this.render.bind(this);
    }
    async init() {
        this.setUpCanvas();
        await this.initShaders();
        this.initGeometry();
        this.camera = new Camera();
        this.inputHandler = new InputHandler(this.window, this.canvas, this.document, this.camera);
        this.initBind();
        this.lastTime = performance.now(); // not sure this ought to be in init.
    }
    setUpCanvas() {
        this.resizeCanvasToDisplaySize = () => {
            const dpr = this.window.devicePixelRatio || 1;
            const display_width = Math.floor(this.canvas.clientWidth * dpr);
            const display_height = Math.floor(this.canvas.clientHeight * dpr);
            if (this.canvas.width !== display_width || this.canvas.height !== display_height) {
                this.canvas.width = display_width;
                this.canvas.height = display_height;
            }
            this.gl.viewport(0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight);
        }
        window.addEventListener("resize", this.resizeCanvasToDisplaySize);
        this.gl = this.canvas.getContext("webgl2", { antialias: true });
        if (!this.gl) {
            alert("WebGL not supported");
            throw new Error("WebGL not supported");
        }
    }
    async initShaders() {        
        const vertSource = await loadShaderSource("./Shaders/vertexShader.vert");
        const fragSource = await loadShaderSource("./Shaders/fragmentShader.frag");
        this.program = create_program(this.gl, vertSource, fragSource);
        this.gl.useProgram(this.program);
        this.attribs = {
            aPosition: this.gl.getAttribLocation(this.program, "aPosition"),
            aColor: this.gl.getAttribLocation(this.program, "aColor"),
            aNormal: this.gl.getAttribLocation(this.program, "aNormal")
        };
        this.uniforms = {
            uViewProj: this.gl.getUniformLocation(this.program, "uViewProj"),
            uModel: this.gl.getUniformLocation(this.program, "uModel")
        };
    }    
    make_buffer(target, data, usage = this.gl.STATIC_DRAW) {
        const buff = this.gl.createBuffer();
        this.gl.bindBuffer(target, buff);
        this.gl.bufferData(target, data, usage);
        return buff;
    }
    initGeometry()
    {
        const quad = Geometries.quad_colored;
        const quad_vertex_buffer = this.make_buffer(this.gl.ARRAY_BUFFER, quad.vertices);
        const quad_idx_buffer = this.make_buffer(this.gl.ELEMENT_ARRAY_BUFFER, quad.indices);
        this.quadGeom = {
            vertex_buffer: quad_vertex_buffer,
            idx_buffer: quad_idx_buffer,
            len: quad.indices.length
        };

        const cube = Geometries.cube_colored;
        const cube_vertex_buffer = this.make_buffer(this.gl.ARRAY_BUFFER, cube.vertices);
        const cube_idx_buffer = this.make_buffer(this.gl.ELEMENT_ARRAY_BUFFER, cube.indices);
        this.cubeGeom = {
            vertex_buffer: cube_vertex_buffer,
            idx_buffer: cube_idx_buffer,
            len: cube.indices.length
        };
    }
    initBind() {
        const float_size = 4;
        const stride = 9 * float_size;
        this.gl.enableVertexAttribArray(this.attribs.aPosition);
        this.gl.vertexAttribPointer(
            this.attribs.aPosition,
            3, this.gl.FLOAT, false,
            stride, 0
        );
        this.gl.enableVertexAttribArray(this.attribs.aColor);
        this.gl.vertexAttribPointer(
            this.attribs.aColor,
            3, this.gl.FLOAT, false,
            stride, 3 * float_size
        );
        this.gl.enableVertexAttribArray(this.attribs.aNormal);
        this.gl.vertexAttribPointer(
            this.attribs.aNormal,
            3, this.gl.FLOAT, false,
            stride, 6 * float_size
        );
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.cullFace(this.gl.BACK);
        this.gl.clearColor(0.05, 0.05, 0.08, 1.0);
    }
    drawObject(geom, modelTrf) {
        this.gl.uniformMatrix4fv(this.uniforms.uModel, false, modelTrf)
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, geom.vertex_buffer);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, geom.idx_buffer);
        this.gl.drawElements(this.gl.TRIANGLES, geom.len, this.gl.UNSIGNED_SHORT, 0);
    }
    setCommonUniforms() {
        const proj = Mat4.perspective(Math.PI / 4.0, this.canvas.width / this.canvas.height, 0.1, 100.0);
        const view = this.camera.get_viewMatrix();
        const vp  = Mat4.mul(proj, view);
        this.gl.uniformMatrix4fv(this.uniforms.uViewProj, false, vp);
    }
    render(now = performance.now()) {
        const dt = (now - this.lastTime) / 1000.0;
        this.lastTime = now;
        this.inputHandler.update(dt);

        this.resizeCanvasToDisplaySize();
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        this.setCommonUniforms();
        //this.drawObject(this.quad_vertex_buffer, this.quad_idx_buffer, this.quad_length);
        this.drawObject(this.cubeGeom, Mat4.id());

        requestAnimationFrame(this.render);
    }
}

const canvas = document.getElementById("gl_canvas");
let app = new App(canvas);
await app.init();
app.render();
