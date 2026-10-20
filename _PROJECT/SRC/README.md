# Q35 — Corner Shower Visualization

[View the live project](https://www.sharamoff.com/_q35/index.html)

Q35 is an interactive portfolio case by **Ihar Sharamau**. It documents the
development and presentation of a Q35 corner shower enclosure: from
engineering documentation and CAD data to a production-ready Blender scene,
material variants, still renders, and a promotional animation.

The case is part of [sharamoff.com](https://www.sharamoff.com) and is intended
to demonstrate a combination of engineering thinking, 3D visualization, web
development, and scroll-driven storytelling.

## Project highlights

- Rebuilt a technically detailed shower enclosure from engineering drawings
  and documentation.
- Prepared complex CAD-based geometry for use in independently designed
  Blender scenes.
- Developed six glass options and six hardware-finish variations.
- Created a complete bathroom environment, lighting setup, materials, still
  renders, and promotional animation.
- Used ChatGPT as part of the material-development and rendering-variant
  workflow.
- Presented the work as a responsive, scroll-based web experience powered by
  GSAP and ScrollTrigger.

## Experience flow

1. **Hero** — introduces the Q35 enclosure and project context.
2. **Project narrative** — reveals the overview, challenge, solution, and tool
   stack as the visitor scrolls.
3. **Animation stage** — scrubs through the promotional video frame by frame
   in response to scroll position.
4. **Render gallery** — contains a prepared sequence of product and interior
   renders for a scroll-driven presentation.

## Technology

### Creative and engineering tools

- Autodesk Inventor
- FreeCAD
- Blender
- Adobe After Effects
- ChatGPT

### Front end

- Semantic HTML5
- SCSS / Sass
- Vanilla JavaScript
- GSAP 3 and ScrollTrigger
- Responsive CSS layouts and viewport-aware styling

### Build tooling

- Node.js and npm
- Gulp 4
- BrowserSync
- Dart Sass
- Autoprefixer and Clean CSS

## Repository layout

```text
_Q35_PROJECT/
├── gulpfile.js          # Gulp tasks and build configuration
├── package.json         # Node.js dependencies
├── SRC/                 # Source files (this directory)
│   ├── index.html       # Page structure and external library references
│   ├── style/           # SCSS entry point, variables, fonts, reset, layout
│   ├── js/              # ScrollTrigger animation logic
│   ├── img/             # Backgrounds, interface assets, logos, and renders
│   └── animation/       # MP4 and WebM promotional-video sources
└── BUILD/               # Generated production output (not committed)
```

## Local development

The Gulp configuration and `package.json` live one directory above `SRC`.
Run the following commands from the project root (`_Q35_PROJECT/`):

```bash
npm install
npx gulp
```

The default task builds the project into `BUILD/`, starts BrowserSync on port
`3001`, and watches source files for changes.

To create a one-off production build without starting the development server:

```bash
npx gulp build
```

## Animation notes

`js/gsap-animation.js` configures three pinned ScrollTrigger sequences. The
video stage maps scroll progress to a 450-frame, 30 FPS animation and smooths
frame changes with a damping loop. The script adapts scrub behaviour for small
screens and preloads gallery imagery before initializing the gallery sequence.

## Media

The project includes the source video in WebM and MP4 formats for browser
compatibility, three WebP environment backgrounds, SVG interface assets, and
a collection of WebP renders. The HTML currently keeps the individual gallery
items commented out; their assets and the gallery animation code remain in the
source for curation or reactivation.

## License

The project is distributed under the ISC license. Visual assets, models, and
project content remain subject to their respective rights.
