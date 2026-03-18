/**
 * Homepage background audio track configuration.
 *
 * Add the corresponding files under: /public/audio/<filename>.mp3
 *
 * Each entry:
 *  - `sourceUrl` is a reference to a royalty-free source page where you can download a track.
 *  - `localPath` is what the app will play.
 */

/** @type {import("../hooks/useBackgroundAudio").BackgroundAudioTrack[]} */
export const audioTracks = [
  {
    name: "Lo-fi Jazz (Example 01)",
    genre: "jazz",
    sourceUrl: "https://pixabay.com/music/search/jazz/",
    localPath: "/audio/lofi-jazz-01.mp3",
  },
  {
    name: "Hip-Hop Beat (Example 01)",
    genre: "hip-hop",
    sourceUrl: "https://pixabay.com/music/search/hip%20hop/",
    localPath: "/audio/hiphop-beat-01.mp3",
  },
];
