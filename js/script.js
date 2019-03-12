let camera, scene, renderer, player, controls, targetPosition, model, cameraPosition, modelDistance, sky, water, texture;
let now, delta, last;
let clock;
let robot, mixer
let raycaster, mouse, intersects, INTERSECTED, selectedObject;
let collisionObjects = [];
let thisChildren;
let run, walk, jump, idle, death, walkjump;
let collision_flag = false;
var mirrorSphere, mirrorSphereCamera, cubeCamera; // for mirror material

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
  	const createDesk = GLTFPromiseLoader.load( 'object/desk.glb').then( onLoad ).then( deskSetup ).catch( onError );
  	const createChest = GLTFPromiseLoader.load( 'object/chest.glb').then( onLoad ).then( chestSetup ).catch( onError );
  	const createStation = GLTFPromiseLoader.load( 'object/GasStation.glb').then( onLoad ).then( stationSetup ).catch( onError );
  }

	const RobotPlayer = () => {
		thisChildren.position.set(0,0,-20);
		targetPosition = thisChildren.position;
		controls = new THREE.FirstPersonControls( thisChildren );
		controls.movementSpeed = 15;
		controls.rotationSpeed = 5;
		mixer = new THREE.AnimationMixer( thisChildren );
		// mixer.clipAction( idle ).setDuration( 5).play();

	}  

	const deskSetup = () => {
	    thisChildren.scale.set(12,12,12);
		thisChildren.position.set(5,0.6,-15);
	} 

	const stationSetup = () => {

	    thisChildren.scale.set(6,6,6);
		thisChildren.position.set(5,-3.75,-15);
	} 


	const chestSetup = () => {
	    thisChildren.scale.set(2,2,2);
		thisChildren.position.set(-5,3,-15);
		thisChildren.rotateY(THREE.Math.degToRad(180))
	}

	const astroSetup = () => {
	    thisChildren.scale.set(1,1,1);
		thisChildren.position.set(-15,0,-15);

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
	scene = new THREE.Scene();
	controls = new THREE.FirstPersonControls( scene );

	// CAMERA SETUP
	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.set(0,7,0);
 	cameraPosition = camera.position;

	// // EVENT LISTENERS 
	// window.addEventListener( 'resize', onWindowResize, false );
	// window.addEventListener( 'click', onMouseClick, false );


	// var skyGeo = new THREE.SphereGeometry(10000, 25, 25); 
	// var textloader  = new THREE.TextureLoader(),
 //        texture = textloader.load( "images/hdri.jpg" );
 //    var material = new THREE.MeshPhongMaterial({ 
 //        map: texture, emissiveMap: texture, emissive: 0x4080ff
	// });
	// material.side = THREE.BackSide;
	// var sky = new THREE.Mesh(skyGeo, material);
 //    sky.material.side = THREE.BackSide;
 //    scene.add(sky);


		var reflectionCube = new THREE.CubeTextureLoader()
			.setPath( 'images/SwedishRoyalCastle/' )
			.load( [ 'px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg' ] );
		reflectionCube.format = THREE.RGBFormat;
		// scene.background = reflectionCube;


	//lights
		var light = new THREE.PointLight( 0xffffff, 1.5, 400 );
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

	//materials
		var mone = new THREE.MeshPhongMaterial( { color: 0x4080ff} );
		var mtwo = new THREE.MeshPhongMaterial( { color: 0xde2301, flatShading:false } );
		var mthree = new THREE.MeshPhongMaterial( { color: 0x22de09, reflectivity: 1, shininess: 2} );

		var toonMaterial = new THREE.MeshToonMaterial( {
								color: 0xffff00,
								reflectivity: 0.6,
								shininess: 1000,
								bumpMap: reflectionCube,
								envMap: reflectionCube

							} );

	var cube = new THREE.Mesh( cubeGeometry, mthree );
	var player = new THREE.Mesh( sphereGeometry, toonMaterial );
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
	cube.position.set(12,4,-20);
	var helper = new THREE.GridHelper( 100, 20, 0xFF4444, 0x404040 );
	// scene.add( helper );

	scene.add( cube );
	scene.add( player );
	scene.add( plane );

	TweenMax.to(cube.rotation,4,{y:Math.PI*2, ease:Power2.easeInOut,repeat:-1});
	TweenMax.to(cube.position,4,{y:2,ease:Power2.easeInOut,yoyo:true, repeat:-1});

	targetPosition = new THREE.Vector3( );

	//collision objects
	collisionObjects.push(scene);
	collisionScene = collisionObjects[0];
	collisionMesh = [];


     // postprocessing
    composer = new THREE.EffectComposer(renderer);

    var renderPass = new THREE.RenderPass(scene, camera);
    composer.addPass(renderPass);

    outlinePass = new THREE.OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera,);
    composer.addPass(outlinePass);
    // outlinePass.selectedObjects = [collisionScene];

    // for (var i = 0; i < collisionScene.children.length; i++ ) {
    // 	selectedObject = collisionScene.children[i];
    // 	collisionMesh.push(selectedObject);
    // 	if (collisionScene.children[i].isMesh) {
    	
    //     outlinePass.selectedObjects = [player];

   	// 	 }
    // }


    effectFXAA = new THREE.ShaderPass(THREE.FXAAShader);
    effectFXAA.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight);
    effectFXAA.renderToScreen = true;
    composer.addPass(effectFXAA);


	outlinePass.edgeGlow = 0.0;
	outlinePass.usePatternTexture = false;
	outlinePass.edgeThickness = 2.0;
	outlinePass.edgeStrength = 100.0;
	outlinePass.downSampleRatio = 0;
	outlinePass.pulsePeriod = 0;
	outlinePass.visibleEdgeColor = new THREE.Color(0xffffff);
	outlinePass.hiddenEdgeColor = new THREE.Color( 0, 0, 0 );
	outlinePass.depthMaterial.blending = THREE.MultiplyBlending;

    window.addEventListener('mousemove', onTouchMove);
    window.addEventListener('touchmove', onTouchMove);

    function onTouchMove(event) {
        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = -( event.clientY / window.innerHeight ) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        intersects = raycaster.intersectObjects(collisionObjects,true);

        if (intersects.length > 0) {
            var selectedObject = intersects[0].object;
            outlinePass.selectedObjects = [selectedObject];
        }
    }

}

function onMouseClick( event ) {
	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components

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
	requestAnimationFrame( animate );
	// controls.update();
	var delta = clock.getDelta();
	controls.update(delta);
	camera.lookAt(targetPosition);

	if(cameraPosition.distanceTo(targetPosition)>40) {
		console.log("too far!");
		// controls.moveForward = false;
		controls.movementSpeed = - controls.movementSpeed*1.1;
		collision_flag = true;
		

	} else {
		controls.movementSpeed = 15;
		collision_flag = false;
	}



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

function render() {


	if ( mixer ) {
		var time = Date.now();
		mixer.update( ( time - prevTime ) * 0.001 );
		prevTime = time;
	}

	//  // update the picking ray with the camera and mouse position
	// raycaster.setFromCamera( mouse, camera );


	// // calculate objects intersecting the picking ray
	// intersects = raycaster.intersectObjects( collisionObjects );
	
	// for ( var i = 0; i < intersects.length; i++ ) {

	// intersects[ i ].object.material.color.set( 0xff0000 );
	// intersects[ i ].object.material.emissive.set( 0xff0000 );
	// intersects[ i ].object.material.specular.set( 0xffffff );
	// intersects[ i ].object.material.shininess = 100;
	// intersects[ i ].object.material.flatShading = true;
	// intersects[ i ].object.material.needsUpdate = true;

	// }

	composer.render( scene, camera );

}


init();
load();
animate();