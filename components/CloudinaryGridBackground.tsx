'use client';

import { useEffect, useMemo, useRef } from 'react';

export default function CloudinaryGridBackground() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim() || 'demo';
  const cloudinaryTexture = useMemo(
    () =>
      `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto,w_2200,h_1400,c_fill,g_auto/sample`,
    [cloudName]
  );

  useEffect(() => {
    const node = wrapperRef.current;
    if (!node) return;

    const setPointer = (xPercent: number, yPercent: number) => {
      node.style.setProperty('--grid-x', `${xPercent}%`);
      node.style.setProperty('--grid-y', `${yPercent}%`);
    };

    setPointer(50, 42);

    const onPointerMove = (event: PointerEvent) => {
      const x = (event.clientX / window.innerWidth) * 100;
      const y = (event.clientY / window.innerHeight) * 100;
      setPointer(x, y);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', onPointerMove);
  }, []);

  return (
    <div ref={wrapperRef} className="cloudinary-grid-bg" aria-hidden="true">
      <div className="cloudinary-layer cloudinary-layer-main" style={{ backgroundImage: `url(${cloudinaryTexture})` }} />
      <div className="cloudinary-layer cloudinary-layer-alt" style={{ backgroundImage: `url(${cloudinaryTexture})` }} />
      <div className="cloudinary-grid-plane" />
      <div className="cloudinary-grid-highlight" />
      <div className="cloudinary-scan-lines" />
    </div>
  );
}
