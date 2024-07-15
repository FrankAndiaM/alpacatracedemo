import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ListItem from '~molecules/ListItem/ListItem';
import { BrowserRouter } from 'react-router-dom';

describe('Render ListItem', () => {
  const item = {
    text: 'mock-text',
    path: 'mock-path',
    icon: 'mock-icon'
  };

  const items = {
    text: 'mock-text',
    path: 'mock-path',
    icon: 'mock-icon',
    children: [
      { text: 'mock-text-1', path: 'mock-path-1', icon: 'mock-icon-1' },
      { text: 'mock-text-2', path: 'mock-path-2', icon: 'mock-icon-2' }
    ]
  };

  test('should render', () => {
    const { container } = render(
      <BrowserRouter>
        <ListItem item={item} />
      </BrowserRouter>
    );
    expect(container).toMatchSnapshot();
  });

  test('should render children', () => {
    render(
      <BrowserRouter>
        <ListItem item={items} />
      </BrowserRouter>
    );
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('button', { name: 'mock-text-1' })).toBeInstanceOf(Node);
    expect(screen.getByRole('button', { name: 'mock-text-2' })).toBeInstanceOf(Node);
  });
});
