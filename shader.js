// ---Use glsl-literal plugin for GLSL syntax highlight
// ---Vertex shader
const vs = /*glsl*/`
    attribute   vec2 a_position;
    varying     vec2 vUv;
    void main() {
        vUv = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
    }    
`;
// ---Fragment shader
const fs = /*glsl*/`
    precision   mediump float;
    varying     vec2 vUv;
    uniform     vec2 uMouse;
    void main() {
        vec3 color = vec3(vUv, 1.0) * vec3(uMouse, 1.0);
        gl_FragColor = vec4(color, 1.0);
    }
`;
export {fs, vs}; 