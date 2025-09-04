
export async function loadShaderSource(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to load shader: ${url}`);
    return await res.text();
}

export function create_shader(gl, shader_type, source) {
    const sh = gl.createShader(shader_type);
    gl.shaderSource(sh, source);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        const log = gl.getShaderInfoLog(sh);
        gl.deleteShader(sh);
        throw new Error("Shader compile error: " + log);
    }
    return sh;
}

export function create_program(gl, vertSrc, fragSrc) {
    const vs = create_shader(gl, gl.VERTEX_SHADER, vertSrc);
    const fs = create_shader(gl, gl.FRAGMENT_SHADER, fragSrc);
    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        const log = gl.getProgramInfoLog(prog);
        gl.deleteProgram(prog);
        throw new Error("Program link error: " + log);
    }
    return prog;
}

