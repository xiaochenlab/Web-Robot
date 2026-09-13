import { useEffect, useMemo, useRef, useState, memo } from 'react';
import './LogoLoop.css';

const ANIMATION_CONFIG = { SMOOTH_TAU: 0.25, MIN_COPIES: 2, COPY_HEADROOM: 2 };

const toCssLength = value => (typeof value === 'number' ? `${value}px` : (value ?? undefined));

export const LogoLoop = memo(
  ({
    logos,
    speed = 120,
    direction = 'left',
    width = '100%',
    logoHeight = 28,
    gap = 32,
    hoverSpeed,
    fadeOut = false,
    scaleOnHover = false,
    className,
    style
  }) => {
    const containerRef = useRef(null);
    const trackRef = useRef(null);
    const seqRef = useRef(null);
    const rafRef = useRef(null);
    const offsetRef = useRef(0);
    const velocityRef = useRef(0);
    const lastTimeRef = useRef(null);

    const [seqWidth, setSeqWidth] = useState(0);
    const [copyCount, setCopyCount] = useState(2);
    const [isHovered, setIsHovered] = useState(false);

    const effectiveHoverSpeed = hoverSpeed !== undefined ? hoverSpeed : 0;

    const targetVelocity = useMemo(() => {
      const magnitude = Math.abs(speed);
      const dirMultiplier = direction === 'left' || direction === 'up' ? 1 : -1;
      return magnitude * dirMultiplier;
    }, [speed, direction]);

    useEffect(() => {
      const track = trackRef.current;
      if (!track) return;

      const animate = (timestamp) => {
        if (lastTimeRef.current === null) lastTimeRef.current = timestamp;
        const deltaTime = Math.max(0, timestamp - lastTimeRef.current) / 1000;
        lastTimeRef.current = timestamp;

        const target = isHovered ? effectiveHoverSpeed : targetVelocity;
        const easingFactor = 1 - Math.exp(-deltaTime / ANIMATION_CONFIG.SMOOTH_TAU);
        velocityRef.current += (target - velocityRef.current) * easingFactor;

        if (seqWidth > 0) {
          offsetRef.current += velocityRef.current * deltaTime;
          offsetRef.current = ((offsetRef.current % seqWidth) + seqWidth) % seqWidth;
          track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
        }

        rafRef.current = requestAnimationFrame(animate);
      };

      rafRef.current = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(rafRef.current);
    }, [targetVelocity, seqWidth, isHovered, effectiveHoverSpeed]);

    useEffect(() => {
      const updateSize = () => {
        if (seqRef.current) {
          const w = seqRef.current.getBoundingClientRect().width;
          if (w > 0) {
            setSeqWidth(Math.ceil(w));
            const containerW = containerRef.current?.clientWidth || window.innerWidth;
            setCopyCount(Math.max(2, Math.ceil(containerW / w) + 2));
          }
        }
      };
      updateSize();
      window.addEventListener('resize', updateSize);
      return () => window.removeEventListener('resize', updateSize);
    }, [logos, gap, logoHeight]);

    const cssVars = {
      '--logoloop-gap': `${gap}px`,
      '--logoloop-logoHeight': `${logoHeight}px`,
    };

    const rootClass = [
      'logoloop',
      fadeOut && 'logoloop--fade',
      scaleOnHover && 'logoloop--scale-hover',
      className
    ].filter(Boolean).join(' ');

    const renderItem = (item, key) => {
      const content = item.node ? (
        <span className="logoloop__node">{item.node}</span>
      ) : (
        <img src={item.src} alt={item.alt || ''} draggable={false} />
      );

      // 有 onClick → 点击执行
      if (item.onClick) {
        return (
          <li className="logoloop__item" key={key} onClick={item.onClick} style={{ cursor: 'pointer' }}>
            {content}
          </li>
        );
      }

      // 有 href → 正常链接
      if (item.href) {
        return (
          <li className="logoloop__item" key={key}>
            <a className="logoloop__link" href={item.href} target="_blank" rel="noreferrer">
              {content}
            </a>
          </li>
        );
      }

      // 纯展示
      return (
        <li className="logoloop__item" key={key}>
          {content}
        </li>
      );
    };

    const lists = Array.from({ length: copyCount }, (_, i) => (
      <ul className="logoloop__list" key={i} ref={i === 0 ? seqRef : null}>
        {logos.map((item, j) => renderItem(item, `${i}-${j}`))}
      </ul>
    ));

    return (
      <div
        ref={containerRef}
        className={rootClass}
        style={{ width: toCssLength(width) ?? '100%', ...cssVars, ...style }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="logoloop__track" ref={trackRef}>
          {lists}
        </div>
      </div>
    );
  }
);

LogoLoop.displayName = 'LogoLoop';
export default LogoLoop;