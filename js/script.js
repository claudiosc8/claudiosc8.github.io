let camera, scene, renderer, player, controls, targetPosition, model, cameraPosition, modelDistance;
let now, delta, last;
let clock;
let robot, mixer;

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
	camera.position.set(0,7,0);

 	cameraPosition = camera.position;

	// Ordbit controls
	// controls = new THREE.OrbitControls( camera, renderer.domElement );
	// controls.enableDamping = true; 
	// controls.dampingFactor = 0;
	// controls.screenSpacePanning = false;

	window.addEventListener( 'resize', onWindowResize, false );

	var light = new THREE.PointLight( 0xffffff, 1, 400 );
	light.position.set( 0, 20, 10 );
	light.castShadow = true;
	light.shadow.mapSize.width = 2048;  // default
	light.shadow.mapSize.height = 2048; // default
	scene.add( light );

	light = new THREE.AmbientLight( 0x888888);
	light.position.set( 0, 20, 0 );
	scene.add( light );

	var cubeGeometry = new THREE.BoxGeometry( 1, 1, 1 );
	var sphereGeometry = new THREE.SphereGeometry( 1, 6, 6 );
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
	plane.position.set(0,-0.02,0);
	player.position.set(10,2,-10);
	cube.position.set(-12,4,20);
	var helper = new THREE.GridHelper( 100, 20, 0xFF4444, 0x404040 );
	scene.add( helper );

	scene.add( cube );
	scene.add( player );
	scene.add( plane );
	targetPosition = new THREE.Vector3( );

	controls = new THREE.FirstPersonControls( player );


	function error ( error ) {console.error( error );}

	var loader = new THREE.GLTFLoader();

	loader.load( 'object/desk.glb', function ( gltf ) {

		gltf.scene.traverse( function( obj ) {
	        if ( obj instanceof THREE.Mesh ) {
	         obj.castShadow = true; 
	         obj.receiveShadow = true; 
	         obj.scale.set(12,12,12);
			obj.position.set(5,0.6,-15);
			}
	    } );

		scene.add( gltf.scene );

	}, undefined, error );

	var robotloader = new THREE.GLTFLoader();
				robotloader.load( "object/RobotExpressive.glb", function( gltf ) {

					robot = gltf.scene.children[ 0 ];
					run = gltf.animations[ 6 ];
					idle = gltf.animations[ 2 ];
					jump = gltf.animations[ 3 ];
					walk = gltf.animations[ 10 ];
					walkjump = gltf.animations[ 11 ];

					robot.traverse( function( obj ) {
	       				 if ( obj instanceof THREE.Mesh ) {
				        	obj.castShadow = true; 
				       	  	obj.receiveShadow = true;
				       	  	rotateObject(obj, 0, 0, 0); 
						}
					} );
					scene.add( robot );
					myfoo();
					

				} );

	function myfoo() {
					robot.scale.set( 1, 1, 1 );
					robot.position.set(-5, 0, -10 );

					targetPosition = robot.position;
					controls = new THREE.FirstPersonControls( robot );
        			controls.movementSpeed = 15;
        			controls.rotationSpeed = 5;

        			mixer = new THREE.AnimationMixer( robot );
        			mixer.clipAction( idle ).setDuration( 5).play();
					
	}

	var playerloader = new THREE.GLTFLoader();
	playerloader.load( 'object/astro.glb', function ( gltf ) {
		model = gltf.scene;
		model.traverse( function( obj ) {
	        if ( obj instanceof THREE.Mesh ) {
	        	obj.castShadow = true; 
	       	  	obj.receiveShadow = true;
	       	  	rotateObject(obj, 0, 180, 0); 
			}
	    } );

		scene.add( model );
		model.scale.set(1,1,1);
		model.position.set(0,0,-10);
		onModelLoad();
		

	}, undefined, error );


	function onModelLoad () {
		
		console.log("model loaded")
		
	}
	// model
	
		
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
	camera.lookAt(targetPosition);
	if(cameraPosition.distanceTo(targetPosition)>40) {
		console.log("too far!");
		controls.moveForward = false;
	}

	// if(controls.moveForward) {
	// 	mixer.clipAction( run ).setDuration( 1 ).play();
	// } else {
	// 	mixer.clipAction( run ).stop();
	// }
	render();
}

var prevTime = Date.now();

function render() {
	renderer.render( scene, camera );

	if ( mixer ) {
		var time = Date.now();
		mixer.update( ( time - prevTime ) * 0.001 );
		prevTime = time;
	}
}

init();
animate();