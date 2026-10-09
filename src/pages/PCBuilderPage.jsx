import React, { useEffect, useMemo, useRef, useState } from "react";
import "./PCBuilderPage.css";
import { useApp } from "../context/AppContext";
import { CATEGORIES } from "../data/catalogMeta";
import { formatCurrency } from "../utils/currency";
import { downloadBuildPdf } from "../utils/pdf";
import {
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Move,
  CheckCircle2,
  AlertTriangle,
  Zap,
  ShoppingCart,
  Bookmark,
  Plus,
  Trash2,
  Cpu,
  Monitor,
  CircuitBoard,
  Layers,
  HardDrive,
  Box,
  Snowflake,
  X,
  Share2,
  Printer,
  Sliders,
  ArrowUpRight,
  Gauge,
} from "lucide-react";
import { Canvas, useThree } from "@react-three/fiber";
import { Environment, Html, OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
const iconMap = {
  cpu: Cpu,
  gpu: Monitor,
  motherboard: CircuitBoard,
  ram: Layers,
  storage: HardDrive,
  psu: Zap,
  case: Box,
  cooler: Snowflake,
};

const motherboardPosition = [0, 0, 0.15];
const referenceModelScale = 0.62;
const referenceModelOrigin = [
  -8.538 * referenceModelScale,
  0.392 * referenceModelScale,
  -0.798 * referenceModelScale,
];

const partPositions = {
  motherboard: motherboardPosition,
  cpu: [0.491, 0.605, -0.567],
  cooler: [-0.1, 1.25, 0.15],
  ram: [0, 0, 0],
  gpu: [0, 0, 0],
  storage: [0, 0, 0],
  psu: [0, -1.28, 0.12],
};

const motherboardSlots = {
  cpu: [[0, 0.18, 0.12]],
  cooler: [[0, 0.38, 0.12]],
  ram: [
    [-0.55, 0.15, 0.12],
    [-0.35, 0.15, 0.12],
    [0.35, 0.15, 0.12],
    [0.55, 0.15, 0.12],
  ],
  storage: [[0.6, 0.18, 0.1], [0.82, 0.18, 0.1], [-0.6, 0.18, 0.1]],
  gpu: [[0, -0.2, 0.28], [0, -0.42, 0.28]],
};

const partModels = {
  motherboard: { size: [1.7, 0.08, 1.25], color: "#1d4d65" },
  cpu: { size: [0.3, 0.15, 0.3], color: "#d6dbe1" },
  cooler: { size: [0.48, 0.62, 0.48], color: "#7dd3fc" },
  gpu: { size: [1.5, 0.18, 0.5], color: "#22d3ee" },
  ram: { size: [0.12, 0.65, 0.28], color: "#a78bfa" },
  storage: { size: [0.28, 0.12, 0.4], color: "#fbbf24" },
  psu: { size: [0.9, 0.24, 0.6], color: "#64748b" },
};

const partColors = {
  motherboard: "#1d4d65",
  cpu: "#d6dbe1",
  cooler: "#7dd3fc",
  gpu: "#22d3ee",
  ram: "#a78bfa",
  storage: "#fbbf24",
  psu: "#64748b",
};

const defaultModelUrls = {
  cpu: "/models/reference-pc/cpu_ryzen_5_3600.glb",
  gpu: "/models/reference-pc/gpu.glb",
  motherboard: "/models/reference-pc/motherboard.glb",
  ram: "/models/reference-pc/ram.glb",
  storage: "/models/reference-pc/storage.glb",
  psu: "/models/reference-pc/psu.glb",
  case: "/models/case/case.glb",
  cooler: "/models/reference-pc/cooler.glb",
};

const defaultModelScales = {
  motherboard: 0.68,
  cpu: 0.0101,
  cooler: 0.5,
  ram: 0.85,
  gpu: 0.48,
  storage: 0.5,
  psu: 0.52,
  case: 0.48,
};

const partTransforms = {
  motherboard: {
    position: [0, 0, 0.15],
    rotation: [0, 0, 0],
    scale: 0.68,
  },
};

function GltfPart({
  url,
  position,
  scale = 0.7,
  rotation = [0, 0, 0],
  centerModel = true,
}) {
  const { scene } = useGLTF(url);
  const model = useMemo(() => {
    const cloned = scene.clone(true);
    if (centerModel) {
      const box = new THREE.Box3().setFromObject(cloned);
      const center = box.getCenter(new THREE.Vector3());
      cloned.position.sub(center);
    }
    return cloned;
  }, [scene, centerModel]);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <primitive object={model} />
    </group>
  );
}

function DraggableGroup({
  position,
  rotation,
  children,
  disabled = false,
  snapPositions,
  snapRadius = 0.4,
  onDragStart,
  onDragEnd,
}) {
  const groupRef = useRef();

  const handlePointerOver = (event) => {
    event.stopPropagation();
    const materials = Array.isArray(event.object.material)
      ? event.object.material
      : [event.object.material];
    materials.forEach((material) => {
      if (!material?.emissive) return;
      material.userData.hoverEmissive = material.emissive.clone();
      material.userData.hoverEmissiveIntensity = material.emissiveIntensity;
      material.emissive.set("#facc15");
      material.emissiveIntensity = Math.max(material.emissiveIntensity, 0.22);
    });
  };

  const handlePointerOut = (event) => {
    const materials = Array.isArray(event.object.material)
      ? event.object.material
      : [event.object.material];
    materials.forEach((material) => {
      if (!material?.emissive || !material.userData.hoverEmissive) return;
      material.emissive.copy(material.userData.hoverEmissive);
      material.emissiveIntensity = material.userData.hoverEmissiveIntensity;
      delete material.userData.hoverEmissive;
      delete material.userData.hoverEmissiveIntensity;
    });
  };

  const clampToBoardArea = (x, z) => {
    const maxX = 2.9;
    const maxZ = 2.1;
    const clampedX = THREE.MathUtils.clamp(x, -maxX, maxX);
    const clampedZ = THREE.MathUtils.clamp(z, -maxZ, maxZ);
    return [clampedX, 0, clampedZ];
  };

  const handlePointerDown = (event) => {
    if (disabled) return;
    event.stopPropagation();
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.15);
    const point = new THREE.Vector3();
    if (event.ray.intersectPlane(plane, point)) {
      groupRef.current.parent?.worldToLocal(point);
      const [x, , z] = clampToBoardArea(point.x, point.z);
      groupRef.current.userData.offset = new THREE.Vector3(x, 0, z).sub(groupRef.current.position);
      groupRef.current.userData.isDragging = true;
      event.target.setPointerCapture?.(event.pointerId);
      if (onDragStart) onDragStart();
    }
  };

  const handlePointerMove = (event) => {
    if (disabled || !groupRef.current?.userData.offset) return;
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.15);
    const point = new THREE.Vector3();
    if (event.ray.intersectPlane(plane, point)) {
      groupRef.current.parent?.worldToLocal(point);
      const [x, , z] = clampToBoardArea(point.x, point.z);
      const nextPosition = new THREE.Vector3(x, 0, z).sub(groupRef.current.userData.offset);
      groupRef.current.position.set(nextPosition.x, nextPosition.y, nextPosition.z);
    }
  };

  const handlePointerUp = (event) => {
    if (!groupRef.current?.userData.isDragging) return;
    const group = groupRef.current;
    if (snapPositions?.length) {
      const nearestPosition = snapPositions.reduce((nearest, candidate) => {
        const candidateDistance = (candidate[0] - group.position.x) ** 2 +
          (candidate[2] - group.position.z) ** 2;
        const nearestDistance = (nearest[0] - group.position.x) ** 2 +
          (nearest[2] - group.position.z) ** 2;
        return candidateDistance < nearestDistance ? candidate : nearest;
      });
      const distanceSquared =
        (nearestPosition[0] - group.position.x) ** 2 +
        (nearestPosition[2] - group.position.z) ** 2;
      if (distanceSquared <= snapRadius ** 2) {
        group.position.set(...nearestPosition);
      }
    }
    delete group.userData.offset;
    delete group.userData.isDragging;
    event.target.releasePointerCapture?.(event.pointerId);
    if (onDragEnd) onDragEnd();
  };

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={(event) => {
        event.stopPropagation();
      }}
      onContextMenu={(event) => {
        event.nativeEvent?.preventDefault?.();
      }}
    >
      {children}
    </group>
  );
}

function AssemblyPart({
  category,
  component,
  rgbColor = "#67e8f9",
  onSelect,
  onDragStart,
  onDragEnd,
}) {
  if (!component) return null;

  let position;
  if (category === "motherboard") {
    position = motherboardPosition;
  } else if (category === "cpu") {
    position = partPositions.cpu;
  } else if (category === "cooler") {
    position = partPositions.cooler;
  } else if (motherboardSlots[category]) {
    const mount = motherboardSlots[category][0];
    position = [
      motherboardPosition[0] + mount[0],
      motherboardPosition[1] + mount[1],
      motherboardPosition[2] + mount[2],
    ];
  } else {
    position = partPositions[category] || [0, 0, 0];
  }

  const isMotherboard = category === "motherboard";
  const transform = partTransforms[category] || {
    position,
    rotation: [0, 0, 0],
    scale: defaultModelScales[category] ?? 0.7,
  };
  const rotation = isMotherboard ? transform.rotation : [0, 0, 0];
  const modelUrl = component.modelUrl || defaultModelUrls[category];
  const usesReferenceModel =
    category !== "cpu" && modelUrl?.startsWith("/models/reference-pc/");
  const snapPositions = category === "cpu"
    ? [position]
    : motherboardSlots[category]?.map(([x, y, z]) => [
        motherboardPosition[0] + x,
        motherboardPosition[1] + y,
        motherboardPosition[2] + z,
      ]) || [position];
  const groupPosition = usesReferenceModel
    ? [0, 0, 0]
    : isMotherboard ? transform.position : position;

  if (modelUrl) {
    return (
      <DraggableGroup
        position={groupPosition}
        rotation={rotation}
        disabled={isMotherboard}
        snapPositions={usesReferenceModel ? [[0, 0, 0]] : snapPositions}
        onSelect={onSelect}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <GltfPart
          url={modelUrl}
          position={usesReferenceModel ? referenceModelOrigin : [0, 0, 0]}
          rotation={category === "cpu" ? [0, 0, Math.PI / 2] : [0, 0, 0]}
          rgbColor={rgbColor}
          scale={usesReferenceModel
            ? referenceModelScale
            : isMotherboard ? transform.scale : defaultModelScales[category] ?? 0.7}
          centerModel={!usesReferenceModel}
        />
      </DraggableGroup>
    );
  }

  const preset = partModels[category];
  const color = preset?.color || partColors[category] || "#ffffff";
  const isGpu = category === "gpu";
  const glowColor = rgbColor;
  const dimensions = preset?.size || (
    isGpu
      ? [1.5, 0.18, 0.5]
      : category === "ram"
        ? [0.12, 0.62, 0.28]
        : [0.55, 0.12, 0.45]
  );
  if (category === "cpu") {
    return (
      <DraggableGroup
        position={position}
        rotation={rotation}
        snapPositions={snapPositions}
        onSelect={onSelect}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <group>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.36, 0.055, 0.36]} />
            <meshStandardMaterial color="#111827" metalness={0.48} roughness={0.42} />
          </mesh>
          <mesh position={[0, 0.043, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.29, 0.032, 0.29]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.82} roughness={0.24} />
          </mesh>
          <Html center distanceFactor={5} className="pc-assembly-label">
            CPU
          </Html>
        </group>
      </DraggableGroup>
    );
  }

  if (category === "motherboard") {
    return (
      <DraggableGroup
        position={position}
        rotation={rotation}
        disabled
        onSelect={onSelect}
      >
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.7, 0.08, 1.25]} />
          <meshStandardMaterial
            color={color}
            metalness={0.55}
            roughness={0.3}
            emissive={glowColor}
            emissiveIntensity={0.22}
          />
        </mesh>
      </DraggableGroup>
    );
  }

  return (
    <DraggableGroup
      position={position}
      rotation={rotation}
      snapPositions={snapPositions}
      onSelect={onSelect}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <group>
        <mesh castShadow receiveShadow>
          <boxGeometry args={dimensions} />
          <meshStandardMaterial
            color={color}
            metalness={0.55}
            roughness={0.3}
            emissive={glowColor}
            emissiveIntensity={category === "gpu" ? 0.18 : 0.08}
          />
        </mesh>
        <mesh position={[0, dimensions[1] / 2 + 0.012, 0]}>
          <boxGeometry
            args={[
              Math.max(0.12, dimensions[0] * 0.55),
              0.025,
              Math.max(0.12, dimensions[2] * 0.55),
            ]}
          />
          <meshStandardMaterial
            color="#111827"
            metalness={0.2}
            roughness={0.65}
          />
        </mesh>
        <Html center distanceFactor={5} className="pc-assembly-label">
          {category.toUpperCase()}
        </Html>
      </group>
    </DraggableGroup>
  );
}

function AssemblyCase({ onSelect, rgbColor }) {
  return (
    <DraggableGroup position={[0, 0, 0]} disabled onSelect={onSelect}>
      <GltfPart
        url="/models/pc-configurator-case.glb"
        position={referenceModelOrigin}
        scale={referenceModelScale}
        centerModel={false}
        rgbColor={rgbColor}
      />
    </DraggableGroup>
  );
}

function AssemblyCamera({ cameraView, controlsRef }) {
  const { camera } = useThree();
  useEffect(() => {
    const positions = {
      front: [-4.2, 2.4, 5.4],
      inside: [-3.2, 1.1, 3.6],
      back: [4.2, 2.2, -5.2],
      top: [3.5, 5.8, 3.2],
    };
    controlsRef.current?.reset();
    controlsRef.current?.target.set(0, 0, 0);
    camera.position.set(...positions[cameraView]);
    camera.lookAt(0, 0, 0);
    controlsRef.current?.update();
  }, [camera, cameraView, controlsRef]);
  return null;
}

function PCAssemblyScene({
  builderConfig,
  modelAssets,
  cameraView,
  zoomLevel,
  rotationAngle,
  rgbColor = "#67e8f9",
  onSelectPart,
}) {
  const groupRef = useRef();
  const controlsRef = useRef();
  useEffect(() => {
    if (groupRef.current)
      groupRef.current.rotation.y = THREE.MathUtils.degToRad(
        rotationAngle - 15,
      );
  }, [rotationAngle]);

  const disableCameraDrag = () => {
    if (controlsRef.current) controlsRef.current.enabled = false;
  };

  const enableCameraDrag = () => {
    if (controlsRef.current) controlsRef.current.enabled = true;
  };

  return (
    <Canvas
      shadows
      camera={{ position: [4.2, 2.4, 5.4], fov: 42 }}
      className="pc-builder-canvas"
    >
      <AssemblyCamera cameraView={cameraView} controlsRef={controlsRef} />
      <ambientLight intensity={0.7} />
      <spotLight
        position={[4, 6, 5]}
        intensity={90}
        angle={0.35}
        penumbra={1}
        castShadow
      />
      <pointLight position={[-3, 1, 2]} intensity={18} color="#00d4ff" />
      <group ref={groupRef} scale={zoomLevel * 0.78}>
        {builderConfig.case && (
          <AssemblyCase onSelect={() => onSelectPart("case")} />
        )}
        {Object.entries(builderConfig).map(([category, component]) => {
          const usesBundledModel = ["cpu", "motherboard", "ram", "cooler"].includes(category);
          const model = usesBundledModel
            ? null
            : modelAssets?.find(
                (asset) =>
                  asset.assignedProduct === component?.name &&
                  (asset.url || asset.modelUrl),
              );
          const resolvedModelUrl = usesBundledModel
            ? defaultModelUrls[category]
            : model?.url || model?.modelUrl || defaultModelUrls[category];
          const renderableComponent = resolvedModelUrl && component
            ? { ...component, modelUrl: resolvedModelUrl }
            : component;
          return (
            category !== "case" && (
              <AssemblyPart
                key={category}
                category={category}
                component={renderableComponent}
                rgbColor={rgbColor}
                onSelect={() => onSelectPart(category)}
                onDragStart={disableCameraDrag}
                onDragEnd={enableCameraDrag}
              />
            )
          );
        })}
      </group>
      <mesh rotation-x={-Math.PI / 2} position={[0, -1.8, 0]} receiveShadow onClick={(event) => event.stopPropagation()}>
        <planeGeometry args={[120, 120]} />
        <meshStandardMaterial color="#0a1626" metalness={0.2} roughness={0.9} />
      </mesh>
      <gridHelper
        args={[120, 120, "#164e63", "#0f2438"]}
        position={[0, -1.79, 0]}
      />
      <Environment preset="city" />
      <OrbitControls
        ref={controlsRef}
        enablePan={true}
        panSpeed={1.5}
        minDistance={0.1}
        maxDistance={Infinity}
        enableDamping
        target={[0, 0, 0]}
      />
    </Canvas>
  );
}
export default function PCBuilderPage() {
  const {
    products,
    builderConfig,
    setBuilderSlot,
    clearBuilderSlot,
    saveCurrentBuild,
    addCustomBuildToCart,
    userRole,
    requireAuth,
    showToast,
    priorityProfile,
    setPriorityProfile,
    bottleneckData,
    compatibilityStatus,
    getRecommendationsForSlot,
    futureUpgradesAdvice,
    models3d,
  } = useApp();

  // Studio Viewport State
  const [cameraView, setCameraView] = useState("front"); // 'front' | 'back' | 'top' | 'inside'
  const [rotationAngle, setRotationAngle] = useState(15);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rgbColor, setRgbColor] = useState("#67e8f9");
  const rgbPresets = ["#67e8f9", "#8b5cf6", "#22c55e", "#f59e0b", "#f43f5e", "#f8fafc"];
  const [activeTab, setActiveTab] = useState("analyzer"); // 'summary' | 'analyzer' | 'upgrades' | 'priorities'
  const [selectedResolution, setSelectedResolution] = useState("1440p"); // '1080p' | '1440p' | '4k'

  // Component Selection Modal / Drawer
  const [activeSlotPicker, setActiveSlotPicker] = useState(null); // category key string e.g. 'gpu'
  const [buildNameInput, setBuildNameInput] = useState(
    "NextGear Studio Battlestation",
  );
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [printModalOpen, setPrintModalOpen] = useState(false);

  // Financial & Diagnostic calculations
  const installedSlots = Object.entries(builderConfig).filter(
    ([_, comp]) => comp !== null,
  );
  const totalPrice = installedSlots.reduce(
    (sum, [_, comp]) => sum + (comp?.price || 0),
    0,
  );
  const totalWattage = installedSlots
    .filter(([slot]) => slot !== "psu")
    .reduce((sum, [_, comp]) => sum + (comp?.wattage || 0), 0);
  const psuWattage = builderConfig.psu?.wattage || 1000;
  const wattagePercentage = Math.min(
    100,
    Math.round((totalWattage / psuWattage) * 100),
  );
  const averageScore =
    installedSlots.length > 0
      ? Math.round(
          installedSlots.reduce(
            (sum, [_, comp]) => sum + (comp?.performanceScore || 85),
            0,
          ) / installedSlots.length,
        )
      : null;
  const upgradeSignals = [
    builderConfig.motherboard?.specs?.socket,
    builderConfig.motherboard?.specs?.slots,
    builderConfig.case?.specs?.gpuClearance,
    builderConfig.psu?.wattage,
    builderConfig.ram?.specs?.capacity,
  ].filter(Boolean).length;
  const coolingScore = builderConfig.case || builderConfig.cooler
    ? Math.round(
        (builderConfig.case ? 50 : 0) +
          (builderConfig.cooler
            ? Math.min(100, Number(builderConfig.cooler.performanceScore) || 60) / 2
            : 0),
      )
    : null;
  const compatibilityScore = installedSlots.length
    ? Math.max(
        0,
        100 -
          compatibilityStatus.issues.filter((issue) => issue.type === "error").length * 35 -
          compatibilityStatus.issues.filter((issue) => issue.type === "warning").length * 15,
      )
    : null;
  const compatibilityErrorCount = compatibilityStatus.issues.filter(
    (issue) => issue.type === "error",
  ).length;
  const compatibilityWarningCount = compatibilityStatus.issues.filter(
    (issue) => issue.type === "warning",
  ).length;
  const compatibilityVerified =
    installedSlots.length > 0 &&
    compatibilityErrorCount === 0 &&
    compatibilityWarningCount === 0;
  const powerEfficiencyScore = builderConfig.psu
    ? Math.max(0, 100 - wattagePercentage)
    : null;
  const valueScores = installedSlots.flatMap(([category, component]) => {
    const price = Number(component.price) || 0;
    const performance = Number(component.performanceScore) || 0;
    if (!price || !performance) return [];
    const categoryProducts = products.filter(
      (product) =>
        product.category === category &&
        Number(product.price) > 0 &&
        Number(product.performanceScore) > 0,
    );
    const bestValue = Math.max(
      ...categoryProducts.map(
        (product) => Number(product.performanceScore) / Number(product.price),
      ),
      performance / price,
    );
    return [Math.round(((performance / price) / bestValue) * 100)];
  });
  const valueScore = valueScores.length
    ? Math.round(valueScores.reduce((sum, score) => sum + score, 0) / valueScores.length)
    : null;
  const analyzerMetrics = [
    { label: "Performance", value: averageScore },
    { label: "Value", value: valueScore },
    {
      label: "Upgradability",
      value: installedSlots.length ? Math.round((upgradeSignals / 5) * 100) : null,
    },
    { label: "Cooling", value: coolingScore },
    { label: "Power Efficiency", value: powerEfficiencyScore },
    { label: "Compatibility", value: compatibilityScore },
  ].filter((metric) => metric.value !== null);
  const analyzerScore = analyzerMetrics.length
    ? Math.round(
        analyzerMetrics.reduce((sum, metric) => sum + metric.value, 0) /
          analyzerMetrics.length,
      )
    : null;

  // Viewport Presets
  const handleCameraPreset = (preset) => {
    setCameraView(preset);
    if (preset === "front") {
      setRotationAngle(15);
      setZoomLevel(1);
    }
    if (preset === "inside") {
      setRotationAngle(0);
      setZoomLevel(1.2);
    }
    if (preset === "back") {
      setRotationAngle(180);
      setZoomLevel(1);
    }
    if (preset === "top") {
      setRotationAngle(45);
      setZoomLevel(0.9);
    }
  };
  const handleSaveBuildClick = () => {
    if (!requireAuth(null, "save custom PC configurations")) return;
    setSaveModalOpen(true);
  };
  const handleConfirmSave = (e) => {
    e.preventDefault();
    saveCurrentBuild(buildNameInput);
    setSaveModalOpen(false);
  };
  const handleAddToCartClick = () => {
    if (!requireAuth(null, "order custom PC builds")) return;
    addCustomBuildToCart({
      name: buildNameInput || "NextGear Custom Battlestation",
      totalPrice,
      image:
        builderConfig.case?.image ||
        "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop&q=80",
      components: Object.fromEntries(
        Object.entries(builderConfig).map(([k, v]) => [k, v ? v.name : "None"]),
      ),
    });
  };
  return (
    <div className="pc-builder-page inline-pcbuilderpage-0">
      <div className="container-wide">
        {/* Studio Header */}
        <div className="flex-between inline-pcbuilderpage-1">
          <div>
            <div className="inline-pcbuilderpage-2">
              <span className="badge badge-cyan">INTELLIGENT PC BUILDER</span>
              <span className="inline-pcbuilderpage-3">
                Real-Time Compatibility & Bottleneck Matrix Active
              </span>
            </div>
            <h1 className="inline-pcbuilderpage-4">Custom PC Builder Studio</h1>
          </div>

          <div className="inline-pcbuilderpage-5">
            <button
              onClick={() => setPrintModalOpen(true)}
              className="btn btn-secondary btn-sm inline-pcbuilderpage-6"
            >
              <Printer size={14} /> Export Spec Sheet
            </button>
            <button
              onClick={() =>
                showToast(
                  "Share Link Ready",
                  "Shareable build configuration copied.",
                  "success",
                )
              }
              className="btn btn-secondary btn-sm inline-pcbuilderpage-7"
            >
              <Share2 size={14} /> Share
            </button>
          </div>
        </div>

        {/* 3-COLUMN STUDIO LAYOUT */}
        <div className="inline-pcbuilderpage-8">
          {/* ==================== LEFT: COMPONENT CATEGORIES & SLOTS ==================== */}
          <section className="cyber-card-static inline-pcbuilderpage-9">
            <div className="flex-between inline-pcbuilderpage-10">
              <h3 className="inline-pcbuilderpage-11">Component Slots</h3>
              <span className="badge badge-green inline-pcbuilderpage-12">
                {installedSlots.length} / {CATEGORIES.length} Mounted
              </span>
            </div>

            <div className="inline-pcbuilderpage-13">
              {CATEGORIES.map((cat) => {
                const comp = builderConfig[cat.id];
                const IconComp = iconMap[cat.id] || Cpu;
                return (
                  <div
                    key={cat.id}
                    style={{
                      background: comp
                        ? "rgba(255, 255, 255, 0.02)"
                        : "transparent",
                      border: comp
                        ? "1px solid var(--border-medium)"
                        : "1px dashed var(--border-subtle)",
                      borderRadius: "var(--radius-md)",
                      padding: "12px",
                      transition: "all 0.2s",
                    }}
                  >
                    <div className="flex-between inline-pcbuilderpage-14">
                      <div className="inline-pcbuilderpage-15">
                        <IconComp size={13} />
                        <span>{cat.short}</span>
                      </div>

                      {comp && (
                        <button
                          onClick={() => clearBuilderSlot(cat.id)}
                          title="Remove part"
                          className="inline-pcbuilderpage-16"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>

                    {comp ? (
                      <div>
                        <div className="inline-pcbuilderpage-17">
                          {comp.name}
                        </div>
                        <div className="flex-between inline-pcbuilderpage-18">
                          <span className="inline-pcbuilderpage-19">
                            {formatCurrency(comp.price, 0)}
                          </span>
                          <button
                            onClick={() => setActiveSlotPicker(cat.id)}
                            className="btn btn-secondary btn-sm inline-pcbuilderpage-20"
                          >
                            Swap
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setActiveSlotPicker(cat.id)}
                        className="inline-pcbuilderpage-21"
                      >
                        <Plus size={13} /> Select {cat.short}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* ==================== CENTER: 3D VIEWPORT & BOTTLENECK METER ==================== */}
          <section className="inline-pcbuilderpage-22">
            {/* 3D Visual Viewport */}
            <div className="cyber-card-static inline-pcbuilderpage-23">
              {/* Camera Presets Bar */}
              <div className="flex-between inline-pcbuilderpage-24">
                <div className="inline-pcbuilderpage-25">
                  <span className="inline-pcbuilderpage-26">Camera:</span>
                  {["front", "inside", "back", "top"].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => handleCameraPreset(preset)}
                      style={{
                        padding: "4px 10px",
                        borderRadius: "6px",
                        fontSize: "11.5px",
                        fontWeight: 600,
                        textTransform: "capitalize",
                        background:
                          cameraView === preset
                            ? "rgba(0, 212, 255, 0.15)"
                            : "rgba(255, 255, 255, 0.04)",
                        color:
                          cameraView === preset
                            ? "var(--accent-cyan)"
                            : "var(--text-secondary)",
                        border:
                          cameraView === preset
                            ? "1px solid var(--accent-cyan)"
                            : "1px solid transparent",
                      }}
                    >
                      {preset}
                    </button>
                  ))}
                </div>

                <span className="badge badge-cyan inline-pcbuilderpage-27">
                  3D Viewport Active
                </span>
              </div>

              {/* Interactive Three.js Assembly Viewport */}
              <div className="inline-pcbuilderpage-28 pc-assembly-viewport">
                <PCAssemblyScene
                  builderConfig={builderConfig}
                  modelAssets={models3d}
                  cameraView={cameraView}
                  zoomLevel={zoomLevel}
                  rotationAngle={rotationAngle}
                  rgbColor={rgbColor}
                  onSelectPart={setActiveSlotPicker}
                />

                <div
                  className="inline-pcbuilderpage-29"
                  style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    left: "auto",
                    bottom: "auto",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: "8px",
                    padding: "8px 10px",
                    borderRadius: "8px",
                    background: "rgba(10, 14, 20, 0.7)",
                    minWidth: "170px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
                      RGB Lighting
                    </span>
                    <input
                      type="color"
                      value={rgbColor}
                      onChange={(e) => setRgbColor(e.target.value)}
                      aria-label="Choose custom RGB color"
                      style={{
                        width: "32px",
                        height: "24px",
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                      }}
                    />
                  </div>

                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    {rgbPresets.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setRgbColor(preset)}
                        aria-label={`Set RGB color to ${preset}`}
                        title={`Set RGB to ${preset}`}
                        style={{
                          width: "18px",
                          height: "18px",
                          borderRadius: "999px",
                          border:
                            rgbColor === preset
                              ? "2px solid #f8fafc"
                              : "1px solid rgba(255,255,255,0.3)",
                          background: preset,
                          boxShadow:
                            rgbColor === preset
                              ? "0 0 14px rgba(255,255,255,0.25)"
                              : "none",
                          cursor: "pointer",
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Viewport Floating Controls */}
                <div className="inline-pcbuilderpage-29">
                  <button
                    onClick={() => setRotationAngle((prev) => prev - 30)}
                    className="btn-icon inline-pcbuilderpage-30"
                  >
                    <RotateCcw size={13} />
                  </button>
                  <button
                    onClick={() => setRotationAngle((prev) => prev + 30)}
                    className="btn-icon inline-pcbuilderpage-31"
                  >
                    <RotateCw size={13} />
                  </button>
                  <button
                    onClick={() =>
                      setZoomLevel((prev) => Math.min(1.5, prev + 0.15))
                    }
                    className="btn-icon inline-pcbuilderpage-32"
                  >
                    <ZoomIn size={13} />
                  </button>
                  <button
                    onClick={() =>
                      setZoomLevel((prev) => Math.max(0.7, prev - 0.15))
                    }
                    className="btn-icon inline-pcbuilderpage-33"
                  >
                    <ZoomOut size={13} />
                  </button>
                  <button
                    onClick={() => {
                      setZoomLevel(1);
                      setRotationAngle(15);
                    }}
                    className="btn-icon inline-pcbuilderpage-34"
                  >
                    <Move size={13} />
                  </button>
                </div>
              </div>
            </div>

            {/* ==================== 4. BOTTLENECK BALANCE METER (REAL-TIME) ==================== */}
            <div className="cyber-card-static inline-pcbuilderpage-35">
              <div className="flex-between inline-pcbuilderpage-36">
                <div className="inline-pcbuilderpage-37">
                  <Gauge size={18} color="var(--accent-cyan)" />
                  <h3 className="inline-pcbuilderpage-38">
                    Real-Time Bottleneck Balance Meter
                  </h3>
                </div>

                {/* Target Gaming Resolution Selector */}
                <div className="inline-pcbuilderpage-39">
                  {["1080p", "1440p", "4k"].map((res) => (
                    <button
                      key={res}
                      onClick={() => setSelectedResolution(res)}
                      style={{
                        padding: "3px 8px",
                        borderRadius: "4px",
                        fontSize: "11px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        background:
                          selectedResolution === res
                            ? "var(--accent-cyan)"
                            : "rgba(255, 255, 255, 0.04)",
                        color:
                          selectedResolution === res
                            ? "#070a12"
                            : "var(--text-muted)",
                      }}
                    >
                      {res}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bottleneck Gauge Meter Bar */}
              <div className="inline-pcbuilderpage-40">
                <div className="flex-between inline-pcbuilderpage-41">
                  <span className="inline-pcbuilderpage-42">
                    Bottleneck Index:{" "}
                    <strong className="inline-pcbuilderpage-43">
                      {bottleneckData.percentage}%
                    </strong>
                  </span>
                  <span
                    className={`badge ${bottleneckData.tier === "Optimal" ? "badge-green" : "badge-amber"}`}
                    style={{
                      fontSize: "10px",
                    }}
                  >
                    {bottleneckData.status}
                  </span>
                </div>

                <div className="bottleneck-components">
                  {[
                    ["CPU", bottleneckData.cpuScore],
                    ["GPU", bottleneckData.gpuScore],
                  ].map(([label, score]) => (
                    <div className="bottleneck-components__row" key={label}>
                      <span>{label}</span>
                      <div className="bottleneck-components__track">
                        <div
                          style={{
                            width: `${score}%`,
                            background: label === "CPU" ? "#34d399" : "#60a5fa",
                          }}
                        />
                      </div>
                      <strong>{score}%</strong>
                    </div>
                  ))}
                </div>

                <div className="inline-pcbuilderpage-45">
                  <div
                    style={{
                      height: "100%",
                      width: `${Math.max(5, bottleneckData.percentage * 4)}%`,
                      background:
                        bottleneckData.percentage < 8
                          ? "var(--accent-emerald)"
                          : "var(--accent-amber)",
                      borderRadius: "4px",
                      transition: "width 0.4s ease",
                    }}
                  />
                </div>
              </div>

              <p className="inline-pcbuilderpage-46">
                {bottleneckData.description}
              </p>
            </div>
          </section>

          {/* ==================== RIGHT: BUILD ANALYZER & SUMMARY TABS ==================== */}
          <section className="cyber-card-static inline-pcbuilderpage-47">
            {/* Top Navigation Tabs */}
            <div className="inline-pcbuilderpage-48">
              {[
                {
                  id: "summary",
                  label: "Summary",
                },
                {
                  id: "analyzer",
                  label: "Analyzer",
                },
                {
                  id: "priorities",
                  label: "Priorities",
                },
                {
                  id: "upgrades",
                  label: "Upgrades",
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    flex: 1,
                    padding: "7px 4px",
                    borderRadius: "6px",
                    fontSize: "11.5px",
                    fontWeight: 700,
                    textAlign: "center",
                    background:
                      activeTab === tab.id
                        ? "rgba(0, 212, 255, 0.15)"
                        : "transparent",
                    color:
                      activeTab === tab.id
                        ? "var(--accent-cyan)"
                        : "var(--text-muted)",
                    border:
                      activeTab === tab.id
                        ? "1px solid rgba(0, 212, 255, 0.3)"
                        : "1px solid transparent",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB 1: SUMMARY & TOTALS */}
            {activeTab === "summary" && (
              <div>
                {/* Total Cost Display */}
                <div className="inline-pcbuilderpage-49">
                  <div className="inline-pcbuilderpage-50">
                    Estimated Total Cost
                  </div>
                  <div className="inline-pcbuilderpage-51">
                    {formatCurrency(totalPrice, 0)}
                  </div>
                  <div className="inline-pcbuilderpage-52">
                    {installedSlots.length} components selected
                  </div>
                </div>

                {/* Real-time Compatibility Matrix Status */}
                <div
                  style={{
                    background: compatibilityErrorCount
                      ? "rgba(239, 68, 68, 0.1)"
                      : compatibilityVerified
                        ? "rgba(16, 185, 129, 0.08)"
                        : "rgba(245, 158, 11, 0.08)",
                    border: compatibilityErrorCount
                      ? "1px solid rgba(239, 68, 68, 0.3)"
                      : compatibilityVerified
                        ? "1px solid rgba(16, 185, 129, 0.3)"
                        : "1px solid rgba(245, 158, 11, 0.3)",
                    borderRadius: "var(--radius-md)",
                    padding: "12px",
                    marginBottom: "16px",
                  }}
                >
                  <div className="inline-pcbuilderpage-53">
                    {compatibilityErrorCount === 0 && compatibilityVerified ? (
                      <CheckCircle2 size={16} color="#34d399" />
                    ) : (
                      <AlertTriangle size={16} color={compatibilityErrorCount ? "#f87171" : "#fbbf24"} />
                    )}
                    <span
                      style={{
                        fontSize: "12.5px",
                        fontWeight: 800,
                        color: compatibilityErrorCount
                          ? "#f87171"
                          : compatibilityVerified
                            ? "#34d399"
                            : "#fbbf24",
                      }}
                    >
                      {!installedSlots.length
                        ? "Select components to verify compatibility"
                        : compatibilityErrorCount
                          ? "Compatibility Issues Detected"
                          : compatibilityWarningCount
                            ? "Compatibility Data Needed"
                            : "Compatibility Verified"}
                    </span>
                  </div>

                  <ul className="inline-pcbuilderpage-54">
                    {!compatibilityStatus.passes.length && !compatibilityStatus.issues.length && (
                      <li>Select components to run compatibility checks.</li>
                    )}
                    {compatibilityStatus.passes.slice(0, 3).map((pass, idx) => (
                      <li key={idx}>✓ {pass}</li>
                    ))}
                    {compatibilityStatus.issues.map((err, idx) => (
                      <li key={idx} className="inline-pcbuilderpage-55">
                        ⚠️ {err.message}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Wattage Load Bar */}
                <div className="inline-pcbuilderpage-56">
                  <div className="flex-between inline-pcbuilderpage-57">
                    <span className="inline-pcbuilderpage-58">
                      <Zap size={13} color="#fbbf24" /> Power Draw
                    </span>
                    <strong className="inline-pcbuilderpage-59">
                      {totalWattage}W / {psuWattage}W
                    </strong>
                  </div>
                  <div className="inline-pcbuilderpage-60">
                    <div
                      style={{
                        height: "100%",
                        width: `${wattagePercentage}%`,
                        background: "#fbbf24",
                        borderRadius: "3px",
                      }}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="inline-pcbuilderpage-61">
                  <button
                    onClick={handleAddToCartClick}
                    className="btn btn-primary inline-pcbuilderpage-62"
                  >
                    <ShoppingCart size={15} />
                    <span>
                      {userRole === "guest"
                        ? "Login to Order Build"
                        : "Add Build to Cart"}
                    </span>
                  </button>

                  <button
                    onClick={handleSaveBuildClick}
                    className="btn btn-secondary inline-pcbuilderpage-63"
                  >
                    <Bookmark size={15} />
                    <span>
                      {userRole === "guest"
                        ? "Login to Save Build"
                        : "Save Build"}
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: BUILD ANALYZER */}
            {activeTab === "analyzer" && (
              <div className="build-analyzer">
                <div className="build-analyzer__panel">
                  <div className="build-analyzer__section-title">
                    <span className="build-analyzer__index">1</span>
                    <h3>Build Analyzer</h3>
                  </div>

                  <div className="build-analyzer__content">
                    <div className="build-analyzer__gauge-wrap">
                      <div
                        className="build-analyzer__gauge"
                        style={{ "--score": analyzerScore || 0 }}
                      >
                        <div className="build-analyzer__gauge-inner">
                          <span className="build-analyzer__gauge-value">
                            {analyzerScore ?? "--"}
                          </span>
                          <span className="build-analyzer__gauge-max">
                            /100
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="build-analyzer__summary">
                      <h4>
                        {analyzerScore === null
                          ? "AWAITING COMPONENTS"
                          : analyzerScore >= 85
                            ? "STRONG BUILD"
                            : analyzerScore >= 70
                              ? "BALANCED BUILD"
                              : "NEEDS ATTENTION"}
                      </h4>
                      <p>
                        {analyzerScore === null
                          ? "Select components to analyze performance, value, power, and compatibility."
                          : `${installedSlots.length} mounted components analyzed against current compatibility and power checks.`}
                      </p>
                    </div>
                  </div>

                  {analyzerMetrics.length > 0 && <div className="build-analyzer__list">
                    {analyzerMetrics.map(({ label, value }) => (
                      <div key={label} className="build-analyzer__metric">
                        <div className="build-analyzer__metric-label">
                          <span
                            className="build-analyzer__metric-icon"
                            aria-hidden="true"
                          >
                            {label === "Performance"
                              ? "◌"
                              : label === "Value"
                                ? "◍"
                                : label === "Upgradability"
                                  ? "↻"
                                  : label === "Cooling"
                                    ? "◔"
                                    : label === "Power Efficiency"
                                      ? "⚡"
                                      : "◌"}
                          </span>
                          <span>{label}</span>
                        </div>
                        <div className="build-analyzer__metric-bar">
                          <span style={{ width: `${value}%` }} />
                        </div>
                        <strong>{value}/100</strong>
                      </div>
                    ))}
                  </div>}
                </div>
              </div>
            )}

            {/* TAB 3: PRIORITY SLIDERS */}
            {activeTab === "priorities" && (
              <div>
                <h4 className="inline-pcbuilderpage-86">
                  <Sliders size={16} color="var(--accent-cyan)" /> Priority
                  Weighting Sliders
                </h4>
                <p className="inline-pcbuilderpage-87">
                  Adjust weights to tune component recommendation matching.
                </p>

                {/* Slider 1: Budget Weight */}
                <div className="inline-pcbuilderpage-88">
                  <div className="flex-between inline-pcbuilderpage-89">
                    <span>Budget & Price Efficiency</span>
                    <strong className="inline-pcbuilderpage-90">
                      {priorityProfile.budget}%
                    </strong>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={priorityProfile.budget}
                    onChange={(e) =>
                      setPriorityProfile((prev) => ({
                        ...prev,
                        budget: Number(e.target.value),
                      }))
                    }
                    className="inline-pcbuilderpage-91"
                  />
                </div>

                {/* Slider 2: Performance Weight */}
                <div className="inline-pcbuilderpage-92">
                  <div className="flex-between inline-pcbuilderpage-93">
                    <span>Peak Raw FPS Performance</span>
                    <strong className="inline-pcbuilderpage-94">
                      {priorityProfile.performance}%
                    </strong>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={priorityProfile.performance}
                    onChange={(e) =>
                      setPriorityProfile((prev) => ({
                        ...prev,
                        performance: Number(e.target.value),
                      }))
                    }
                    className="inline-pcbuilderpage-95"
                  />
                </div>

                {/* Slider 3: Upgradability Weight */}
                <div className="inline-pcbuilderpage-96">
                  <div className="flex-between inline-pcbuilderpage-97">
                    <span>Future Upgradability & Longevity</span>
                    <strong className="inline-pcbuilderpage-98">
                      {priorityProfile.upgradability}%
                    </strong>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={priorityProfile.upgradability}
                    onChange={(e) =>
                      setPriorityProfile((prev) => ({
                        ...prev,
                        upgradability: Number(e.target.value),
                      }))
                    }
                    className="inline-pcbuilderpage-99"
                  />
                </div>

                <div className="inline-pcbuilderpage-100">
                  Recommendation scores and ordering update as these weights change.
                </div>
              </div>
            )}

            {/* TAB 4: FUTURE UPGRADES ADVISOR */}
            {activeTab === "upgrades" && (
              <div>
                <h4 className="inline-pcbuilderpage-101">
                  <ArrowUpRight size={16} color="#34d399" /> Future Upgrade Path
                </h4>

                <div className="inline-pcbuilderpage-102">
                  {futureUpgradesAdvice.length === 0 ? (
                    <p className="build-analyzer__empty">
                      Select components to see compatible upgrades from the current catalog.
                    </p>
                  ) : futureUpgradesAdvice.map((adv) => (
                    <div key={adv.product.id} className="inline-pcbuilderpage-103">
                      <div className="inline-pcbuilderpage-104">
                        {adv.title}
                      </div>
                      <div className="inline-pcbuilderpage-105">{adv.desc}</div>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => setBuilderSlot(adv.slot, adv.product)}
                      >
                        Install upgrade · {formatCurrency(adv.product.price, 0)}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* ==================== COMPONENT SELECTION MODAL WITH DYNAMIC RECOMMENDATIONS ==================== */}
      {activeSlotPicker && (
        <div
          className="modal-overlay"
          onClick={() => setActiveSlotPicker(null)}
        >
          <div
            className="modal-content modal-content-lg inline-pcbuilderpage-106"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex-between inline-pcbuilderpage-107">
              <div>
                <span className="badge badge-cyan inline-pcbuilderpage-108">
                  RECOMMENDATION ENGINE
                </span>
                <h3 className="inline-pcbuilderpage-109">
                  Select {activeSlotPicker.toUpperCase()} Hardware Match
                </h3>
              </div>
              <button
                onClick={() => setActiveSlotPicker(null)}
                className="btn-icon"
              >
                <X size={16} />
              </button>
            </div>

            <div className="grid-cols-2 inline-pcbuilderpage-110">
              {getRecommendationsForSlot(activeSlotPicker).map((product) => {
                const isCurrent =
                  builderConfig[activeSlotPicker]?.id === product.id;
                return (
                  <div
                    key={product.id}
                    className="cyber-card"
                    style={{
                      padding: "14px",
                      display: "flex",
                      gap: "14px",
                      borderColor: product.isRecommendedMatch
                        ? "var(--accent-cyan)"
                        : "var(--border-subtle)",
                      background: product.isRecommendedMatch
                        ? "rgba(0, 212, 255, 0.04)"
                        : "rgba(16, 22, 36, 0.7)",
                    }}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="inline-pcbuilderpage-111"
                    />
                    <div className="inline-pcbuilderpage-112">
                      {product.isRecommendedMatch && (
                        <div className="inline-pcbuilderpage-113">
                          {product.recommendationReason}
                        </div>
                      )}

                      <h4 className="inline-pcbuilderpage-114">
                        {product.name}
                      </h4>

                      <div className="inline-pcbuilderpage-115">
                        {formatCurrency(product.price, 0)}
                      </div>

                      <button
                        onClick={() => {
                          setBuilderSlot(activeSlotPicker, product);
                          setActiveSlotPicker(null);
                        }}
                        className={`btn ${isCurrent ? "btn-secondary" : "btn-primary"} btn-sm`}
                        style={{
                          width: "100%",
                          padding: "5px",
                        }}
                      >
                        {isCurrent ? "✓ Currently Mounted" : "Mount into Slot"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ==================== EXPORT / PRINT SPEC SHEET MODAL ==================== */}
      {printModalOpen && (
        <div className="modal-overlay" onClick={() => setPrintModalOpen(false)}>
          <div
            className="modal-content modal-content-lg inline-pcbuilderpage-117"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex-between inline-pcbuilderpage-118">
              <div>
                <div className="inline-pcbuilderpage-119">
                  NEXT GEAR BUILD SPECIFICATION
                </div>
                <h3 className="inline-pcbuilderpage-120">{buildNameInput}</h3>
              </div>
              <button
                onClick={() => setPrintModalOpen(false)}
                className="btn-icon"
              >
                <X size={16} />
              </button>
            </div>

            <div className="inline-pcbuilderpage-121">
              {CATEGORIES.map((cat) => {
                const comp = builderConfig[cat.id];
                return (
                  <div
                    key={cat.id}
                    className="flex-between inline-pcbuilderpage-122"
                  >
                    <span className="inline-pcbuilderpage-123">
                      {cat.name}:
                    </span>
                    <span className="inline-pcbuilderpage-124">
                      {comp ? comp.name : "Not Selected"}
                    </span>
                    <span className="inline-pcbuilderpage-125">
                      {comp ? formatCurrency(comp.price, 0) : "-"}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="inline-pcbuilderpage-126">
              <div className="flex-between">
                <div>
                  <div className="inline-pcbuilderpage-127">
                    Total Estimated Build Cost
                  </div>
                  <div className="inline-pcbuilderpage-128">
                    {formatCurrency(totalPrice, 0)}
                  </div>
                </div>
                <div className="inline-pcbuilderpage-129">
                  <span className="badge badge-green inline-pcbuilderpage-130">
                    100% COMPATIBLE
                  </span>
                  <div className="inline-pcbuilderpage-131">
                    Power Draw: {totalWattage}W (Optimal Load)
                  </div>
                </div>
              </div>
            </div>

            <div className="inline-pcbuilderpage-132">
              <button
                onClick={() => {
                  downloadBuildPdf({
                    builderConfig,
                    totalPrice,
                    totalWattage,
                    compatibilityStatus,
                  });
                  showToast(
                    "PDF Exported",
                    "Cleanroom assembly spec sheet generated.",
                    "success",
                  );
                  setPrintModalOpen(false);
                }}
                className="btn btn-primary inline-pcbuilderpage-133"
              >
                <Printer size={15} /> Print / Save as PDF
              </button>
              <button
                onClick={() => setPrintModalOpen(false)}
                className="btn btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== SAVE BUILD MODAL ==================== */}
      {saveModalOpen && (
        <div className="modal-overlay" onClick={() => setSaveModalOpen(false)}>
          <div
            className="modal-content inline-pcbuilderpage-134"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex-between inline-pcbuilderpage-135">
              <h3 className="inline-pcbuilderpage-136">
                Save Build Configuration
              </h3>
              <button
                onClick={() => setSaveModalOpen(false)}
                className="btn-icon"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleConfirmSave}>
              <div className="form-group">
                <label className="form-label">Build Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={buildNameInput}
                  onChange={(e) => setBuildNameInput(e.target.value)}
                  placeholder="e.g. NextGear Esports Streamer"
                  required
                />
              </div>

              <div className="inline-pcbuilderpage-137">
                <div>
                  Mounted Slots:{" "}
                  <strong>{installedSlots.length} Components</strong>
                </div>
                <div>
                  Estimated Total:{" "}
                  <strong>{formatCurrency(totalPrice, 0)}</strong>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary inline-pcbuilderpage-138"
              >
                Confirm & Save Build
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
