import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'
import { GUI } from 'dat.gui'

const scene = new THREE.Scene();
scene.add(new THREE.AxesHelper(5))

const light = new THREE.SpotLight()
light.castShadow = true
light.shadow.mapSize.width = 512
light.shadow.mapSize.height = 512
light.shadow.camera.near = 0.5
light.shadow.camera.far = 100
scene.add(light)

const helper = new THREE.CameraHelper(light.shadow.camera)
scene.add(helper)

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.z = 7

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap
//renderer.shadowMap.type = THREE.BasicShadowMap
//renderer.shadowMap.type = THREE.PCFShadowMap
//renderer.shadowMap.type = THREE.VSMShadowMap
document.body.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

const planeGeometry = new THREE.PlaneGeometry(100,10);
const plane = new THREE.Mesh(planeGeometry, new THREE.MeshPhongMaterial())
plane.rotateX(-Math.PI / 2)
plane.position.y = -1.75
scene.add(plane)

const torusGeometry = [
    new THREE.TorusGeometry(),
    new THREE.TorusGeometry(),
    new THREE.TorusGeometry(),
]

const material = [
    new THREE.MeshBasicMaterial(),
    new THREE.MeshLambertMaterial(),
    new THREE.MeshToonMaterial()
]

const torus = [
    new THREE.Mesh(torusGeometry[0], material[0]),
    new THREE.Mesh(torusGeometry[1], material[1]),
    new THREE.Mesh(torusGeometry[2], material[2]),
]

const texture = new THREE.TextureLoader().load("img/grid.png")
for (const materialElement of material) {
    materialElement.map = texture
}

torus[0].position.x = -8
torus[1].position.x = -4
torus[2].position.x = 0

for (const torusElement of torus) {
    torusElement.castShadow = true
    torusElement.receiveShadow = true
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

const data  = {
    color: light.color.getHex(),
    mapsEnabled: true,
    shadowMapSizeWidth: 512,
    shadowMapSizeHeight: 512,
}

const gui = new GUI()
const lightFolder = gui.addFolder('THREE.Light')
lightFolder.addColor(data, 'color').onChange(() => {
    light.color.setHex(Number(data.color.toString().replace('#', '0x')))
})
lightFolder.add(light, 'intensity', 0, 1, 0.01)

const spotLightFolder = gui.addFolder('THREE.SpotLight')
spotLightFolder.add(light, 'distance', 0, 100, 0.01)
spotLightFolder.add(light, 'decay', 0, 4, 0.1)
spotLightFolder.add(light, 'angle', 0, 1, 0.1)
spotLightFolder.add(light, 'penumbra', 0, 1, 0.1)
spotLightFolder.add(light.shadow.camera, "near", 0.1,100)
.onChange(() => light.shadow.camera.updateProjectionMatrix())
spotLightFolder.add(light.shadow.camera, "far", 0.1,100)
.onChange(() => light.shadow.camera.updateProjectionMatrix())

const shadowMapOptions = [256, 512, 1024,2048,4096]
spotLightFolder.add(data, "shadowMapSizeWidth", shadowMapOptions)
.onChange(() => updateShadowMapSize())
spotLightFolder.add(data, "shadowMapSizeHeight", shadowMapOptions)
.onChange(() => updateShadowMapSize())
spotLightFolder.add(light.position, 'x', -50, 50, 0.01)
spotLightFolder.add(light.position, 'y', -50, 50, 0.01)
spotLightFolder.add(light.position, 'z', -50, 50, 0.01)
spotLightFolder.open()

function updateShadowMapSize() {
    light.shadow.mapSize.width = data.shadowMapSizeWidth
    light.shadow.mapSize.height = data.shadowMapSizeHeight
    ;(light.shadow.map as any) = null
}

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

    helper.update()

    torus.forEach((t) => {
        t.rotation.y += 0.01
    })

    render()

    stats.update()
}

animate()