/**
 * @title Buffer Mesh Instance - 3D Instanced Rendering Demo
 * @category Mesh
 * @thumbnail https://mdn.alipayobjects.com/merchant_appfe/afts/img/A*jjZMTrp-vU8AAAAAAAAAAAAADiR2AQ/original
 * 
 * This demo showcases advanced 3D rendering using instanced geometry with Galacean Engine.
 * It renders 4000 cube instances efficiently using a single draw call.
 * Each cube has a unique position and color, demonstrating GPU instancing capabilities.
 */

// Import orbit controls for camera manipulation
import { OrbitControl } from "@galacean/engine-toolkit-controls";

// Import core Galacean Engine components for 3D rendering
import {
  Buffer,              // GPU buffer for vertex/index data
  BufferBindFlag,      // Specifies buffer type (vertex/index)
  BufferMesh,          // Custom mesh using buffer geometry
  BufferUsage,         // GPU memory usage pattern
  Camera,              // Camera component for 3D view
  Engine,              // Core engine interface
  IndexFormat,         // Index buffer data format
  Material,            // Material for rendering appearance
  Mesh,                // Base mesh interface
  MeshRenderer,        // Component that renders meshes
  Shader,              // Custom shader program
  Vector3,             // 3D vector for positions/directions
  VertexElement,       // Describes vertex attribute layout
  VertexElementFormat, // Format of vertex attributes
  WebGLEngine,         // WebGL-based rendering engine
} from "@galacean/engine";

// Initialize the 3D application
// WebGLEngine.create() returns a Promise, so we use .then() to handle initialization
WebGLEngine.create({ canvas: "canvas-id" }).then((engine) => {
  // Automatically resize canvas to match container size
  engine.canvas.resizeByClientSize();

  // Get the default scene and create a root entity to hold all objects
  const scene = engine.sceneManager.activeScene;
  const rootEntity = scene.createRootEntity("Root");

  // Initialize our custom shader that handles instanced rendering
  const shader = initCustomShader();

  // === CAMERA SETUP ===
  // Create camera entity and configure for 3D viewing
  const cameraEntity = rootEntity.createChild("Camera");
  const camera = cameraEntity.addComponent(Camera);
  
  // Add orbit controls so user can rotate/zoom the camera with mouse
  cameraEntity.addComponent(OrbitControl);
  
  // Position camera far back to see all 4000 cubes
  cameraEntity.transform.setPosition(0, 10, 160);
  cameraEntity.transform.lookAt(new Vector3(0, 0, 0)); // Look at origin
  
  // Extend far clipping plane to render distant objects
  camera.farClipPlane = 300;

  // === INSTANCED CUBE SETUP ===
  // Create a single cube entity that will be rendered 4000 times
  const cubeEntity = rootEntity.createChild("Cube");
  const cubeRenderer = cubeEntity.addComponent(MeshRenderer);
  
  // Create material using our custom instancing shader
  const material = new Material(engine, shader);
  
  // Rotate the entire cube cluster for better initial view
  cubeEntity.transform.rotate(0, 60, 0);
  
  // Assign our custom mesh with 4000 instances and the instancing material
  cubeRenderer.mesh = createCustomMesh(engine, 1.0); // 1.0 = cube size
  cubeRenderer.setMaterial(material);

  // Start the render loop
  engine.run();
});

/**
 * Creates a custom cube mesh with GPU instancing for efficient rendering of many copies.
 * This function demonstrates advanced 3D programming concepts:
 * - Vertex buffer objects (VBOs) for GPU memory management
 * - Index buffers for efficient vertex reuse
 * - Instanced rendering for drawing many objects in one draw call
 * - Custom vertex layouts with per-instance attributes
 * 
 * @param engine - The Galacean engine instance
 * @param size - Size of each cube (1.0 = unit cube)
 * @returns BufferMesh configured for instanced rendering
 */
function createCustomMesh(engine: Engine, size: number): Mesh {
  // Create custom geometry using BufferMesh for maximum control
  const geometry = new BufferMesh(engine, "CustomCubeGeometry");

  // === VERTEX DATA CREATION ===
  // Define cube vertices with positions and normals for each face
  // Format: [x, y, z, nx, ny, nz] for each vertex
  // prettier-ignore
  const vertices: Float32Array = new Float32Array([
          // Up face (top of cube) - normal pointing up (0,1,0)
          -size, size, -size, 0, 1, 0, size, size, -size, 0, 1, 0, size, size, size, 0, 1, 0, -size, size, size, 0, 1, 0,
          // Down face (bottom) - normal pointing down (0,-1,0)
          -size, -size, -size, 0, -1, 0, size, -size, -size, 0, -1, 0, size, -size, size, 0, -1, 0, -size, -size, size, 0, -1, 0,
          // Left face - normal pointing left (-1,0,0)
          -size, size, -size, -1, 0, 0, -size, size, size, -1, 0, 0, -size, -size, size, -1, 0, 0, -size, -size, -size, -1, 0, 0,
          // Right face - normal pointing right (1,0,0)
          size, size, -size, 1, 0, 0, size, size, size, 1, 0, 0, size, -size, size, 1, 0, 0, size, -size, -size, 1, 0, 0,
          // Front face - normal pointing forward (0,0,1)
          -size, size, size, 0, 0, 1, size, size, size, 0, 0, 1, size, -size, size, 0, 0, 1, -size, -size, size, 0, 0, 1,
          // Back face - normal pointing backward (0,0,-1)
          -size, size, -size, 0, 0, -1, size, size, -size, 0, 0, -1, size, -size, -size, 0, 0, -1, -size, -size, -size, 0, 0, -1]);

  // === INSTANCE DATA GENERATION ===
  // Generate data for 4000 cube instances, each with unique position and color
  const instanceCount = 4000;
  const instanceStride = 6; // 6 floats per instance: 3 for position + 3 for color
  const instanceData: Float32Array = new Float32Array(instanceCount * instanceStride);
  
  // Generate random position and color for each cube instance
  for (let i = 0; i < instanceCount; i++) {
    const offset = i * instanceStride;
    
    // Random position offset within a 60x60x60 cube centered at origin
    instanceData[offset] = (Math.random() - 0.5) * 60;     // X position
    instanceData[offset + 1] = (Math.random() - 0.5) * 60; // Y position
    instanceData[offset + 2] = (Math.random() - 0.5) * 60; // Z position
    
    // Random RGB color values (0.0 to 1.0)
    instanceData[offset + 3] = Math.random(); // Red component
    instanceData[offset + 4] = Math.random(); // Green component
    instanceData[offset + 5] = Math.random(); // Blue component
  }

  // === INDEX BUFFER CREATION ===
  // Define triangles for each cube face using vertex indices
  // Each face needs 2 triangles = 6 indices
  // prettier-ignore
  const indices: Uint16Array = new Uint16Array([
          // Up face: 2 triangles
          0, 2, 1, 2, 0, 3,
          // Down face: 2 triangles
          4, 6, 7, 6, 4, 5,
          // Left face: 2 triangles
          8, 10, 9, 10, 8, 11,
          // Right face: 2 triangles
          12, 14, 15, 14, 12, 13,
          // Front face: 2 triangles
          16, 18, 17, 18, 16, 19,
          // Back face: 2 triangles
          20, 22, 23, 22, 20, 21]);

  // === GPU BUFFER CREATION ===
  // Create GPU buffers for efficient rendering
  
  // Main vertex buffer: contains cube geometry (positions + normals)
  const vertexBuffer = new Buffer(
    engine,
    BufferBindFlag.VertexBuffer, // This is a vertex buffer
    vertices,                    // Vertex data
    BufferUsage.Static          // Data won't change (static geometry)
  );
  
  // Instance buffer: contains per-instance data (positions + colors)
  const instanceVertexBuffer = new Buffer(
    engine,
    BufferBindFlag.VertexBuffer, // Also a vertex buffer, but for instance data
    instanceData,                // Instance-specific data
    BufferUsage.Static          // Instance data is also static
  );
  
  // Index buffer: defines triangles using vertex indices
  const indexBuffer = new Buffer(
    engine,
    BufferBindFlag.IndexBuffer,  // This is an index buffer
    indices,                     // Triangle indices
    BufferUsage.Static          // Index data won't change
  );

  // === BUFFER BINDING ===
  // Bind buffers to the geometry with specific stride and binding points
  geometry.setVertexBufferBinding(vertexBuffer, 24, 0);        // 24 bytes per vertex (6 floats * 4 bytes), binding 0
  geometry.setVertexBufferBinding(instanceVertexBuffer, 24, 1); // 24 bytes per instance (6 floats * 4 bytes), binding 1
  geometry.setIndexBufferBinding(indexBuffer, IndexFormat.UInt16); // 16-bit unsigned integers for indices

  // === VERTEX LAYOUT DEFINITION ===
  // Define how the GPU should interpret the vertex data
  geometry.setVertexElements([
    // Vertex attributes from main vertex buffer (binding 0, instanceStepRate 0 = per-vertex)
    new VertexElement("POSITION", 0, VertexElementFormat.Vector3, 0, 0),  // Position at offset 0
    new VertexElement("NORMAL", 12, VertexElementFormat.Vector3, 0, 0),   // Normal at offset 12 bytes
    
    // Instance attributes from instance buffer (binding 1, instanceStepRate 1 = per-instance)
    new VertexElement("INSTANCE_OFFSET", 0, VertexElementFormat.Vector3, 1, 1),  // Instance position
    new VertexElement("INSTANCE_COLOR", 12, VertexElementFormat.Vector3, 1, 1),  // Instance color
  ]);

  // === SUBMESH DEFINITION ===
  // Define a single submesh that uses all indices
  geometry.addSubMesh(0, indices.length);

  // Set the number of instances to render
  geometry.instanceCount = instanceCount;

  return geometry;
}

/**
 * Creates a custom shader program for instanced rendering.
 * This shader receives both per-vertex and per-instance data:
 * - Per-vertex: POSITION (cube vertices)
 * - Per-instance: INSTANCE_OFFSET (position) and INSTANCE_COLOR (color)
 * 
 * The vertex shader positions each instance and passes color to fragment shader.
 * The fragment shader simply outputs the interpolated instance color.
 * 
 * @returns Compiled shader program ready for use
 */
function initCustomShader(): Shader {
  const shader = Shader.create(
    "CustomShader",
    
    // === VERTEX SHADER ===
    // Transforms vertices and handles per-instance positioning
    `uniform mat4 renderer_MVPMat;        // Model-View-Projection matrix for 3D transformation
      attribute vec4 POSITION;            // Base cube vertex position
      attribute vec3 INSTANCE_OFFSET;     // Per-instance position offset
      attribute vec3 INSTANCE_COLOR;      // Per-instance color
      
      uniform mat4 renderer_MVMat;        // Model-View matrix (currently unused)
      
      varying vec3 v_position;            // Pass position to fragment shader
      varying vec3 v_color;               // Pass color to fragment shader
      
      void main() {
        // Apply instance offset to base vertex position
        vec4 position = POSITION;
        position.xyz += INSTANCE_OFFSET;
        
        // Transform to screen coordinates
        gl_Position = renderer_MVPMat * position;

        // Pass instance color to fragment shader
        v_color = INSTANCE_COLOR;
      }`,

    // === FRAGMENT SHADER ===
    // Simply outputs the interpolated instance color
    `
      varying vec3 v_color;               // Color from vertex shader
      uniform vec4 u_color;               // Uniform color (currently unused)
      
      void main() {
        // Output the instance color with full opacity
        vec4 color = vec4(v_color, 1.0);
        gl_FragColor = color;
      }
      `
  );
  return shader;
}