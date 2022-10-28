import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import  Stats from "three/examples/jsm/libs/stats.module";

const scene = new THREE.Scene();
scene.add(new THREE.AxesHelper(5))

const light = new THREE.DirectionalLight()
light.position.set(2,2,2)
scene.add(light)

const ambient_light = new THREE.AmbientLight()
ambient_light.intensity = 0.3
scene.add(ambient_light)

const point_light_helper = new THREE.DirectionalLightHelper(light);
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
renderer.setClearColor(0x88C0F1)
document.body.appendChild(renderer.domElement)

const geometries = [
    new THREE.SphereGeometry(),
    new THREE.BoxGeometry(),
    new THREE.CylinderGeometry()
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

var sphere_geo = new THREE.EdgesGeometry( geometries[0] );
var cube_geo = new THREE.EdgesGeometry( geometries[1] );
var cylinder_geo = new THREE.EdgesGeometry( geometries[2] );


var line_mat = new THREE.LineBasicMaterial( { color: 0x00ff00, linewidth: 100 } );

var sphere_wireframe = new THREE.LineSegments( sphere_geo, line_mat );
var cube_wireframe = new THREE.LineSegments( cube_geo, line_mat );
var cylinder_wireframe = new THREE.LineSegments( cylinder_geo, line_mat );

objects[0].add( sphere_wireframe );
objects[1].add( cube_wireframe );
objects[2].add( cylinder_wireframe );

objects[0].position.x = -2
objects[1].position.x = 0
objects[2].position.x = 2

function gen_random_rotation() {
    return Math.random() * Math.PI*2
}

objects.forEach((o) => {
    o.rotateX(gen_random_rotation())
    o.rotateY(gen_random_rotation())
    o.rotateZ(gen_random_rotation())
})
objects.forEach((o) => scene.add(o))

const orbit_controls = new OrbitControls(camera, renderer.domElement);

orbit_controls.enabled = true

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