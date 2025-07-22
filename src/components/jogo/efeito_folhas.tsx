import { useEffect, useRef } from "react";
import "@/assets/css/leaves.css";

export default function EfeitoFolhas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const viewport = containerRef.current;
    const world = document.createElement("div");
    const leaves: Leaf[] = [];

    const options = {
      numLeaves: 26,
      wind: {
        magnitude: 1.2,
        maxSpeed: 12,
        duration: 300,
        start: 0,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        speed: (_t: number, _y: number) => 0,
      },
    };

    let width = viewport.offsetWidth;
    let height = viewport.offsetHeight;
    let timer = 0;

    interface Leaf {
      el: HTMLDivElement;
      x: number;
      y: number;
      z: number;
      rotation: {
        axis: "X" | "Y" | "Z";
        value: number;
        speed: number;
        x: number;
      };
      xSpeedVariation: number;
      ySpeed: number;
      path: { type: number; start: number };
      image: number;
    }

    const resetLeaf = (leaf: Leaf) => {
      leaf.x = width * 2 - Math.random() * width * 1.75;
      leaf.y = -10;
      leaf.z = Math.random() * 200;

      if (leaf.x > width) {
        leaf.x = width + 10;
        leaf.y = (Math.random() * height) / 2;
      }

      if (timer === 0) {
        leaf.y = Math.random() * height;
      }

      leaf.rotation.speed = Math.random() * 10;
      const randomAxis = Math.random();
      if (randomAxis > 0.5) {
        leaf.rotation.axis = "X";
      } else if (randomAxis > 0.25) {
        leaf.rotation.axis = "Y";
        leaf.rotation.x = Math.random() * 180 + 90;
      } else {
        leaf.rotation.axis = "Z";
        leaf.rotation.x = Math.random() * 360 - 180;
        leaf.rotation.speed = Math.random() * 3;
      }

      leaf.xSpeedVariation = Math.random() * 0.8 - 0.4;
      leaf.ySpeed = Math.random() + 1.5;

      return leaf;
    };

    const updateLeaf = (leaf: Leaf) => {
      const leafWindSpeed = options.wind.speed(
        timer - options.wind.start,
        leaf.y
      );
      const xSpeed = leafWindSpeed + leaf.xSpeedVariation;
      leaf.x -= xSpeed;
      leaf.y += leaf.ySpeed;
      leaf.rotation.value += leaf.rotation.speed;

      let transform = `
        translateX(${leaf.x}px)
        translateY(${leaf.y}px)
        translateZ(${leaf.z}px)
        rotate${leaf.rotation.axis}(${leaf.rotation.value}deg)
      `;
      if (leaf.rotation.axis !== "X") {
        transform += ` rotateX(${leaf.rotation.x}deg)`;
      }

      const el = leaf.el;
      el.style.transform = transform;

      if (leaf.x < -10 || leaf.y > height + 10) {
        resetLeaf(leaf);
      }
    };

    const updateWind = () => {
      if (timer === 0 || timer > options.wind.start + options.wind.duration) {
        options.wind.magnitude = Math.random() * options.wind.maxSpeed;
        options.wind.duration =
          options.wind.magnitude * 50 + (Math.random() * 20 - 10);
        options.wind.start = timer;

        options.wind.speed = function (t, y) {
          const a = ((this.magnitude / 2) * (height - (2 * y) / 3)) / height;
          return (
            a *
              Math.sin(
                ((2 * Math.PI) / this.duration) * t + (3 * Math.PI) / 2
              ) +
            a
          );
        };
      }
    };

    const init = () => {
      for (let i = 0; i < options.numLeaves; i++) {
        const leaf: Leaf = {
          el: document.createElement("div"),
          x: 0,
          y: 0,
          z: 0,
          rotation: {
            axis: "X" as "X" | "Y" | "Z",
            value: 0,
            speed: 0,
            x: 0,
          },
          xSpeedVariation: 0,
          ySpeed: 0,
          path: { type: 1, start: 0 },
          image: 1,
        };
        resetLeaf(leaf);
        leaves.push(leaf);
        world.appendChild(leaf.el);
      }

      world.className = "leaf-scene";
      viewport.appendChild(world);

      world.style.perspective = "400px";

      window.addEventListener("resize", handleResize);
    };

    const handleResize = () => {
      width = viewport.offsetWidth;
      height = viewport.offsetHeight;
    };

    const render = () => {
      updateWind();
      leaves.forEach(updateLeaf);
      timer++;
      animationId = requestAnimationFrame(render);
    };

    let animationId = requestAnimationFrame(render);
    init();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      viewport.innerHTML = "";
    };
  }, []);

  return (
    <section className="absolute size-full top-0 left-0">
      <div className="falling-leaves" ref={containerRef}></div>
    </section>
  );
}
