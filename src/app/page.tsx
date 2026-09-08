import Image from "next/image";
import PixelSnow from "./PixelSnow";
import Hero from "../components/Hero";
import About from "../components/About";
import TechSphere from "@/components/Skills";


export default function Home() {
  return (
    // With custom prop values
    <>
      <div style={{ width: '100%', height: '100%', position: 'fixed', top: 0, left: 0, zIndex: -1 }}>
        <PixelSnow
          color="#ffffff"
          flakeSize={0.01}
          minFlakeSize={1.25}
          pixelResolution={200}
          speed={1.25}
          density={0.3}
          direction={0}
          brightness={1}
          depthFade={8}
          farPlane={20}
          gamma={0.4545}
          variant="square"
        />
      </div>
      <Hero />
      <About />
      <TechSphere/>
    </>
  );
}
