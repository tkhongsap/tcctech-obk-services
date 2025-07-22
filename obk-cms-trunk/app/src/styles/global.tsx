import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  svg {
    display: block;
  }

  body {
    max-width: 100%;
    overflow-x: hidden;
  }

  .col-sticky-start {
    position: sticky !important;
    left: 0;
    top: 0;
    background: linear-gradient(
      to left,
      ${(props) => props.theme.colors.astronaut50} 5px,
      ${(props) => props.theme.colors.porcelain} 5px,
      ${(props) => props.theme.colors.porcelain} 100%
    );
  }
  
  .col-sticky-end {
    position: sticky !important;
    right: 0;
    top: 0;
  }

`

export default GlobalStyle
