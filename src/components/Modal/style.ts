import styled from 'styled-components';

const Component = styled.div`
  width: 50%;

  & > [data-nicetoolfn-mask] {
    display: none;
  }

  & > [data-nicetoolfn-mask] + * {
    z-index: 1000;
    position: fixed;
    top: 50%;
    left: 50%;
    background-color: rgba(255, 255, 0, 1);
    transform: translate(-50%, -50%) scale(1.2, 1.2);
    transition: transform 150ms, opacity 150ms;
    opacity: 0;
  }
`;

const Mask = styled.div`
  position: fixed;
  z-index: 999;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.2);
`

export {
  Component,
  Mask
}
