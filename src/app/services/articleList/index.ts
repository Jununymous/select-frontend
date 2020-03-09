import { createAction, createReducer } from 'redux-act';

import { FetchStatusFlag } from 'app/constants';
import { Paginated, ArticleKey } from 'app/types';

export const Actions = {
  loadArticleListRequest: createAction<{
    type: ArticleListType;
    page: number;
    size?: number;
  }>('loadArticleListRequest'),
  afterLoadArticleList: createAction<{
    type: ArticleListType;
    page: number;
    articles?: ArticleKey[];
    totalCount?: number;
  }>('afterLoadArticleList'),
};

export enum ArticleListType {
  RECENT = 'recentArticleList',
  POPULAR = 'popularArticleList',
  RECOMMEND = 'recommendArticleList',
}

export interface ArticleListState {
  recentArticleList: Paginated<ArticleKey>;
  popularArticleList: Paginated<ArticleKey>;
  recommendArticleList: Paginated<ArticleKey>;
}

export const INITIAL_STATE: ArticleListState = {
  recentArticleList: {
    itemListByPage: {},
  },
  popularArticleList: {
    itemListByPage: {},
  },
  recommendArticleList: {
    itemListByPage: {},
  },
};

export const articleListReducer = createReducer<typeof INITIAL_STATE>({}, INITIAL_STATE);

articleListReducer.on(Actions.loadArticleListRequest, (state, action) => {
  const { type, page } = action;
  return {
    ...state,
    [type]: {
      ...state[type],
      itemListByPage: {
        ...state[type].itemListByPage,
        [page]: {
          ...state[type].itemListByPage[page],
          fetchStatus: FetchStatusFlag.FETCHING,
          isFetched: false,
        },
      },
    },
  };
});

articleListReducer.on(Actions.afterLoadArticleList, (state, action) => {
  const { type, page, articles, totalCount } = action;

  return articles && totalCount
    ? {
        ...state,
        [type]: {
          ...state[type],
          itemCount: totalCount,
          itemListByPage: {
            ...state[type].itemListByPage,
            [page]: {
              fetchStatus: FetchStatusFlag.IDLE,
              itemList: articles,
              isFetched: true,
            },
          },
        },
      }
    : {
        ...state,
        [type]: {
          ...state[type],
          itemListByPage: {
            ...state[type].itemListByPage,
            [page]: {
              ...state[type].itemListByPage[page],
              fetchStatus: FetchStatusFlag.FETCH_ERROR,
              isFetched: false,
            },
          },
        },
      };
});
