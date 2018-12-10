
// Mocking out react templates by adding array via setAttribute

// Quick event listener test

module.exports = function init() {
    let controllers = document.querySelectorAll('[hand-controls]');
    let els = Array.prototype.slice.call(controllers);
    els.forEach((el) => {
        console.log('ELEMENT');
        console.log(el);
        el.addEventListener('hitstart', (e) => {
            e.target.addState('colliding');
            let sphere = e.target.querySelector('.sphere-controller');
            if (sphere) {
                sphere.setAttribute('material', 'color: #39ceef');
            }
        });

        el.addEventListener('hitend', (e) => {
            e.target.addState('free');
            let sphere = e.target.querySelector('.sphere-controller');
            if (sphere) {
                sphere.setAttribute('material', 'color: #1d39d7');
            }
        });
    });
    // end test

    let scene = document.querySelector('a-scene');

    if (scene.hasLoaded) {
        run();
    } else {
        scene.addEventListener('loaded', run);
    }

    function run() {
        // Dynamic assets test
        // <a-asset-item id="obj-asset-1" src="/assets/objects/senior_project/The_Brain.obj"></a-asset-item>
        // <a-asset-item id="mtl-asset-1" src="/assets/objects/senior_project/The_Brain.mtl"></a-asset-item>
        let objAsset1 = document.createElement('a-asset-item');
        objAsset1.setAttribute('id', 'obj-asset-1');
        objAsset1.setAttribute('src', '/assets/objects/TheBrain/The_Brain.obj');

        let mtlAsset1 = document.createElement('a-asset-item');
        mtlAsset1.setAttribute('id', 'mtl-asset-1');
        mtlAsset1.setAttribute('src', '/assets/objects/TheBrain/The_Brain.mtl');

        let assets = document.querySelector('a-assets');
        assets.appendChild(objAsset1);
        assets.appendChild(mtlAsset1);
        
        let assetList = [{
                name: 'test',
                obj: '#obj-asset-1',
                mtl: '#mtl-asset-1',
                previewImage: '/assets/objects/TheBrain/previewIcon.jpg'
            }, 
            {
                name: 'test2'
            }
        ];
        let itemSelector = document.querySelector('a-entity[item-selector]');
        itemSelector.setAttribute('item-selector', 'assetList:' + JSON.stringify(assetList));
        console.log('ITEMSEL', itemSelector);
    }
}
