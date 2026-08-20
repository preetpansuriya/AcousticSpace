import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCcw, ShieldAlert, ShieldCheck, Play, Pause, Compass, Gauge } from 'lucide-react';
import { Card3D } from './Card3D';

interface ThreeAcousticSceneProps {
  verdict?: string;
  syntheticProbability?: number;
  reflectionMismatchScore?: number;
  isPlaying?: boolean;
}

export const ThreeAcousticScene: React.FC<ThreeAcousticSceneProps> = ({
  verdict = 'DEEPFAKE_DETECTED',
  syntheticProbability: _syntheticProbability = 0.97,
  reflectionMismatchScore = 88,
  isPlaying = false,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [viewMode, setViewMode] = useState<'sphere' | 'room' | 'landscape'>('room');
  const [autoRotate360, setAutoRotate360] = useState(false);
  const [rotateSpeed, setRotateSpeed] = useState<number>(1); // 0.5x, 1x, 2x, 3x
  const [currentYawDegrees, setCurrentYawDegrees] = useState<number>(0);
  const [currentPitchDegrees, setCurrentPitchDegrees] = useState<number>(0);

  // 3D Room Customizer State
  const [roomLength, setRoomLength] = useState<number>(6.5);
  const [roomWidth, setRoomWidth] = useState<number>(5.0);
  const [roomHeight, setRoomHeight] = useState<number>(3.2);
  const [wallMaterial, setWallMaterial] = useState<'Concrete' | 'Wood Paneling' | 'Drywall' | 'Glass' | 'Carpeted Studio'>('Concrete');

  const absorptionCoeffs: Record<string, number> = {
    'Concrete': 0.02,
    'Wood Paneling': 0.12,
    'Drywall': 0.08,
    'Glass': 0.04,
    'Carpeted Studio': 0.35
  };
  const calculatedAbsorption = absorptionCoeffs[wallMaterial] || 0.05;
  const calculatedVolume = Number((roomLength * roomWidth * roomHeight).toFixed(1));
  const calculatedRt60 = Number((0.161 * calculatedVolume / (2 * (roomLength*roomWidth + roomLength*roomHeight + roomWidth*roomHeight) * calculatedAbsorption)).toFixed(2));

  const isDeepfake = verdict === 'DEEPFAKE_DETECTED';

  // Refs to share state with requestAnimationFrame loop without triggering re-renders
  const autoRotateRef = useRef(autoRotate360);
  autoRotateRef.current = autoRotate360;

  const speedRef = useRef(rotateSpeed);
  speedRef.current = rotateSpeed;

  const resetSignalRef = useRef<number>(0);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Dimensions
    const width = container.clientWidth || 600;
    const height = 340;

    // Three Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0f1d, 0.08);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 2, 7);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(isDeepfake ? 0xf43f5e : 0x06b6d4, 2.5, 50);
    pointLight.position.set(2, 4, 3);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0x3b82f6, 1.8, 50);
    pointLight2.position.set(-3, -2, -2);
    scene.add(pointLight2);

    // Group for objects
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // --- 1. SPHERE MODE OBJECTS ---
    const sphereGeometry = new THREE.IcosahedronGeometry(2, 4);
    const sphereMaterial = new THREE.MeshStandardMaterial({
      color: isDeepfake ? 0xe11d48 : 0x06b6d4,
      wireframe: true,
      roughness: 0.2,
      metalness: 0.8,
      emissive: isDeepfake ? 0x881337 : 0x083344,
      emissiveIntensity: 0.5,
    });
    const acousticSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

    // Core glowing sphere inside
    const coreGeometry = new THREE.SphereGeometry(1.2, 32, 32);
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: isDeepfake ? 0xff4d4d : 0x38bdf8,
      transparent: true,
      opacity: 0.6,
    });
    const coreSphere = new THREE.Mesh(coreGeometry, coreMaterial);
    acousticSphere.add(coreSphere);

    // --- 2. ROOM MODE OBJECTS ---
    const roomBoxGeometry = new THREE.BoxGeometry(4.5, 3.5, 4.5);
    const roomBoxMaterial = new THREE.MeshBasicMaterial({
      color: 0x334155,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    });
    const roomBox = new THREE.Mesh(roomBoxGeometry, roomBoxMaterial);

    // Rays inside room
    const rayLinesGroup = new THREE.Group();
    const rayCount = 24;
    const rayMaterial = new THREE.LineBasicMaterial({
      color: isDeepfake ? 0xf43f5e : 0x10b981,
      transparent: true,
      opacity: 0.75,
    });

    for (let i = 0; i < rayCount; i++) {
      const points = [];
      points.push(new THREE.Vector3(0, 0, 0));
      const target = new THREE.Vector3(
        (Math.random() - 0.5) * 4.2,
        (Math.random() - 0.5) * 3.2,
        (Math.random() - 0.5) * 4.2
      );
      points.push(target);
      const geom = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geom, rayMaterial);
      rayLinesGroup.add(line);
    }
    roomBox.add(rayLinesGroup);

    // --- 3. LANDSCAPE / 3D SPECTRUM GRID MODE ---
    const spectrumGroup = new THREE.Group();
    const gridRows = 8;
    const gridCols = 8;
    const barSpacing = 0.55;
    const spectrumBars: THREE.Mesh[] = [];

    const barBoxGeometry = new THREE.BoxGeometry(0.38, 1, 0.38);

    for (let r = 0; r < gridRows; r++) {
      for (let c = 0; c < gridCols; c++) {
        const distCenter = Math.sqrt((r - 3.5) * (r - 3.5) + (c - 3.5) * (c - 3.5));
        const barMaterial = new THREE.MeshStandardMaterial({
          color: isDeepfake
            ? (distCenter < 2 ? 0xf43f5e : 0x9f1239)
            : ((r + c) % 2 === 0 ? 0x06b6d4 : 0x3b82f6),
          roughness: 0.2,
          metalness: 0.8,
          emissive: isDeepfake ? 0x881337 : 0x0369a1,
          emissiveIntensity: 0.5,
        });
        const barMesh = new THREE.Mesh(barBoxGeometry, barMaterial);

        const posX = (c - (gridCols - 1) / 2) * barSpacing;
        const posZ = (r - (gridRows - 1) / 2) * barSpacing;
        barMesh.position.set(posX, 0, posZ);

        spectrumGroup.add(barMesh);
        spectrumBars.push(barMesh);
      }
    }

    // Glowing floor grid helper under the 3D Spectrum Grid
    const spectrumFloorGrid = new THREE.GridHelper(6, 12, isDeepfake ? 0xf43f5e : 0x06b6d4, 0x334155);
    spectrumFloorGrid.position.y = -0.55;
    spectrumGroup.add(spectrumFloorGrid);

    // --- PARTICLES CLOUD ---
    const particleCount = 250;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color(isDeepfake ? 0xef4444 : 0x06b6d4);
    const color2 = new THREE.Color(isDeepfake ? 0xf43f5e : 0x10b981);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 10;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 10;

      const mixedColor = color1.clone().lerp(color2, Math.random());
      particleColors[i * 3] = mixedColor.r;
      particleColors[i * 3 + 1] = mixedColor.g;
      particleColors[i * 3 + 2] = mixedColor.b;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.09,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    // Mount view object
    if (viewMode === 'sphere') {
      mainGroup.add(acousticSphere);
    } else if (viewMode === 'room') {
      mainGroup.add(roomBox);
    } else {
      mainGroup.add(spectrumGroup);
    }

    // Pointer Interaction Drag & Cursor Movement Rotation Logic
    let isPointerDown = false;
    let previousPointerX = 0;
    let previousPointerY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handlePointerDown = (event: PointerEvent) => {
      isPointerDown = true;
      previousPointerX = event.clientX;
      previousPointerY = event.clientY;
    };

    const handlePointerUp = () => {
      isPointerDown = false;
    };

    const handlePointerMove = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const normX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((event.clientY - rect.top) / rect.height) * 2 - 1);

      targetMouseX = normX;
      targetMouseY = normY;

      if (isPointerDown) {
        const deltaX = event.clientX - previousPointerX;
        const deltaY = event.clientY - previousPointerY;

        mainGroup.rotation.y += deltaX * 0.012;
        mainGroup.rotation.x += deltaY * 0.012;

        previousPointerX = event.clientX;
        previousPointerY = event.clientY;
      }
    };

    container.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);
    container.addEventListener('pointermove', handlePointerMove);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const originalPositions = sphereGeometry.attributes.position.clone();

    let lastDegUpdate = 0;

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Check reset signal
      if (resetSignalRef.current !== 0) {
        mainGroup.rotation.set(0, 0, 0);
        resetSignalRef.current = 0;
      }

      // Smooth cursor hover rotation influence when not dragging
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;

      if (!isPointerDown) {
        // Subtle real-time tilt guided by mouse/cursor hover position
        mainGroup.rotation.x = THREE.MathUtils.lerp(mainGroup.rotation.x, currentMouseY * 0.35, 0.04);
      }

      // Continuous 360-degree auto orbit rotation
      if (autoRotateRef.current && !isPointerDown) {
        const baseSpeed = 0.012 * speedRef.current;
        mainGroup.rotation.y += baseSpeed;
      }

      // Slowly rotate background particle cloud in 360 space
      particleSystem.rotation.y -= 0.003;

      // Update 360 degree HUD state periodically
      if (elapsedTime - lastDegUpdate > 0.1) {
        lastDegUpdate = elapsedTime;
        const normalizedY = ((mainGroup.rotation.y % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
        const yawDeg = Math.round((normalizedY * 180) / Math.PI);
        const pitchDeg = Math.round((mainGroup.rotation.x * 180) / Math.PI) % 360;

        setCurrentYawDegrees(yawDeg);
        setCurrentPitchDegrees(pitchDeg);
      }

      // Dynamic geometry vertex displacement
      if (viewMode === 'sphere') {
        const positionAttribute = sphereGeometry.attributes.position;
        const vertex = new THREE.Vector3();

        for (let i = 0; i < positionAttribute.count; i++) {
          vertex.fromBufferAttribute(originalPositions, i);
          const wave = Math.sin(vertex.x * 2.5 + elapsedTime * 4.5) * Math.cos(vertex.y * 2.5 + elapsedTime * 3.5);
          const pulse = isPlaying ? Math.sin(elapsedTime * 14) * 0.25 : 0.05;
          const factor = 1 + wave * (0.12 + pulse) + (isDeepfake ? 0.08 : 0);

          vertex.multiplyScalar(factor);
          positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
        }
        positionAttribute.needsUpdate = true;
        sphereGeometry.computeVertexNormals();

        const coreScale = 1 + Math.sin(elapsedTime * 6) * 0.08;
        coreSphere.scale.set(coreScale, coreScale, coreScale);
      } else if (viewMode === 'landscape') {
        // Animate 3D Spectrum Equalizer Grid bars
        spectrumBars.forEach((bar, idx) => {
          const row = Math.floor(idx / gridCols);
          const col = idx % gridCols;
          const distFromCenter = Math.sqrt((row - 3.5) * (row - 3.5) + (col - 3.5) * (col - 3.5));

          const wave1 = Math.sin(elapsedTime * 5 + distFromCenter * 1.2 + col * 0.6);
          const wave2 = Math.cos(elapsedTime * 4.2 + row * 0.8 + idx * 0.15);
          const audioEnergy = isPlaying ? Math.abs(Math.sin(elapsedTime * 10 + idx * 0.3)) * 2.5 + 0.4 : 0.2;

          const heightFactor = Math.max(0.15, Math.abs(wave1 * wave2) * 2.2 + audioEnergy + (isDeepfake ? 0.4 : 0));

          bar.scale.y = heightFactor;
          bar.position.y = heightFactor / 2 - 0.55; // align bottom to floor
        });
      } else if (viewMode === 'room') {
        rayLinesGroup.rotation.y += 0.01;
      }

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 600;
      camera.aspect = w / height;
      camera.updateProjectionMatrix();
      renderer.setSize(w, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      container.removeEventListener('pointermove', handlePointerMove);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      sphereGeometry.dispose();
      sphereMaterial.dispose();
      roomBoxGeometry.dispose();
      roomBoxMaterial.dispose();
      barBoxGeometry.dispose();
      spectrumBars.forEach((bar) => {
        if (bar.material instanceof THREE.Material) {
          bar.material.dispose();
        }
      });
      particleGeometry.dispose();
      particleMaterial.dispose();
    };
  }, [viewMode, isDeepfake, isPlaying]);

  const handleReset360 = () => {
    resetSignalRef.current = Date.now();
  };

  return (
    <Card3D glowColor={isDeepfake ? 'rose' : 'cyan'} className="p-5 space-y-3">
      {/* 3D Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/10 pb-3 gap-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Compass className="w-5 h-5 text-cyan-400 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-xs font-extrabold text-slate-100 uppercase tracking-wider">
                360° Interactive Acoustic Visualizer
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 animate-pulse">
                360° WEBGL ORBIT
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">
              360-Degree Continuous Orbital Camera & Acoustic Topology Inspection
            </p>
          </div>
        </div>
      </div>

      {/* 360 Animation Interactive Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 rounded-xl bg-slate-900/80 border border-white/10 text-xs">
        <div className="flex items-center space-x-2">
          {/* Play / Pause 360 Rotation */}
          <button
            onClick={() => setAutoRotate360(!autoRotate360)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-2 transition-all ${
              autoRotate360
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30'
                : 'bg-white/10 text-slate-300 hover:bg-white/20'
            }`}
          >
            {autoRotate360 ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{autoRotate360 ? '360° Orbiting Active' : 'Resume 360° Orbit'}</span>
          </button>

          {/* Speed Selector */}
          <div className="flex items-center space-x-1 bg-white/5 p-1 rounded-lg border border-white/10">
            <span className="text-[10px] text-slate-400 px-1 font-semibold">Speed:</span>
            {[0.5, 1, 2, 3].map((spd) => (
              <button
                key={spd}
                onClick={() => setRotateSpeed(spd)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                  rotateSpeed === spd
                    ? 'bg-cyan-500 text-slate-950 font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Reset Camera Position */}
          <button
            onClick={handleReset360}
            className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-semibold flex items-center space-x-1.5 transition-all"
            title="Reset 360 View"
          >
            <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Reset View</span>
          </button>
        </div>
      </div>

      {/* 3D Viewport Area */}
      <div className="relative rounded-2xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-white/10 overflow-hidden shadow-2xl">
        <div ref={mountRef} className="w-full h-80 cursor-grab active:cursor-grabbing select-none" />

        {/* Floating 3D HUD Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
          <div className="glass-pill px-3 py-1 rounded-xl border border-white/15 text-[10px] font-mono text-cyan-300 flex items-center gap-2 shadow-xl">
            <Compass className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
            <span className="font-bold">YAW: {currentYawDegrees}° / 360°</span>
          </div>
          <div className="glass-pill px-3 py-1 rounded-xl border border-white/15 text-[10px] font-mono text-indigo-300 flex items-center gap-2 shadow-xl">
            <Gauge className="w-3.5 h-3.5 text-indigo-400" />
            <span>PITCH: {currentPitchDegrees}°</span>
          </div>
          <div className={`glass-pill px-3 py-1 rounded-xl border text-[10px] font-mono font-bold flex items-center gap-2 shadow-xl ${
            isDeepfake ? 'bg-rose-500/10 text-rose-300 border-rose-500/30' : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
          }`}>
            {isDeepfake ? <ShieldAlert className="w-3.5 h-3.5 text-rose-400" /> : <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />}
            <span>RIR ANOMALY: {reflectionMismatchScore}%</span>
          </div>
        </div>

        <div className="absolute bottom-3 right-3 text-[10px] font-mono text-slate-300 glass-pill px-3 py-1.5 rounded-xl border border-white/15 pointer-events-none flex items-center space-x-2 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
          <span>Click & Drag to rotate 360° manually</span>
        </div>
      </div>

      {/* 3D Room Customizer Settings Panel */}
      {viewMode === 'room' && (
        <div className="glass-panel p-4 rounded-2xl border border-white/10 space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="text-xs font-bold text-slate-100 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              <span>3D Acoustic Room Physical Parameters Customizer</span>
            </span>
            <span className="text-[10px] font-mono font-bold text-amber-300 glass-pill px-2.5 py-0.5 rounded-full border border-amber-400/30">
              Est. RT60: {calculatedRt60}s | Vol: {calculatedVolume}m³
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="text-[11px] font-bold text-slate-300 flex justify-between">
                <span>Room Length:</span>
                <span className="font-mono text-cyan-300">{roomLength}m</span>
              </label>
              <input
                type="range"
                min={3}
                max={20}
                step={0.5}
                value={roomLength}
                onChange={(e) => setRoomLength(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer mt-1"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-300 flex justify-between">
                <span>Room Width:</span>
                <span className="font-mono text-cyan-300">{roomWidth}m</span>
              </label>
              <input
                type="range"
                min={3}
                max={15}
                step={0.5}
                value={roomWidth}
                onChange={(e) => setRoomWidth(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer mt-1"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-300 flex justify-between">
                <span>Room Height:</span>
                <span className="font-mono text-cyan-300">{roomHeight}m</span>
              </label>
              <input
                type="range"
                min={2.5}
                max={8}
                step={0.5}
                value={roomHeight}
                onChange={(e) => setRoomHeight(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer mt-1"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">
                <span>Wall Material:</span>
              </label>
              <select
                value={wallMaterial}
                onChange={(e) => setWallMaterial(e.target.value as any)}
                className="w-full bg-slate-900 border border-white/20 text-xs text-slate-100 rounded-xl p-1.5 font-sans focus:outline-none focus:border-cyan-400 cursor-pointer"
              >
                <option value="Concrete">Concrete (Abs: 0.02)</option>
                <option value="Wood Paneling">Wood Paneling (Abs: 0.12)</option>
                <option value="Drywall">Drywall (Abs: 0.08)</option>
                <option value="Glass">Glass Windows (Abs: 0.04)</option>
                <option value="Carpeted Studio">Carpeted Studio (Abs: 0.35)</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </Card3D>
  );
};
