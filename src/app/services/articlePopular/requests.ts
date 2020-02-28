import { AxiosResponse } from 'axios';
import request from 'app/config/axios';

import { camelize } from '@ridi/object-case-converter';

import env from 'app/config/env';
import { Article } from 'app/services/article';

export interface PopularArticleListResponse {
  totalPage: number;
  totalCount: number;
  size: number;

  articles: Article[];
}

export const requestPopularArticleList = ({
  page,
  countPerPage,
}: {
  page?: number;
  countPerPage?: number;
}): Promise<PopularArticleListResponse> => {
  const paramsArray = [];
  if (page) {
    paramsArray.push(`page=${page}`);
  }
  paramsArray.push(`size=${countPerPage || 20}`);
  return request({
    url: `${env.BESTSELLER_API}/select/popular/articles${
      paramsArray.length > 0 ? `?${paramsArray.join('&')}` : ''
    }`,
    method: 'GET',
    withCredentials: true,
  }).then(
    response =>
      camelize<AxiosResponse<PopularArticleListResponse>>(response, { recursive: true }).data,
  );
};
