import * as GALACEAN from "@galacean/engine";

// Create engine by passing in the HTMLCanvasElement id and adjust canvas size
const engine = await GALACEAN.WebGLEngine.create({ canvas: "canvas-id" });
engine.canvas.resizeByClientSize();

// Get scene and create root entity
const scene = engine.sceneManager.activeScene;
const rootEntity = scene.createRootEntity("Root");

// Create light
const lightEntity = rootEntity.createChild("Light");
const directLight = lightEntity.addComponent(GALACEAN.DirectLight);
lightEntity.transform.setRotation(-45, -45, 0);

// Create camera
const cameraEntity = rootEntity.createChild("Camera");
cameraEntity.addComponent(GALACEAN.Camera);
cameraEntity.transform.setPosition(0, 0, 12);

// Create sphere
const meshEntity = rootEntity.createChild("Sphere");
const meshRenderer = meshEntity.addComponent(GALACEAN.MeshRenderer);
const material = new GALACEAN.BlinnPhongMaterial(engine);
meshRenderer.setMaterial(material);
meshRenderer.mesh = GALACEAN.PrimitiveMesh.createSphere(engine, 1);

// create box
const boxEntity = rootEntity.createChild("BoxEntity");
const boxRenderer = boxEntity.addComponent(GALACEAN.MeshRenderer);

const boxMtl = new GALACEAN.PBRMaterial(engine);
boxMtl.baseColor.set(0.6, 0.3, 0.3, 1.0);
boxMtl.metallic = 0.0;
boxMtl.roughness = 0.5;
boxRenderer.mesh = GALACEAN.PrimitiveMesh.createCuboid(engine, 2, 2, 2);
boxRenderer.setMaterial(boxMtl);

// Run engine
engine.run();