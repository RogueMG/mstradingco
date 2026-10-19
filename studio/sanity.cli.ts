import { defineCliConfig } from "sanity/cli";

import project from "../sanity.project.json";

export default defineCliConfig({
  api: {
    projectId: project.projectId,
    dataset: project.dataset,
  },
  // The Studio is served from the GitHub Pages project site at /mstradingco/studio.
  project: {
    basePath: "/mstradingco/studio",
  },
  deployment: {
    autoUpdates: false,
  },
});
