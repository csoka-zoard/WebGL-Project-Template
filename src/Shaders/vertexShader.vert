#version 300 es

precision mediump float;

// attributes
in vec3 aPosition;
in vec3 aColor;
in vec3 aNormal;

// uniforms
uniform mat4 uViewProj;
uniform mat4 uModel;

// varying
out vec3 vColor;
out vec3 vNormal;

void main() {
    vColor = aColor;
    vNormal = mat3(inverse(transpose(uModel))) * aNormal;
    gl_Position = uViewProj * uModel * vec4(aPosition, 1.0);
}
