import React from 'react';
import {screen, render, cleanup} from '@testing-library/react';
import {DevConfigProvider} from '../contexts/devConfigContext';

import App from '../App';

describe('App component', () => {
  beforeAll(() => {
    const devConfigExample = ['Webpack', 'ESLint'];
    render(
      <DevConfigProvider value={devConfigExample}>
        <App />
      </DevConfigProvider>,
    );
  });

  it('should have the right message in the dom', () => {
    const message = 'Webpack';

    expect(screen.getByText(message)).toBeInTheDocument();
  });

  afterAll(cleanup);
});
