AFRAME.registerComponent('preview-icon', {
    schema: {
        name: {type: "string", default: "temp"},
        previewImage: {type: "string", 'default': ''},
        obj: {type: "string", default: ''},
        mtl: {type: "string", default: ''},
        collisionObjs: {type: "array", default: []}
    },

    init: function () {
        const ICON_HEIGHT = 0.05;
        const ICON_WIDTH = 0.05;

        // Preview Icons
        this.assetElementsMap = [];
        let startPos = this.el.getAttribute('position');

        this.previewObj = null;

        let previewIconG = new THREE.BoxBufferGeometry(ICON_HEIGHT, 0.01, ICON_WIDTH);
        let previewIconM = new THREE.MeshBasicMaterial({
            color: 0xeeeeee,
            side: 'double'
        });

        // Adds image to icon(button) if present
        let image = this.getImage();
        if (image !== null) {
            previewIconM.map = image;
        }

        this.previewIconMesh = new THREE.Mesh(previewIconG, previewIconM);
        // Aligns Picture Icon in the correct orientation
        this.previewIconMesh.rotateY(Math.PI/2);
        this.el.setObject3D('mesh', this.previewIconMesh);


        // Pressing Animations
        let animationDown = document.createElement('a-animation');
        animationDown.setAttribute('attribute', "position");
        animationDown.setAttribute('dur', "100");
        animationDown.setAttribute('to', `${startPos.x} ${startPos.y + -0.005} ${startPos.z}`);
        animationDown.setAttribute('begin', "down");
        this.el.appendChild(animationDown);

        let animationUp = document.createElement('a-animation');
        animationUp.setAttribute('attribute', "position");
        animationUp.setAttribute('dur', "100");
        animationUp.setAttribute('to', `${startPos.x} ${startPos.y} ${startPos.z}`);
        animationUp.setAttribute('begin', "up");
        this.el.appendChild(animationUp);

        this.el.flushToDOM();

        // Check if preview obj is present
        if (this.data.obj !== '' && this.data.mtl !== '') {

            // Create preview Obj
            this.previewObj = document.createElement('a-entity');
            this.previewObj.setAttribute('obj-model', {
                obj: this.data.obj,
                mtl: this.data.mtl
            });

            this.previewObj.setAttribute('scale', '0.01 0.01 0.01');
            this.previewObj.setAttribute('position', '-0.12 0 0');
            this.previewObj.setAttribute('rotation', '-90 0 90');
            // this.previewObj.setAttribute('material', 'visible: false');

            this.previewObj.flushToDOM();
        } else {
            console.warn(`Data obj not found on`, this.el);
        }

        //this.el.flushToDOM();
        //this.el.setAttribute('position', '-0.2 0.1 0.1');
    

        // Sets aframe extra's sphere collider onto icon
        //this.el.setAttribute('class', "preview-icon");
        this.el.setAttribute('aabb-collider', 'objects: [hand-controls]');
        this.el.setAttribute('class', 'collides');
        
        this.el.addEventListener('hitstart', (e) => {
            console.log("HIT HAS HAPPENED");
            this.el.emit('down');
            //this.addPreviewObj();
        });

        this.el.addEventListener('hitend', (e) => {
            console.log("HIT END HAS HAPPENED");
            this.el.emit('up');
            //this.removePreviewObj();
        });

                
                
                //previewObj.material.wireframe = true;
                console.log('ICON', this.el); 
    },
    update: function () {},
    tick: function () {},
    remove: function () {},
    pause: function () {},
    play: function () {},

    getImage() {
        let previewImage = this.data.previewImage;
        if (previewImage !== 'undefined' && previewImage !== undefined) {
            try {
                let image = THREE.ImageUtils.loadTexture(previewImage);
                return image;
            } catch (e) {
                console.error(e);
            }
        }
        return null;
    },

    addPreviewObj() {
        if (this.previewObj) {
            this.el.appendChild(this.previewObj);
        }
    },

    removePreviewObj() {
        let preObj = this.el.querySelector('a-entity[obj-model]');
        if (preObj) {
            this.el.removeChild(preObj);
        } else {
            console.log('No preview object to remove');
        }
    },

    previewObjVisible() {
        let preObj = this.el.querySelector('a-entity[obj-model]');
        if (preObj) {
            preObj.setAttribute('material', 'visible: true');
        } else {
            console.log('No preview object found');
        }
    },

    hidePreviewObj() {
        let preObj = this.el.querySelector('a-entity[obj-model]');
        if (preObj) {
            preObj.setAttribute('material', 'visible: false');
        } else {
            console.log('No preview object found');
        }
    }
  });