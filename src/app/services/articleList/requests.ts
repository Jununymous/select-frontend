import qs from 'qs';
import { AxiosResponse } from 'axios';
import request from 'app/config/axios';

import { camelize } from '@ridi/object-case-converter';

import env from 'app/config/env';
import { Article } from 'app/services/article';
import { ArticleRequestQueries } from 'app/types';
import { ArticleResponse } from 'app/services/article/requests';
import { buildArticleRequestQueriesToString } from 'app/utils/request';

export interface ArticleListResponse {
  count: number;
  next?: string;
  previous?: string;
  results: ArticleResponse[];
}

export interface PopularArticleListResponse {
  totalPage: number;
  totalCount: number;
  size: number;

  articles: Article[];
}

export const requestArticles = (
  requestQueries?: ArticleRequestQueries,
  articleIds?: number[],
  size?: number,
): Promise<ArticleListResponse> => {
  let requestUrl = `/article/articles${buildArticleRequestQueriesToString(requestQueries)}`;
  if (articleIds) {
    requestUrl = `/article/articles${buildArticleRequestQueriesToString(
      requestQueries,
    )}&ids=${articleIds}&size=${size || 24}`;
  }
  return request({
    url: requestUrl,
    method: 'GET',
  }).then(
    response => camelize<AxiosResponse<ArticleListResponse>>(response, { recursive: true }).data,
  );
};

export const requestPopularArticleList = ({
  page,
  countPerPage,
}: {
  page?: number;
  countPerPage?: number;
}): Promise<PopularArticleListResponse> => {
  const parameters = qs.stringify({ page, size: countPerPage || 20 });
  return request({
    url: `${env.BESTSELLER_API}/select/popular/articles?${parameters}`,
    method: 'GET',
    withCredentials: true,
  }).then(
    response =>
      camelize<AxiosResponse<PopularArticleListResponse>>(response, { recursive: true }).data,
  );
};
