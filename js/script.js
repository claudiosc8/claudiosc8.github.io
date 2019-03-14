let camera, scene, renderer, player, light, controls, targetPosition, model, cameraPosition, modelDistance, sky, water, texture, floortexture;
let now, delta, last;
let clock;
let robot, mixer
let raycaster, mouse, intersects, INTERSECTED, selectedObject;
let collisionObjects = [];
let highlightObjects = [];
let thisChildren;
let run, walk, jump, idle, death, walkjump;
let collision_flag = false;
var mirrorSphere, mirrorSphereCamera, cubeCamera; // for mirror material
var robotCharacter, robotHelper, collisionHelperForward, collisionHelperBackward;


var stats = new Stats();
stats.showPanel( 1 ); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( stats.dom );


// Here is the magic - this function takes any three.js loader and returns a promisifiedLoader
function promisifyLoader ( loader, onProgress ) {

  function promiseLoader ( url ) {

    return new Promise( ( resolve, reject ) => {

      loader.load( url, resolve, onProgress, reject );

    } );
  }

  return {
    originalLoader: loader,
    load: promiseLoader,
  };

}

const basicSetup = (myobject) => {
	// give shadow
	myobject.traverse( function( obj ) {
   				 if ( obj instanceof THREE.Mesh ) {
		        	obj.castShadow = true; 
		       	  	obj.receiveShadow = true;
		       	  	obj.material.side = THREE.FrontSide;
		       	  	}
			} );
}

	const characterLoaded = function( gltf ) {

			run = gltf.animations[ 6 ];
			death = gltf.animations[ 1 ];
			idle = gltf.animations[ 2 ];
			jump = gltf.animations[ 3 ];
			walk = gltf.animations[ 10 ];
			walkjump = gltf.animations[ 11 ];
			
		}


const onProgress = function( progress ) {
	console.log( ( progress.loaded / progress.total * 100 ) + '% loaded' );
		}


const GLTFPromiseLoader = promisifyLoader( new THREE.GLTFLoader(), onProgress );

function load() {
	const onLoad = (loadedObject) => {  
		scene.add( loadedObject.scene );
		thisChildren = scene.children[scene.children.length -1].children[0]
		basicSetup( thisChildren );
	  };
	const onError = ( ( err ) => { console.error( err ); } );


	new THREE.GLTFLoader().load( "object/RobotExpressive.glb", characterLoaded, onProgress, onError );


  	const createDuck = GLTFPromiseLoader.load( 'object/RobotExpressive.glb').then( onLoad ).then( RobotPlayer ).catch( onError );
  	const createastro = GLTFPromiseLoader.load( 'object/astro.glb').then( onLoad ).then( astroSetup ).catch( onError )
  	const createChest = GLTFPromiseLoader.load( 'object/chest.glb').then( onLoad ).then( chestSetup ).catch( onError );
  	const createCinema = GLTFPromiseLoader.load( 'object/cinema.glb').then( onLoad ).then( cinemaSetup ).catch( onError );
  	const createFountain = GLTFPromiseLoader.load( 'object/fountain.glb').then( onLoad ).then( fountainSetup ).catch( onError );
  	const createHouse = GLTFPromiseLoader.load( 'object/house.glb').then( onLoad ).then( houseSetup ).catch( onError );
  	const createTrees = GLTFPromiseLoader.load( 'object/trees.glb').then( onLoad ).then( treesSetup ).catch( onError );
  	const createDiamond = GLTFPromiseLoader.load( 'object/diamond.glb').then( onLoad ).then( diamondSetup ).catch( onError );
  }

	const RobotPlayer = () => {
		thisChildren.name = "robotCharacter";
		robotCharacter = scene.getObjectByName('robotCharacter');
		thisChildren.position.set(0,0,-20);
		targetPosition = thisChildren.position;
		controls = new THREE.FirstPersonControls( thisChildren );
		controls.movementSpeed = 15;
		controls.rotationSpeed = 5;
		mixer = new THREE.AnimationMixer( thisChildren );
		// mixer.clipAction( idle ).setDuration( 5).play();

	}  

	const stationSetup = () => {
	    thisChildren.scale.set(6,6,6);
		thisChildren.position.set(5,-3.75,-15);
		thisChildren.name = "station";
	} 

	const diamondSetup = () => {
	    thisChildren.scale.set(0.1,0.1,0.1);
		thisChildren.position.set(-10,2,-18);
		thisChildren.name = "diamond";
		collisionObjects.push(thisChildren);
		highlightObjects.push(thisChildren);
		thisChildren.material.opacity = 1;
		var color = new THREE.Color( 0x112233 );
		thisChildren.material.emissive.copy(color);
		TweenMax.to(thisChildren.rotation,8,{y:Math.PI*2,ease: Power0.easeNone,repeat:-1});
		//find min and max 
		var mybox = new THREE.Box3().setFromObject( thisChildren );
		console.log( "min", mybox.min.y, "max", mybox.max.y, "size");
	} 


	const cinemaSetup = () => {
	    thisChildren.scale.set(1,1,1);
	    thisChildren.name = "cinema";
		thisChildren.position.set(-5,0,-30);
		collisionObjects.push(thisChildren);
	}

	const treesSetup = () => {
	    thisChildren.scale.set(16,16,16);
	    thisChildren.name = "trees";
		thisChildren.position.set(-45,4,-20);
		collisionObjects.push(thisChildren);

		//
		
	}

	const fountainSetup = () => {
	    thisChildren.scale.set(7,7,7);
	    thisChildren.name = "fountain";
		thisChildren.position.set(-20,0,1);
		collisionObjects.push(thisChildren);
	}

	const houseSetup = () => {
	    thisChildren.scale.set(8,8,8);
	    thisChildren.name = "house";
		thisChildren.position.set(30,5.1,10);
		thisChildren.rotateY(THREE.Math.degToRad(180));
		collisionObjects.push(thisChildren);
	}

	const chestSetup = () => {
	    thisChildren.scale.set(2,2,2);
	    thisChildren.name = "chest";
		thisChildren.position.set(-5,3,-15);
		thisChildren.rotateY(THREE.Math.degToRad(180));
		collisionObjects.push(thisChildren);
	}

	const astroSetup = () => {
	    thisChildren.scale.set(1,1,1);
		thisChildren.position.set(-15,0,-15);
		collisionObjects.push(thisChildren);

	} 






function init() {


	// VARIABLES
	clock = new THREE.Clock();
	raycaster = new THREE.Raycaster();
	mouse = new THREE.Vector2();


	// BASIC SETUPS 
	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight ); 
	document.body.appendChild( renderer.domElement );
	renderer.shadowMap.enabled = true;  // enable Shadows
	renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
	renderer.gammaOutput = true;
	renderer.gammaFactor = 2.2;
	composer = new THREE.EffectComposer( renderer );
	scene = new THREE.Scene();
	controls = new THREE.FirstPersonControls( scene );
	fogColor = new THREE.Color(0xffffff);
    scene.background = fogColor;
    scene.fog = new THREE.Fog(fogColor, 20, 50);
    window.addEventListener( 'resize', onWindowResize, false );

	// CAMERA SETUP
	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.set(0,7,0);
 	cameraPosition = camera.position;



	var reflectionCube = new THREE.CubeTextureLoader()
		.setPath( 'images/SwedishRoyalCastle/' )
		.load( [ 'px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg' ] );
	reflectionCube.format = THREE.RGBFormat;
	// scene.background = reflectionCube;

	function rotateObject(object, degreeX=0, degreeY=0, degreeZ=0) {
  		 object.rotateX(THREE.Math.degToRad(degreeX));
 		  object.rotateY(THREE.Math.degToRad(degreeY));
  		 object.rotateZ(THREE.Math.degToRad(degreeZ));
	}

	//lights
		var light = new THREE.PointLight( 0xffffff, 1, 400 );
		light.position.set( 0, 20, 10 );
		light.castShadow = true;
		light.shadow.mapSize.width = 2048;  // default
		light.shadow.mapSize.height = 2048; // default
		scene.add( light );

		light = new THREE.AmbientLight( 0x888888);
		scene.add( light );


	//geometry
		var cubeGeometry = new THREE.BoxGeometry( 1, 1, 1 );
		var sphereGeometry = new THREE.SphereGeometry( 1, 16, 16 );
		var planegeometry = new THREE.PlaneGeometry( 100, 100, 100, 100);

		var robotHelperGeometry = new THREE.CylinderGeometry( 2,2,5,8,3 );
		var collisionHelperGeometry = new THREE.BoxGeometry( 1, 5, 2, 2,2,2);
		var collisionHelperGeometry2 = new THREE.BoxGeometry( 1, 5, 2, 2,2,2);

		var floortexture  = new THREE.TextureLoader().load( "images/StoneFloorTexture.jpg" );
		floortexture.wrapS = THREE.RepeatWrapping;
		floortexture.wrapT = THREE.RepeatWrapping;
		floortexture.repeat.set( 16, 16 );

	//materials
		var mone = new THREE.MeshPhongMaterial( { color: 0xffffff, map: floortexture,} );
		var mtwo = new THREE.MeshPhongMaterial( { color: 0xde2301, flatShading:false } );
		var mthree = new THREE.MeshPhongMaterial( { color: 0x22de09, reflectivity: 1, shininess: 2} );
		var robomatred = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true, transparent:true, opacity: 1} );
		var robomatyellow = new THREE.MeshBasicMaterial( { color: 0xffff00, wireframe: true, transparent:true, opacity: 1} );

		var toonMaterial = new THREE.MeshToonMaterial( {
								color: 0xffff00,
								reflectivity: 0.6,
								shininess: 1000,
								bumpMap: reflectionCube,
								envMap: reflectionCube

							} );

		var torusgeometry = new THREE.TorusGeometry( 50, 1, 3, 8 );
		var torus = new THREE.Mesh( torusgeometry, new THREE.MeshBasicMaterial( {transparent:true, opacity: 0} ) );
		torus.rotateX(THREE.Math.degToRad(90));
		torus.name = "torus";
		scene.add( torus );

	var cube = new THREE.Mesh( cubeGeometry, mthree );
	var player = new THREE.Mesh( sphereGeometry, toonMaterial );
	var plane = new THREE.Mesh( planegeometry, mone );

	collisionHelperForward = new THREE.Mesh( collisionHelperGeometry, robomatred );
	collisionHelperForward.name = "collisionHelperForward";
	collisionHelperForward.geometry.translate( 0, 2.5, 1 );

	collisionHelperBackward = new THREE.Mesh( collisionHelperGeometry2, robomatyellow );
	collisionHelperBackward.name = "collisionHelperBackward";
	collisionHelperBackward.geometry.translate( 0, 2.5, -1 );

	scene.add( collisionHelperBackward );
	scene.add( collisionHelperForward );

	plane.material.side = THREE.DoubleSide;
   	player.castShadow = true; 
	player.receiveShadow = true; 
	cube.castShadow = true; 
	cube.receiveShadow = true; 
	plane.receiveShadow = true; 

	

	rotateObject(plane, 90, 0, 0);
	plane.position.set(0,-0.02,0);
	player.position.set(10,2,-10);
	cube.position.set(12,4,-20);
	var helper = new THREE.GridHelper( 100, 20, 0xFF4444, 0x404040 );
	// scene.add( helper );

	scene.add( cube );
	scene.add( player );
	scene.add( plane );



	collisionObjects.push(cube, player, torus);

	TweenMax.to(cube.rotation,4,{y:Math.PI*2, ease:Power2.easeInOut,repeat:-1});
	TweenMax.to(cube.position,4,{y:2,ease:Power2.easeInOut,yoyo:true, repeat:-1});

	targetPosition = new THREE.Vector3( );


	scene.userData.outlineColor = new THREE.Color( 0x00FFFF );

	 outlineSelection() 
}

function outlineSelection() {
	highlightScene = highlightObjects[0];
	collisionMesh = [];
	composer.addPass( new THREE.RenderPass( scene, camera ) );
	createOutline( scene, highlightObjects, camera, scene.userData.outlineColor );
}

function createOutline( scene, objectsArray, camera, visibleColor ) {
	outlinePass = new THREE.OutlinePass( new THREE.Vector2( window.innerWidth, window.innerHeight ), scene, camera, objectsArray );
	outlinePass.edgeStrength = 1;
	outlinePass.edgeGlow = 2;
	outlinePass.edgeThickness = 1;
	outlinePass.visibleEdgeColor = visibleColor;
	outlinePass.hiddenEdgeColor.set( 0 );
	outlinePass.renderToScreen = true;
	outlinePass.pulsePeriod = 5;
	composer.addPass( outlinePass );
	scene.userData.outlineEnabled = true;
	
	return outlinePass;
}


function onMouseClick( event ) {

	event.preventDefault();
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	return
}

function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
   
}
				
function animate() {

	stats.begin();
	stats.end();

	requestAnimationFrame( animate );

	
	// controls.update();
	var delta = clock.getDelta();
	controls.update(delta);
	camera.lookAt(targetPosition);

	if(cameraPosition.distanceTo(targetPosition)>30) {
		TweenMax.to(camera,2,{fov:20});
		camera.updateProjectionMatrix ();

	} else {
		TweenMax.to(camera,2,{fov:45});
		camera.updateProjectionMatrix ();
	}

	render();
}

var prevTime = Date.now();


 function checkCollision() {

 		collisionHelperForward.position.copy(robotCharacter.position);
		collisionHelperForward.rotation.copy(robotCharacter.rotation);
		collisionHelperBackward.position.copy(robotCharacter.position);
		collisionHelperBackward.rotation.copy(robotCharacter.rotation);

		collisionHelperForward.material.opacity = 0;
		collisionHelperBackward.material.opacity = 0;

		controls.movementSpeed = 15;

        var backwardCollisionHelper = scene.getObjectByName('collisionHelperBackward');
        var forwardCollisionHelper = scene.getObjectByName('collisionHelperForward');
        var backwardOriginPoint = backwardCollisionHelper.position.clone();
        var forwardOriginPoint = forwardCollisionHelper.position.clone();
        for (var vertexIndex = 0; vertexIndex < forwardCollisionHelper.geometry.vertices.length; vertexIndex++) {
            var localVertex = forwardCollisionHelper.geometry.vertices[vertexIndex].clone();
            var globalVertex = localVertex.applyMatrix4(forwardCollisionHelper.matrix);
            var directionVector = globalVertex.sub(forwardCollisionHelper.position);
            var ray = new THREE.Raycaster(forwardOriginPoint, directionVector.clone().normalize());
            var collisionResults = ray.intersectObjects(collisionObjects);
            if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {
                console.log(collisionResults[0].object.name);
                collisionHelperForward.material.opacity = 1;
                if (controls.moveForward) {
                controls.movementSpeed = 0;
				collision_flag = true;
				}
				if (collisionResults[0].object.name === "chest") {
					console.log("treasure!")
				}
            }
        }
        for (var vertexIndex = 0; vertexIndex < backwardCollisionHelper.geometry.vertices.length; vertexIndex++) {
            var localVertex = backwardCollisionHelper.geometry.vertices[vertexIndex].clone();
            var globalVertex = localVertex.applyMatrix4(backwardCollisionHelper.matrix);
            var directionVector = globalVertex.sub(backwardCollisionHelper.position);
            var ray = new THREE.Raycaster(backwardOriginPoint, directionVector.clone().normalize());
            var collisionResults = ray.intersectObjects(collisionObjects);
            if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {
                console.log(collisionResults[0].object.name);
                collisionHelperBackward.material.opacity = 1;
                if (controls.moveBackward) {
                controls.movementSpeed = 0;
				collision_flag = true;
				}
            }
        }
    }


function render() {

	if ( mixer ) {
		var time = Date.now();
		mixer.update( ( time - prevTime ) * 0.001 );
		prevTime = time;
	}

	checkCollision()

	composer.render( scene, camera );

}





init();
load();
animate();