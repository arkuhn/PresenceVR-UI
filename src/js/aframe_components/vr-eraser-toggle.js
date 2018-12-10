AFRAME.registerComponent('vr-eraser-toggle', {
    // This is a controller tool. Must be placed on the controller element.
    schema: {},

    init: function () {
        // Variables
        this.eraserActive = false;

        // Eraser Tool Rectangle
        let etGeo = new THREE.BoxBufferGeometry(0.025, 0.01, 0.05);
        let etMat = new THREE.MeshBasicMaterial({
            color: '#e8a5a0'
        });
        this.etMesh = new THREE.Mesh(etGeo, etMat);
        
        // Placeholder for the Eraser
        let pGeo = new THREE.BoxBufferGeometry(0.025, 0.001, 0.05);
        let pMat = new THREE.MeshBasicMaterial({
            color: '#C5344A',
            wireframe: true
        });
        this.pMesh = new THREE.Mesh(pGeo, pMat);

        this.el.setObject3D('et', this.etMesh);
        // Must be called 'mesh' in order for aabb colider to work
        this.el.setObject3D('mesh', this.pMesh);


        // Text
        // Todo: A tool UI component should be created that has the option of text instead of creating tool specific text and icons here.
        let eraserText = document.createElement('a-text');
        eraserText.setAttribute('value', 'Eraser');
        eraserText.setAttribute('rotation', '-90 90 0');
        eraserText.setAttribute('scale', '0.05 0.05 0.05');
        eraserText.setAttribute('position', '0.03 0 0.02');
        eraserText.setAttribute('color', '#010101');
        this.el.appendChild(eraserText);


        this.el.flushToDOM();

        // Set collider
        this.el.setAttribute('aabb-collider', 'objects: [hand-controls]');
        this.el.setAttribute('class', 'collides');
        this.el.flushToDOM();

        // Event Listeners
        this.el.addEventListener('click', (e) => {
            let targetEl = e.detail.el;
            console.log('targetEl');
            console.log(targetEl);
            if (this.eraserActive) {
                this.removeEraser(targetEl);
                this.eraserActive = false;
                console.log("Remove Eraser");
            } else {
                this.attachEraser(targetEl);
                this.eraserActive = true;
                console.log("Add Eraser")
            }
        });
    },
    update: function () {},
    tick: function () {},
    remove: function () {},
    pause: function () {},
    play: function () {},

    attachEraser(controllerEl) {
        if (controllerEl) {
            controllerEl.setAttribute('vr-eraser', "");
            this.el.removeObject3D('et');
        }
    },
    

    removeEraser(controllerEl) {
        if (controllerEl) {
            controllerEl.removeAttribute('vr-eraser');
            this.el.setObject3D('et', this.etMesh);
        }
    },
  });