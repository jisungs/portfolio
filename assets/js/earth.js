import * as THREE from "three";
import { OrbitControls } from 'jsm/controls/OrbitControls.js';

import getStarfield from "./assets/src/getStarfield.js";
import {getFresnelMat} from "./assets/src/getFresnelMat.js";

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w/h, 0.1, 1000);
camera.position.z = 3;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;


//지구의 축을 실제 처럼 약간 기울어지게 만들어줌
const earthGroup = new THREE.Group();
earthGroup.rotation.z = -23.4 * Math.PI/ 180;
scene.add(earthGroup);

new OrbitControls(camera, renderer.domElement)
const detail = 12
const loader = new THREE.TextureLoader();
const geometry  = new THREE.IcosahedronGeometry(1, detail);
const material = new THREE.MeshPhongMaterial({
    // color: 0xffff00,
    // flatShading : true,
    map: loader.load("./assets/textures/00_earthmap1k.jpg"),
    specularMap: loader.load("./assets/textures/02_earthspec1k.jpg"),
    bumpMap: loader.load("./assets/textures/01_earthbump1k.jpg"),
    bumpScale: 0.04,
})

// material.map.colorSpace = THREE.SRGBColorSpace;
const earthMesh = new THREE.Mesh(geometry, material);
scene.add(earthMesh)

//지구가 밤일때 불빛 추가 
const lightsMat = new THREE.MeshBasicMaterial({
    // color:0x00ff00,
    // transparent : true,
    // opacity:0.6,
    map: loader.load("./assets/textures/03_earthlights1k.jpg"),
    blending: THREE.AdditiveBlending, // 블렌딩 모드를 NormalBlending으로 변경AdditiveBlending
    transparent: true, // 텍스처의 투명도를 사용하여 밤의 불빛이 자연스럽게 보이도록 함
    opacity: 0.7, // 필요한 경우 투명도를 조절하여 밤 텍스처 강조

  });
const lightsMesh = new THREE.Mesh(geometry, lightsMat);
// 녹색 구가 지구를 완전히 덮도록 약간 크게 설정
lightsMesh.scale.set(1.002, 1.002, 1.002);
earthGroup.add(lightsMesh);

//구름 추가 
const cloudsMat = new THREE.MeshStandardMaterial({
    map: loader.load("./assets/textures/04_earthcloudmap.jpg"),
    transparent:true,
    opacity:0.8,
    blending: THREE.AdditiveBlending,
    alphaMap: loader.load('./assets/textures/05_earthcloudmaptrans.jpg'),
});
const cloudsMesh = new THREE.Mesh(geometry, cloudsMat);
cloudsMesh.scale.setScalar(1.006, 1.006, 1.006);
earthGroup.add(cloudsMesh);

const fresnelMat = getFresnelMat();
const glowMesh = new THREE.Mesh(geometry, fresnelMat)
glowMesh.scale.setScalar(1.01);
earthGroup.add(glowMesh)


//지구 주변에 별 추가
const stars = getStarfield({numStars:2000});
scene.add(stars);

//빛 추가 
// const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444)
// scene.add(hemiLight);
const sunLight = new THREE.DirectionalLight(0xffffff, 2.0);
sunLight.position.set(-2, 0.5, 1.5);
scene.add(sunLight);

// 추가 조명: 지구를 더 밝게 보이도록 하기 위해 AmbientLight 추가
const ambientLight = new THREE.AmbientLight(0x404040, 1.5); // 밝기 조절
scene.add(ambientLight);


// 윈도우 리사이즈에 따른 처리
function onWindowResize() {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}
window.addEventListener('resize', onWindowResize, false);

// 초기 사이즈 설정
onWindowResize();


function animate(){
    requestAnimationFrame(animate);

    // earthMesh.rotation.x += 0.01;
    earthMesh.rotation.y += 0.002;
    lightsMesh.rotation.y += 0.002;
    cloudsMesh.rotation.y += 0.003;
    glowMesh.rotation.y += 0.002;
    renderer.render(scene,camera);
    // controls.update();//궤도 조정 업데이트
}

animate()