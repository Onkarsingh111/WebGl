
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Normal;\n' +
  'uniform mat4 u_MvpMatrix;\n' +
  'uniform mat4 u_NormalMatrix;\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_Position = u_MvpMatrix * a_Position;\n' +
  // Shading calculation to make the arm look three-dimensional
  '  vec3 lightDirection = normalize(vec3(0.0, 0.5, 0.7));\n' + // Light direction
  '  vec4 color = vec4(0.631, 0.631, 0.631, 1.0);\n' +
  '  vec3 normal = normalize((u_NormalMatrix * a_Normal).xyz);\n' +
  '  float nDotL = max(dot(normal, lightDirection), 0.0);\n' +
  '  v_Color = vec4(color.rgb * nDotL + vec3(0.1), color.a);\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +
    'varying vec4 v_Color;\n' +
    'uniform vec3 U_AmbientLight;\n' + // Ambient light color'
  'void main() {\n' +
  '  gl_FragColor = vec4(v_Color.rgb + U_AmbientLight, v_Color.a);\n' +
  '}\n';

function main() {
    // Retrieve <canvas> element
    var canvas = document.getElementById('webgl');

    // Get the rendering context for WebGL
    var gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to initialize shaders.');
        return;
    }

    // Set the vertex information
    var n = initVertexBuffers(gl);
    if (n < 0) {
        console.log('Failed to set the vertex information');
        return;
    }

    // Set the clear color and enable the depth test
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.enable(gl.DEPTH_TEST);

    // Get the storage locations of uniform variables
    var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
    var u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
    var u_AmbientLight = gl.getUniformLocation(gl.program, 'U_AmbientLight');
    if (!u_MvpMatrix || !u_NormalMatrix || !u_AmbientLight) {
        console.log('Failed to get the storage location');
        return;
    }

    // Set ambient light color
    var ambientLight = new Float32Array([0.1,0.1,1.0]); // Dim light (R, G, B)
    gl.uniform3fv(u_AmbientLight, ambientLight);

    // Calculate the view projection matrix
    var viewProjMatrix = new Matrix4();
    viewProjMatrix.setPerspective(40.0, canvas.width / canvas.height, 2.0, 500.0);
    viewProjMatrix.lookAt(-100.0, 0.0, 100.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);

    // Register the event handler to be called when keys are pressed
    document.onkeydown = function (ev) { keydown(ev, gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); };

    draw(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix);
}


var ANGLE_STEP = 3.0;  
var g_arm1Angle = 0.0; 
var g_Arm1Angle = 0;
var g_arm2Angle = 0;
var g_Arm2Angle = 0;
var g_arm3Angle = 0;
var g_Arm3Angle = 0;
var g_arm4Angle = 0;
var g_Arm4Angle = 0;
var g_thumbAngle = 0;
var g_ThumbAngle = 0;
var g_wholeAngle = 0; 
function keydown(ev, gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix) {
    switch (ev.keyCode) {
        case 39: // The right arrow key was pressed
            g_wholeAngle += ANGLE_STEP;
            break;
        case 37: // The left arrow key was pressed
            g_wholeAngle -= ANGLE_STEP;
            break;
        //Arm 1 (1,2,q,w))
        case 49: 
            if (g_arm1Angle < 0.0) g_arm1Angle += ANGLE_STEP; 
            break;
        case 81: 
            if (g_arm1Angle > -75.0) g_arm1Angle -= ANGLE_STEP;
            break;
        case 50: 
            if (g_Arm1Angle < 5.0) g_Arm1Angle += ANGLE_STEP;  
            break;
        case 87: 
            if (g_Arm1Angle > -60.0) g_Arm1Angle -= ANGLE_STEP; 
            break;

        //Arm 2 ( 3,4,e,r)
        case 51: 
            if (g_arm2Angle < 0.0) g_arm2Angle += ANGLE_STEP; 
            break;
        case 69: 
            if (g_arm2Angle > -75.0) g_arm2Angle -= ANGLE_STEP; 
            break;
        
        case 52:  
            if (g_Arm2Angle < 5.0) g_Arm2Angle += ANGLE_STEP;  
            break;
        case 82:  
            if (g_Arm2Angle > -60.0) g_Arm2Angle -= ANGLE_STEP; 
            break;
        //Arm 3 (5,6,t,y)
        case 53: 
            if (g_arm3Angle < 0.0) g_arm3Angle += ANGLE_STEP;
            break;
        case 84:
            if (g_arm3Angle > -75.0) g_arm3Angle -= ANGLE_STEP; 
            break;

        case 54:  
            if (g_Arm3Angle < 5.0) g_Arm3Angle += ANGLE_STEP; 
            break;
        case 89:  
            if (g_Arm3Angle > -60.0) g_Arm3Angle -= ANGLE_STEP; 
            break;

        //Arm 4 (7,8,u,i)
        case 55: 
            if (g_arm4Angle < 0.0) g_arm4Angle += ANGLE_STEP;
            break;
        case 85: 
            if (g_arm4Angle > -75.0) g_arm4Angle -= ANGLE_STEP; 
            break;

        case 56: 
            if (g_Arm4Angle < 5.0) g_Arm4Angle += ANGLE_STEP;  
            break;
        case 73:  
            if (g_Arm4Angle > -60.0) g_Arm4Angle -= ANGLE_STEP;
            break;

        //Thumb (9,0,o,p)
        case 57: 
            if (g_thumbAngle < 0.0) g_thumbAngle += ANGLE_STEP; 
            break;
        case 79: 
            if (g_thumbAngle > -75.0) g_thumbAngle -= ANGLE_STEP;
            break;

        case 48:  
            if (g_ThumbAngle < 5.0) g_ThumbAngle += ANGLE_STEP;  
            break;
        case 80:  
            if (g_ThumbAngle > -60.0) g_ThumbAngle -= ANGLE_STEP; 
            break;
        //Special
        case 32:
            g_ThumbAngle = 0;
            g_thumbAngle = 0;
            g_Arm1Angle = -60;
            g_Arm2Angle = -60;
            g_Arm3Angle = 0;
            g_Arm4Angle = -60;
            g_arm1Angle = -60;
            g_arm2Angle = -60;
            g_arm3Angle = 0;
            g_arm4Angle = -60;
            break;
           
     
        case 90:
            g_ThumbAngle = -60;
            g_thumbAngle = 0;
            g_Arm1Angle = -60;
            g_Arm2Angle = -60;
            g_Arm3Angle = -60;
            g_Arm4Angle = 0;
            g_arm1Angle = -60;
            g_arm2Angle = -60;
            g_arm3Angle = -60;
            g_arm4Angle = 0;
            break;
        case 88:
            g_ThumbAngle = -60;
            g_thumbAngle = 0;
            g_Arm1Angle = -60;
            g_Arm2Angle = -60;
            g_Arm3Angle = 0;
            g_Arm4Angle = 0;
            g_arm1Angle = -60;
            g_arm2Angle = -60;
            g_arm3Angle = 0;
            g_arm4Angle = 0;
            break;
        case 67:
            g_ThumbAngle = -60;
            g_thumbAngle = 0;
            g_Arm1Angle = -60;
            g_Arm2Angle = 0;
            g_Arm3Angle = 0;
            g_Arm4Angle = 0;
            g_arm1Angle = -60;
            g_arm2Angle = 0;
            g_arm3Angle = 0;
            g_arm4Angle = 0;
            break;
        case 86:
            g_ThumbAngle = -60;
            g_thumbAngle = 0;
            g_Arm1Angle = 0;
            g_Arm2Angle = 0;
            g_Arm3Angle = 0;
            g_Arm4Angle = 0;
            g_arm1Angle = 0;
            g_arm2Angle = 0;
            g_arm3Angle = 0;
            g_arm4Angle = 0;
            break;
        case 78:
            g_ThumbAngle = 0;
            g_thumbAngle = 0;
            g_Arm1Angle = 0;
            g_Arm2Angle = 0;
            g_Arm3Angle = 0;
            g_Arm4Angle = 0;
            g_arm1Angle = 0;
            g_arm2Angle = 0;
            g_arm3Angle = 0;
            g_arm4Angle = 0;
            break;
        
            


      //---------------------------------------
    
    default: return; // Skip drawing at no effective action
  }
  // Draw the robot arm
  draw(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix);
}

function initVertexBuffers(gl) {
  // Vertex coordinates（a cuboid 3.0 in width, 10.0 in height, and 3.0 in length with its origin at the center of its bottom)
  var vertices = new Float32Array([
    1.5, 10.0, 1.5, -1.5, 10.0, 1.5, -1.5,  0.0, 1.5,  1.5,  0.0, 1.5, // v0-v1-v2-v3 front
    1.5, 10.0, 1.5,  1.5,  0.0, 1.5,  1.5,  0.0,-1.5,  1.5, 10.0,-1.5, // v0-v3-v4-v5 right
    1.5, 10.0, 1.5,  1.5, 10.0,-1.5, -1.5, 10.0,-1.5, -1.5, 10.0, 1.5, // v0-v5-v6-v1 up
   -1.5, 10.0, 1.5, -1.5, 10.0,-1.5, -1.5,  0.0,-1.5, -1.5,  0.0, 1.5, // v1-v6-v7-v2 left
   -1.5,  0.0,-1.5,  1.5,  0.0,-1.5,  1.5,  0.0, 1.5, -1.5,  0.0, 1.5, // v7-v4-v3-v2 down
      1.5, 0.0, -1.5, -1.5, 0.0, -1.5, -1.5, 10.0, -1.5, 1.5, 10.0, -1.5  // v4-v7-v6-v5 back


  ]);

  // Normal
  var normals = new Float32Array([
    0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0, // v0-v1-v2-v3 front
    1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0, // v0-v3-v4-v5 right
    0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0, // v0-v5-v6-v1 up
   -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, // v1-v6-v7-v2 left
    0.0,-1.0, 0.0,  0.0,-1.0, 0.0,  0.0,-1.0, 0.0,  0.0,-1.0, 0.0, // v7-v4-v3-v2 down
    0.0, 0.0,-1.0,  0.0, 0.0,-1.0,  0.0, 0.0,-1.0,  0.0, 0.0,-1.0  // v4-v7-v6-v5 back
  ]);

  // Indices of the vertices
  var indices = new Uint8Array([
     0, 1, 2,   0, 2, 3,    // front
     4, 5, 6,   4, 6, 7,    // right
     8, 9,10,   8,10,11,    // up
    12,13,14,  12,14,15,    // left
    16,17,18,  16,18,19,    // down
    20,21,22,  20,22,23     // back
  ]);

  // Write the vertex property to buffers (coordinates and normals)
  if (!initArrayBuffer(gl, 'a_Position', vertices, gl.FLOAT, 3)) return -1;
  if (!initArrayBuffer(gl, 'a_Normal', normals, gl.FLOAT, 3)) return -1;

  // Unbind the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  // Write the indices to the buffer object
  var indexBuffer = gl.createBuffer();
  if (!indexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  return indices.length;
}

function initArrayBuffer(gl, attribute, data, type, num) {
  // Create a buffer object
  var buffer = gl.createBuffer();
  if (!buffer) {
    console.log('Failed to create the buffer object');
    return false;
  }
  // Write date into the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

  // Assign the buffer object to the attribute variable
  var a_attribute = gl.getAttribLocation(gl.program, attribute);
  if (a_attribute < 0) {
    console.log('Failed to get the storage location of ' + attribute);
    return false;
  }
  gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
  // Enable the assignment of the buffer object to the attribute variable
  gl.enableVertexAttribArray(a_attribute);

  return true;
}

// Coordinate transformation matrix
var g_modelMatrix = new Matrix4(), g_mvpMatrix = new Matrix4();

function draw(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix) {
    // Clear color and depth buffer
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Create a base model matrix for the entire robot arm
    var baseModelMatrix = new Matrix4();
    baseModelMatrix.setTranslate(0.0, 0.0, 0.0); // You can adjust the translation if needed
    baseModelMatrix.rotate(g_wholeAngle, 0.0, 1.0, 0.0); // Rotate the entire model around the y-axis

    // Arm 1
    var arm1Length = 8.0; // Length of arm1
    g_modelMatrix.set(baseModelMatrix); // Start with the base model matrix
    g_modelMatrix.translate(-5.0, -14.0, 0.0);
    g_modelMatrix.rotate(g_arm1Angle, -1.0, 0.0, 0.0)// Translate arm1 to the left
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw arm1

    g_modelMatrix.translate(0.0, arm1Length, 0.0); // Move to joint1 position
    g_modelMatrix.rotate(g_Arm1Angle, -1.0, 0.0, 0.0); // Rotate around the z-axis for joint1
    g_modelMatrix.scale(1.3, 1.0, 1.3); // Make it a little thicker for the joint
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw joint1

    g_modelMatrix.translate(0.0, arm1Length, 0.0); // Move to joint1 position
    g_modelMatrix.rotate(g_Arm1Angle, -1.0, 0.0, 0.0); // Rotate around the z-axis for joint1
    g_modelMatrix.scale(1, 0.7, 1.0); // Make it a little thicker for the joint
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw joint1

    // Arm 2
    g_modelMatrix.set(baseModelMatrix); // Reset to the base model matrix
    g_modelMatrix.translate(0.0, -12.0, 0.0);
    g_modelMatrix.rotate(g_arm2Angle, -1.0, 0.0, 0.0);// Translate arm2 to the right
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw arm2

    g_modelMatrix.translate(0.0, arm1Length, 0.0); // Move to joint2 position
    g_modelMatrix.rotate(g_Arm2Angle, -1.0, 0.0, 0.0);; // Rotate around the z-axis for joint2
    g_modelMatrix.scale(1.3, 1.0, 1.3); // Make it a little thicker for the joint
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw joint2

    g_modelMatrix.translate(0.0, arm1Length, 0.0); // Move to joint2 position
    g_modelMatrix.rotate(g_Arm2Angle, -1.0, 0.0, 0.0); // Rotate around the z-axis for joint2
    g_modelMatrix.scale(1,1,1); // Make it a little thicker for the joint
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw joint2

    // Arm 3
    g_modelMatrix.set(baseModelMatrix); // Reset to the base model matrix
    g_modelMatrix.translate(5.0, -12.0, 0.0);
    g_modelMatrix.rotate(g_arm3Angle, -1.0, 0.0, 0.0);// Translate arm3 to the right
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw arm3

    g_modelMatrix.translate(0.0, arm1Length, 0.0); // Move to joint3 position
    g_modelMatrix.rotate(g_Arm3Angle, -1.0, 0.0, 0.0); // Rotate around the z-axis for joint3
    g_modelMatrix.scale(1.3, 1.3, 1.3); // Make it a little thicker for the joint
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw joint3

    g_modelMatrix.translate(0.0, arm1Length, 0.0); // Move to joint3 position
    g_modelMatrix.rotate(g_Arm3Angle, -1.0, 0.0, 0.0); // Rotate around the z-axis for joint3
    g_modelMatrix.scale(1,1,1); // Make it a little thicker for the joint
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw joint3

    // Arm 4
    g_modelMatrix.set(baseModelMatrix); // Reset to the base model matrix
    g_modelMatrix.translate(10.0, -12.0, 0.0);
    g_modelMatrix.rotate(g_arm4Angle, -1.0, 0.0, 0.0);// Translate arm4 to the right
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw arm4

    g_modelMatrix.translate(0.0, arm1Length, 0.0); // Move to joint4 position
    g_modelMatrix.rotate(g_Arm4Angle, -1.0, 0.0, 0.0); // Rotate around the z-axis for joint4
    g_modelMatrix.scale(1.3, 1.0, 1.3); // Make it a little thicker for the joint
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw joint4

    g_modelMatrix.translate(0.0, arm1Length, 0.0); // Move to joint4 position
    g_modelMatrix.rotate(g_Arm4Angle, -1.0, 0.0, 0.0); // Rotate around the z-axis for joint4
    g_modelMatrix.scale(1,1,1); // Make it a little thicker for the joint
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw joint4

    // Thumb
    g_modelMatrix.set(baseModelMatrix); // Reset to the base model matrix
    g_modelMatrix.translate(15.0, -32.0, 10.0);
    g_modelMatrix.rotate(g_thumbAngle, -1.0, 0.0, 0.0);// Translate thumb position

    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw thumb

    g_modelMatrix.translate(0.0, arm1Length, 0.0); // Move to thumb joint position
    g_modelMatrix.rotate(g_ThumbAngle, 0.5, 0.0, -1.0); // Rotate around the z-axis for thumb joint
    g_modelMatrix.scale(1.0, 1.0, 1.0); // Scale for thumb joint
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw thumb joint

    // Palm
    g_modelMatrix.set(baseModelMatrix); // Reset to the base model matrix
    g_modelMatrix.translate(3.5, -42.0, 0.0); // Position of the palm
    g_modelMatrix.scale(7.0, 3.0, 2.0); // Make it a wide and thin box
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw palm
    // JavaScript source code
 
}


var g_normalMatrix = new Matrix4(); // Coordinate transformation matrix for normals

// Draw the cube
function drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix) {
  // Calculate the model view project matrix and pass it to u_MvpMatrix
  g_mvpMatrix.set(viewProjMatrix);
  g_mvpMatrix.multiply(g_modelMatrix);
  gl.uniformMatrix4fv(u_MvpMatrix, false, g_mvpMatrix.elements);
  // Calculate the normal transformation matrix and pass it to u_NormalMatrix
  g_normalMatrix.setInverseOf(g_modelMatrix);
  g_normalMatrix.transpose();
  gl.uniformMatrix4fv(u_NormalMatrix, false, g_normalMatrix.elements);
  // Draw
  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
}
function drawFinger(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, fingerAngle, translation) {
    // Set the model matrix for the finger
    var fingerMatrix = new Matrix4();
    fingerMatrix.setTranslate(translation[0], translation[1], translation[2]);
    fingerMatrix.rotate(fingerAngle, 0, 1, 0); // Rotate finger around the y-axis

    // Set the model-view-projection matrix
    var mvpMatrix = new Matrix4(viewProjMatrix);
    mvpMatrix.multiply(fingerMatrix);

    // Set normal matrix
    var normalMatrix = new Matrix4();
    normalMatrix.setInverseOf(fingerMatrix);
    normalMatrix.transpose();

    // Draw the finger (using the same cube for simplicity)
    drawCube(gl, n, u_MvpMatrix, mvpMatrix, u_NormalMatrix, normalMatrix);
}

function drawCube(gl, n, u_MvpMatrix, mvpMatrix, u_NormalMatrix, normalMatrix) {
    // Code to draw a simple cube (finger)
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
    gl.drawArrays(gl.TRIANGLES, 0, n);  // Draw cube (simple finger)
}

