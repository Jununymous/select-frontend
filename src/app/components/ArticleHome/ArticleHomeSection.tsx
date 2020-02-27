import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ArticleSectionChartList } from 'app/components/ArticleSectionChartList';
import { GridArticleList } from 'app/components/GridArticleList';
import { FetchStatusFlag } from 'app/constants';
import { ArticleSectionChartListPlaceholder } from 'app/placeholder/ArticleSectionChartListPlaceholder';
import { ArticleSectionHeaderPlaceholder } from 'app/placeholder/ArticleSectionHeaderPlaceholder';
import { GridArticleListPlaceholder } from 'app/placeholder/GridArticleListPlaceholder';
import { ArticleResponse } from 'app/services/article/requests';
import { Actions, ArticleHomeSectionType, ArticleSectionType } from 'app/services/articleHome';
import { Actions as PopularArticleActions } from 'app/services/articlePopular';
import { RidiSelectState } from 'app/store';

interface ArticleHomeSectionProps {
  title: string;
  type: string;
  order: number;
  articleHomeSectionType: ArticleHomeSectionType;
  articleList?: ArticleResponse[];
  articleChartList?: ArticleResponse[];
}

interface ArticleSectionHeaderProps {
  title: string;
}

export const ArticleSectionHeader: React.FunctionComponent<ArticleSectionHeaderProps> = props => {
  const { title } = props;

  return (
    <div className="ArticleSection_Header">
      <h2 className="ArticleSection_Title reset-heading">{title}</h2>
    </div>
  );
};

export const ArticleHomeSection: React.FunctionComponent<ArticleHomeSectionProps> = props => {
  const { title, type, order, articleHomeSectionType } = props;
  const articles = useSelector((state: RidiSelectState) => state.articlesById);
  const sectionData = useSelector(
    (state: RidiSelectState) => state.articleHome[articleHomeSectionType],
  );
  const popularArticle = useSelector(
    (state: RidiSelectState) => state.popularArticle.itemListByPage[1],
  );
  const ArticleCount =
    articleHomeSectionType && articleHomeSectionType === ArticleHomeSectionType.RECENT ? 8 : 4;

  const dispatch = useDispatch();
  React.useEffect(() => {
    if (articleHomeSectionType === ArticleHomeSectionType.POPULAR) {
      if (
        popularArticle?.itemList !== undefined ||
        popularArticle?.fetchStatus === FetchStatusFlag.FETCHING
      ) {
        return;
      }
      dispatch(PopularArticleActions.loadPopularArticlesRequest({ page: 1 }));
      return;
    }

    if (
      sectionData.fetchStatus === FetchStatusFlag.FETCHING ||
      (sectionData.fetchStatus === FetchStatusFlag.IDLE && sectionData.articles !== undefined)
    ) {
      return;
    }
    dispatch(Actions.loadArticleHomeSectionListRequest({ targetSection: articleHomeSectionType }));
  }, []);

  if (type === ArticleSectionType.CHART) {
    return (
      <section className="ArticleHomeSection">
        {popularArticle?.fetchStatus === FetchStatusFlag.FETCHING ? (
          <>
            <ArticleSectionHeaderPlaceholder />
            <ArticleSectionChartListPlaceholder />
          </>
        ) : popularArticle?.itemList ? (
          <>
            <ArticleSectionHeader title={title} />
            <ArticleSectionChartList
              articleList={
                popularArticle?.itemList &&
                popularArticle?.itemList.map(id => articles[id].article!)
              }
              serviceTitleForTracking="select-article"
              pageTitleForTracking="home"
              uiPartTitleForTracking={`${articleHomeSectionType.replace('ArticleList', '')}`}
              miscTracking={JSON.stringify({ sect_order: order })}
            />
          </>
        ) : null}
      </section>
    );
  }
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
