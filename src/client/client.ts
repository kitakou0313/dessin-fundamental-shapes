import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'

const scene = new THREE.Scene();
scene.add(new THREE.AxesHelper(5))

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.z = 2

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
// controls.target.set(3, 3, 3)
controls.addEventListener("change", () => console.log("Controls change"))
controls.addEventListener("start", () => console.log("Controls start event"))
controls.addEventListener("end", () => console.log("Controls end event"))

const geometry = new THREE.BoxGeometry()
const material = new THREE.MeshBasicMaterial({
    color : 0x00ff00,
    wireframe: true
})

const cube = new THREE.Mesh(geometry, material)
scene.add(cube)

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

window.addEventListener('resize', onWindowResize, false)

const stats =  Stats();
document.body.appendChild(stats.domElement)

function animate() {
    requestAnimationFrame(animate)

    render()

    stats.update()
}

function render() {
    renderer.render(scene, camera)
}

animate()