import { all, takeLatest, call, put } from 'redux-saga/effects';

import { Actions } from 'app/services/articlePopular';
import { Actions as ArticleActions } from 'app/services/article';
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
      ArticleActions.updateArticles({
        articles: response.articles,
      }),
    );
    yield put(Actions.afterLoadPopularArticles({ page, response }));
  } catch {
    yield put(Actions.afterLoadPopularArticles({ page }));
  }
}

export function* watchLoadPopularArticlesRequest() {
  yield takeLatest(Actions.loadPopularArticlesRequest.getType(), loadPopularArticlesRequest);
}

export function* articlePopularRootSaga() {
  yield all([watchLoadPopularArticlesRequest()]);
}
