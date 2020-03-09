import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RidiSelectState } from 'app/store';
import { FetchStatusFlag } from 'app/constants';
import { ArticleResponse } from 'app/services/article/requests';
import { ArticleSectionChartList } from 'app/components/ArticleSectionChartList';
import { ArticleSectionHeader } from 'app/components/ArticleHome/ArticleSectionHeader';
import { ArticleSectionHeaderPlaceholder } from 'app/placeholder/ArticleSectionHeaderPlaceholder';
import { ArticleSectionChartListPlaceholder } from 'app/placeholder/ArticleSectionChartListPlaceholder';
import { Actions as PopularArticleActions, ArticleListType } from 'app/services/articleList';

interface ArticleHomeSectionProps {
  title: string;
  order: number;
  articleListType: ArticleListType;
  articleList?: ArticleResponse[];
  articleChartList?: ArticleResponse[];
}

export const ArticleHomeChartSection: React.FunctionComponent<ArticleHomeSectionProps> = props => {
  const { title, order, articleListType } = props;
  const articles = useSelector((state: RidiSelectState) => state.articlesById);
  const popularArticle = useSelector(
    (state: RidiSelectState) => state.articleList[ArticleListType.POPULAR].itemListByPage[1],
  );

  const dispatch = useDispatch();
  React.useEffect(() => {
    if (
      popularArticle?.itemList !== undefined ||
      popularArticle?.fetchStatus === FetchStatusFlag.FETCHING
    ) {
      return;
    }
    dispatch(
      PopularArticleActions.loadArticleListRequest({ type: ArticleListType.POPULAR, page: 1 }),
    );
  }, []);

  if (popularArticle?.fetchStatus === FetchStatusFlag.FETCHING) {
    return (
      <section className="ArticleHomeSection">
        <ArticleSectionHeaderPlaceholder />
        <ArticleSectionChartListPlaceholder />
      </section>
    );
  }

  return popularArticle?.itemList ? (
    <section className="ArticleHomeSection">
      <ArticleSectionHeader title={title} />
      <ArticleSectionChartList
        articleList={popularArticle?.itemList.map(id => articles[id].article!)}
        serviceTitleForTracking="select-article"
        pageTitleForTracking="home"
        uiPartTitleForTracking={`${articleListType.replace('ArticleList', '')}`}
        miscTracking={JSON.stringify({ sect_order: order })}
      />
    </section>
  ) : null;
};
