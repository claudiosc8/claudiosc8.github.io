var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

//controls
var controls = new THREE.OrbitControls( camera );

//controls.update() must be called after any manual changes to the camera's transform
camera.position.set( 0, 20, 100 );
controls.update();

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

scene.add( new THREE.AmbientLight( 0x666666 ) );
				var light = new THREE.DirectionalLight( 0xdfebff, 1 );
				light.position.set( 3, 3, 2 );
				light.position.multiplyScalar( 1.3 );
				light.castShadow = true;
				light.shadow.mapSize.width = 1024;
				light.shadow.mapSize.height = 1024;
				var d = 300;
				light.shadow.camera.left = - d;
				light.shadow.camera.right = d;
				light.shadow.camera.top = d;
				light.shadow.camera.bottom = - d;
				light.shadow.camera.far = 1000;
	

var cubemesh = new THREE.BoxGeometry( 1, 1, 1 ).translate(3,0,0);
var sphere = new THREE.SphereGeometry( 2, 12, 12 );
var planegeometry = new THREE.BoxGeometry( 50, 50 , 0.1 );
cubemesh.receiveShadow = true;
sphere.receiveShadow = true;
cubemesh.castShadow = true;
sphere.castShadow = true;
var green = new THREE.MeshPhongMaterial( { color: 0x4080ff, dithering: true } );
var red = new THREE.MeshPhongMaterial( { color: 0x4080ff, dithering: false, flatShading:true } );
var cube = new THREE.Mesh( cubemesh, green );
var sphere = new THREE.Mesh( sphere, red );
var plane = new THREE.Mesh( planegeometry, red );

plane.receiveShadow = true;


function rotateObject(object, degreeX=0, degreeY=0, degreeZ=0) {
   object.rotateX(THREE.Math.degToRad(degreeX));
   object.rotateY(THREE.Math.degToRad(degreeY));
   object.rotateZ(THREE.Math.degToRad(degreeZ));
}

// usage:
rotateObject(plane, 0, 0, 0);
plane.position.set(0,-2,-10);

scene.add( cube );
scene.add( sphere );
scene.add( plane );
scene.add( light );

camera.position.z = 5;


function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
  cube.rotation.x += 0.01;
sphere.rotation.y += 0.01;

	// required if controls.enableDamping or controls.autoRotate are set to true
	controls.update();

  
}
animate();




// BEGIN Clara.io JSON loader code
var objectLoader = new THREE.ObjectLoader();
objectLoader.load("js/jscene.json", function ( obj ) {
scene.add( obj );
} );
// END Clara.io JSON loader code