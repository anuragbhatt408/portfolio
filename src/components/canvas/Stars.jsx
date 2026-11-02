import React, { useEffect, useRef, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Preload } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm";
import styled from "styled-components";

const StyledCanvasWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
`;

const Stars = (props) => {
  const ref = useRef();
  const [sphere] = useState(() =>
    random.inSphere(new Float32Array(3000), { radius: 1.2 })
  );

  useFrame((state, delta) => {
    if (!ref.current) return;
    const frameDelta = Math.min(delta, 0.1);
    ref.current.rotation.x -= frameDelta / 10;
    ref.current.rotation.y -= frameDelta / 15;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        <PointMaterial
          transparent
          color="#f272c8"
          size={0.002}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

const StyledStarsCanvas = () => {
  const [isPageVisible, setIsPageVisible] = useState(
    () => document.visibilityState === "visible"
  );

  useEffect(() => {
    const updateVisibility = () =>
      setIsPageVisible(document.visibilityState === "visible");

    document.addEventListener("visibilitychange", updateVisibility);
    return () =>
      document.removeEventListener("visibilitychange", updateVisibility);
  }, []);

  return (
    <StyledCanvasWrapper>
      <Canvas
        camera={{ position: [0, 0, 1] }}
        dpr={[1, 1.25]}
        frameloop={isPageVisible ? "always" : "never"}
        gl={{ antialias: false, powerPreference: "low-power" }}
      >
        <Suspense fallback={null}>
          <Stars />
        </Suspense>
        <Preload all />
      </Canvas>
    </StyledCanvasWrapper>
  );
};

export default StyledStarsCanvas;
