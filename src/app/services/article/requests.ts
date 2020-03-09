import { AxiosResponse, Method } from 'axios';

import { camelize } from '@ridi/object-case-converter';

import request from 'app/config/axios';
import { Article } from 'app/services/article';
import { ArticleChannel } from 'app/services/articleChannel';
import { ArticleRequestQueries, DateDTO } from 'app/types';
import { buildArticleRequestQueriesToString } from 'app/utils/request';

export interface AuthorResponse {
  id: number;
  name: string;
  description?: string;
  thumbnailUrl?: string;
  regDate: DateDTO;
  lastModified: DateDTO;
}

export interface ArticleResponse extends Article {
  author?: AuthorResponse;
  content?: string;
  channel?: ArticleChannel;
}

export interface FavoriteArticleActionResponse {
  channelName: string;
  contentId: number;
  isFavorite: boolean;
}

export const requestSingleArticle = (
  channelName: string,
  contentIndex: number,
  requestQueries?: ArticleRequestQueries,
): Promise<ArticleResponse> => {
  const requestUrl = `/article/articles/@${channelName}/${contentIndex}${buildArticleRequestQueriesToString(
    requestQueries,
  )}`;

  return request({
    url: requestUrl,
    method: 'GET',
  }).then(
    response => camelize<AxiosResponse<ArticleResponse>>(response, { recursive: true }).data,
  );
};

export const requestFavoriteArticleAction = (
  method: Method,
  articleId: number,
): Promise<FavoriteArticleActionResponse> =>
  request({
    url: '/article/me/favorites',
    method,
    data: {
      article_id: articleId,
    },
  }).then(
    response =>
      camelize<AxiosResponse<FavoriteArticleActionResponse>>(response, { recursive: true }).data,
  );
