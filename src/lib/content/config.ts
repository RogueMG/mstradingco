import project from "../../../sanity.project.json";

export const { projectId, dataset, apiVersion } = project;

/** True once a Sanity projectId is set. Until then the site renders local starter data. */
export const cmsEnabled = projectId !== "";
