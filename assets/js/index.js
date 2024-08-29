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
    transparent: true, // 투명도 설정
    opacity: 0.4,      // 투명도 조절 (0: 완전히 투명, 1: 불투명)
});
const mesh = new THREE.Mesh(geo, mat);
scene.add(mesh);

//오브젝트에 선 추가 
const wireMat = new THREE.MeshBasicMaterial({
    color: 0x000000,
    wireframe:true,
})
const wireMesh = new THREE.Mesh(geo, wireMat);
wireMesh.scale.setScalar(1.001);//선의 크기 증가
mesh.add(wireMesh); //구체에 선 추가 


// 스프라이트 텍스처 로드
// const spriteTexture = new THREE.TextureLoader().load('images/pic00.jpg');


// 사용할 이미지 텍스처 배열
const textures = [
    new THREE.TextureLoader().load('images/pic00.jpg'), // 각 정점에 대해 다른 이미지 파일 경로로 변경
    new THREE.TextureLoader().load('images/Break-out.jpg'),
    new THREE.TextureLoader().load('images/cafeAndWifi.jpg'),
    new THREE.TextureLoader().load('images/color-from-image.jpg'),
    new THREE.TextureLoader().load('images/morse_code.jpg'),
    new THREE.TextureLoader().load('images/My-own-AI.jpg'),
    new THREE.TextureLoader().load('images/pdf-to-audiobook.jpg'),
    new THREE.TextureLoader().load('images/tic-tac-toe-game.jpg'),
    new THREE.TextureLoader().load('images/todo-list.jpg'),
    new THREE.TextureLoader().load('images/typing-speed-checker.jpg'),
    // new THREE.TextureLoader().load('image11.png'),
    // new THREE.TextureLoader().load('image12.png')
];

// 스프라이트 생성 함수
function createSprite(position, texture) {
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture
     });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.position.copy(position);
    sprite.scale.set(0.1, 0.1, 0.1); // 스프라이트 크기 조절
    scene.add(sprite);
    return sprite;
}


// 스프라이트 배열 생성
const sprites = [];

// 정점 위치에 스프라이트 추가
const positionAttribute = geo.getAttribute('position');
for (let i = 0; i < positionAttribute.count; i++) {
    const vertex = new THREE.Vector3();
    vertex.fromBufferAttribute(positionAttribute, i);
    const textureIndex = i % textures.length; // 텍스처 배열의 인덱스를 반복적으로 사용
    const sprite = createSprite(vertex, textures[textureIndex]);
    sprites.push(sprite); // 스프라이트 배열에 추가
}



//빛 추가 
const hemiLight = new THREE.HemisphereLight(0x0099ff, 0xaa5500)
// const hemiLight = new THREE.HemisphereLight(0x000000, 0x000000)
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

    // 스프라이트 위치 업데이트
    const positionAttribute = geo.getAttribute('position');
    for (let i = 0; i < positionAttribute.count; i++) {
        const vertex = new THREE.Vector3();
        vertex.fromBufferAttribute(positionAttribute, i);
        vertex.applyMatrix4(mesh.matrixWorld); // 월드 좌표로 변환
        
        // 스프라이트가 배열에 존재하는지 확인 후 위치 업데이트
        if (sprites[i]) {
            sprites[i].position.copy(vertex);
        }
    }


    controls.update();
    renderer.render(scene, camera);
}

animate();