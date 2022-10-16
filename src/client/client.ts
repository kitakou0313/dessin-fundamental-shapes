import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'
import { GUI } from 'dat.gui'

const scene = new THREE.Scene();
scene.add(new THREE.AxesHelper(5))

const light = new THREE.AmbientLight()
scene.add(light)

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.z = 7

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

const torusGeometry = [
    new THREE.TorusGeometry(),
    new THREE.TorusGeometry(),
    new THREE.TorusGeometry(),
    new THREE.TorusGeometry(),
    new THREE.TorusGeometry()
]

const material = [
    new THREE.MeshBasicMaterial(),
    new THREE.MeshLambertMaterial(),
    new THREE.MeshPhongMaterial(),
    new THREE.MeshPhysicalMaterial(),
    new THREE.MeshToonMaterial()
]

const torus = [
    new THREE.Mesh(torusGeometry[0], material[0]),
    new THREE.Mesh(torusGeometry[1], material[1]),
    new THREE.Mesh(torusGeometry[2], material[2]),
    new THREE.Mesh(torusGeometry[3], material[3]),
    new THREE.Mesh(torusGeometry[4], material[4]),
]

const texture = new THREE.TextureLoader().load("img/grid.png")
for (const materialElement of material) {
    materialElement.map = texture
}

torus[0].position.x = -8
torus[1].position.x = -4
torus[2].position.x = 0
torus[3].position.x = 4
torus[4].position.x = 8

for (const torusElement of torus) {
    scene.add(torusElement)
}

// common scripts
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

const stats = Stats()
document.body.appendChild(stats.dom)

const data = {
    color: light.color.getHex(),
    mapsEnabled: true
}

const gui = new GUI()
const lightFolder = gui.addFolder('THREE.Light')
lightFolder.addColor(data, 'color').onChange(() => {
    light.color.setHex(Number(data.color.toString().replace('#', '0x')))
})
lightFolder.add(light, 'intensity', 0, 1, 0.01)

const ambientLightFolder = gui.addFolder('THREE.AmbientLight')
ambientLightFolder.open()

const meshesFolder = gui.addFolder('Meshes')
meshesFolder.add(data, 'mapsEnabled').onChange(() => {
    material.forEach((m) => {
        if (data.mapsEnabled) {
            m.map = texture
        } else {
            m.map = null
        }
        m.needsUpdate = true
    })
})

function animate() {
    requestAnimationFrame(animate)

    torus.forEach((t) => {
        t.rotation.y += 0.01
    })

    render()

    stats.update()
}

animate()