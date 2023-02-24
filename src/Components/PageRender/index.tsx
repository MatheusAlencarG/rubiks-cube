import React from "react";

import Header from "../Header";
import Footer from "../Footer";

type PageRenderProps = {
  page: React.ReactElement | null;
}

function PageRender({ page }: PageRenderProps) {
  return(
    <div className="pageRender">
      <Header />
      {page}
      <Footer />
    </div>
  );
}

export default PageRender;
