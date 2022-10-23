import * as THREE from "three";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { DragControls } from "three/examples/jsm/controls/DragControls";
import  Stats from "three/examples/jsm/libs/stats.module";

const scene = new THREE.Scene();
scene.add(new THREE.AxesHelper(5))

const light = new THREE.PointLight()
light.position.set(2,2,2)
scene.add(light)

const point_light_helper = new THREE.PointLightHelper(light);
scene.add(point_light_helper)

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

const box_geometry = new THREE.BoxGeometry()
const tube_geometry = new THREE.TubeGeometry();
const sphere_geometry = new THREE.SphereGeometry()

const geometries = [
    new THREE.BoxGeometry(),
    new THREE.ConeGeometry(),
    new THREE.SphereGeometry()
]

const materials = [
    new THREE.MeshStandardMaterial({ color: 0xff0000, transparent: true }),
    new THREE.MeshStandardMaterial({ color: 0xff0000, transparent: true }),
    new THREE.MeshStandardMaterial({ color: 0xff0000, transparent: true }),
]

const objects = [
    new THREE.Mesh(geometries[0], materials[0]),
    new THREE.Mesh(geometries[1], materials[1]),
    new THREE.Mesh(geometries[2], materials[2]),
    light
]

objects[0].position.x = -2
objects[1].position.x = 0
objects[2].position.x = 2

objects.forEach((c) => scene.add(c))

const orbit_controls = new OrbitControls(camera, renderer.domElement);
const drag_controls = new DragControls(objects, camera, renderer.domElement)

orbit_controls.enabled = true
drag_controls.enabled = false

window.addEventListener("keydown", (event) => {
    switch (event.code) {
        case "KeyC":
            orbit_controls.enabled = !orbit_controls.enabled
            drag_controls.enabled = !drag_controls.enabled
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

    point_light_helper.update()

    stats.update()
}

animate()