AFRAME.registerComponent('item-selector', {
    schema: {
        // size: {type: 'vec2', default: {x:0.5, y:0.2}}
        // Contain a list of objects
        // ex: {
        //      name:    // Name of object
        //      obj:     // 3D object location
        //      preview: // Preview image location
        // }
        assetList: {type: 'string', default: "[]"}
    },

    init: function () {

        console.log(this.data.assetList);

        this.assetList = [];

        // Display rectangle
        let displayG = new THREE.BoxBufferGeometry(0.3, 0.01, 0.5);
        let displayM = new THREE.MeshBasicMaterial({
            color: 0xbbbbff,
            side: 'double'
        });
        this.displayMesh = new THREE.Mesh(displayG, displayM);

        this.el.setObject3D('mesh', this.displayMesh);
        this.el.setAttribute('position', '-0.1 0.3 0.1');
        this.el.setAttribute('rotation', '0 0 -75');

        // Add Labels
        let assetText = document.createElement('a-text');
        assetText.setAttribute('value', 'Assets');
        assetText.setAttribute('rotation', '-90 90 0');
        assetText.setAttribute('scale', '0.1 0.1 0.1');
        assetText.setAttribute('position', '-0.11 0.01 0.24');
        assetText.setAttribute('color', '#010101');

        this.el.appendChild(assetText);

        let toolsText = document.createElement('a-text');
        toolsText.setAttribute('rotation', '-90 90 0');
        toolsText.setAttribute('scale', '0.1 0.1 0.1');
        toolsText.setAttribute('position', '0.03 0.01 0.24');
        toolsText.setAttribute('color', '#010101');
        toolsText.setAttribute('value', 'Tools');
        this.el.appendChild(toolsText);
        
        // Add Tools
        // Adding Remover Tool
        let removerTool = document.createElement('a-entity');
        removerTool.setAttribute('vr-eraser-toggle', "");
        removerTool.setAttribute('position', "0.08 0.01 0.21");
        this.el.appendChild(removerTool);


        // Preview Icon Container
        const ICON_HEIGHT = 0.05;
        const ICON_WIDTH = 0.05;
        this.ICON_OFFSET = 0.21;
        this.ICON_MULTIPLYER = 0.08;

        let previewIconContainerG = new THREE.BoxBufferGeometry(ICON_HEIGHT, 0.01, ICON_WIDTH);
        let previewIconContainerM = new THREE.MeshBasicMaterial({
            color: 0x999999,
            side: 'double'
        });
        this.previewIconContainerMesh = new THREE.Mesh(displayG, displayM);
    },
    update: function () {

        // Setup assertList
        try {
            this.assetList = JSON.parse(this.data.assetList);
            this.updateAssetList(this.assetList);
        } catch(e) {
            throw new Error(e);
        }
    },
    tick: function () {},
    remove: function () {},
    pause: function () {},
    play: function () {},

    updateAssetList(newAssetList) {
        // TODO: Remove all previous elements from the list
        // if (this.currentAssetElements.length > 0) {
        //     this.currentAssetElements.forEach((asset) => {
        //         this.el.removeObject3D(asset.name. asset.mesh);
        //     });
        // }
        console.log('hit1');
        if (newAssetList.length > 0) {
            newAssetList.forEach((asset, i) => {
                console.log('Asset' , asset);
                console.log('hit inside');
                //this.el.setObject3D('icon_' + i, this.displayMesh);
                let icon = document.createElement('a-entity');
                
                icon.setAttribute('preview-icon', `name: ${asset.name}; obj: ${asset.obj}; mtl: ${asset.mtl}; previewImage: ${asset.previewImage}`);
                icon.setAttribute('position', `-0.045 0.01 ${(-i*this.ICON_MULTIPLYER) + this.ICON_OFFSET}`);
                this.el.appendChild(icon);
                
                console.log('Element Created');
            });
        }
        
        //this.el.setObject3D('icon_1', this.displayMesh);
        //this.el.setAttribute('position', '-0.2 0 0.1');
    }
  });