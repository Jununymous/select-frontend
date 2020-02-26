import { all, call, put, take, takeEvery, select } from 'redux-saga/effects';

import history from 'app/config/history';
import { Actions } from 'app/services/collection';
import { Actions as BookActions } from 'app/services/book';
import { Actions as UserActions } from 'app/services/user';
import { FetchErrorFlag, FetchStatusFlag } from 'app/constants';
import { requestUserGroup } from 'app/services/user/requests';
import {
  CollectionResponse,
  requestCollection,
  requestPopularBooks,
} from 'app/services/collection/requests';
import {
  fixWrongPaginationScope,
  isValidPaginationParameter,
  updateQueryStringParam,
} from 'app/utils/request';
import toast from 'app/utils/toast';
import { RidiSelectState } from 'app/store';

export function* loadCollection({ payload }: ReturnType<typeof Actions.loadCollectionRequest>) {
  const { page, collectionId } = payload;
  try {
    if (!isValidPaginationParameter(page)) {
      throw FetchErrorFlag.UNEXPECTED_PAGE_PARAMS;
    }
    const response: CollectionResponse = yield call(requestCollection, collectionId, page);
    yield put(BookActions.updateBooks({ books: response.books }));
    if (collectionId === 'spotlight') {
      yield put(Actions.updateSpotlight({ spotlight: response }));
    } else {
      yield put(Actions.loadCollectionSuccess({ collectionId, page, response }));
    }
  } catch (error) {
    if (error === FetchErrorFlag.UNEXPECTED_PAGE_PARAMS) {
      history.replace(`?${updateQueryStringParam('page', 1)}`);
      return;
    }
    yield put(Actions.loadCollectionFailure({ collectionId, page, error }));
  }
}

export function* watchLoadCollection() {
  yield takeEvery(Actions.loadCollectionRequest.getType(), loadCollection);
}

export function* watchCollectionFailure() {
  while (true) {
    const {
      payload: { collectionId, page, error },
    }: ReturnType<typeof Actions.loadCollectionFailure> = yield take(
      Actions.loadCollectionFailure.getType(),
    );
    if (collectionId === 'spotlight') {
      // spotlight의 경우 홈 화면에서만 섹션이 노출되고 아직 전체보기 페이지가 없어서 페이지네이션의 개념이 없음
      return;
    }
    if (page === 1) {
      toast.failureMessage('없는 페이지입니다. 다시 시도해주세요.');
      return;
    }
    fixWrongPaginationScope(error.response);
  }
}

export function* loadPopularBooksRequest({
  payload,
}: ReturnType<typeof Actions.loadPopularBooksRequest>) {
  const { page } = payload;
  try {
    let userGroup = yield select((state: RidiSelectState) => state.user.userGroup);

    if (!userGroup) {
      const userGroupResponse = yield call(requestUserGroup);
      userGroup = userGroupResponse.userGroup;
      yield put(UserActions.fetchUserGroupInfo({ userGroup }));
    }

    const popularBooksResponse = yield call(requestPopularBooks, { userGroup, page });
    yield put(BookActions.updateBooks({ books: popularBooksResponse.books }));
    yield put(
      Actions.afterLoadPopularBooks({
        page,
        books: popularBooksResponse.books,
        totalCount: popularBooksResponse.totalCount,
      }),
    );
  } catch {
    toast.failureMessage('인기 도서 목록을 불러오는데 실패했습니다.');
    yield put(Actions.afterLoadPopularBooks({ page }));
  }
}

export function* watchLoadPopularBooks() {
  yield takeEvery(Actions.loadPopularBooksRequest, loadPopularBooksRequest);
}

export function* collectionsRootSaga() {
  yield all([watchLoadCollection(), watchCollectionFailure(), watchLoadPopularBooks()]);
}
