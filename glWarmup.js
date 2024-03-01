// Project 1: glWarmup

// Create three.js scene, camera, renderer objects, attach renderer to HTML DOM
var scene = new THREE.Scene();
var aspect = window.innerWidth / window.innerHeight;
var camera = new THREE.PerspectiveCamera( 45, aspect, 0.1, 1000 );
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor(new THREE.Color(0.3, 0.3, 0.3));
document.body.appendChild(renderer.domElement);

// Create shading material and a point light
var material = new THREE.MeshStandardMaterial( {color: new THREE.Color(1, 0.3, 0.1), side: THREE.DoubleSide} );

var light1 = new THREE.PointLight( new THREE.Color(1, 1, 1), 2, 50 );
light1.position.set(-5, 10, 5);

scene.add(light1);
camera.position.z = 5;

// Array to store list of shapes
var shapes = [];

// Creates a single triangle object
var triangle_geometry = new THREE.Geometry();
var v1 = new THREE.Vector3(0.0, 1.5, 0.0);
var v2 = new THREE.Vector3(-1.0, 0.5, 0.0);
var v3 = new THREE.Vector3(1.0, -0.5, 0.0);

triangle_geometry.vertices.push(v1);
triangle_geometry.vertices.push(v2);
triangle_geometry.vertices.push(v3);

triangle_geometry.faces.push(new THREE.Face3(0, 1, 2));
triangle_geometry.computeFaceNormals();

var triangle = new THREE.Mesh(triangle_geometry, material);
shapes.push(triangle); // add the triangle to list of shapes

// Create a torus mesh
var torus_geometry = new THREE.TorusBufferGeometry(1, 0.4, 16, 100);
var torus = new THREE.Mesh(torus_geometry, material);
shapes.push(torus);

// Create a Sphere mesh
var sphere_geometry = new THREE.SphereBufferGeometry(1, 64, 64);
var sphere = new THREE.Mesh(sphere_geometry, material);
shapes.push(sphere);

// Create an Icosahedron mesh
var icosahedron_geometry = new THREE.IcosahedronBufferGeometry();
var icosahedron = new THREE.Mesh(icosahedron_geometry, material);
shapes.push(icosahedron);

// Creates a Teapot mesh
var teapot_geometry = new THREE.TeapotBufferGeometry(1);
var teapot = new THREE.Mesh(teapot_geometry, material);
shapes.push(teapot);

// added: Creates a Box Mesh
var box_geometry = new THREE.BoxGeometry(1, 1, 1);
var box = new THREE.Mesh(box_geometry, material);
shapes.push(box);

// added: Creates a Cone Mesh
var cone_geometry = new THREE.ConeGeometry(1, 1, 32);
var cone = new THREE.Mesh(cone_geometry, material);
shapes.push(cone);

// Set the initial shape
var currentShape = triangle;
var currentShapeId = 0;
scene.add(currentShape);

// Transformation parameters
var tx = 0.0; // translation in x
var ty = 0.0; // translation in y
var scale = 1.0; // scaling factor
var angleV = 0.0; // vertical rotation
var angleH = 0.0; // horizontal rotation
var isWireframe = false;

// Mouse variables
var mouse = new THREE.Vector2();
var norm_mouse = new THREE.Vector2();
var prevMouse = new THREE.Vector2();
var mousePressed = false;
var mouseClicked = false;
var mouseButton = 0;
var clickedOnShape = false;

var raycaster = new THREE.Raycaster();

// Mouse move callback function
function onMouseMove(event) { 
    // stores previous mouse position
    prevMouse.x = mouse.x
    prevMouse.y = mouse.y

    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    norm_mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    norm_mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    // calculate mouse position in screen coordinates
    mouse.x = event.clientX;
    mouse.y = event.clientY;
}

// Key Press callback function
function onKeyPress(event) { 
    if (event.key == ' ') { // cycle through shapes if space key is pressed
        scene.remove(currentShape);
        currentShapeId = (currentShapeId + 1) % shapes.length;
        currentShape = shapes[currentShapeId];
        scene.add(currentShape); // remove previous shape and add next shape to scene 
    }

    if (event.key == 'w') { // toggle wireframe if w key is pressed
        isWireframe = !isWireframe;
    }
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    // rotate the shape in x, y, z axes respectively
    currentShape.rotation.setFromVector3(new THREE.Vector3(angleV, angleH, 0.0)); // edited the y axis to change with angleH
    // uniform scaling
    currentShape.scale.set(scale, scale, scale);
    currentShape.material.wireframe = isWireframe;

    /* Written Question: read the code below in lines 131 to 137 and answer:
     * How does the program determine whether the mouse pointer is on the shape or not?
     * You must explain the mechanism/logic of the detection, NOT merely describing/repeating the code.
     * Answer: The code checks if a ray from the camera through the mouse pointer intersects with any objects in the scene.
     * If an intersection occurs, the mouse pointer is on a shape; if not, it’s not on a shape.
     */
    if (mouseClicked) {
        raycaster.setFromCamera(norm_mouse, camera);
        var intersects = raycaster.intersectObjects(scene.children);
        if (intersects.length > 0) {
            clickedOnShape = true;
        } else {
            clickedOnShape = false;
        }

        //Set click to false so we don't detect a click in next iteration
        mouseClicked = false;
    }
    if (clickedOnShape && mouseButton == 0) { // updates vertical and horizontal angle at the same time with the same button
        // update vertical rotation angle
        var dy = mouse.y - prevMouse.y;
        angleV += dy*0.01;

        // added: update horizontal rotation angle
        var dx = mouse.x - prevMouse.x;
        angleH += dx*0.01;
    }

    if (clickedOnShape && mouseButton == 2)	{ // update scaling
        var dy = mouse.y - prevMouse.y;
        scale -= dy*0.01;
    }

    if (clickedOnShape && mouseButton == 1) { // update translation
        var dy = mouse.y - prevMouse.y;
        var dx = mouse.x - prevMouse.x;
        currentShape.position.x += dx*0.01;
        currentShape.position.y -= dy*0.01;
    }

    renderer.render(scene, camera);
}

animate();

// Hook up callback functions to window
window.addEventListener( 'mousemove', onMouseMove, false );
window.addEventListener( 'mousedown', 
    function (event) { 
        if (!mousePressed){
            mouseClicked = true;
        }
        mousePressed = true; 
        mouseButton = event.button;
    }, 
    false );
window.addEventListener( 'mouseup',
function (event) { 
    clickedOnShape = false; 
    mouseClicked = false; 
    mousePressed = false; 
}, false );
window.addEventListener('keypress', onKeyPress, false);

