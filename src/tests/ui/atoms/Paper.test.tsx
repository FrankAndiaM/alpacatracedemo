import React from 'react';
import { render, screen } from '@testing-library/react';
import Paper from '~atoms/Paper/Paper';

describe('Render Paper', () => {
  const title: string = 'Test title';
  const component: React.ReactNode = <div>component</div>;
  const children: React.ReactNode = <div>children</div>;

  test('should render a title', () => {
    render(<Paper title={title} />);

    expect(screen.getByText(title)).toBeInstanceOf(Node);
  });

  test('should render a component', () => {
    render(<Paper component={component} />);

    expect(screen.getByText('component')).toBeInstanceOf(Node);
  });

  it('should render children', () => {
    render(<Paper>{children}</Paper>);

    expect(screen.getByText('children')).not.toBeNull();
  });
});
