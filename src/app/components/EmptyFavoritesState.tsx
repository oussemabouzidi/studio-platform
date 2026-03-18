'use client';

import Link from 'next/link';
import { FaHeart } from 'react-icons/fa';

import { specialGothic } from '@/app/fonts';
import { useT } from '@/app/i18n/useT';

type EmptyFavoritesStateProps = {
  browseHref: string;
  browseLabel?: string;
  title?: string;
  description?: string;
};

export default function EmptyFavoritesState({
  browseHref,
  browseLabel,
  title,
  description,
}: EmptyFavoritesStateProps) {
  const t = useT();
  const resolvedBrowseLabel = browseLabel ?? t('common.browseStudios');
  const resolvedTitle = title ?? t('common.noFavoritesTitle');
  const resolvedDescription = description ?? t('common.noFavoritesDescription');

  return (
    <div className="lux-card lux-rect p-6 sm:p-8 md:p-12 text-center">
      <div className="flex justify-center mb-4">
        <div className="bg-black/30 border border-white/10 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center shadow-[0_0_22px_rgba(207,210,218,0.12)]">
          <FaHeart className="text-xl sm:text-2xl md:text-3xl text-purple-400" />
        </div>
      </div>
      <h2 className={`text-xl sm:text-2xl font-bold mb-2 ${specialGothic.className}`}>{resolvedTitle}</h2>
      <p className="text-gray-400 text-sm sm:text-base max-w-md mx-auto mb-4 sm:mb-6">{resolvedDescription}</p>
      <Link
        href={browseHref}
        className={`inline-flex items-center justify-center lux-btn-metal px-5 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base font-bold ${specialGothic.className}`}
      >
        {resolvedBrowseLabel}
      </Link>
    </div>
  );
}
