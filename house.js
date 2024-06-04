const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, .1, 1000);
const renderer = new THREE.WebGLRenderer();

const controls = {};
const player = {
	height: 3,
	turnSpeed: .05,
	speed: .5,
	jumpHeight: .2,
	gravity: .01,
	velocity: 0,

	playerJumps: false
};

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
scene.background = new THREE.Color("black");
document.body.appendChild(renderer.domElement);



// BrowserWindow->Renderer:ResizeRe-Render
window.addEventListener('resize', () => {
	let w = window.innerWidth,
		h = window.innerHeight;

	renderer.setSize(w, h);
	camera.aspect = w / h;
	camera.updateProjectionMatrix();
});

// Camera:Setup
camera.position.set(0, player.height, -45);
camera.lookAt(new THREE.Vector3(0, player.height, 0));


// Object:Plane
scene.background = new THREE.Color(0xc9c9c9);

// Polygons



meshFloor = new THREE.Mesh(

	new THREE.PlaneGeometry(150, 150, 10, 10),
	new THREE.MeshPhongMaterial({ color: 0xffffff, wireframe: false })

);

meshFloor.rotation.x -= Math.PI / 2;
meshFloor.receiveShadow = true;

scene.add(meshFloor);


wall = new THREE.Mesh(

	new THREE.PlaneGeometry(150, 150, 10, 10),
	new THREE.MeshPhongMaterial({ color: 0x66ffff, wireframe: false })


);

wall.receiveShadow = true;
wall.position.set(0, 0, -75);
scene.add(wall);

wall2 = new THREE.Mesh(

	new THREE.PlaneGeometry(150, 150, 10, 10),
	new THREE.MeshPhongMaterial({ color: 0x66ffff, wireframe: false })


);


wall2.receiveShadow = true;
wall2.position.set(-75, 0, 0);
wall2.rotation.y = Math.PI / 2;

scene.add(wall2);

wall3 = new THREE.Mesh(
	new THREE.PlaneGeometry(150, 150, 10, 10),
	new THREE.MeshPhongMaterial({ color: 0x66ffff, wireframe: false })
);

// Rotate the wall 90 degrees to the right
wall3.rotation.y = Math.PI;

// Set shadow properties for the wall
wall3.receiveShadow = true;
wall3.castShadow = true;

// Set the position of the wall
wall3.position.set(0, 0, 75);

// Add the wall to the scene
scene.add(wall3);




wall4 = new THREE.Mesh(
	new THREE.PlaneGeometry(150, 150, 10, 10),
	new THREE.MeshPhongMaterial({ color: 0x66ffff, wireframe: false })
);

// Rotate the wall 90 degrees to the left
wall4.rotation.y = -Math.PI / 2;

// Set shadow properties for the wall
wall4.receiveShadow = true;
wall4.castShadow = true;

// Set the position of the wall
wall4.position.set(75, 0, 0);

// Add the wall to the scene
scene.add(wall4);




// Object:Light:1
var light3 = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(light3);




var spotLight = new THREE.SpotLight(0xffffff, 0.3);
spotLight.position.set(10, 60, 10);
spotLight.castShadow = true;
spotLight.angle = 40;
spotLight.shadow.mapSize.width = 500;
spotLight.shadow.mapSize.height = 200;
spotLight.shadow.camera.near = .25;
spotLight.shadow.camera.far = 1000;
spotLight.shadow.camera.fov = 3;
scene.add(spotLight);


var sphereSize = 1
var spotLightHelper = new THREE.SpotLightHelper(spotLight, sphereSize);
scene.add(spotLightHelper);

// Controls:Listeners
document.addEventListener('keydown', ({ keyCode }) => { controls[keyCode] = true });
document.addEventListener('keyup', ({ keyCode }) => { controls[keyCode] = false });

// ...
function control() {
	// Controls:Engine 
	if (controls[87]) { // w
		camera.position.x -= Math.sin(camera.rotation.y) * player.speed;
		camera.position.z -= -Math.cos(camera.rotation.y) * player.speed;
	}
	if (controls[83]) { // s
		camera.position.x += Math.sin(camera.rotation.y) * player.speed;
		camera.position.z += -Math.cos(camera.rotation.y) * player.speed;
	}
	if (controls[65]) { // a
		camera.position.x += Math.sin(camera.rotation.y + Math.PI / 2) * player.speed;
		camera.position.z += -Math.cos(camera.rotation.y + Math.PI / 2) * player.speed;
	}
	if (controls[68]) { // d
		camera.position.x += Math.sin(camera.rotation.y - Math.PI / 2) * player.speed;
		camera.position.z += -Math.cos(camera.rotation.y - Math.PI / 2) * player.speed;
	}
	if (controls[37]) { // la
		camera.rotation.y -= player.turnSpeed;
	}
	if (controls[39]) { // ra
		camera.rotation.y += player.turnSpeed;
	}
	if (controls[32]) { // space
		if (player.jumps) return false;
		player.jumps = true;
		player.velocity = -player.jumpHeight;
	}
}

function MovementUpdate() {
	player.velocity += player.gravity;
	camera.position.y -= player.velocity;

	if (camera.position.y < player.height) {
		camera.position.y = player.height;
		player.jumps = false;
	}
}

function update() {
	control();
	MovementUpdate();

}

function render() {
	renderer.render(scene, camera);
}

function loop() {
	requestAnimationFrame(loop);
	update();
	render();
}



//Adding a Skydome
var geometry = new THREE.SphereGeometry(1000, 32, 32);
var texture = new THREE.TextureLoader().load('Sky.jpg');
var material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
var skydome = new THREE.Mesh(geometry, material);
scene.add(skydome);

loop();

//adding a house 
// Load the Collada file and add it to the scene
var loader = new THREE.ColladaLoader();
      loader.load("House.dae", function (collada) {
        var house = collada.scene;

        // Adjust the scale of the house model
        var scale = 10; // Set the scale to twice the original size
        house.scale.set(scale, scale, scale);
// move the model down
var offsetY = -6; // custom offset
house.position.y += offsetY;

var angleInDegrees = 90;
var angleInRadians = THREE.MathUtils.degToRad(angleInDegrees);
house.rotation.z = angleInRadians;

// traverse through the model's children and set the textures
collada.scene.traverse(function(child) {
    if (child instanceof THREE.Mesh) {
      // set the texture
      var texture = new THREE.TextureLoader().load('Wood_2.jpg');
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(1, 1);
      child.material.map = texture;

  }
});

scene.add(house);
});



var loader = new THREE.ColladaLoader();
      loader.load("indoor plant_02.dae", function (collada) {
        var plant = collada.scene;

        // Adjust the scale of the house model
        var scale = 2; // Set the scale to twice the original size
        plant.scale.set(scale, scale, scale);
// move the model down
var offsetY = 2; // custom offset
plant.position.y += offsetY;
plant.position.z = 8;
plant.position.x = -7;


var angleInDegrees = 90;
var angleInRadians = THREE.MathUtils.degToRad(angleInDegrees);
plant.rotation.z = angleInRadians;



// traverse through the model's children and set the textures


scene.add(plant);
});




// Create a table top
var tableTopGeometry = new THREE.BoxGeometry(10, 1, 6);



var texture = new THREE.TextureLoader().load('pov3.png');
var material = new THREE.MeshBasicMaterial({ map: texture});
var tabletexture = new THREE.Mesh(tableTopGeometry, material);
scene.add(tabletexture);
tabletexture.position.set(-2,6,-1);
// Create table legs
var legGeometry = new THREE.BoxGeometry(1, 10, 1);
var texture = new THREE.TextureLoader().load('POV.png');
var legMaterial = new THREE.MeshBasicMaterial({ map: texture});
var legtexture = new THREE.Mesh(legGeometry, material);





var leg1 = new THREE.Mesh(legGeometry, legMaterial);
var leg2 = new THREE.Mesh(legGeometry, legMaterial);
var leg3 = new THREE.Mesh(legGeometry, legMaterial);
var leg4 = new THREE.Mesh(legGeometry, legMaterial);

// Position table legs
leg1.position.set(2.4, 1, 1.2);
leg2.position.set(-6.4, 1, 1.2);
leg3.position.set(-6.4, 1, -3.2);
leg4.position.set(2.4, 1, -3.2);

// Add table top and legs to the scene

scene.add(leg1);
scene.add(leg2);
scene.add(leg3);
scene.add(leg4);


const lampGeometry = new THREE.CylinderGeometry(0.5, 0.5, 30, 32);
var texture = new THREE.TextureLoader().load('pov2.png');
var lampMaterial = new THREE.MeshBasicMaterial({ map: texture});
const lamp = new THREE.Mesh(lampGeometry, lampMaterial);
lamp.position.set(-30,1.2,-25);
scene.add(lamp);


var light1 = new THREE.PointLight("blue", .8);
light1.position.set(-30, 16 , -25);
light1.castShadow = true;
light1.shadow.camera.near = 2.5;
scene.add(light1);






// Set up the lightbulb
const lightbulbGeometry = new THREE.SphereGeometry(1, 32, 32);
const lightbulbMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
const lightbulb = new THREE.Mesh(lightbulbGeometry, lightbulbMaterial);
lightbulb.position.set(-30,17,-25);
scene.add(lightbulb);

// Add the lightbulb to the lamp




// Add the lamp to the scene



const _VS = `
varying vec3 v_Normal;
void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
	v_Normal = normal;
}
`;

const _FS = `
varying vec3 v_Normal;
void main() {
	gl_FragColor = vec4( v_Normal, 1.0 );
}
`;




const sphere1 = new THREE.Mesh(
	new THREE.SphereGeometry(2,32,32),
	new THREE.ShaderMaterial({
		uniforms: {},
		vertexShader: _VS,
		fragmentShader: _FS,
	})


);
sphere1.position.set(-2,10,-1);
scene.add(sphere1);





var floorTexture = new THREE.TextureLoader().load('grasslight-big.jpg');

// load the floor texture image
var material = new THREE.MeshBasicMaterial({ map: floorTexture });


// create the plane geometry
var planeGeometry = new THREE.PlaneGeometry(150, 150, 10, 10);




// create the mesh and add it to the scene
var floorMesh = new THREE.Mesh(planeGeometry, material);
floorMesh.rotation.x -= Math.PI / 2;
scene.add(floorMesh);


// Add lighting


const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);
// Render the scene
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();