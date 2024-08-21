import React from "react";
import styled from "styled-components";

interface RootProps {
  $ratio: number;
}

const Root = styled.div<RootProps>`
  position: relative;
  padding-top: ${(props) => props.$ratio * 100}%;

  img {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    object-fit: cover;
    cursor: inherit;
  }
`;

interface ImageProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string;
  alt?: string;
  ratio?: number;
}

const Image: React.FC<ImageProps> = ({ src, alt = " ", ratio = 9 / 16, ...props }) => {
  return (
    <Root $ratio={ratio} {...props}>
      <img src={src} alt={alt} />
    </Root>
  );
};

export default Image;