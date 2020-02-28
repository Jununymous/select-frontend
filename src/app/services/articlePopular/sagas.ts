import { all, takeLatest, call, put } from 'redux-saga/effects';

import { Actions as ArticleActions } from 'app/services/articlePopular';
import { Actions } from 'app/services/article';
import {
  PopularArticleListResponse,
  requestPopularArticleList,
} from 'app/services/articlePopular/requests';
import toast from 'app/utils/toast';

export function* loadPopularArticlesRequest({
  payload,
}: ReturnType<typeof Actions.loadPopularArticlesRequest>) {
  const { page } = payload;
  try {
    const response: PopularArticleListResponse = yield call(requestPopularArticleList, { page });
    yield put(
      Actions.updateArticles({
        articles: response.articles,
      }),
    );
    yield put(ArticleActions.afterLoadPopularArticles({ page, response }));
  } catch {
    toast.failureMessage('인기 아티클 목록을 불러오는데 실패했습니다.');
    yield put(ArticleActions.afterLoadPopularArticles({ page }));
  }
}

export function* watchLoadPopularArticlesRequest() {
  yield takeLatest(ArticleActions.loadPopularArticlesRequest.getType(), loadPopularArticlesRequest);
}

export function* articlePopularRootSaga() {
  yield all([watchLoadPopularArticlesRequest()]);
}
