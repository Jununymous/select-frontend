import { getNotAvailableConvertDate } from 'app/utils/expiredDate';
import * as React from 'react';

interface ExpireRemaningTimeProps {
  expireDate: string;
}

export const ExpireIconComponent = (props: any) => (
  <svg width={10} height={10} {...props}>
    <g fill="none" fillRule="evenodd">
      <circle cx={5} cy={5} r={4.444} stroke="#0077D9" strokeWidth={1.111} />
      <path fill="#0077D9" d="M1.464 2.25l.786-.786L8.536 7.75l-.786.786z" />
    </g>
  </svg>
);

export const ExpireRemaningTime: React.SFC<ExpireRemaningTimeProps> = (props: ExpireRemaningTimeProps) => (
  <div className="ExpireRemaningTime">
    <ExpireIconComponent className="MySelectBookList_BlockIcon" />
    {/* TODO: 만료된 도서면 "종료된 도서" 표기하도록 수정. */}
    <span className="MySelectBookList_expired">{getNotAvailableConvertDate(props.expireDate)}</span>
  </div>
);
