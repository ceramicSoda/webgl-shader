import {vs, fs} from './shader.js'

const render = (gl) => {   
    requestAnimationFrame(render); 
}


class Material{
    constructor(){
        this.fs     = null;
        this.vs     = null;
        this.prog   = null; 
        this.uni    = {};
        this.attr   = {};
    }

    genShader(gl, type, src){
        const shader = gl.createShader(type);
        gl.shaderSource(shader, src);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
            console.error(gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    genProg(gl, vsSrc, fsSrc){
        vs = this.genShader(gl.VERTEX_SHADER, vsSrc);
        fs = this.genShader(gl.FRAGMENT_SHADER, fsSrc);
        this.prog = gl.createProgram();
        gl.attachShader(this.prog, vs);
        gl.attachShader(this.prog, fs);
        gl.linkProgram(this.prog);
        if (!gl.getProgramParameter(this.prog, gl.LINK_STATUS)){
            console.error(gl.getProgramInfoLog(this.prog));
            gl.deleteProgram(this.prog);
            return null;
        }
        return this.prog;
    }
    addUniform(gl, type, val){

    }
    addAttribute(gl, type, val){

    }
}

class Scene{
    constructor(parent = document.body){
        this.canvas     = document.createElement('canvas'); 
        this.parent     = parent; 
        this.progs      = [];
        this.progPtr    = 0; 
        this.gl         = null;
        this.geom       = null;
    }
    
    genPlaneGeom(){
        const planeGeom = new Float32Array([
            -1.0, -1.0,     1.0, -1.0,     -1.0, 1.0,
            -1.0,  1.0,     1.0, -1.0,      1.0, 1.0,
        ]); 
        this.geom = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.geom);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, planeGeom, this.gl.STATIC_DRAW);
    }

    updateSize(){
        // this.canvas.width = this.parent.innerWidth;
        // this.canvas.height = this.parent.innerHeight;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    render(){
        requestAnimationFrame(()=>this.render);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
    }

    initGl(){
        this.canvas.setAttribute('id', 'glViewport');
        this.updateSize();
        this.parent.append(this.canvas);
        this.gl = this.canvas.getContext("webgl");
        if (!this.gl){
            console.error('Failed to init WebGL!');
            return null; 
        }
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clearColor(0, 0, 0, 1);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.genPlaneGeom();

        let shader = scene.genProg(vs, fs); 
        scene.gl.useProgram(shader);    
        this.render(); 
    }
}

let scene = new Scene(document.body);
scene.initGl(); 
window.addEventListener("resize", () => {
    scene.updateSize();
});