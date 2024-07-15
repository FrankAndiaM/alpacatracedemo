import React from 'react';
import { render, screen } from '@testing-library/react';
import LinearProgress from '~atoms/LinearProgress/LinearProgress';

describe('Render LinearProgress', () => {
  test('should render is not loading', () => {
    const { container } = render(<LinearProgress loading={false} />);

    expect(container).toMatchSnapshot();
  });

  test('should render is loading', () => {
    render(<LinearProgress loading={true} />);

    expect(screen.getByRole('progressbar')).toBeInstanceOf(Node);
  });
});
