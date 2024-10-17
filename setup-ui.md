# Setup UI

## References

- https://ui.shadcn.com/docs/installation/vite#add-tailwind-and-its-configuration
- https://tailwindcss.com/docs/guides/vite

## Setup

bash
npm create vite@latest [project-name]
cd [project-name]

bash
npm install
npm install -D tailwindcss postcss autoprefixer @types/node @vitejs/plugin-react
npx tailwindcss init -p

javascript:[project-name]/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

css:[project-name]/src/index.css
@tailwind base;
@tailwind components;
@tailwind utilities;

json:[project-name]/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}

typescript:[project-name]/vite.config.ts
import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})

bash
npx shadcn@latest init

bash
npx shadcn@latest add button

typescript:[project-name]/src/App.tsx
import { Button } from "@/components/ui/button"

function App() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Your Project</h1>
        <Button>Get Started</Button>
      </div>
    </div>
  )
}

export default App

bash
npm run dev
