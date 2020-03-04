import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RidiSelectState } from 'app/store';
import { FetchStatusFlag } from 'app/constants';
import { ArticleResponse } from 'app/services/article/requests';
import { GridArticleList } from 'app/components/GridArticleList';
import { Actions, ArticleHomeSectionType } from 'app/services/articleHome';
import { ArticleSectionHeader } from 'app/components/ArticleHome/ArticleSectionHeader';
import { GridArticleListPlaceholder } from 'app/placeholder/GridArticleListPlaceholder';
import { ArticleSectionHeaderPlaceholder } from 'app/placeholder/ArticleSectionHeaderPlaceholder';

interface ArticleHomeSectionProps {
  title: string;
  order: number;
  articleHomeSectionType: ArticleHomeSectionType;
  articleList?: ArticleResponse[];
  articleChartList?: ArticleResponse[];
}

export const ArticleHomeListSection: React.FunctionComponent<ArticleHomeSectionProps> = props => {
  const { title, order, articleHomeSectionType } = props;
  const articles = useSelector((state: RidiSelectState) => state.articlesById);
  const sectionData = useSelector(
    (state: RidiSelectState) => state.articleHome[articleHomeSectionType],
  );
  const ArticleCount =
    articleHomeSectionType && articleHomeSectionType === ArticleHomeSectionType.RECENT ? 8 : 4;

  const dispatch = useDispatch();
  React.useEffect(() => {
    if (
      sectionData.fetchStatus === FetchStatusFlag.FETCHING ||
      (sectionData.fetchStatus === FetchStatusFlag.IDLE && sectionData.articles !== undefined)
    ) {
      return;
    }
    dispatch(Actions.loadArticleHomeSectionListRequest({ targetSection: articleHomeSectionType }));
  }, []);

  return (
    <section className="ArticleHomeSection">
      {!sectionData.articles ? (
        <>
          <ArticleSectionHeaderPlaceholder />
          <GridArticleListPlaceholder />
        </>
      ) : (
        <>
          <ArticleSectionHeader title={title} />
          <GridArticleList
            serviceTitleForTracking="select-article"
            pageTitleForTracking="home"
            uiPartTitleForTracking={`${articleHomeSectionType.replace('ArticleList', '')}`}
            miscTracking={JSON.stringify({ sect_order: order })}
            renderChannelMeta
            articles={
              sectionData.articles &&
              sectionData.articles.slice(0, ArticleCount).map(id => articles[id].article!)
            }
          />
        </>
      )}
    </section>
  );
};
