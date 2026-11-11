import React from "react";
import { Helmet } from "react-helmet-async";
import { Navigate, useParams } from "react-router-dom";
import ROUTE_PATHS from "../routes/RoutePath";
import { ProjectDetailView } from "../components/projects3d/ProjectsSections";
import { PROJECTS } from "../components/projects3d/projectsData";

// One project's own page (/project-case-studies/<id>): cover, overview, specifications, scope, outcome and gallery.
// It scrolls with the normal browser scroll bar (no inner scroller), so there is exactly one scroll bar and it works.
const ProjectDetail = () => {
  const { projectId } = useParams();
  const p = PROJECTS.find((x) => x.id === projectId);
  if (!p) return <Navigate to={ROUTE_PATHS.PROJECT_CASE_STUDIES} replace />;

  return (
    <div className="pj-page">
      <Helmet>
        <title>{`${p.title} | ${p.client} | DIY PreFab`}</title>
        <meta name="description" content={p.overview} />
      </Helmet>
      <ProjectDetailView projectId={p.id} />
    </div>
  );
};

export default React.memo(ProjectDetail);
