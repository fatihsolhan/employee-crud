import { css } from 'lit';

export const resetCss = css`
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  scroll-behavior: smooth;
}

body {
  min-height: 100vh;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
  background-color: #fff;
  color: #000;
  line-height: 1.5;
}

ul, ol {
  list-style: none;
}

a {
  text-decoration: none;
  color: inherit;
}

h1, h2, h3, h4, h5, h6 {
  font-size: inherit;
  font-weight: inherit;
}

button, input, select, textarea {
  font: inherit;
  color: inherit;
  background: none;
  border: none;
  outline: none;
  padding: 0;
  margin: 0;
  appearance: none;
}

button {
  cursor: pointer;
}

img, picture, video, canvas, svg {
  display: block;
  max-width: 100%;
  height: auto;
}
`;

export const cssVariables = css`
  :host {
    --primary-color: #FF6200;
    --primary-color-light: rgba(255, 98, 0, 0.1);
  }
`;

export const containerStyles = css`

    .container {
      width: 100%;
      margin-left: auto;
      margin-right: auto;
      padding-left: 1rem;
      padding-right: 1rem;
    }

    @media (min-width: 640px) {
      .container {
        max-width: 640px;
      }
    }

    @media (min-width: 768px) {
      .container {
        max-width: 768px;
      }
    }

    @media (min-width: 1024px) {
      .container {
        max-width: 1024px;
      }
    }

    @media (min-width: 1280px) {
      .container {
        max-width: 1280px;
      }
    }

    @media (min-width: 1536px) {
      .container {
        max-width: 1536px;
      }
    }
  `
