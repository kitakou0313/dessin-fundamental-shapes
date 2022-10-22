import * as THREE from "three";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import  Stats from "three/examples/jsm/libs/stats.module";

const scene = new THREE.Scene();
scene.add(new THREE.AxesHelper(5))

const light = new THREE.PointLight()
light.position.set(10,10,10)
scene.add(light)

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)
camera.position.z = 3

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const geometry = new THREE.BoxGeometry()

const material = [
    new THREE.MeshPhongMaterial({ color: 0xff0000, transparent: true }),
]

const cubes = [
    new THREE.Mesh(geometry, material[0]),
]
cubes[0].position.x = 0
cubes.forEach((c) => scene.add(c))

const orbit_controls = new OrbitControls(camera, renderer.domElement);

const transform_controls = new TransformControls(camera, renderer.domElement)
transform_controls.attach(cubes[0])
scene.add(transform_controls)

window.addEventListener("keydown", (event) => {
    switch (event.code) {
        case "KeyG":
            transform_controls.setMode("translate")
            break;
        case "KeyR":
            transform_controls.setMode("rotate")
            break
        case "KeyS":
            transform_controls.setMode("scale")
            break
        case "KeyO":
            orbit_controls.enabled = !orbit_controls.enabled
            break
    }
})


const stats = Stats()
document.body.appendChild(stats.dom)

function render() {
    renderer.render(scene, camera)
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}
window.addEventListener('resize', onWindowResize, false)

function animate() {
    requestAnimationFrame(animate)

    render()

    stats.update()
}

animate()