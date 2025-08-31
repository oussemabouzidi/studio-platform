import localFont from 'next/font/local';

export const specialGothic = localFont({
  src: [
    {
      path: './fonts/Special_Gothic_Expanded_One/SpecialGothicExpandedOne-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/Special_Gothic_Expanded_One/SpecialGothicExpandedOne-Regular.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-special-gothic',
});

export const specialGothicRegular = localFont({
  src: [
    {
      path: './fonts/Special_Gothic/SpecialGothic-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/Special_Gothic/SpecialGothic-Regular.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-special-gothic-regular',
});