import React from 'react';
import { render, screen } from '@testing-library/react';
import TableBody from '~molecules/TableBody/TableBody';
import { TableHeadColumn } from '~molecules/TableHead/TableHead';

describe('Render TableBody', () => {
  // const textNoItems: string = 'mock-text-no-items';
  const headers: TableHeadColumn[] = [
    {
      sorteable: true,
      align: 'left',
      padding: 'none',
      size: 'medium',
      variant: 'body',
      text: 'description',
      value: 'description'
    }
  ];

  const items = [
    {
      id: 1,
      description: 'mock-description-1'
    },
    {
      id: 2,
      description: 'mock-description-2'
    }
  ];

  test('should render', () => {
    const { container } = render(
      <table>
        <TableBody headers={[]} items={[]} />
      </table>
    );
    expect(container).toMatchSnapshot();
  });

  test('should render headers and items', () => {
    render(
      <table>
        <TableBody headers={headers} items={items} />
      </table>
    );

    expect(screen.getByRole('row', { name: 'mock-description-1' })).toBeInstanceOf(Node);
    expect(screen.getByRole('row', { name: 'mock-description-2' })).toBeInstanceOf(Node);
    expect(screen.getByRole('cell', { name: 'mock-description-1' })).toBeInstanceOf(Node);
    expect(screen.getByRole('cell', { name: 'mock-description-2' })).toBeInstanceOf(Node);
  });
});
