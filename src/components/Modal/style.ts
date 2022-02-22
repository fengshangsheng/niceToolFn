import styled from 'styled-components';

const Component = styled.div`
  width: 50%;

  & > [data-nicetoolfn-mask] {
  }

  & > [data-nicetoolfn-mask] + * {
    z-index: 999;
    position: fixed;
    top: 50%;
    left: 50%;
    background-color: rgb(0, 21, 255);
    opacity: 0;
    transform: translate(-50%, -50%) scale(1.15, 1.15);
    transition: transform 150ms, opacity 150ms;
  }
`;

const Mask = styled.div`
  position: fixed;
  z-index: 999;
  //left: 0;
  width: 50%;
  top: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.3);
  opacity: 0;
  transition: opacity 150ms;
`

export {
  Component,
  Mask
}
