/*Three.js WIP rendition of 3D Black Hole Visualization by Lisa Sekaida
Available at https://openprocessing.org/sketch/1867236*/


import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


let scene, camera, renderer, controls;
let stats, clock;
let light, pointLight;
let centerPoint;

let angleOffset = 0;

let sphereRadius = 50;
let numPoints = 200;
let numRings = 50;

let sphere;

let col = new THREE.Color(255, 250, 206);

init();
animate();

function init() {

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("sketch-container").appendChild(renderer.domElement);

    //camera interaction controls
    controls = new OrbitControls(camera, renderer.domElement);

    //controls.update() must be called after any manual changes to the camera's transform
    camera.position.set(8, 13, 20); //always looks at center
    controls.update();

    //set up our scene
    light = new THREE.AmbientLight(col); // soft white light
    scene.add(light);
    pointLight = new THREE.PointLight(0xfffafe, 1, 100);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    centerPoint = new THREE.Vector2(0, 0);

    const geometry = new THREE.SphereGeometry(sphereRadius, 50, 50);
    const material = new THREE.MeshNormalMaterial();
    sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    //help us animate
    clock = new THREE.Clock();

    //For frame rate
    stats = Stats()
    stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(stats.dom)

    window.addEventListener('resize', onWindowResize);
}


function animate() {
    renderer.setAnimationLoop(render);
}

function render() {
    stats.begin();

    for (let ring = 0; ring < numRings; ring++) {
        let ringRadius = THREE.MathUtils.mapLinear(ring, 0, numRings, sphereRadius * 1.2, sphereRadius * 4);
        let angle = THREE.MathUtils.mapLinear(ring, 0, numRings, 0, Math.PI * 2 * 8) + angleOffset;
        let x = ringRadius * Math.cos(angle);
        let y = ringRadius * Math.sin(angle);

        for (let pt = 0; pt < numPoints; pt++) {
            let ptAngle = THREE.MathUtils.mapLinear(pt, 0, numPoints, 0, Math.PI * 2);
            let px = x + ringRadius * Math.cos(ptAngle);
            let py = y + ringRadius * Math.sin(ptAngle);
            let pz = ringRadius * Math.sin(ptAngle);

            let pVec2 = new THREE.Vector2(px, py);
            let d = pVec2.distanceTo(centerPoint);
            let c = THREE.MathUtils.mapLinear(d, 0, sphereRadius * 4, 255, 0);
            col.r = c;
            col.g = 255;
            col.b = c + 100;
            //   fill(c, 255, c + 100, 64);

            //   push();
            sphere.position.x = px;
            sphere.position.y = py;
            sphere.position.z = pz;

            sphereRadius = c / 50;
            //   pop();
        }
    }

    angleOffset += 0.01;

    stats.end();

    // required if controls.enableDamping or controls.autoRotate are set to true
    //controls.update();

    renderer.render(scene, camera);
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

}