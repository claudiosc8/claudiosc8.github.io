/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author paulirish / http://paulirish.com/
 */

THREE.FirstPersonControls = function ( object, domElement ) {

	this.object = object;

	this.domElement = ( domElement !== undefined ) ? domElement : document;

	this.enabled = true;

	this.movementSpeed = 1.0;
	this.lookSpeed = 0.005;
	this.rotationSpeed = 2

	this.lookVertical = true;
	this.autoForward = false;

	this.activeLook = true;

	this.heightSpeed = false;
	this.heightCoef = 1.0;
	this.heightMin = 0.0;
	this.heightMax = 1.0;

	this.constrainVertical = false;
	this.verticalMin = 0;
	this.verticalMax = Math.PI;

	this.autoSpeedFactor = 0.0;

	this.mouseX = 0;
	this.mouseY = 0;

	this.moveForward = false;
	this.moveBackward = false;
	this.moveLeft = false;
	this.moveRight = false;
	this.rotateLeft = false;
	this.rotateRight = false;
	this.Jump = false;


	this.mouseDragOn = false;

	this.viewHalfX = 0;
	this.viewHalfY = 0;

	// private variables

	var lat = 0;
	var lon = 0;

	var lookDirection = new THREE.Vector3();
	var spherical = new THREE.Spherical();
	var target = new THREE.Vector3();

	//

	if ( this.domElement !== document ) {

		this.domElement.setAttribute( 'tabindex', - 1 );

	}

	//

	this.handleResize = function () {

		if ( this.domElement === document ) {

			this.viewHalfX = window.innerWidth / 2;
			this.viewHalfY = window.innerHeight / 2;

		} else {

			this.viewHalfX = this.domElement.offsetWidth / 2;
			this.viewHalfY = this.domElement.offsetHeight / 2;

		}

	};
	

	this.onKeyDown = function ( event ) {

		//event.preventDefault();

		switch ( event.keyCode ) {

			case 38: /*up*/
			case 87: /*W*/ this.moveForward = true; break;

			case 81: /*Q*/ this.moveLeft = true; break;

			case 37: /*left*/
			case 65: /*A*/ this.rotateLeft = true; break;

			case 40: /*down*/
			case 83: /*S*/ this.moveBackward = true; break;

			case 69: /*E*/ this.moveRight = true; break;

			case 39: /*right*/
			case 68: /*D*/ this.rotateRight = true; break;

			case 82: /*R*/ this.moveUp = true; break;
			case 70: /*F*/ this.moveDown = true; break;

			case 32: /*SPACE*/ this.Jump = true; break;

		}

	};

	this.onKeyUp = function ( event ) {

		switch ( event.keyCode ) {

			case 38: /*up*/
			case 87: /*W*/ this.moveForward = false; break;

			case 81: /*Q*/ this.moveLeft = false; break;

			case 37: //*left*
			case 65: /*A*/ this.rotateLeft = false; break;

			case 40: /*down*/
			case 83: /*S*/ this.moveBackward = false; break;

			case 69: /*E*/ this.moveRight = false; break;

			case 39: /*right*/
			case 68: /*D*/ this.rotateRight = false; break;

			case 82: /*R*/ this.moveUp = false; break;
			case 70: /*F*/ this.moveDown = false; break;

			case 32: /*SPACE*/ this.Jump = false; break;

		}

	};

	this.lookAt = function ( x, y, z ) {

		if ( x.isVector3 ) {

			target.copy( x );

		} else {

			target.set( x, y, z );

		}

		this.object.lookAt( target );

		setOrientation( this );

		return this;

	};

	this.update = function () {

		var targetPosition = new THREE.Vector3();

		return function update( delta ) {

			if ( this.enabled === false ) return;

			if ( this.heightSpeed ) {

				var y = THREE.Math.clamp( this.object.position.y, this.heightMin, this.heightMax );
				var heightDelta = y - this.heightMin;

				this.autoSpeedFactor = delta * ( heightDelta * this.heightCoef );

			} else {

				this.autoSpeedFactor = 0.0;

			}

			//

			// lat = Math.max( - 85, Math.min( 85, lat ) );

			// var phi = THREE.Math.degToRad( 90 - lat );
			// var theta = THREE.Math.degToRad( lon );

			// if ( this.constrainVertical ) {

			// 	phi = THREE.Math.mapLinear( phi, 0, Math.PI, this.verticalMin, this.verticalMax );

			// }

			// var position = this.object.position;

			// targetPosition.setFromSphericalCoords( 1, phi, theta ).add( position );
			// this.object.lookAt( targetPosition );	

			//


			var actualMoveSpeed = delta * this.movementSpeed;
			var actualRotation = delta * this.rotationSpeed;

			if ( this.moveForward || ( this.autoForward && ! this.moveBackward ) ) {
				this.object.translateZ(  ( actualMoveSpeed + this.autoSpeedFactor ) );
				if (!mixer.clipAction( run ).isRunning()) {
				mixer.clipAction( run ).setDuration( 1 ).play()
				}
			}

			if (!this.moveForward) {
				mixer.clipAction( run ).stop();
			}
			if ( this.moveBackward ) {
				this.object.translateZ( - actualMoveSpeed/2 );
				mixer.clipAction( walk ).setDuration( -1 ).play();
			}
			if (!this.moveBackward) {
				mixer.clipAction( walk ).stop();
			}


			if ( this.moveLeft ) this.object.translateX( - actualMoveSpeed );
			if ( this.moveRight ) this.object.translateX( actualMoveSpeed );

			if ( this.rotateLeft )   this.object.rotateY(actualRotation);
			if ( this.rotateRight )  this.object.rotateY(-actualRotation);

			if ( this.rotateRight || this.rotateLeft) {
				
			} 

			if ( this.moveUp ) this.object.translateY( actualMoveSpeed );
			if ( this.moveDown ) this.object.translateY( - actualMoveSpeed );


			if ( this.Jump ) {
				
				if (!mixer.clipAction( walkjump ).isRunning()) {

				mixer.clipAction( walkjump ).setDuration( 1 ).setLoop( THREE.LoopOnce ).play().reset();
				}
			};


		};

	}();

	function contextmenu( event ) {

		event.preventDefault();

	}

	this.dispose = function () {



		window.removeEventListener( 'keydown', _onKeyDown, false );
		window.removeEventListener( 'keyup', _onKeyUp, false );

	};


	var _onKeyDown = bind( this, this.onKeyDown );
	var _onKeyUp = bind( this, this.onKeyUp );



	window.addEventListener( 'keydown', _onKeyDown, false );
	window.addEventListener( 'keyup', _onKeyUp, false );

	function bind( scope, fn ) {

		return function () {

			fn.apply( scope, arguments );

		};

	}

	function setOrientation( controls ) {

		var quaternion = controls.object.quaternion;

		lookDirection.set( 0, 0, - 1 ).applyQuaternion( quaternion );
		spherical.setFromVector3( lookDirection );

		lat = 90 - THREE.Math.radToDeg( spherical.phi );
		lon = THREE.Math.radToDeg( spherical.theta );

	}

	this.handleResize();

	setOrientation( this );

};
