
document.addEventListener("DOMContentLoaded", start);
var gl;

function start()
{
    console.log("I started");
    var canvas = document.getElementById("renderCanvas");
    gl = canvas.getContext("webgl2");

    var triangleVertices = [
        1.0, -1.0, 0.0,
        0.0, 1.0, 0.0,
        - 1.0, -1.0, 0.0];

    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);

    var triangleColors = [
        1.0, 0.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 1.0
    ]

    var colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleColors), gl.STATIC_DRAW);


    var vertexShader = getAndCompileShader("vertexShader");
    var fragmentshader = getAndCompileShader("fragmentShader");
    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentshader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not link shaders");
    }

    gl.useProgram(shaderProgram);

    var vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    var positionLocation = gl.getAttribLocation(shaderProgram, "position");
    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    //void gl.vertexAttribPointer(index, size, type, normalized, stride, offset);
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT,false, 0, 0);

    var colorLocation = gl.getAttribLocation(shaderProgram, "color");
    gl.enableVertexAttribArray(colorLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    //void gl.vertexAttribPointer(index, size, type, normalized, stride, offset);
    gl.vertexAttribPointer(colorLocation, 4, gl.FLOAT,false, 0, 0);



    requestAnimationFrame(runRenderLoop);


    function runRenderLoop()
    {
        gl.clearColor(1, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.useProgram(shaderProgram);
        gl.bindVertexArray(vao);
        gl.drawArrays(gl.TRIANGLES, 0, 3);

        requestAnimationFrame(runRenderLoop);
    }


}

function getAndCompileShader(id)
{
    var shader;
    var shaderElement = document.getElementById(id);
    var shaderText = shaderElement.text.trim();
    if (id == "vertexShader")
        shader = gl.createShader(gl.VERTEX_SHADER);
    else if (id == "fragmentShader")
        shader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(shader, shaderText);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }
    return shader;
}

