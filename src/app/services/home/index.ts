import { FetchStatusFlag } from 'app/constants';
import { isRidiselectUrl } from 'app/utils/regexHelper';
import { createAction, createReducer } from 'redux-act';
import { CollectionId } from 'app/services/collection';
import { HomeResponse } from 'app/services/home/requests';

export const Actions = {
  loadHomeRequest: createAction('loadHomeRequest'),
  loadHomeSuccess: createAction<{
    response: HomeResponse;
    fetchedAt: number;
    isIosInApp: boolean;
  }>('loadHomeSuccess'),
  loadHomeFailure: createAction('loadHomeFailure'),
  updateBannerIndex: createAction<{
    currentIdx: number;
  }>('updateBannerIndex'),
};

export interface BigBanner {
  id: number;
  imageUrl: string;
  linkUrl: string;
  title: string;
}

export interface HomeState {
  fetchedAt: number | null;
  fetchStatus: FetchStatusFlag;
  currentIdx: number;
  bigBannerList: BigBanner[];
  collectionIdList: number[];
}

export const INITIAL_HOME_STATE: HomeState = {
  fetchedAt: null,
  fetchStatus: FetchStatusFlag.IDLE,
  currentIdx: 0,
  bigBannerList: [],
  collectionIdList: [],
};

export const homeReducer = createReducer<typeof INITIAL_HOME_STATE>({}, INITIAL_HOME_STATE);

homeReducer.on(Actions.loadHomeRequest, (state, action) => ({
  ...state,
  fetchStatus: FetchStatusFlag.FETCHING,
}));

homeReducer.on(Actions.loadHomeSuccess, (state, action) => {
  const { response, fetchedAt, isIosInApp } = action;
  const collectionIdListForRendering = response.collections.map(
    collection => collection.collectionId,
  );
  // 홈 화면에서 현재 셀렉트 백엔드에서 내려주는 Home API의 섹션 리스트를 이용하여 렌더링을 자동화 처리를 해둔 상황에서 중간에 static한 위치에
  // 데이터팀의 인기 도서 API의 응답 데이터를 활용해야하는 상황이라서 collection id list의 3번째 포지션에 임의로 인기도서 섹션에 해당하는 id를 넣어주는 처리.
  // TODO: 후에 홈 화면의 섹션 렌더링 방식을 개선하면서 이렇게 부분적으로 처리하는 것을 어떻게 줄일지 고민 필요.
  collectionIdListForRendering.splice(2, 0, 0);
  return {
    ...state,
    fetchedAt,
    bigBannerList: isIosInApp
      ? response.banners.filter(banner => isRidiselectUrl(banner.linkUrl))
      : response.banners,
    collectionIdList: collectionIdListForRendering,
    fetchStatus: FetchStatusFlag.IDLE,
  };
});

homeReducer.on(Actions.loadHomeFailure, (state, action) => ({
  ...state,
  fetchStatus: FetchStatusFlag.FETCH_ERROR,
}));

homeReducer.on(Actions.updateBannerIndex, (state, action) => {
  const { currentIdx } = action;
  return {
    ...state,
    currentIdx,
  };
});
