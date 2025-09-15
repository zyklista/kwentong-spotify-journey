import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

import { componentTagger } from "lovable-tagger";
//...
plugins: [
  react(),
  // REMOVE or COMMENT OUT this line below:
  // mode === 'development' && componentTagger(),
].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
