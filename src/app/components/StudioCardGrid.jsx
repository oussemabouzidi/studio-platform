// components/StudioCardGrid.jsx
'use client';
import React from 'react';
import { FaStar, FaMapMarkerAlt, FaMusic, FaInfoCircle, FaTimes } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import { useT } from '@/app/i18n/useT';

// Optional perks configuration for visual enhancements
const STUDIO_PERKS = {
  1: { name: 'Basic', badge: null },
  2: { name: 'Highlighted', badge: 'Pro', color: 'blue' },
  3: { name: 'Ranking Boost', badge: 'Boost', color: 'green' },
  4: { name: 'Featured', badge: 'Featured', color: 'purple' },
  5: { name: 'Priority', badge: 'Priority', color: 'orange' },
  6: { name: 'Analytics', badge: 'Analytics', color: 'teal' },
  7: { name: 'Headliner', badge: 'Headliner', color: 'red' },
  8: { name: 'Promo', badge: 'Promo', color: 'pink' },
  9: { name: 'Legend', badge: 'Legend', color: 'yellow' },
  10: { name: 'Elite', badge: 'Elite', color: 'gradient' }
};

const getBadgeColor = (perk) => {
  switch (perk?.color) {
    case 'blue': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'green': return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'purple': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    case 'orange': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    case 'teal': return 'bg-teal-500/20 text-teal-400 border-teal-500/30';
    case 'red': return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'pink': return 'bg-pink-500/20 text-pink-400 border-pink-500/30';
    case 'yellow': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'gradient': return 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-white border-purple-500/50';
    default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
};

const getPerkBorderGlow = (level) => {
  if (level >= 10) return 'ring-1 ring-purple-400/30 shadow-[0_0_0_1px_rgba(126,34,206,0.18),0_28px_90px_rgba(0,0,0,0.65),0_18px_70px_rgba(126,34,206,0.12)]';
  if (level >= 7) return 'ring-1 ring-white/16 shadow-[0_24px_80px_rgba(0,0,0,0.62),0_14px_50px_rgba(0,0,0,0.5)]';
  if (level >= 5) return 'ring-1 ring-white/14 shadow-[0_20px_70px_rgba(0,0,0,0.6)]';
  if (level >= 3) return 'ring-1 ring-white/12 shadow-[0_16px_55px_rgba(0,0,0,0.55)]';
  if (level >= 2) return 'ring-1 ring-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.5)]';
  return 'ring-1 ring-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.45)]';
};

export const StudioCard = ({
  studio,
  href,
  showPerks = true,
  showInfo = false,
  variant = 'card',
}) => {
  const t = useT();
  const router = useRouter();
  const level = studio?.level || 1;
  const perk = STUDIO_PERKS[level] || STUDIO_PERKS[1];
  const [isInfoOpen, setIsInfoOpen] = React.useState(false);
  const [isInfoEntered, setIsInfoEntered] = React.useState(false);
  const closeBtnRef = React.useRef(null);

  const reducedMotion =
    typeof window !== 'undefined' &&
    (window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false);

  React.useEffect(() => {
    if (!isInfoOpen) return;
    setIsInfoEntered(false);
    let raf = 0;
    try {
      raf = window.requestAnimationFrame(() => setIsInfoEntered(true));
    } catch {
      setIsInfoEntered(true);
    }
    const fallback = window.setTimeout(() => setIsInfoEntered(true), 80);
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setIsInfoOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      window.clearTimeout(fallback);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isInfoOpen]);

  React.useEffect(() => {
    if (!isInfoOpen) return;
    window.setTimeout(() => closeBtnRef.current?.focus?.(), 0);
  }, [isInfoOpen]);

  const openInfo = (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    // Extra safety: avoid any parent click handlers (navigation) firing.
    e?.nativeEvent?.stopImmediatePropagation?.();
    setIsInfoOpen(true);
  };

  const closeInfo = (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    e?.nativeEvent?.stopImmediatePropagation?.();
    setIsInfoOpen(false);
  };

  const goToDetails = () => {
    if (!href) return;
    router.push(href);
  };

  const onCardKeyDown = (e) => {
    if (!href) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      goToDetails();
    }
  };

  const isRow = variant === 'row';
  const cardClassName = `group lux-card ${isRow ? '' : 'lux-tilt'} overflow-hidden ${showPerks ? getPerkBorderGlow(level) : ''} ${href ? 'cursor-pointer' : ''}`;

  return (
    <>
      <div
        role={href ? 'link' : undefined}
        tabIndex={href ? 0 : undefined}
        onClick={
          href
            ? (e) => {
                if (e.defaultPrevented) return;
                const target = e.target;
                if (target instanceof Element && target.closest('[data-stop-card-nav="true"]'))
                  return;
                if (target instanceof Element && target.closest('button')) return;
                goToDetails();
              }
            : undefined
        }
        onKeyDown={href ? onCardKeyDown : undefined}
        className={cardClassName}
        aria-label={href ? `Open ${studio?.name ?? 'studio'} details` : undefined}
      >
        <div className={isRow ? 'flex' : undefined}>
          <div
            className={
              isRow
                ? 'relative w-44 sm:w-56 shrink-0 self-stretch min-h-[7rem] overflow-hidden'
                : 'relative h-48'
            }
          >
            {studio.coverPhoto ? (
              <img 
                src={studio.coverPhoto} 
                alt={studio.name} 
                className={isRow ? 'absolute inset-0 w-full h-full object-cover lux-media' : 'w-full h-full object-cover lux-media'}
                loading="lazy"
                decoding="async"
              />
            ) : (
              <div className="bg-[#1a1f1a] w-full h-full flex items-center justify-center">
                <FaMusic className={`text-[#540D6E] ${isRow ? 'text-5xl' : 'text-6xl'}`} />
              </div>
            )}

            {isRow ? (
              <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-black/15" />
            ) : null}

            {/* Info button */}
            {!isRow && showInfo ? (
              <button
                type="button"
                data-stop-card-nav="true"
                onPointerDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.nativeEvent?.stopImmediatePropagation?.();
                }}
                onClick={openInfo}
                onKeyDown={(e) => e.stopPropagation()}
                className="absolute top-2 left-2 z-10 h-9 w-9 rounded-full grid place-items-center bg-black/55 backdrop-blur border border-white/10 text-white/80 hover:text-white hover:bg-black/70 transition-all"
                aria-label={t('studios.studioInfo')}
                title={t('studios.studioInfo')}
              >
                <FaInfoCircle />
              </button>
            ) : null}

            {/* Avatar */}
            <div
              className={
                isRow
                  ? 'absolute inset-0 flex items-center justify-center pointer-events-none'
                  : 'absolute -bottom-6 left-4'
              }
            >
              <div
                className={[
                  'lux-card rounded-full border-white/10 bg-black/45',
                  isRow ? 'p-1.5 shadow-[0_18px_60px_rgba(0,0,0,0.65)]' : 'p-1',
                ].join(' ')}
              >
                {studio.avatar ? (
                  <img 
                    src={studio.avatar} 
                    alt={studio.name} 
                    className={`${isRow ? 'w-16 h-16' : 'w-12 h-12'} rounded-full border border-white/15 object-cover lux-media`}
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div className={`${isRow ? 'w-16 h-16' : 'w-12 h-12'} rounded-full bg-black/40 border border-white/15 flex items-center justify-center`}>
                    <FaMusic className={`${isRow ? 'text-3xl' : 'text-2xl'} text-purple-300`} />
                  </div>
                )}
              </div>
            </div>

            {/* Perk badge */}
            {showPerks && perk?.badge && (
              <div className={`absolute top-2 right-2 z-10 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold border ${getBadgeColor(perk)}`}>
                <span>{perk.badge}</span>
              </div>
            )}
          </div>

          {/* Studio Info */}
          <div className={isRow ? 'p-4 flex-1 min-w-0' : 'p-5 pt-8'}>
            <div className="flex justify-between items-start mb-2 gap-3">
              <h3 className={`text-white font-semibold font-special ${isRow ? 'text-base sm:text-lg truncate' : 'text-lg'}`}>
                {studio.name}
              </h3>
              <div className="flex items-center gap-2 shrink-0">
                <div className="lux-chip border-white/10 bg-black/30">
                  <FaStar className="text-yellow-400 mr-1" />
                  <span className="text-white/90 font-special-regular">{studio.rating}</span>
                </div>
                {isRow && showInfo ? (
                  <button
                    type="button"
                    data-stop-card-nav="true"
                    onPointerDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      e.nativeEvent?.stopImmediatePropagation?.();
                    }}
                    onClick={openInfo}
                    onKeyDown={(e) => e.stopPropagation()}
                    className="h-9 w-9 rounded-full grid place-items-center bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white transition-all"
                    aria-label={t('studios.studioInfo')}
                    title={t('studios.studioInfo')}
                  >
                    <FaInfoCircle />
                  </button>
                ) : null}
              </div>
            </div>

            <div className="flex items-center mb-3 min-w-0">
              <FaMapMarkerAlt className="text-purple-400 mr-2 shrink-0" />
              <span className="text-white/65 text-sm font-special-regular truncate">{studio.location}</span>
            </div>

            <div className={isRow ? 'mb-3' : 'mb-4'}>
              <p className="text-white/80 text-sm font-medium mb-2 font-special-regular">{t('studios.studioType')}</p>
              <div className="flex flex-wrap gap-2 font-special-regular">
                {(studio.types || []).slice(0, isRow ? 2 : undefined).map((type, index) => (
                  <span 
                    key={index} 
                    className="lux-chip border-white/10 bg-white/5 text-white/80"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-white/80 text-sm font-medium mb-2 font-special-regular">{t('studios.musicGenres')}</p>
              <div className="flex flex-wrap gap-2">
                {(studio.genres || []).slice(0, isRow ? 3 : undefined).map((genre, index) => (
                  <span 
                    key={index} 
                    className="lux-chip border-white/10 bg-black/30 text-white/75"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showInfo && isInfoOpen && typeof document !== 'undefined'
        ? createPortal(
            <div
              className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-sm flex items-center justify-center px-4"
              role="dialog"
              aria-modal="true"
              aria-label={t('studios.studioInformation')}
              onClick={() => setIsInfoOpen(false)}
            >
              <div
                className="w-full max-w-4xl lux-card lux-rect p-6 sm:p-7 border border-white/10 bg-black/55 shadow-[0_30px_120px_rgba(0,0,0,0.75)] transition-[transform,opacity] duration-300 ease-out motion-reduce:transition-none transform-gpu will-change-transform"
                style={
                  reducedMotion
                    ? undefined
                    : {
                        opacity: isInfoEntered ? 1 : 0,
                        transform: isInfoEntered
                          ? 'perspective(900px) translateY(0px) scale(1) rotateX(0deg)'
                          : 'perspective(900px) translateY(18px) scale(0.96) rotateX(10deg)',
                      }
                }
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="text-xl sm:text-2xl font-bold text-white font-special truncate">
                      {studio?.name ?? 'Studio'}
                    </h3>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-white/70 font-special-regular">
                      {studio?.location ? (
                        <span className="inline-flex items-center gap-2">
                          <FaMapMarkerAlt className="text-purple-400" />
                          {studio.location}
                        </span>
                      ) : null}
                      {typeof studio?.price === 'number' ? (
                        <span className="lux-chip border-white/10 bg-black/30">
                          ${studio.price}
                        </span>
                      ) : null}
                      {typeof studio?.rating === 'number' ? (
                        <span className="lux-chip border-white/10 bg-black/30 inline-flex items-center gap-2">
                          <FaStar className="text-yellow-400" />
                          <span className="text-white/90">{studio.rating}</span>
                        </span>
                      ) : null}
                      {showPerks && perk?.badge ? (
                        <span className={`lux-chip border ${getBadgeColor(perk)}`}>
                          {perk.badge}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <button
                    ref={closeBtnRef}
                    type="button"
                    onClick={closeInfo}
                    className="h-10 w-10 rounded-full grid place-items-center bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white transition-all"
                    aria-label={t('common.close')}
                    title={t('common.close')}
                  >
                    <FaTimes />
                  </button>
                </div>

                <div className="mt-6 space-y-5">
                  <div>
                    <div className="text-xs uppercase tracking-[0.18em] text-white/45 font-special-regular">
                      {t('studios.studioType')}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {(studio?.types || []).length ? (
                        (studio.types || []).map((type, index) => (
                          <span
                            key={`${type}-${index}`}
                            className="lux-chip border-white/10 bg-white/5 text-white/80"
                          >
                            {type}
                          </span>
                        ))
                      ) : (
                        <span className="text-white/60 text-sm font-special-regular">—</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs uppercase tracking-[0.18em] text-white/45 font-special-regular">
                      {t('studios.musicGenres')}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {(studio?.genres || []).length ? (
                        (studio.genres || []).map((genre, index) => (
                          <span
                            key={`${genre}-${index}`}
                            className="lux-chip border-white/10 bg-black/30 text-white/75"
                          >
                            {genre}
                          </span>
                        ))
                      ) : (
                        <span className="text-white/60 text-sm font-special-regular">—</span>
                      )}
                    </div>
                  </div>
                </div>

                {href ? (
                  <div className="mt-7 flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        closeInfo(e);
                        goToDetails();
                      }}
                      className="lux-btn-metal w-full sm:w-auto px-5 py-2.5 text-sm font-medium"
                    >
                      {t('studios.openStudioPage')}
                    </button>
                    <button
                      type="button"
                      onClick={closeInfo}
                      className="lux-btn-ghost w-full sm:w-auto px-5 py-2.5 text-sm font-medium"
                    >
                      {t('common.close')}
                    </button>
                  </div>
                ) : null}
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
};

const StudioCardGrid = ({ studios }) => {
  const t = useT();
  if (!studios || studios.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-[#EAEAEA]">{t('studios.noStudiosFound')}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
      {studios.map((studio, idx) => (
        <div
          key={studio.id}
          data-reveal
          style={{ '--reveal-delay': `${Math.min(360, 60 + idx * 55)}ms` }}
        >
          <StudioCard studio={studio} href={`/pages/client/studios/studio-details/${studio.id}`} />
        </div>
      ))}
    </div>
  );
};

export default StudioCardGrid;
