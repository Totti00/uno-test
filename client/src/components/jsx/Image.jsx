import styled from "styled-components";

const Root = styled.div`
  position: relative;
  padding-top: ${(props) => props.ratio * 100}%;

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

const shouldForwardProp = (prop) => !["ratio"].includes(prop);

const StyledRoot = styled(Root).withConfig({ shouldForwardProp })``;

export default function Image({ src, alt = " ", ratio = 9 / 16, ...props }) {
  return (
    <StyledRoot ratio={ratio} {...props}>
      <img src={src} alt={alt} />
    </StyledRoot>
  );
}
