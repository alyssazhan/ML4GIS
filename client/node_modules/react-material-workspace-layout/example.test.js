import React from 'react';
import { render } from '@testing-library/react';
import App from './App';
test('renders learn react link', function () {
  var _render = render( /*#__PURE__*/React.createElement(App, null)),
      getByText = _render.getByText;

  var linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});