#version 300 es

precision mediump float;

in vec3 vColor;
in vec3 vNormal;

out vec4 outColor;

void main() {
    outColor = vec4(vColor, 1.0);
}