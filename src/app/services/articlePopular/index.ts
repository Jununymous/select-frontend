import { createAction, createReducer } from 'redux-act';

import { FetchStatusFlag } from 'app/constants';
import { ArticleKey, Paginated } from 'app/types';
import { PopularArticleListResponse } from 'app/services/articlePopular/requests';
import { getArticleKeyFromData } from 'app/utils/utils';

export const Actions = {
  loadPopularArticlesRequest: createAction<{
    page: number;
  }>('loadPopularArticlesRequest'),
  afterLoadPopularArticles: createAction<{
    page: number;
    response?: PopularArticleListResponse;
  }>('afterLoadPopularArticles'),
};

export type PopularArticleListState = Paginated<ArticleKey>;

export const INITIAL_STATE: PopularArticleListState = {
  itemListByPage: {},
};

export const popularArticleListReducer = createReducer<typeof INITIAL_STATE>({}, INITIAL_STATE);

popularArticleListReducer.on(Actions.loadPopularArticlesRequest, (state, action) => {
  const { page } = action;
  return {
    ...state,
    itemListByPage: {
      ...state.itemListByPage,
      [page]: {
        ...state.itemListByPage[page],
        fetchStatus: FetchStatusFlag.FETCHING,
        isFetched: false,
      },
    },
  };
});

popularArticleListReducer.on(Actions.afterLoadPopularArticles, (state, action) => {
  const { page, response } = action;

  return response && response.articles
    ? {
        ...state,
        itemCount: response?.totalCount,
        itemListByPage: {
          ...state.itemListByPage,
          [page]: {
            fetchStatus: FetchStatusFlag.IDLE,
            itemList: response.articles.map(article => getArticleKeyFromData(article)),
            isFetched: true,
          },
        },
      }
    : {
        ...state,
        itemListByPage: {
          ...state.itemListByPage,
          [page]: {
            ...state.itemListByPage[page],
            fetchStatus: FetchStatusFlag.FETCH_ERROR,
            isFetched: false,
          },
        },
      };
});
