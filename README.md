# Galacean 3D Application

A simple 3D web application built with [Galacean Engine](https://galacean.antgroup.com/), featuring a rotating sphere with lighting and camera controls.

## What This App Does

This application creates a basic 3D scene with:
- A 3D sphere rendered with BlinnPhong material
- Directional lighting
- A camera positioned to view the scene
- WebGL rendering through Galacean Engine

## Prerequisites

- Node.js (version 14 or higher)
- npm (comes with Node.js)
- A modern web browser that supports WebGL

## Installation

1. Clone or download this project
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
```

## Running the Application

### Development Mode (Recommended)

Start the Vite development server:

```bash
npm run dev
```

Then open your browser and navigate to `http://localhost:5173/`

### Alternative: Manual Compilation

If you prefer to compile TypeScript manually:

```bash
npx tsc
```

Then serve the files using any HTTP server (due to CORS restrictions with ES6 modules).

## Project Structure

```
GalaceanApp2/
├── index.html          # Main HTML file
├── index.ts            # TypeScript source code
├── tsconfig.json       # TypeScript configuration
├── package.json        # Node.js dependencies and scripts
├── dist/               # Compiled JavaScript output (after running tsc)
│   └── index.js
└── README.md           # This file
```

## Key Files

- **`index.ts`** - Main application code that creates the 3D scene
- **`index.html`** - HTML template with canvas element
- **`tsconfig.json`** - TypeScript compiler configuration with `skipLibCheck` enabled
- **`package.json`** - Project dependencies and npm scripts

## Technologies Used

- **Galacean Engine** - 3D rendering engine
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and development server
- **WebGL** - 3D graphics API

## Troubleshooting

### Common Issues and Solutions

1. **TypeScript compilation errors from `@galacean/engine`**
   - **Solution**: We've added `"skipLibCheck": true` to `tsconfig.json` to bypass library type definition issues

2. **CORS errors when opening HTML directly**
   - **Solution**: Use the Vite dev server (`npm run dev`) instead of opening the HTML file directly

3. **Module resolution errors in browser**
   - **Solution**: Vite handles bundling and module resolution automatically

4. **`tsc` command not found**
   - **Solution**: Use `npx tsc` to run the locally installed TypeScript compiler

## Scripts

- `npm run dev` - Start Vite development server with hot reloading
- `npm run start` - Compile TypeScript and run with Node.js (not recommended for this web app)
- `npx tsc` - Compile TypeScript manually

## Browser Compatibility

This application requires a modern browser with WebGL support:
- Chrome 51+
- Firefox 51+
- Safari 10+
- Edge 79+

## License

ISC

## Development Notes

This project was created as a learning exercise for Galacean Engine. The engine provides a powerful 3D rendering system with WebGL backend support. 

## Screenshot(s)

![img](./Screenshot%202025-06-03%20175415.png)