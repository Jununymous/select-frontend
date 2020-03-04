import React from 'react';

interface ArticleSectionHeaderProps {
  title: string;
}

export const ArticleSectionHeader: React.FunctionComponent<ArticleSectionHeaderProps> = props => {
  const { title } = props;

  return (
    <div className="ArticleSection_Header">
      <h2 className="ArticleSection_Title reset-heading">{title}</h2>
    </div>
  );
};
