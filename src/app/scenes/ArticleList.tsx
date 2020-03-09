import qs from 'qs';
import { Link, LinkProps } from 'react-router-dom';
import React, { useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useSelector, useDispatch } from 'react-redux';

import { RidiSelectState } from 'app/store';
import { COUNT_PER_PAGE } from 'app/services/collection';
import { ArticleEmpty } from 'app/components/ArticleEmpty';
import { getPageQuery } from 'app/services/routing/selectors';
import { GridArticleList } from 'app/components/GridArticleList';
import { ArticleListType, Actions } from 'app/services/articleList';
import { getSectionStringForTracking } from 'app/services/tracking/utils';
import { ConnectedPageHeader, HelmetWithTitle, Pagination } from 'app/components';
import { PageTitleText, MAX_WIDTH, RoutePaths, FetchStatusFlag } from 'app/constants';
import { GridArticleListPlaceholder } from 'app/placeholder/GridArticleListPlaceholder';

const ArticleList: React.FunctionComponent = () => {
  const itemCountPerPage = COUNT_PER_PAGE;
  const articleListType = useSelector((state: RidiSelectState) => {
    const parsedQuery = qs.parse(state.router.location.search, {
      ignoreQueryPrefix: true,
    });
    return `${parsedQuery.listType}ArticleList` as ArticleListType;
  });
  const page = useSelector(getPageQuery);
  const articleList = useSelector(
    (state: RidiSelectState) => state.articleList[articleListType].itemListByPage[page],
  );
  const itemCount = useSelector(
    (state: RidiSelectState) => state.articleList[articleListType].itemCount || 0,
  );
  const articles = useSelector((state: RidiSelectState) => state.articlesById);
  const isMobile = useMediaQuery({ query: `(max-device-width: ${MAX_WIDTH})` });
  const dispatch = useDispatch();

  useEffect(() => {
    if (
      !articleList ||
      (!articleList?.itemList && articleList.fetchStatus !== FetchStatusFlag.FETCHING)
    ) {
      dispatch(
        Actions.loadArticleListRequest({
          type: articleListType,
          page,
          size: itemCountPerPage,
        }),
      );
    }
  }, []);

  return (
    <main className="SceneWrapper SceneWrapper_WithGNB SceneWrapper_WithLNB PageArticleList">
      <HelmetWithTitle titleName={PageTitleText.ARTICLE_RECENT} />
      <ConnectedPageHeader pageTitle={PageTitleText.ARTICLE_RECENT} />
      <div className="ArticleList">
        {!articleList || articleList.fetchStatus === FetchStatusFlag.FETCHING ? (
          <GridArticleListPlaceholder gridSize="large" />
        ) : articleList?.itemList?.length > 0 ? (
          <>
            <GridArticleList
              serviceTitleForTracking="select-article"
              pageTitleForTracking="favorite"
              uiPartTitleForTracking="article-list"
              miscTracking={JSON.stringify({ sect_page: page })}
              articles={articleList.itemList.map(id => articles[id].article!)}
              renderChannelThumbnail
              renderChannelMeta
              renderAuthor={false}
              renderPublishDate
              renderFavoriteButton
              isFullWidthAvailable
              gridListSizeClassNames="GridArticleList-large"
            />
            <Pagination
              currentPage={page}
              totalPages={Math.ceil(itemCount / itemCountPerPage)}
              isMobile={isMobile}
              item={{
                el: Link,
                getProps: (p): LinkProps => ({
                  to: `${RoutePaths.ARTICLE_RECENT}?page=${p}`,
                }),
              }}
            />
          </>
        ) : (
          <ArticleEmpty iconName="document" description="아티클이 없습니다." />
        )}
      </div>
    </main>
  );
};

export default ArticleList;
