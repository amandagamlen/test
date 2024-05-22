import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

var scene = new THREE.Scene()
var camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
camera.position.set(1, 1, 20)
var renderer = new THREE.WebGLRenderer({
  antialias: true,
})
renderer.setClearColor(0xffffff, 0)
var canvas = renderer.domElement
document.body.appendChild(canvas)
renderer.setPixelRatio(2)

const spotLight = new THREE.SpotLight(0xffffff)
spotLight.position.set(100, 1000, 100)

scene.add(spotLight)

// const spotLightHelper = new THREE.SpotLightHelper(spotLight)
// scene.add(spotLightHelper)

let model

let base = new THREE.Object3D()
scene.add(base)

const loader = new GLTFLoader()
loader.load(
  'assets/M-Logo.glb',
  function (gltf) {
    model = gltf.scene
    model.scale.setScalar(2.5)
    base.add(model)
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
  },
  function (error) {
    console.log('An error happened')
  }
)

var plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -2)
var raycaster = new THREE.Raycaster()
var mouse = new THREE.Vector2()
var pointOfIntersection = new THREE.Vector3()
canvas.addEventListener('mousemove', onMouseMove, false)

function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
  raycaster.setFromCamera(mouse, camera)
  raycaster.ray.intersectPlane(plane, pointOfIntersection)
  base.lookAt(pointOfIntersection)
}

renderer.setAnimationLoop(() => {
  if (resize(renderer)) {
    camera.aspect = canvas.clientWidth / canvas.clientHeight
    camera.updateProjectionMatrix()
  }
  renderer.render(scene, camera)
})

function resize(renderer) {
  const canvas = renderer.domElement
  const width = canvas.clientWidth
  const height = canvas.clientHeight
  const needResize = canvas.width !== width || canvas.height !== height
  if (needResize) {
    renderer.setSize(width, height, false)
  }
  return needResize
}

function animate() {
  requestAnimationFrame(animate)

  if (model) model.rotation.y += 0.01
  if (model) model.rotation.x += 0.00001

  renderer.render(scene, camera)
}
animate()
