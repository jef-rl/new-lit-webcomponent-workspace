# Reproducible Build Guide: Lit Web Component with TypeScript

This document provides a comprehensive, step-by-step guide to building the standalone Lit web component contained in this project using TypeScript. The goal is to produce a single, minified, and distributable Universal Module Definition (UMD) file that can be used in any web page.

## Part 1: The Development Environment

This project uses a declarative development environment powered by Nix, defined in the `.idx/dev.nix` file. This approach guarantees that every developer has the exact same tools and versions, making the build process perfectly reproducible.

### Environment Configuration (`.idx/dev.nix`)

The environment is configured to provide Node.js, which is the only system-level dependency needed for this project.

```nix
{ pkgs, ... }: {
  # Use a specific channel for nix packages to ensure consistency
  channel = "stable-24.05";

  # Install Node.js version 20
  packages = [
    pkgs.nodejs_20
  ];

  # Workspace lifecycle hooks
  idx = {
    workspace = {
      # This command runs once when the workspace is first created.
      # It automatically installs the project's npm dependencies.
      onCreate = {
        npm-install = "npm install";
      };
    };
  };
}
```

When this project is opened in a compatible environment like Firebase Studio, the correct Node.js version is automatically installed and `npm install` is run, setting up everything you need without any manual steps.

## Part 2: Project Structure & Key Files

The project is structured to be simple and focused.

-   `src/{{ .componentName }}.ts`: The TypeScript source code for our Lit web component.
-   `package.json`: Defines project metadata, scripts, and dependencies.
-   `tsconfig.json`: Configures the TypeScript compiler.
-   `vite.config.js`: The build configuration file that instructs Vite how to create our desired output.

### `package.json`

This file defines the `build` script and lists the necessary development dependencies: `vite`, `terser` and now `typescript`.

```json
{
  "name": "{{ .componentName }}",
  "version": "1.0.0",
  "description": "A lightweight web component built with Lit and TypeScript.",
  "main": "src/{{ .componentName }}.ts",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "serve": "vite preview"
  },
  "dependencies": {
    "lit": "^3.1.4"
  },
  "devDependencies": {
    "typescript": "^5.2.2",
    "terser": "^5.44.0",
    "vite": "^4.4.5"
  }
}
```

### `tsconfig.json` - The TypeScript Blueprint

This file is essential for a TypeScript project. It specifies the compiler options required to correctly process Lit's decorators and modern JavaScript features.

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ES2020",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "experimentalDecorators": true,
    "useDefineForClassFields": false,
    "moduleResolution": "node"
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules"]
}
```

**Configuration Breakdown:**

-   `target` & `module`: Set to `ES2020` to use modern JavaScript features that Lit relies on.
-   `strict`: Enables all strict type-checking options for more robust code.
-   `experimentalDecorators`: This is **required** for Lit, as it uses decorators for features like `@customElement` and `@property`.
-   `useDefineForClassFields`: Set to `false` as it is the standard for Lit components.

### `vite.config.js` - The Build Blueprint

This configuration file remains largely the same, but the `entry` path is updated to point to our new TypeScript source file in the `src` directory.

```javascript
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    // 1. Configure the library build
    lib: {
      entry: 'src/{{ .componentName }}.ts',
      name: '{{ toPascal .componentName }}',
      // 2. Restrict output to a single UMD file
      fileName: () => `{{ .componentName }}.umd.js`,
      formats: ['umd']
    },
    // 3. Explicitly set 'terser' as the minifier
    minify: 'terser',
    // 4. Configure Terser to remove all comments from the output
    terserOptions: {
      format: {
        comments: false
      }
    }
  }
});
```

## Part 3: Step-by-Step Build Instructions

Follow these steps exactly to reproduce the build.

### Step 1: Install Dependencies

If the `onCreate` hook hasn't run, or if you need to manually install dependencies, run the following command from the project's root directory:

```bash
npm install
```

This command reads `package.json` and installs Lit, Vite, Terser, and TypeScript into the `node_modules` directory.

### Step 2: Run the Build

To start the build process, run the `build` script defined in `package.json`:

```bash
npm run build
```

This command executes `vite build`. Vite now performs the following actions:
1.  Reads the `tsconfig.json` file for TypeScript rules.
2.  Takes `src/{{ .componentName }}.ts` as the entry point and transpiles it to JavaScript.
3.  Bundles the transpiled code, the Lit library, and other dependencies.
4.  Transpiles the bundle into the UMD format.
5.  Minifies the output using Terser and removes all comments.
6.  Writes the final file to `dist/{{ .componentName }}.umd.js`.

## Part 4: The Final Output

After the build successfully completes, the `dist` directory will contain the final product:

-   `dist/{{ .componentName }}.umd.js`

This single file is the production-ready, distributable web component. It is self-contained and can be deployed to any web server or CDN.

### Usage Example

You can use the component by including the script in any HTML file.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Component Usage Example</title>
    <!-- 1. Include the component's script from its location -->
    <script src="dist/{{ .componentName }}.umd.js"></script>
</head>
<body>
    <h1>My Web Page</h1>

    <!-- 2. Use the custom element in your HTML -->
    <{{ .componentName }}></{{ .componentName }}>

</body>
</html>
```
