import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";

import project from "../sanity.project.json";
import { schemaTypes } from "./schemaTypes";
import { structure } from "./structure";

// No basePath here: the build already mounts the Studio at the CLI's
// project.basePath, and a workspace basePath would be appended to it.
export default defineConfig({
  name: "default",
  title: "MS Trading Co.",
  projectId: project.projectId,
  dataset: project.dataset,
  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: project.apiVersion }),
  ],
  schema: {
    types: schemaTypes,
  },
});
