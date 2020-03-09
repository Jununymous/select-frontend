import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RidiSelectState } from 'app/store';
import { FetchStatusFlag } from 'app/constants';
import { ArticleResponse } from 'app/services/article/requests';
import { GridArticleList } from 'app/components/GridArticleList';
import { Actions, ArticleListType } from 'app/services/articleList';
import { ArticleSectionHeader } from 'app/components/ArticleHome/ArticleSectionHeader';
import { GridArticleListPlaceholder } from 'app/placeholder/GridArticleListPlaceholder';
import { ArticleSectionHeaderPlaceholder } from 'app/placeholder/ArticleSectionHeaderPlaceholder';

interface ArticleHomeSectionProps {
  title: string;
  order: number;
  articleListType: ArticleListType;
  articleList?: ArticleResponse[];
  articleChartList?: ArticleResponse[];
}

export const ArticleHomeListSection: React.FunctionComponent<ArticleHomeSectionProps> = props => {
  const { title, order, articleListType } = props;
  const articles = useSelector((state: RidiSelectState) => state.articlesById);
  const sectionData = useSelector(
    (state: RidiSelectState) => state.articleList[articleListType].itemListByPage[1],
  );
  const ArticleCount = articleListType && articleListType === ArticleListType.RECENT ? 8 : 4;

  const dispatch = useDispatch();
  React.useEffect(() => {
    if (
      sectionData?.itemList !== undefined ||
      sectionData?.fetchStatus === FetchStatusFlag.FETCHING
    ) {
      return;
    }
    dispatch(Actions.loadArticleListRequest({ type: articleListType, page: 1 }));
  }, []);

  return (
    <section className="ArticleHomeSection">
      {!sectionData?.itemList ? (
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
            uiPartTitleForTracking={`${articleListType.replace('ArticleList', '')}`}
            miscTracking={JSON.stringify({ sect_order: order })}
            renderChannelMeta
            articles={sectionData.itemList.slice(0, ArticleCount).map(id => articles[id].article!)}
          />
        </>
      )}
    </section>
  );
};
