import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ActionsMenu from '~molecules/ActionsMenu/actionsMenu';

describe('Render ActionsMenu', () => {
  test('should render', () => {
    const { container } = render(<ActionsMenu />);
    expect(container).toMatchSnapshot();
  });

  test('should render items', () => {
    const items = [
      {
        onClick: () => {
          //console.log('');
        },
        icon: 'mock-icon',
        text: 'mock-text'
      }
    ];
    render(<ActionsMenu listItems={items} />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('menuitem', { name: 'mock-text' })).toBeInstanceOf(Node);
    expect(screen.getByText('mock-icon')).toBeInstanceOf(Node);
  });
});
