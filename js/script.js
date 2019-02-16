let camera, scene, renderer;

function init() {
	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight ); 
	document.body.appendChild( renderer.domElement );
	renderer.shadowMap.enabled = true;  // enable Shadows
	renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.z = 25;
	// controls
	controls = new THREE.OrbitControls( camera, renderer.domElement );
	controls.enableDamping = true; 
	controls.dampingFactor = 0.25;
	window.addEventListener( 'resize', onWindowResize, false );
}


function sceneSetup() {
	//Create a PointLight and turn on shadows for the light
	var light = new THREE.PointLight( 0xffffff, 1, 100 );
	light.position.set( 0, 10, 5 );
	light.castShadow = true;            // default false
	scene.add( light );
	scene.add( new THREE.AmbientLight( 0xff0000 ));

	var cubeGeometry = new THREE.BoxGeometry( 1, 1, 1 ).translate(3,0,0);
	var sphereGeometry = new THREE.SphereGeometry( 2, 12, 12 );
	var planegeometry = new THREE.BoxGeometry( 50, 50 , 0.1 );


	var one = new THREE.MeshPhongMaterial( { color: 0x4080ff} );
	var two = new THREE.MeshPhongMaterial( { color: 0x4080ff, flatShading:true } );

	var cube = new THREE.Mesh( cubeGeometry, one );
	var sphere = new THREE.Mesh( sphereGeometry, two );
	var plane = new THREE.Mesh( planegeometry, one );


   

	sphere.castShadow = true; 
	sphere.receiveShadow = true; 
	cube.castShadow = true; 
	cube.receiveShadow = true; 
	plane.castShadow = true; 
	plane.receiveShadow = true; 

	function rotateObject(object, degreeX=0, degreeY=0, degreeZ=0) {
	   object.rotateX(THREE.Math.degToRad(degreeX));
	   object.rotateY(THREE.Math.degToRad(degreeY));
	   object.rotateZ(THREE.Math.degToRad(degreeZ));
	}

	rotateObject(plane, 0, 0, 0);
	plane.position.set(0,-2,-3);

	scene.add( cube );
	scene.add( sphere );
	scene.add( plane );

		var mtlLoader = new THREE.MTLLoader();
		mtlLoader.setTexturePath('object/');
		mtlLoader.setPath('object/');
		mtlLoader.load('Desk.mtl', function (materials) {
		 
		    materials.preload();
		 
		    var objLoader = new THREE.OBJLoader();
		    objLoader.setMaterials(materials);
		    objLoader.setPath('object/');
		    objLoader.load('Desk.obj', function (myobject) {
		 
		        scene.add(myobject);
		        myobject.position.y = 2;
		 
		    });
		 
		});

	function animateElem() {
	cube.rotation.x += 0.01;
	sphere.rotation.y += 0.01;
	}

	animateElem();

}

function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {
	requestAnimationFrame( animate );
	controls.update();
	renderer.render( scene, camera );
}

init();
sceneSetup();
animate();



