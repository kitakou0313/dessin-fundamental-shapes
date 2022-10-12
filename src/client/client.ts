import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const scese = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)

camera.position.z = 2

const renderer = new THREE.WebGL1Renderer(
);
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(
    renderer.domElement
)

new OrbitControls(camera, renderer.domElement)

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial(
    {
        color:0x00ff00,
        wireframe:true
});

const cube = new THREE.Mesh(geometry, material);
scese.add(cube)


function render() {
    renderer.render(scese, camera)
}

function animate() {
    requestAnimationFrame(animate)

    cube.rotation.x += 0.01
    cube.rotation.y += 0.01

    render()
}

function onWindowResize() {
    camera.aspect = window.innerWidth / innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}
window.addEventListener('resize',onWindowResize, false)

animate()