import './style.css'
import {vs, fs} from './shader.js'

const render = (gl) => {   
    requestAnimationFrame(render); 
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

    genShader(type, src){
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, src);
        this.gl.compileShader(shader);
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)){
            console.error(this.gl.getShaderInfoLog(shader));
            this.gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    genProg(vsSrc, fsSrc){
        const vs = this.genShader(this.gl.VERTEX_SHADER, vsSrc);
        const fs = this.genShader(this.gl.FRAGMENT_SHADER, fsSrc);
        const prog = this.gl.createProgram();
        this.gl.attachShader(prog, vs);
        this.gl.attachShader(prog, fs);
        this.gl.linkProgram(prog);
        if (!this.gl.getProgramParameter(prog, this.gl.LINK_STATUS)){
            console.error(this.gl.getProgramInfoLog(prog));
            this.gl.deleteProgram(prog);
            return null;
        }

        const posPtr = this.gl.getAttribLocation(prog, "aPos");
        console.log(posPtr); 
        this.gl.enableVertexAttribArray(posPtr);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.geom);
        this.gl.vertexAttribPointer(posPtr, 2, this.gl.FLOAT, false, 0, 0);
        
        return prog;
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