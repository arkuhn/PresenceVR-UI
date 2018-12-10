AFRAME.registerComponent('vr-eraser', {
    // This is a controller tool. Must be placed on the controller element.
    schema: {},

    init: function () {
        this.controller = this.el;


        // Variables
        this.eraserHover = false;
        this.previousAssetHit = undefined;                          // Tracks the previous asset the eraser was in contact with


        // Set Eraser
        let eraserGeo = new THREE.CubeGeometry(0.05, 0.1, 0.02);
        let eraserMat = new THREE.MeshBasicMaterial({
            color: '#e8a5a0'
        });

        this.eraserMesh = new THREE.Mesh(eraserGeo, eraserMat);
        this.eraserMesh.translateZ(-0.1);
        this.eraserMesh.rotateX(Math.PI/2);
        this.el.setObject3D('eraser', this.eraserMesh);
        this.el.setAttribute('aabb-collider', 'objects: .collides');


        // Deletion Detection Box
        let ddBoxGeo = new THREE.CubeGeometry(25, 25, 25);
        let ddBoxMat = new THREE.MeshBasicMaterial({
            color: '#ff0000',
            wireframe: true
        });

        this.ddBoxMesh = new THREE.Mesh(ddBoxGeo, ddBoxMat);


        this.el.flushToDOM();

        this.events = { 
            hitstart: ((e) => {

                let assetEl = this.el.components['aabb-collider']['intersectedEls'][0];
    
                // Create a bounding box if the element is an object model
                if (assetEl) {
                    if (assetEl.components['obj-model']) {
                        // Object Model Clicked
                        //let boundingBox = new THREE.BoundingBoxHelper(assetEl.getObject3D('mesh'), 0xff0000);
                        //this.el.sceneEl.add(boundingBox);
                        assetEl.setObject3D('ddBox', this.ddBoxMesh);
                        this.previousAssetHit = assetEl;
                    }
                }
                
    
                console.log("Eraser HIT");
                this.eraserHover = true;
                this.eraserMesh.material.color.setHex(0xFF0000);
            }),
            hitend: ((e) => {

                // Remove a bounding box if the element is an object model
                if (this.previousAssetHit) {
                    this.previousAssetHit.removeObject3D('ddBox');
                    this.previousAssetHit = undefined;
                }
    
                console.log("Eraser END");
                this.eraserHover = false;
                this.eraserMesh.material.color.setHex(0xCC6666);
            }),
            triggerdown: ((e) => {
                console.log('trigger down');
                // The controller can either be "free" or "colliding" as specified in the main.js file
                // Colliding refers to colliding with a preview-icon
                if (this.controller.is('colliding')) {
                    try {
                        let assetEl = this.el.components['aabb-collider']['intersectedEls'][0];
                        let assetData = undefined; 
                        if (assetEl) {
                            if (assetEl.components['obj-model']) {
                                assetEl.parentNode.removeChild(assetEl);
                            }
                        }
                        console.log('colliding');
                    } catch (e) {
                        console.log(e);
                    }
                }
            })
        }

        this.el.addEventListener('hitstart', this.events.hitstart);
        this.el.addEventListener('hitend', this.events.hitend);
        this.el.addEventListener('triggerdown', this.events.triggerdown);
        
    },
    update: function () {},
    tick: function () {},
    remove: function () {
        this.el.removeEventListener('hitstart', this.events.hitstart);
        this.el.removeEventListener('hitend', this.events.hitend);
        this.el.removeEventListener('triggerdown', this.events.triggerdown);

        this.el.removeObject3D('eraser');
    },
    pause: function () {},
    play: function () {},
  });