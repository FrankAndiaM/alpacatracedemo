import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DataTable from '~ui/organisms/DataTable/ClientSide/DataTable';
import { TableHeadColumn } from '~molecules/TableHead/TableHead';

describe('Render DataTable ClientSide', () => {
  const headers: TableHeadColumn[] = [
    {
      sorteable: true,
      align: 'left',
      padding: 'none',
      size: 'medium',
      variant: 'body',
      text: 'columnValue',
      value: 'columnValue'
    }
  ];

  const items = [
    {
      columnValue: 'a'
    },
    {
      columnValue: 'ab'
    },
    {
      columnValue: 'c'
    },
    {
      columnValue: 'd'
    },
    {
      columnValue: 'e'
    },
    {
      columnValue: 'f'
    },
    {
      columnValue: 'g'
    },
    {
      columnValue: 'h'
    },
    {
      columnValue: 'i'
    },
    {
      columnValue: 'j'
    },
    {
      columnValue: 'k'
    }
  ];

  test('should render navigation buttons and textfield search', () => {
    render(<DataTable headers={[]} items={[]} />);
    expect(screen.getByRole('textbox', { name: 'Buscar' })).toBeInstanceOf(Node);
    expect(screen.getByRole('table')).toBeInstanceOf(Node);
    expect(screen.getByRole('row', { name: '' })).toBeInstanceOf(Node);
    expect(screen.getByRole('cell')).toBeInstanceOf(Node);
    expect(screen.getByRole('button', { name: /rows per page/i })).toBeInstanceOf(Node);
    expect(screen.getByRole('button', { name: 'first page' })).toBeInstanceOf(Node);
    expect(screen.getByRole('button', { name: 'previous page' })).toBeInstanceOf(Node);
    expect(screen.getByRole('button', { name: 'next page' })).toBeInstanceOf(Node);
    expect(screen.getByRole('button', { name: 'last page' })).toBeInstanceOf(Node);
  });

  test('should render headers', () => {
    render(<DataTable headers={headers} items={[]} />);
    expect(screen.getByRole('columnheader', { name: 'columnValue' })).toBeInstanceOf(Node);
  });

  test('should render items', () => {
    render(<DataTable headers={headers} items={items} />);
    expect(screen.getAllByRole('cell')[0].textContent).toBe('a');
    expect(screen.getAllByRole('cell').length).toBe(10);
  });

  test('should click event on header', () => {
    render(<DataTable headers={headers} items={items} />);
    expect(screen.getAllByRole('cell')[0].textContent).toBe('a');
    fireEvent.click(screen.getByRole('button', { name: 'columnValue' }));
    expect(screen.getAllByRole('cell')[0].textContent).toBe('k');
  });

  test('should search row on table', () => {
    render(<DataTable headers={headers} items={items} />);
    expect(screen.getAllByRole('cell').length).toBe(10);
    fireEvent.change(screen.getByRole('textbox', { name: 'Buscar' }), { target: { value: 'a' } });
    expect(screen.getAllByRole('cell').length).toBe(2);
  });

  test('should click on next and prev buttons', () => {
    render(<DataTable headers={headers} items={items} />);
    expect(screen.getAllByRole('cell').length).toBe(10);
    fireEvent.click(screen.getByRole('button', { name: 'next page' }));
    expect(screen.getAllByRole('cell').length).toBe(1);
    fireEvent.click(screen.getByRole('button', { name: 'previous page' }));
    expect(screen.getAllByRole('cell').length).toBe(10);
  });

  test('should click on first and last buttons', () => {
    render(<DataTable headers={headers} items={items} />);
    expect(screen.getAllByRole('cell').length).toBe(10);
    fireEvent.click(screen.getByRole('button', { name: 'last page' }));
    expect(screen.getAllByRole('cell').length).toBe(1);
    fireEvent.click(screen.getByRole('button', { name: 'first page' }));
    expect(screen.getAllByRole('cell').length).toBe(10);
  });
});
