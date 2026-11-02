# Homepage video trial

The current hero uses original edits of three Mixkit videos, each explicitly listed under the Mixkit Stock Video Free License for commercial or personal use (verified 2 November 2026):

- https://mixkit.co/free-stock-video/female-scientist-observing-through-a-microscope-4773/
- https://mixkit.co/free-stock-video/scientist-mixing-liquids-in-a-laboratory-4719/
- https://mixkit.co/free-stock-video/scientist-observing-through-a-microscope-4733/
- Licence: https://mixkit.co/license/#videoFree

The montage is grayscale and contains no audio. It is illustrative stock footage; the people shown are not presented as MRG members. The original downloads and source-page records are retained outside the repo in the task work/science-hero directory.

Earlier video edits and posters remain in public/media. The current hero uses research-montage-dots-dense.mp4 (14.25 seconds, 1920x1080, H.264, 24 fps, fast-start, about 8 MB) and its matching first-frame PNG poster. Each six-second shot blends into the next over 1.25 seconds, including the last-to-first transition. The final edit starts 1.25 seconds into the first shot and ends at the same point in its repeated copy, eliminating the old fade through black.

The dot treatment is rendered into the file, inspired by Maritime's pre-rendered dotted hero video. No Maritime footage is used. The science footage is sampled at 240x135, gently averaged over three frames, then interpolated to a 320x180 dot field. Inverted luminance and a stable ordered threshold turn it into small light points spaced 6px apart on a #0A0A0A background: darker instruments and people form the image while bright lab walls leave negative space. The denser revision has 78% more sample positions, increased midtone coverage and brighter neutral-white dots. Dot opacity interpolates through threshold crossings to soften shimmer, and edge attenuation keeps the frame from becoming a solid rectangular grid. There is no continuous photographic image between the dots.

Full-range grayscale input is explicitly converted to limited-range BT.709 YUV with matching stream metadata. The header keeps an opaque #0A0A0A surface in both scroll states, without backdrop blur over the video. The hero itself has no scroll-driven colour, opacity or filter changes; the heading's requested colour loop is independent and remains enabled.

The browser uses ordinary video rendering with no live mask, filter, blend mode or opacity layer. Only a light static veil remains over the text. Reduced-motion visitors see the still poster and a static headline gradient. Playback pauses offscreen or in a hidden tab. The visible playback control was removed at the site owner's request. Both hero links use the same 44px border-box height, centered 20px line-height and arrow alignment.

The page background is sampled from the supplied colour swatch: #0A0A0A. Shared CSS variables and the site-background Tailwind colour keep page sections, footer, and background fades consistent.

## Restore the previous hero

The previous hero including the interactive Notion preview is preserved in src/components/LegacyHandbookHero.tsx. Its components, assets and data remain unchanged. To restore it, change the re-export in src/components/HeroNew.tsx to ./LegacyHandbookHero. A separate full snapshot of the edited source files is also in the task outputs/homepage-before-science-hero-20261102 directory.

The rest of the homepage, including the lower handbook section, remains available.
