import React, { useEffect, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Environment, Html, OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import './PCAssemblyScene.css';

const motherboardPosition = [0, 0, -0.62];

const partPositions = {
  motherboard: motherboardPosition,
  cpu: [0, 0, 0],
  cooler: [0, 0, 0],
  ram: [0, 0, 0],
  gpu: [0, 0, 0],
  storage: [0, 0, 0],
  psu: [0, -1.28, 0.12],
  fans: [0, 0.70, 0.55],
};

const motherboardOffsets = {
  cpu: [0, 0.18, 0.12],
  cooler: [0, 0.38, 0.12],
  ram: [-0.55, 0.15, 0.12],
  storage: [0.6, 0.18, 0.1],
  gpu: [0, -0.2, 0.28],
};

const partModels = {
  motherboard: { size: [1.7, 0.08, 1.25], color: "#1d4d65" },
  cpu: { size: [0.3, 0.15, 0.3], color: "#d6dbe1" },
  cooler: { size: [0.38, 0.2, 0.38], color: "#7dd3fc" },
  gpu: { size: [1.5, 0.18, 0.5], color: "#22d3ee" },
  ram: { size: [0.12, 0.65, 0.28], color: "#a78bfa" },
  storage: { size: [0.28, 0.12, 0.4], color: "#fbbf24" },
  psu: { size: [0.9, 0.24, 0.6], color: "#64748b" },
  fans: { size: [0.24, 0.24, 0.1], color: "#34d399" },
};

const partColors = {
  motherboard: "#1d4d65",
  cpu: "#d6dbe1",
  cooler: "#7dd3fc",
  gpu: "#22d3ee",
  ram: "#a78bfa",
  storage: "#fbbf24",
  psu: "#64748b",
  fans: "#34d399",
};

function GltfPart({
  url,
  position,
  scale = 0.7,
  rotation = [0, 0, 0],
}) {
  const { scene } = useGLTF(url);

  const clonedScene = scene.clone(true);

  return (
    <primitive
      object={clonedScene}
      position={position}
      rotation={rotation}
      scale={scale}
    />
  );
}

function AssemblyPart({ category, component, rgbColor = "#67e8f9" }) {
  if (!component) return null;

  let position;

  if (category === "motherboard") {
    position = motherboardPosition;
  } else if (motherboardOffsets[category]) {
    const mount = motherboardOffsets[category];
    position = [
      motherboardPosition[0] + mount[0],
      motherboardPosition[1] + mount[1],
      motherboardPosition[2] + mount[2],
    ];
  } else {
    position = partPositions[category] || [0, 0, 0];
  }

  /*
   * Rotations
   */
  const rotations = {
    motherboard: [0, 0, 0],

    cpu: [0, 0, 0],

    cooler: [0, 0, 0],

    ram: [0, 0, 0],

    storage: [0, 0, 0],

    /*
     * GPU is horizontal like a real GPU.
     */
    gpu: [0, 0, 0],

    psu: [0, 0, 0],

    fans: [0, 0, 0],
  };

  const rotation =
    rotations[category] || [0, 0, 0];

  /*
   * IMPORTANT:
   *
   * GLB models have different original sizes.
   */
  const scales = {
    motherboard: 1.15,

    cpu: 0.34,

    cooler: 0.4,

    ram: 0.34,

    storage: 0.32,

    gpu: 0.3,

    psu: 0.50,

    fans: 0.38,
  };

  const scale =
    scales[category] || 0.5;

  /*
   * REAL GLB MODEL
   */
  if (component.modelUrl) {
    return (
      <GltfPart
        url={component.modelUrl}
        position={position}
        rotation={rotation}
        scale={scale}
      />
    );
  }

  /*
   * FALLBACK MODEL
   */
  const color =
    partColors[category] || "#ffffff";
  const glowColor =
    ["motherboard", "cooler", "ram", "fans"].includes(category)
      ? rgbColor
      : color;

  const dimensions =
    category === "motherboard"
      ? [1.7, 0.08, 1.25]
      : category === "cpu"
      ? [0.32, 0.12, 0.32]
      : category === "cooler"
      ? [0.42, 0.22, 0.42]
      : category === "gpu"
      ? [1.5, 0.18, 0.48]
      : category === "ram"
      ? [0.12, 0.62, 0.28]
      : category === "storage"
      ? [0.32, 0.08, 0.42]
      : category === "psu"
      ? [0.85, 0.25, 0.60]
      : category === "fans"
      ? [0.30, 0.30, 0.10]
      : [0.50, 0.15, 0.40];

  return (
    <group
      position={position}
      rotation={rotation}
    >
      <mesh
        castShadow
        receiveShadow
      >
        <boxGeometry args={dimensions} />

        <meshStandardMaterial
          color={color}
          metalness={0.55}
          roughness={0.3}
          emissive={glowColor}
          emissiveIntensity={category === "motherboard" ? 0.25 : 0.08}
        />
      </mesh>

      <Html
        center
        distanceFactor={5}
        className="pc-assembly-label"
      >
        {category.toUpperCase()}
      </Html>
    </group>
  );
}

function AssemblyCase({ component, rgbColor = "#67e8f9" }) {
  return (
    <group>

      {/* =========================
          MAIN CASE BODY
      ========================= */}

      <mesh
        position={[0, 0, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry
          args={[2.45, 3.15, 1.70]}
        />

        <meshPhysicalMaterial
          color="#111827"
          metalness={0.75}
          roughness={0.25}
          transparent
          opacity={0.18}
          transmission={0.15}
        />
      </mesh>


      {/* =========================
          BACK MOTHERBOARD PANEL
      ========================= */}

      <mesh
        position={[0, 0, -0.87]}
        receiveShadow
      >
        <boxGeometry
          args={[2.20, 2.90, 0.06]}
        />

        <meshStandardMaterial
          color="#0b1220"
          metalness={0.7}
          roughness={0.35}
        />
      </mesh>


      {/* =========================
          LEFT CASE FRAME
      ========================= */}

      <mesh
        position={[-1.18, 0, 0]}
        castShadow
      >
        <boxGeometry
          args={[0.10, 3.15, 1.60]}
        />

        <meshStandardMaterial
          color="#172554"
          metalness={0.8}
          roughness={0.25}
        />
      </mesh>


      {/* =========================
          RIGHT CASE FRAME
      ========================= */}

      <mesh
        position={[1.18, 0, 0]}
        castShadow
      >
        <boxGeometry
          args={[0.10, 3.15, 1.60]}
        />

        <meshStandardMaterial
          color="#172554"
          metalness={0.8}
          roughness={0.25}
        />
      </mesh>


      {/* =========================
          TOP FRAME
      ========================= */}

      <mesh
        position={[0, 1.52, 0]}
        castShadow
      >
        <boxGeometry
          args={[2.45, 0.12, 1.70]}
        />

        <meshStandardMaterial
          color="#1e3a8a"
          metalness={0.8}
          roughness={0.25}
        />
      </mesh>


      {/* =========================
          BOTTOM FRAME
      ========================= */}

      <mesh
        position={[0, -1.52, 0]}
        castShadow
      >
        <boxGeometry
          args={[2.45, 0.12, 1.70]}
        />

        <meshStandardMaterial
          color="#111827"
          metalness={0.8}
          roughness={0.25}
        />
      </mesh>


      {/* =========================
          FRONT GLASS
      ========================= */}

      <mesh
        position={[0, 0, 0.86]}
      >
        <boxGeometry
          args={[2.20, 2.85, 0.035]}
        />

        <meshPhysicalMaterial
          color="#0ea5e9"
          transparent
          opacity={0.10}
          roughness={0.05}
          metalness={0.15}
          transmission={0.25}
        />
      </mesh>


      {/* =========================
          RGB STRIP - LEFT
      ========================= */}

      <mesh
        position={[-1.08, 0, 0.89]}
      >
        <boxGeometry
          args={[0.035, 2.75, 0.025]}
        />

        <meshStandardMaterial
          color={rgbColor}
          emissive={rgbColor}
          emissiveIntensity={2}
        />
      </mesh>


      {/* =========================
          RGB STRIP - RIGHT
      ========================= */}

      <mesh
        position={[1.08, 0, 0.89]}
      >
        <boxGeometry
          args={[0.035, 2.75, 0.025]}
        />

        <meshStandardMaterial
          color={rgbColor}
          emissive={rgbColor}
          emissiveIntensity={2}
        />
      </mesh>


      {/* =========================
          PSU SHROUD
      ========================= */}

      <mesh
        position={[0, -1.30, -0.05]}
        castShadow
      >
        <boxGeometry
          args={[2.15, 0.55, 1.45]}
        />

        <meshStandardMaterial
          color="#111827"
          metalness={0.65}
          roughness={0.35}
        />
      </mesh>


      {/* =========================
          PSU SHROUD RGB
      ========================= */}

      <mesh
        position={[0, -1.03, 0.73]}
      >
        <boxGeometry
          args={[1.75, 0.025, 0.025]}
        />

        <meshStandardMaterial
          color={rgbColor}
          emissive={rgbColor}
          emissiveIntensity={2}
        />
      </mesh>


      {/* =========================
          TOP FAN
      ========================= */}

      <mesh
        position={[0, 1.38, 0]}
      >
        <cylinderGeometry
          args={[0.38, 0.38, 0.06, 32]}
        />

        <meshStandardMaterial
          color="#111827"
          metalness={0.5}
          roughness={0.4}
        />
      </mesh>


      {/* =========================
          FEET
      ========================= */}

      <mesh
        position={[-0.85, -1.67, 0.55]}
      >
        <boxGeometry
          args={[0.35, 0.20, 0.35]}
        />

        <meshStandardMaterial
          color="#020617"
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>

      <mesh
        position={[0.85, -1.67, 0.55]}
      >
        <boxGeometry
          args={[0.35, 0.20, 0.35]}
        />

        <meshStandardMaterial
          color="#020617"
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>

    </group>
  );
}

function AssemblyCamera({ cameraView }) {
  const { camera } = useThree();
  useEffect(() => {
    const positions = {
      front: [4.2, 2.4, 5.4],
      inside: [3.2, 1.1, 3.6],
      back: [-4.2, 2.2, -5.2],
      top: [3.5, 5.8, 3.2],
    };
    camera.position.set(...positions[cameraView]);
    camera.lookAt(0, 0, 0);
  }, [camera, cameraView]);
  return null;
}

export default function PCAssemblyScene({
  builderConfig,
  modelAssets = [],
  cameraView = "front",
  zoomLevel = 1,
  rotationAngle = 15,
  showControls = true,
  rgbColor = "#67e8f9",
}) {
  const groupRef = useRef();
  useEffect(() => {
    if (groupRef.current)
      groupRef.current.rotation.y = THREE.MathUtils.degToRad(
        rotationAngle - 15,
      );
  }, [rotationAngle]);

  return (
    <Canvas
      shadows
      camera={{ position: [4.2, 2.4, 5.4], fov: 42 }}
      className="pc-builder-canvas"
    >
      <AssemblyCamera cameraView={cameraView} />
      <ambientLight intensity={0.7} />
      <spotLight
        position={[4, 6, 5]}
        intensity={90}
        angle={0.35}
        penumbra={1}
        castShadow
      />
      <pointLight position={[-3, 1, 2]} intensity={18} color="#00d4ff" />
      <group ref={groupRef} scale={zoomLevel}>
        <AssemblyCase component={builderConfig.case} rgbColor={rgbColor} />
        {Object.entries(builderConfig).map(([category, component]) => {
          const model = modelAssets.find(
            (asset) =>
              asset.assignedProduct === component?.name &&
              (asset.url || asset.modelUrl),
          );
          const renderableComponent = model
            ? { ...component, modelUrl: model.url || model.modelUrl }
            : component;
          return (
            category !== "case" && (
              <AssemblyPart
                key={category}
                category={category}
                component={renderableComponent}
                rgbColor={rgbColor}
              />
            )
          );
        })}
      </group>
      <gridHelper
        args={[8, 16, "#164e63", "#0f2438"]}
        position={[0, -1.65, 0]}
      />
      <Environment preset="city" />
      {showControls && (
        <OrbitControls
          enablePan={false}
          minDistance={3.5}
          maxDistance={9}
          target={[0, 0, 0]}
        />
      )}
    </Canvas>
  );
}
