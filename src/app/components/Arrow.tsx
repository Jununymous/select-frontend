/**
 * made by jeongsik@ridi.com
 */
import classNames from 'classnames';
import React from 'react';
import MediaQuery, { useMediaQuery } from 'react-responsive';

interface ArrowProps {
  side?: 'left' | 'right';
  renderGradient?: boolean;
  className: string;
  gradientClassName: string;
  transition: boolean | string;
  label: string;
  onClickHandler: (e: React.FormEvent) => void;
}

const ArrowV = (props: any) => (
  <svg width={11} height={14} {...props}>
    <path d="M1.78 13.013L7.68 7 1.78.987 2.75 0l6.875 7-6.875 7z" />
  </svg>
);

const Arrow: React.FunctionComponent<ArrowProps> = props => {
  const { transition, side, className, gradientClassName, onClickHandler, renderGradient } = props;
  const handleClick = (e: React.FormEvent) => {
    e.preventDefault();
    onClickHandler(e);
  };
  const isButtonVisible = useMediaQuery({ query: '(min-device-width: 900px)' });
  return (
    <>
      {renderGradient && (
        <div className={classNames('ArrowButtonGradient', gradientClassName, transition || '')} />
      )}
      {isButtonVisible && (
        <button
          type="button"
          onClick={handleClick}
          className={classNames('SlideArrowButton', className, transition || '')}
        >
          <ArrowV
            className={classNames(
              side === 'left' ? 'SlideArrowButtonIcon_Left' : 'SlideArrowButtonIcon_Right',
            )}
          />
          <span className="a11y">{props.label}</span>
        </button>
      )}
    </>
  );
};

export default React.memo(Arrow);
