"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    gsap?: {
      registerPlugin: (...plugins: unknown[]) => void;
      utils: {
        toArray: (selector: string) => HTMLElement[];
      };
      fromTo: (
        target: Element | Element[] | string,
        fromVars: Record<string, unknown>,
        toVars: Record<string, unknown>
      ) => void;
      to: (target: Element | Element[] | string, vars: Record<string, unknown>) => void;
    };
    ScrollTrigger?: unknown;
  }
}

const loadScript = (src: string) =>
  new Promise<void>((resolve, reject) => {
    if (document.querySelector(`script[src=\"${src}\"]`)) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });

export default function Home() {
  useEffect(() => {
    let cancelled = false;

    const setupAnimation = async () => {
      try {
        await loadScript("https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js");
        await loadScript(
          "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"
        );

        if (cancelled || !window.gsap || !window.ScrollTrigger) {
          return;
        }

        const gsap = window.gsap;
        gsap.registerPlugin(window.ScrollTrigger);

        const chapters = gsap.utils.toArray(".chapter");
        chapters.forEach((chapter, idx) => {
          const heading = chapter.querySelector("h2");
          const body = chapter.querySelector("p");

          gsap.fromTo(
            chapter,
            { opacity: 0.25, y: 60 },
            {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: chapter,
                start: "top 75%",
                end: "bottom 45%",
                scrub: 1,
              },
            }
          );

          if (heading && body) {
            gsap.fromTo(
              heading,
              { clipPath: "inset(0 100% 0 0)", opacity: 0.4 },
              {
                clipPath: "inset(0 0% 0 0)",
                opacity: 1,
                duration: 1.1,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: chapter,
                  start: "top 78%",
                  end: "top 42%",
                  scrub: true,
                },
              }
            );

            gsap.fromTo(
              body,
              { opacity: 0, y: 35 },
              {
                opacity: 0.95,
                y: 0,
                duration: 0.9,
                ease: "power2.out",
                delay: idx * 0.03,
                scrollTrigger: {
                  trigger: chapter,
                  start: "top 70%",
                  end: "top 50%",
                  scrub: true,
                },
              }
            );
          }
        });

        gsap.to(".timeline-glow", {
          backgroundPosition: "200% 50%",
          ease: "none",
          scrollTrigger: {
            trigger: ".story",
            start: "top top",
            end: "bottom bottom",
            scrub: 1.5,
          },
        });
      } catch {
        // Graceful fallback: page remains readable if CDN scripts are blocked.
      }
    };

    setupAnimation();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="story">
      <header className="hero chapter">
        <p className="kicker">Software Engineer Portfolio</p>
        <h1>From Curious Builder to Systems Storyteller</h1>
        <p>
          I design products where performance, empathy, and clean architecture meet.
          Scroll to see the story behind the code.
        </p>
      </header>

      <div className="timeline-glow" aria-hidden />

      <section className="chapter">
        <span>Chapter 01</span>
        <h2>The spark</h2>
        <p>
          It began with tiny scripts automating repetitive tasks, then grew into a
          passion for crafting reliable tools that save teams hours every week.
        </p>
      </section>

      <section className="chapter">
        <span>Chapter 02</span>
        <h2>Building at scale</h2>
        <p>
          I architected resilient APIs and event-driven services, cutting average
          response time by 48% while supporting 10x traffic growth.
        </p>
      </section>

      <section className="chapter">
        <span>Chapter 03</span>
        <h2>Craft meets collaboration</h2>
        <p>
          Partnering with design and product, I translate user journeys into polished
          interfaces that feel fast, intuitive, and alive.
        </p>
      </section>

      <section className="chapter">
        <span>Chapter 04</span>
        <h2>Now & next</h2>
        <p>
          Today I focus on developer experience, cloud-native systems, and AI-assisted
          workflows — always shipping with purpose and clarity.
        </p>
      </section>

      <footer className="chapter cta">
        <h2>Let&apos;s build the next chapter together.</h2>
        <p>Open to senior software engineering roles and impactful freelance projects.</p>
        <a href="mailto:hello@portfolio.dev">hello@portfolio.dev</a>
      </footer>
    </main>
  );
}
