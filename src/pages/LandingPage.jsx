import { useState } from 'react';
import { ArrowRight, Cpu, MapPinned, Sparkles, Zap } from 'lucide-react';
import MouseTrailParticles from '../components/MouseTrailParticles.jsx';
import WaterfallCards from '../components/WaterfallCards.jsx';

const logoPath = '/images/meituan-logo.png';

export default function LandingPage({ onEnter, isTransitioning }) {
  const [logoBouncing, setLogoBouncing] = useState(false);

  const handleLogoMouseEnter = () => {
    if (logoBouncing) return;
    setLogoBouncing(true);
    window.setTimeout(() => setLogoBouncing(false), 650);
  };

  return (
    <main className={`landing-root ${isTransitioning ? 'landing-departing' : ''}`}>
      <div className="landing-grid" />
      <div className="landing-aurora landing-aurora-one" />
      <div className="landing-aurora landing-aurora-two" />
      <div className="landing-aurora landing-aurora-three" />
      <div className="landing-light-band" />
      <div className="landing-particles" />
      <MouseTrailParticles />
      <WaterfallCards />

      <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-5 py-12 text-center text-white">
        <div className="landing-chip mb-8">
          <Cpu size={15} />
          基于美团小团 · 多人周末出行 Agent
        </div>

        <div className="hero-logo-stage">
          <div className="hero-logo-aura" />
          <div className="hero-logo-rotating-ring" />
          <div className="hero-logo-float">
            <div
              className={`hero-logo-bounce ${logoBouncing ? 'is-bouncing' : ''}`}
              onMouseEnter={handleLogoMouseEnter}
            >
              <img
                src={logoPath}
                alt="美团logo"
                className="hero-logo-img"
                onError={(event) => {
                  event.currentTarget.style.display = 'none';
                  event.currentTarget.nextElementSibling.style.display = 'grid';
                }}
              />
              <div className="hero-logo-fallback">美团</div>
            </div>
          </div>
        </div>

        <h1 className="hero-title mt-8 text-4xl sm:text-6xl">团崽 AI</h1>
        <p className="mt-4 text-xl font-semibold text-[#ffe68a] sm:text-2xl">
          基于美团小团的多人周末出行规划 Agent
        </p>
        <p className="mt-5 max-w-2xl text-sm leading-7 text-white/72 sm:text-base">
          一句话协调同行人偏好、实时排队预约、路线与预算，把周末安排好。
        </p>

        <button
          onClick={onEnter}
          disabled={isTransitioning}
          className="landing-cta group mt-9"
        >
          <span className="relative z-10">点击进入新时代美团</span>
          <ArrowRight className="relative z-10 transition-transform duration-300 group-hover:translate-x-1" size={20} />
        </button>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-white/60">
          <span className="landing-mini-pill"><Sparkles size={13} /> AI Agent</span>
          <span className="landing-mini-pill"><MapPinned size={13} /> 本地探索</span>
          <span className="landing-mini-pill"><Zap size={13} /> 自动规划</span>
          <span className="landing-mini-pill">一键预订</span>
        </div>
      </section>
    </main>
  );
}
