import React from 'react';
import { PageTitleText } from 'app/constants';
import { HelmetWithTitle } from 'app/components';
import { useSelector } from 'react-redux';
import { getPageQuery } from 'app/services/routing/selectors';
import { RidiSelectState } from 'app/store';

const ArticlePopular: React.FunctionComponent = () => {
  const page = useSelector((state: RidiSelectState) => getPageQuery(state));
  const isFetched = useSelector((state: RidiSelectState) => null);
  return (
    <main className="SceneWrapper SceneWrapper_WithGNB SceneWrapper_WithLNB PageArticleFavorite">
      <HelmetWithTitle titleName={PageTitleText.ARTICLE_CHARTS} />
    </main>
  );
};

export default ArticlePopular;
