import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";

// 컨테이너 요소 선택
const container = document.getElementById('threejs-container');

// 렌더러 생성 및 설정
const renderer = new THREE.WebGLRenderer({ antialias: true });
container.appendChild(renderer.domElement);

// 카메라 설정
const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 10);
camera.position.z = 2;

// 씬 생성
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff); // 흰색 배경

// Orbit controls 추가
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;

// 3D 객체 추가
const geo = new THREE.IcosahedronGeometry(1.0, 2);
const mat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    flatShading: true,
});
const mesh = new THREE.Mesh(geo, mat);
scene.add(mesh);

//오브젝트에 선 추가 
const wireMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe:true,
})
const wireMesh = new THREE.Mesh(geo, wireMat);
wireMesh.scale.setScalar(1.001);//선의 크기 증가
mesh.add(wireMesh); //구체에 선 추가 

//빛 추가 
const hemiLight = new THREE.HemisphereLight(0x0099ff, 0xaa5500)
scene.add(hemiLight);

// 윈도우 리사이즈에 따른 처리
function onWindowResize() {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}
window.addEventListener('resize', onWindowResize, false);

// 초기 사이즈 설정
onWindowResize();

// 애니메이션 루프
function animate() {
    requestAnimationFrame(animate);
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.01;
    controls.update();
    renderer.render(scene, camera);
}

animate();