import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import { createPortal } from 'react-dom';
import type { CubeSession } from '../model/CubeSession';

const colors = ['#facc15', '#38bdf8', '#fb7185', '#a78bfa', '#4ade80'];

export default function CubeCelebration({
  stage,
  session,
  busy,
}: {
  stage: RefObject<HTMLDivElement>;
  session: CubeSession;
  busy: boolean;
}) {
  const layer = useRef<HTMLDivElement>(null);
  const { finished } = session;

  useEffect(() => {
    const source = stage.current;
    const overlay = layer.current;
    const visual = source?.firstElementChild;
    const cube = source?.querySelector('.cube');
    if (!finished || busy || !source || !overlay || !visual || !cube || !session.takeCelebration())
      return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !visual.animate) return;

    const frame = source.getBoundingClientRect();
    const bounds = cube.getBoundingClientRect();
    const originX = bounds.left + bounds.width / 2;
    const originY = bounds.top + bounds.height / 2;
    const x = window.innerWidth / 2 - originX;
    const y = window.innerHeight / 2 - originY;
    const availableSize = Math.min(window.innerWidth, window.innerHeight) * 0.76;
    const scale = Math.max(1, Math.min(1.55, availableSize / session.appearance.widthPx));

    const flight = document.createElement('div');
    flight.className = 'absolute [transform-style:preserve-3d]';
    Object.assign(flight.style, {
      left: `${frame.left}px`,
      top: `${frame.top}px`,
      width: `${frame.width}px`,
      height: `${frame.height}px`,
      transformOrigin: `${originX - frame.left}px ${originY - frame.top}px`,
    });

    const replica = visual.cloneNode(true) as HTMLElement;
    replica.style.height = '100%';
    flight.append(replica);
    overlay.append(flight);
    overlay.dataset.celebrating = 'true';
    source.style.visibility = 'hidden';

    const atCenter = `translate(${x}px, ${y}px) scale(${scale})`;
    const animation = flight.animate(
      [
        { transform: 'none' },
        { transform: `${atCenter} rotateY(0deg)`, offset: 0.26 },
        { transform: `${atCenter} rotateY(360deg)`, offset: 0.77 },
        { transform: 'rotateY(360deg)' },
      ],
      { duration: 4100, easing: 'ease-in-out' }
    );
    const confetti = burstConfetti(overlay);

    function clear() {
      if (!overlay?.dataset.celebrating || !source) return;

      window.removeEventListener('resize', clear);
      window.removeEventListener('scroll', clear, true);
      delete overlay.dataset.celebrating;
      animation.cancel();
      confetti.forEach(particle => particle.cancel());
      overlay.replaceChildren();
      source.style.removeProperty('visibility');
    }

    void animation.finished.then(clear, clear);
    window.addEventListener('resize', clear);
    window.addEventListener('scroll', clear, true);
    return clear;
  }, [busy, finished, session, stage]);

  return createPortal(
    <div
      ref={layer}
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
      aria-hidden="true"
    />,
    document.body
  );
}

function burstConfetti(overlay: HTMLElement) {
  const fragment = document.createDocumentFragment();
  const particles = Array.from({ length: 36 }, (_, index) => {
    const element = document.createElement('span');
    element.className = 'absolute left-1/2 top-1/2 h-2.5 w-1.5 rounded-sm opacity-0';
    element.style.backgroundColor = colors[index % colors.length];
    fragment.append(element);
    return element;
  });
  overlay.append(fragment);

  return particles.map((element, index) => {
    const direction = (index / particles.length) * 2 * Math.PI;
    const spread = 110 + (index % 5) * 33;
    const x = Math.cos(direction) * spread;
    const y = Math.sin(direction) * spread;

    return element.animate(
      [
        { opacity: 0, transform: 'translate(0, 0)' },
        { opacity: 1, transform: `translate(${x * 0.65}px, ${y * 0.65 - 40}px)`, offset: 0.35 },
        { opacity: 0, transform: `translate(${x}px, ${y + 170}px) rotate(${360 + index * 22}deg)` },
      ],
      { delay: 740 + (index % 6) * 45, duration: 2500, easing: 'ease-out' }
    );
  });
}
