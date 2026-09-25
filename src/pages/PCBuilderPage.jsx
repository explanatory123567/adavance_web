import React, { useEffect, useRef, useState } from "react";
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
  Wind,
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
  fans: Wind,
};

const motherboardPosition = [0, 0, -0.62];

const partPositions = {
  motherboard: motherboardPosition,
  cpu: [0, 0, 0],
  cooler: [0, 0, 0],
  ram: [0, 0, 0],
  gpu: [0, 0, 0],
  storage: [0, 0, 0],
  psu: [0, -1.28, 0.12],
  fans: [0, 0.25, 0.62],
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

function GltfPart({ url, position, scale = 0.7, rotation = [0, 0, 0] }) {
  const { scene } = useGLTF(url);
  return (
    <primitive
      object={scene.clone()}
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

  const isMotherboard = category === "motherboard";
  const rotation = isMotherboard ? [Math.PI / 2, 0, 0] : [0, 0, 0];

  if (component.modelUrl) {
    return (
      <GltfPart
        url={component.modelUrl}
        position={position}
        rotation={rotation}
      />
    );
  }

  const preset = partModels[category];
  const color = preset?.color || partColors[category] || "#ffffff";
  const isGpu = category === "gpu";
  const glowColor =
    ["motherboard", "cooler", "ram", "fans"].includes(category)
      ? rgbColor
      : color;
  const dimensions = preset?.size || (
    isGpu
      ? [1.5, 0.18, 0.5]
      : category === "ram"
        ? [0.12, 0.62, 0.28]
        : [0.55, 0.12, 0.45]
  );
  if (category === "motherboard") {
    return (
      <group position={position} rotation={rotation}>
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
      </group>
    );
  }

  return (
    <group position={position} rotation={rotation}>
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
  );
}

function AssemblyCase({ component, rgbColor = "#67e8f9" }) {
  const color = component ? "#15283a" : "#263447";
  return (
    <group>
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[2.25, 3.2, 1.55]} />
        <meshPhysicalMaterial
          color={color}
          metalness={0.7}
          roughness={0.22}
          transparent
          opacity={0.32}
          transmission={0.15}
        />
      </mesh>
      <mesh position={[0, 0, -0.86]}>
        <boxGeometry args={[2.05, 3, 0.04]} />
        <meshStandardMaterial color="#07111d" metalness={0.2} roughness={0.6} />
      </mesh>
      <mesh position={[-1.12, 0, 0]}>
        <boxGeometry args={[0.06, 3.1, 1.45]} />
        <meshStandardMaterial color="#0b1624" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[1.12, 0, 0]}>
        <boxGeometry args={[0.06, 3.1, 1.45]} />
        <meshStandardMaterial color="#0b1624" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.75, 0.76]}>
        <boxGeometry args={[1.5, 0.12, 0.04]} />
        <meshStandardMaterial
          color={rgbColor}
          emissive={rgbColor}
          emissiveIntensity={1.9}
          metalness={0.2}
          roughness={0.3}
        />
      </mesh>
      <mesh position={[0, -0.8, 0.76]}>
        <boxGeometry args={[1.3, 0.12, 0.04]} />
        <meshStandardMaterial
          color={rgbColor}
          emissive={rgbColor}
          emissiveIntensity={1.5}
          metalness={0.2}
          roughness={0.3}
        />
      </mesh>
      <pointLight position={[0, 0.2, 0.7]} intensity={18} color={rgbColor} />
      <pointLight position={[0.9, -0.7, 0.2]} intensity={12} color={rgbColor} />
      <pointLight position={[-0.9, 0.8, 0.2]} intensity={12} color={rgbColor} />
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

function PCAssemblyScene({
  builderConfig,
  modelAssets,
  cameraView,
  zoomLevel,
  rotationAngle,
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
          const model = modelAssets?.find(
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
      <OrbitControls
        enablePan={false}
        minDistance={3.5}
        maxDistance={9}
        target={[0, 0, 0]}
      />
    </Canvas>
  );
}
export default function PCBuilderPage() {
  const {
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
      : 90;

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
                {installedSlots.length} / 9 Mounted
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
                    background: compatibilityStatus.isCompatible
                      ? "rgba(16, 185, 129, 0.08)"
                      : "rgba(239, 68, 68, 0.1)",
                    border: compatibilityStatus.isCompatible
                      ? "1px solid rgba(16, 185, 129, 0.3)"
                      : "1px solid rgba(239, 68, 68, 0.3)",
                    borderRadius: "var(--radius-md)",
                    padding: "12px",
                    marginBottom: "16px",
                  }}
                >
                  <div className="inline-pcbuilderpage-53">
                    {compatibilityStatus.isCompatible ? (
                      <CheckCircle2 size={16} color="#34d399" />
                    ) : (
                      <AlertTriangle size={16} color="#f87171" />
                    )}
                    <span
                      style={{
                        fontSize: "12.5px",
                        fontWeight: 800,
                        color: compatibilityStatus.isCompatible
                          ? "#34d399"
                          : "#f87171",
                      }}
                    >
                      {compatibilityStatus.isCompatible
                        ? "100% Real-Time Compatibility Verified"
                        : "Compatibility Issues Detected"}
                    </span>
                  </div>

                  <ul className="inline-pcbuilderpage-54">
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
                        style={{ "--score": averageScore }}
                      >
                        <div className="build-analyzer__gauge-inner">
                          <span className="build-analyzer__gauge-value">
                            {averageScore}
                          </span>
                          <span className="build-analyzer__gauge-max">
                            /100
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="build-analyzer__summary">
                      <h4>GOOD BUILD</h4>
                      <p>
                        Your build is well balanced. There are some areas you
                        can improve.
                      </p>
                    </div>
                  </div>

                  <div className="build-analyzer__list">
                    {[
                      ["Performance", 92],
                      ["Value", 80],
                      ["Upgradability", 75],
                      ["Cooling", 85],
                      ["Power Efficiency", 90],
                      ["Compatibility", 100],
                    ].map(([label, value]) => (
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
                  </div>
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
                  ✓ Recommendation engine adjusted to prioritize long-life
                  platforms & high-efficiency power supplies.
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
                  {futureUpgradesAdvice.map((adv, idx) => (
                    <div key={idx} className="inline-pcbuilderpage-103">
                      <div className="inline-pcbuilderpage-104">
                        {adv.title}
                      </div>
                      <div className="inline-pcbuilderpage-105">{adv.desc}</div>
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
