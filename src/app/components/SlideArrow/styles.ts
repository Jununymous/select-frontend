import { css } from '@emotion/core';

import Colors from 'app/styles/colors';
import { customMedia } from 'app/styles/customProperties';

export const SlideArrowButton = css`
  position: absolute;
  background: white;
  width: 40px;
  height: 40px;
  top: 50%;
  border-radius: 40px;
  border-color: transparent;
  box-shadow: 0 0.8px 3px rgba(0, 0, 0, 0.33);
  margin: -20px 0 0 0;
  padding: 0;
  transition: opacity 0.1s;
  cursor: pointer;
  opacity: 0.95;

  &:hover {
    opacity: 0.6;
  }

  @media (hover: none) {
    :hover {
      opacity: 0.95;
    }
  }

  @media ${customMedia.mobileLayout} {
    top: 15px;
  }
`;

export const SlideArrowButton_Left = css`
  ${SlideArrowButton}

  left: -45px;
  justify-content: flex-start;

  @media ${customMedia.mobileLayout} {
    top: 15px;
  }

  &::before {
    content: '';
    display: block;
    position: absolute;
    right: 0;
    top: 0;
    width: 25px;
    height: 100%;
    background-image: linear-gradient(
      to left,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 1) 100%,
      white 100%
    );
  }
`;

export const SlideArrowButton_Left_Hidden = css`
  ${SlideArrowButton_Left}

  opacity: 0;
`;

export const SlideArrowButton_Right = css`
  ${SlideArrowButton}

  right: -45px;
`;

export const SlideArrowButton_Right_Hidden = css`
  ${SlideArrowButton_Right}

  opacity: 0;
`;

export const ArrowButtonGradient = css`
  position: absolute;
  top: 0;
  width: 62px;
  height: 100%;
  z-index: 10;

  @media ${customMedia.mobileLayout} {
    top: 12px;
  }
`;

export const ArrowButtonGradient_Left = css`
  ${ArrowButtonGradient}

  left: 0;
  background-image: linear-gradient(to left, rgba(255, 255, 255, 0), white 100%);
`;

export const ArrowButtonGradient_Left_Hidden = css`
  ${ArrowButtonGradient_Left}

  opacity: 0;
`;

export const ArrowButtonGradient_Right = css`
  ${ArrowButtonGradient}

  right: 0;
  background-image: linear-gradient(to right, rgba(255, 255, 255, 0), white 100%);
`;

export const ArrowButtonGradient_Right_Hidden = css`
  ${ArrowButtonGradient_Right}

  opacity: 0;
`;

export const SlideArrowButtonIcon_Left = css`
  transform-origin: center;
  transform: rotateX(180deg) translate(-2%, 0) rotate(180deg);
  fill: ${Colors.slategray_50};
`;

export const SlideArrowButtonIcon_Right = css`
  fill: ${Colors.slategray_50};
`;
