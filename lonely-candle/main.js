var hide = true;
circle.addEventListener("click", function() {
  if (hide) {
    circle.style.background = "darkorange";
    circle.style.color = "orange";
    info.style.width = "640px";
    info.style.height = "214px";
  } else {
    circle.style.background = "rgba(255, 165, 0, .5)";
    circle.style.color = "rgba(255, 165, 0, 1)";
    info.style.width = "62px";
    info.style.height = "62px";
  }
  hide = !hide;
}, false);

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(3, 5, 8).setLength(15);
var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x101005);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);
window.addEventListener("resize", event => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix()
  renderer.setSize(innerWidth, innerHeight);
})

var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enablePan = false;
controls.minPolarAngle = THREE.Math.degToRad(60);
controls.maxPolarAngle = THREE.Math.degToRad(95);
controls.minDistance = 4;
controls.maxDistance = 20;
controls.autoRotate = true;
controls.autoRotateSpeed = 1;
controls.target.set(0, 2, 0);
controls.update();

//scene.add(new THREE.GridHelper(10, 10, 0x552222, 0x333322));

var light = new THREE.DirectionalLight(0xffffff, 0.025);
light.position.setScalar(10);
scene.add(light);
scene.add(new THREE.AmbientLight(0xffffff, 0.0625));


// candle
var casePath = new THREE.Path();
casePath.moveTo(0, 0);
casePath.lineTo(0, 0);
casePath.absarc(1.5, 0.5, 0.5, Math.PI * 1.5, Math.PI * 2);
casePath.lineTo(2, 1.5);
casePath.lineTo(1.99, 1.5);
casePath.lineTo(1.9, 0.5);
var caseGeo = new THREE.LatheBufferGeometry(casePath.getPoints(), 64);
var caseMat = new THREE.MeshStandardMaterial({color: "silver" });
var caseMesh = new THREE.Mesh(caseGeo, caseMat);
caseMesh.castShadow = true;

// paraffin
var paraffinPath = new THREE.Path();
paraffinPath.moveTo(0, -.25);
paraffinPath.lineTo(0, -.25);
paraffinPath.absarc(1, 0, 0.25, Math.PI * 1.5, Math.PI * 2);
paraffinPath.lineTo(1.25, 0);
paraffinPath.absarc(1.89, 0.1, 0.1, Math.PI * 1.5, Math.PI * 2);
var paraffinGeo = new THREE.LatheBufferGeometry(paraffinPath.getPoints(), 64);
paraffinGeo.translate(0, 1.25, 0);
var paraffinMat = new THREE.MeshStandardMaterial({color: 0xffff99, side: THREE.BackSide, metalness: 0, roughness: 0.75});
var paraffinMesh = new THREE.Mesh(paraffinGeo, paraffinMat);
caseMesh.add(paraffinMesh);

// candlewick
var candlewickProfile = new THREE.Shape();
candlewickProfile.absarc(0, 0, 0.0625, 0, Math.PI * 2);

var candlewickCurve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(0, 0.5, -0.0625),
  new THREE.Vector3(0.25, 0.5, 0.125)
]);

var candlewickGeo = new THREE.ExtrudeBufferGeometry(candlewickProfile, {
	steps: 8,
	bevelEnabled: false,
  extrudePath: candlewickCurve
});
var colors = [];
var color1 = new THREE.Color("black");
var color2 = new THREE.Color(0x994411);
var color3 = new THREE.Color(0xffff44);
for (let i = 0; i < candlewickGeo.attributes.position.count; i++){
  if (candlewickGeo.attributes.position.getY(i) < 0.4){
    color1.toArray(colors, i * 3);
  }
  else {
    color2.toArray(colors, i * 3);
  };
  if (candlewickGeo.attributes.position.getY(i) < 0.15) color3.toArray(colors, i * 3);
}
candlewickGeo.addAttribute( 'color', new THREE.BufferAttribute( new Float32Array(colors), 3 ) );
candlewickGeo.translate(0, 0.95, 0);
var candlewickMat = new THREE.MeshBasicMaterial({vertexColors: THREE.VertexColors});

var candlewickMesh = new THREE.Mesh(candlewickGeo, candlewickMat);
caseMesh.add(candlewickMesh);

// candle light
var candleLight = new THREE.PointLight(0xffaa33, 1, 5, 2);
candleLight.position.set(0, 3, 0);
candleLight.castShadow = true; 
caseMesh.add(candleLight);
var candleLight2 = new THREE.PointLight(0xffaa33, 1, 10, 2);
candleLight2.position.set(0, 4, 0);
candleLight2.castShadow = true;
caseMesh.add(candleLight2);
//scene.add(new THREE.PointLightHelper(candleLight2));

// flame
var flameMaterials = [];
function flame(isFrontSide){
  let flameGeo = new THREE.SphereBufferGeometry(0.5, 32, 32);
  flameGeo.translate(0, 0.5, 0);
  let flameMat = getFlameMaterial(true);
  flameMaterials.push(flameMat);
  let flame = new THREE.Mesh(flameGeo, flameMat);
  flame.position.set(0.06, 1.2, 0.06);
  flame.rotation.y = THREE.Math.degToRad(-45);
  caseMesh.add(flame);
}

flame(false);
flame(true);

// table
var tableGeo = new THREE.CylinderBufferGeometry(14, 14, 0.5, 64);
tableGeo.translate(0, -0.25, 0);
var tableMat = new THREE.MeshStandardMaterial({map: new THREE.TextureLoader().load("https://threejs.org/examples/textures/hardwood2_diffuse.jpg"), metalness: 0, roughness: 0.75});
var tableMesh = new THREE.Mesh(tableGeo, tableMat);
tableMesh.receiveShadow = true;

tableMesh.add(caseMesh);
scene.add(tableMesh);

// pentagram
/*var penta = new THREE.CircleGeometry(7, 5);
penta.rotateX(-Math.PI * 0.5);
penta.vertices.shift();
var pentagramGeo = new THREE.BufferGeometry().setFromPoints(penta.vertices);
pentagramGeo.setIndex([0,1, 1,2, 2,3, 3,4, 4,0, 0,2, 2,4, 4,1, 1,3, 3,0]);
var pentagram = new THREE.LineSegments(pentagramGeo, new THREE.LineBasicMaterial({color: 0xff3311}));
pentagram.y = 0.01;
scene.add(pentagram);*/


var clock = new THREE.Clock();
var time = 0;

render();
function render(){
  requestAnimationFrame(render);
  time += clock.getDelta();
  flameMaterials[0].uniforms.time.value = time;
  flameMaterials[1].uniforms.time.value = time;
  candleLight2.position.x = Math.sin(time * Math.PI) * 0.25;
  candleLight2.position.z = Math.cos(time * Math.PI * 0.75) * 0.25;
  candleLight2.intensity = 2 + Math.sin(time * Math.PI * 2) * Math.cos(time * Math.PI * 1.5) * 0.25;
  controls.update();
  renderer.render(scene, camera);
}