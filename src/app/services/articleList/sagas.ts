import { all, call, put, takeEvery } from 'redux-saga/effects';

import { ArticleRequestType } from 'app/types';
import { ErrorStatus } from 'app/constants/index';
import { getArticleKeyFromData } from 'app/utils/utils';
import showMessageForRequestError from 'app/utils/toastHelper';
import { Actions, ArticleListType } from 'app/services/articleList';
import { Actions as ArticleActions, Article } from 'app/services/article';
import {
  requestArticles,
  ArticleListResponse,
  requestPopularArticleList,
  PopularArticleListResponse,
} from 'app/services/articleList/requests';

function* loadArticleListRequest({ payload }: ReturnType<typeof Actions.loadArticleListRequest>) {
  const { type, page, size = 20 } = payload;
  try {
    let response: ArticleListResponse & PopularArticleListResponse;
    let articles: Article[];
    let totalCount: number;

    if (type === ArticleListType.POPULAR) {
      response = yield call(requestPopularArticleList, { page, countPerPage: size });
      articles = response.articles;
      totalCount = response.totalCount;
    } else {
      response = yield call(requestArticles, {
        type: type === ArticleListType.RECOMMEND ? ArticleRequestType.RECOMMEND : undefined,
        exceptRidiChannel: type === ArticleListType.RECENT,
      });
      articles = response.results;
      totalCount = response.totalCount;
    }

    yield put(
      ArticleActions.updateArticles({
        articles,
      }),
    );
    yield put(
      Actions.afterLoadArticleList({
        articles: articles.map(article => getArticleKeyFromData(article)),
        totalCount,
        page,
        type,
      }),
    );
  } catch (e) {
    yield put(
      Actions.afterLoadArticleList({
        type,
        page,
      }),
    );
    if (e && e.response && e.response.data && e.response.data.status === ErrorStatus.MAINTENANCE) {
      return;
    }
    showMessageForRequestError(e);
  }
}
export function* watchLoadArticleListRequest() {
  yield takeEvery(Actions.loadArticleListRequest.getType(), loadArticleListRequest);
}

export function* articleListRootSaga() {
  yield all([watchLoadArticleListRequest()]);
}
