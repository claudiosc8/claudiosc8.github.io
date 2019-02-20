let camera, scene, renderer, player, controls;
let now, delta, last;
let clock;

function init() {
	clock = new THREE.Clock();

	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight ); 
	document.body.appendChild( renderer.domElement );
	renderer.shadowMap.enabled = true;  // enable Shadows
	renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
	renderer.gammaOutput = true;
	renderer.gammaFactor = 2.2;
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.set(0,3,50);
	// controls
	// controls = new THREE.OrbitControls( camera, renderer.domElement );
	// // controls.enableDamping = true; 
	// // controls.dampingFactor = 0;
	// controls.screenSpacePanning = false;
	window.addEventListener( 'resize', onWindowResize, false );




	var light = new THREE.DirectionalLight( 0xffffff );
	light.position.set( 0, 20, 10 );
	light.castShadow = true;
	scene.add( light );

	light = new THREE.AmbientLight( 0x888888);
	light.position.set( 0, 20, 0 );
	scene.add( light );

	var cubeGeometry = new THREE.BoxGeometry( 1, 1, 1 );
	var sphereGeometry = new THREE.SphereGeometry( 1, 12, 12 );
	var planegeometry = new THREE.PlaneGeometry( 100, 100, 100, 100);


	var mone = new THREE.MeshPhongMaterial( { color: 0x4080ff} );
	var mtwo = new THREE.MeshPhongMaterial( { color: 0xde2301, flatShading:true } );
	var mthree = new THREE.MeshPhongMaterial( { color: 0xff0009} );

	var cube = new THREE.Mesh( cubeGeometry, mthree );
	var player = new THREE.Mesh( sphereGeometry, mtwo );
	var plane = new THREE.Mesh( planegeometry, mone );

	plane.material.side = THREE.DoubleSide;
   

	player.castShadow = true; 
	player.receiveShadow = true; 
	cube.castShadow = true; 
	cube.receiveShadow = true; 

	plane.receiveShadow = true; 

	function rotateObject(object, degreeX=0, degreeY=0, degreeZ=0) {
	   object.rotateX(THREE.Math.degToRad(degreeX));
	   object.rotateY(THREE.Math.degToRad(degreeY));
	   object.rotateZ(THREE.Math.degToRad(degreeZ));
	}

	rotateObject(plane, 90, 0, 0);
	plane.position.set(0,0,0);
	player.position.set(0,4,0);
	cube.position.set(2,4,0);
	// var helper = new THREE.GridHelper( 1000, 200, 0xFF4444, 0x404040 );
	// scene.add( helper );

	scene.add( cube );
	scene.add( player );
	scene.add( plane );


	controls = new THREE.FirstPersonControls( player );

                controls.movementSpeed = 7;
                controls.lookSpeed = 0.1;
                controls.noFly = true;
                controls.lookVertical = false;
                // controls.mouseDragOn = false;
	// model


	function error ( error ) {console.error( error );}

	var loader = new THREE.GLTFLoader();

	loader.load( 'object/desk.glb', function ( gltf ) {

		gltf.scene.traverse( function( obj ) {
	        if ( obj instanceof THREE.Mesh ) {
	         obj.castShadow = true; 
	         obj.receiveShadow = true; 
	         obj.scale.set(12,12,12);
			obj.position.set(0,0.6,0);
			}
	    } );

		scene.add( gltf.scene );

	}, undefined, error );


	loader.load( 'object/astro.glb', function ( gltf ) {

		gltf.scene.traverse( function( obj ) {
	        if ( obj instanceof THREE.Mesh ) {
	        	obj.castShadow = true; 
	       	  	obj.receiveShadow = true; 
	       	  	obj.scale.set(1,1,1);
				obj.position.set(-2,0,0);
			}
	    } );

		scene.add( gltf.scene );

	}, undefined, error );


}


function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}
				
function animate() {
	requestAnimationFrame( animate );
	// controls.update();
	var delta = clock.getDelta();
	controls.update(delta);
	render();
}

function render() {
	renderer.render( scene, camera );
}

init();
animate();