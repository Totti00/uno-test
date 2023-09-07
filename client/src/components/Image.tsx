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
`

interface Image {
    src: string,
    alt?: string,
}

const Image = ({ src, alt = "", ...props }: Image) => {
    return (
        <Root {...props}>
            <img src={src} alt={alt}/>
        </Root>
    );
}

export default Image;