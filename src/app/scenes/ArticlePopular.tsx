import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { RidiSelectState } from 'app/store';
import { HelmetWithTitle } from 'app/components';
import { Actions } from 'app/services/articlePopular';
import { Actions as TrackingActions } from 'app/services/tracking';
import { getArticleKeyFromData } from 'app/utils/utils';
import { PageTitleText, FetchStatusFlag, ImageSize } from 'app/constants';
import { ConnectedTrackImpression } from 'app/components/TrackImpression';
import { getSectionStringForTracking } from 'app/services/tracking/utils';
import { ArticleThumbnail } from 'app/components/ArticleThumbnail';
import { ThumbnailShape } from 'app/components/ArticleThumbnail/types';
import { Link } from 'react-router-dom';
import { articleChannelToPath } from 'app/utils/toPath';

const ArticlePopular: React.FunctionComponent = () => {
  const popularArticles = useSelector(
    (state: RidiSelectState) => state.popularArticle.itemListByPage[1],
  );
  const articles = useSelector((state: RidiSelectState) => state.articlesById);
  const articleChannelById = useSelector((state: RidiSelectState) => state.articleChannelById);
  const section = getSectionStringForTracking('select-article', 'popular', 'article-list');
  const dispatch = useDispatch();

  const trackingClick = (index: number, id: number | string, misc?: string) => {
    if (!section) {
      return;
    }
    dispatch(TrackingActions.trackClick({ trackingParams: { section, index, id, misc } }));
  };

  useEffect(() => {
    if (
      !popularArticles ||
      (!popularArticles?.itemList && popularArticles.fetchStatus !== FetchStatusFlag.FETCHING) ||
      popularArticles.itemList.length <= 100
    ) {
      dispatch(Actions.loadPopularArticlesRequest({ page: 1, size: 100 }));
    }
  }, []);

  return (
    <main className="SceneWrapper SceneWrapper_WithGNB SceneWrapper_WithLNB PageArticlePopular">
      <HelmetWithTitle titleName={PageTitleText.ARTICLE_POPULAR} />
      <ul>
        {popularArticles?.itemList?.map((articleKey, idx) => {
          const { article } = articles[articleKey];
          const articleUrl = `/article/${getArticleKeyFromData(article)}`;
          const channelMeta =
            articleChannelById &&
            articleChannelById[article.channelName] &&
            articleChannelById[article.channelName].channelMeta;
          return (
            <li key={`popular_article_${idx}`} className="ArticleChartList_Article">
              <ConnectedTrackImpression
                section={section}
                index={idx}
                id={article.id}
                misc={JSON.stringify({ sect_ch: `ch:${channelMeta!.id}` })}
              >
                <span className="ArticleChartList_Rank">{idx + 1}</span>
                <ArticleThumbnail
                  linkUrl={articleUrl}
                  imageUrl={article.thumbnailUrl}
                  articleTitle={article.title}
                  thumbnailShape={ThumbnailShape.SQUARE}
                  imageSize={ImageSize.HEIGHT_100}
                  onLinkClick={() =>
                    trackingClick(
                      idx,
                      article.id,
                      JSON.stringify({ sect_ch: `ch:${channelMeta!.id}` }),
                    )
                  }
                />
                <div className="ArticleChartList_Meta">
                  <Link
                    className="ArticleChartList_Meta_Link"
                    to={articleUrl}
                    onClick={() =>
                      trackingClick(
                        idx,
                        article.id,
                        JSON.stringify({ sect_ch: `ch:${channelMeta!.id}` }),
                      )
                    }
                  >
                    <span className="ArticleChartList_Meta_Title">{article.title}</span>
                  </Link>
                  {channelMeta ? (
                    <Link
                      className="ArticleChartList_Channel_Link"
                      to={articleChannelToPath({ channelName: channelMeta.name })}
                      onClick={() => trackingClick(idx, `ch:${channelMeta.id}`)}
                    >
                      <span className="ArticleChartList_Meta_Channel">
                        {channelMeta.displayName}
                      </span>
                    </Link>
                  ) : null}
                </div>
              </ConnectedTrackImpression>
            </li>
          );
        })}
      </ul>
    </main>
  );
};

export default ArticlePopular;
