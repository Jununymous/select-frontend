import React from 'react';
import { PageTitleText } from 'app/constants';
import { ConnectedPageHeader, HelmetWithTitle } from 'app/components';

const ArticleRecent: React.FunctionComponent = () => (
  // const recentArticles = useSelctor(())
  <main className="SceneWrapper SceneWrapper_WithGNB SceneWrapper_WithLNB PageArticlePopular">
    <HelmetWithTitle titleName={PageTitleText.ARTICLE_RECENT} />
    <ConnectedPageHeader pageTitle={PageTitleText.ARTICLE_RECENT} />
  </main>
);

export default ArticleRecent;
