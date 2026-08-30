import React, { useEffect, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Environment, Html, OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import './PCAssemblyScene.css';

const partPositions = {
  motherboard: [0, 0.15, 0.18],
  cpu: [-0.25, 0.5, 0.05],
  cooler: [-0.25, 0.78, 0.05],
  gpu: [0, -0.05, -0.34],
  ram: [-0.62, 0.48, 0.02],
  storage: [0.48, 0.48, 0.02],
  psu: [0, -0.92, 0.04],
  fans: [0.78, 0.15, -0.12]
};

const partColors = {
  motherboard: '#1d4d65',
  cpu: '#d6dbe1',
  cooler: '#7dd3fc',
  gpu: '#22d3ee',
  ram: '#a78bfa',
  storage: '#fbbf24',
  psu: '#64748b',
  fans: '#34d399'
};

function GltfPart({ url, position, scale = 0.7 }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene.clone()} position={position} scale={scale} />;
}

function AssemblyPart({ category, component }) {
  if (!component) return null;
  if (component.modelUrl) return <GltfPart url={component.modelUrl} position={partPositions[category]} />;

  const color = partColors[category];
  const position = partPositions[category];
  const isGpu = category === 'gpu';
  const dimensions = isGpu ? [1.5, 0.18, 0.5] : category === 'ram' ? [0.1, 0.65, 0.28] : [0.55, 0.12, 0.45];

  return (
    <group position={position}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={dimensions} />
        <meshStandardMaterial color={color} metalness={0.55} roughness={0.3} emissive={isGpu ? color : '#000000'} emissiveIntensity={isGpu ? 0.18 : 0} />
      </mesh>
      <mesh position={[0, dimensions[1] / 2 + 0.012, 0]}>
        <boxGeometry args={[Math.max(0.12, dimensions[0] * 0.55), 0.025, Math.max(0.12, dimensions[2] * 0.55)]} />
        <meshStandardMaterial color="#111827" metalness={0.2} roughness={0.65} />
      </mesh>
      <Html center distanceFactor={5} className="pc-assembly-label">
        {category.toUpperCase()}
      </Html>
    </group>
  );
}

function AssemblyCase({ component }) {
  const color = component ? '#15283a' : '#263447';
  return (
    <group>
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[2.25, 3.2, 1.55]} />
        <meshPhysicalMaterial color={color} metalness={0.7} roughness={0.22} transparent opacity={0.32} transmission={0.15} />
      </mesh>
      <mesh position={[0, 0, -0.79]}>
        <boxGeometry args={[2.05, 3, 0.04]} />
        <meshStandardMaterial color="#07111d" metalness={0.2} roughness={0.6} />
      </mesh>
      <mesh position={[-1.08, 0, 0]}>
        <boxGeometry args={[0.06, 3.1, 1.45]} />
        <meshStandardMaterial color="#0b1624" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[1.08, 0, 0]}>
        <boxGeometry args={[0.06, 3.1, 1.45]} />
        <meshStandardMaterial color="#0b1624" metalness={0.8} roughness={0.3} />
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
      top: [3.5, 5.8, 3.2]
    };
    camera.position.set(...positions[cameraView]);
    camera.lookAt(0, 0, 0);
  }, [camera, cameraView]);
  return null;
}

export default function PCAssemblyScene({ builderConfig, modelAssets = [], cameraView = 'front', zoomLevel = 1, rotationAngle = 15, showControls = true }) {
  const groupRef = useRef();
  useEffect(() => {
    if (groupRef.current) groupRef.current.rotation.y = THREE.MathUtils.degToRad(rotationAngle - 15);
  }, [rotationAngle]);

  return (
    <Canvas shadows camera={{ position: [4.2, 2.4, 5.4], fov: 42 }} className="pc-builder-canvas">
      <AssemblyCamera cameraView={cameraView} />
      <ambientLight intensity={0.7} />
      <spotLight position={[4, 6, 5]} intensity={90} angle={0.35} penumbra={1} castShadow />
      <pointLight position={[-3, 1, 2]} intensity={18} color="#00d4ff" />
      <group ref={groupRef} scale={zoomLevel}>
        <AssemblyCase component={builderConfig.case} />
        {Object.entries(builderConfig).map(([category, component]) => {
          const model = modelAssets.find(asset => asset.assignedProduct === component?.name && (asset.url || asset.modelUrl));
          const renderableComponent = model ? { ...component, modelUrl: model.url || model.modelUrl } : component;
          return category !== 'case' && <AssemblyPart key={category} category={category} component={renderableComponent} />;
        })}
      </group>
      <gridHelper args={[8, 16, '#164e63', '#0f2438']} position={[0, -1.65, 0]} />
      <Environment preset="city" />
      {showControls && <OrbitControls enablePan={false} minDistance={3.5} maxDistance={9} target={[0, 0, 0]} />}
    </Canvas>
  );
}
