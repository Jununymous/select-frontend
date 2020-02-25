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
  const collectionIdList = response.collections.map(collection => collection.collectionId);
  collectionIdList.splice(2, 0, 0);
  return {
    ...state,
    fetchedAt,
    bigBannerList: isIosInApp
      ? response.banners.filter(banner => isRidiselectUrl(banner.linkUrl))
      : response.banners,
    collectionIdList,
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
