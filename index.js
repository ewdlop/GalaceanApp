"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var engine_1 = require("@galacean/engine");
// Create engine by passing in the HTMLCanvasElement id and adjust canvas size
var engine = await engine_1.WebGLEngine.create({ canvas: "canvas-id" });
engine.canvas.resizeByClientSize();
// Get scene and create root entity
var scene = engine.sceneManager.activeScene;
var rootEntity = scene.createRootEntity("Root");
// Create light
var lightEntity = rootEntity.createChild("Light");
var directLight = lightEntity.addComponent(engine_1.DirectLight);
lightEntity.transform.setRotation(-45, -45, 0);
directLight.intensity = 0.4;
// Create camera
var cameraEntity = rootEntity.createChild("Camera");
cameraEntity.addComponent(engine_1.Camera);
cameraEntity.transform.setPosition(0, 0, 12);
// Create sphere
var meshEntity = rootEntity.createChild("Sphere");
var meshRenderer = meshEntity.addComponent(engine_1.MeshRenderer);
var material = new engine_1.BlinnPhongMaterial(engine);
meshRenderer.setMaterial(material);
meshRenderer.mesh = engine_1.PrimitiveMesh.createSphere(engine, 1);
// Run engine
engine.run();
