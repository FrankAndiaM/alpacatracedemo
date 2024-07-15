import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import DataTable from '~ui/organisms/DataTable/ServerSide/DataTable';
import { act } from 'react-dom/test-utils';
import { TableHeadColumn } from '~molecules/TableHead/TableHead';
import { AxiosResponse } from 'axios';

jest.mock('axios');
afterEach(cleanup);

describe('Render DataTable ServerSide', () => {
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

  // la siguiente estructura es del objeto devuelto en las API
  const values: any = {
    data: {
      data: {
        total: 11,
        items
      }
    }
  };

  let promise = Promise.resolve(values);

  const mockOnLoad = jest.fn(
    (page: number, perPage: number, orderBy: string, order: string, search: string): Promise<AxiosResponse<any>> => {
      const currentPage = page * perPage - perPage;
      const currentItems = items
        .sort((a: any, b: any) => {
          if (order === 'desc' && orderBy === 'columnValue') {
            if (a.columnValue > b.columnValue) return -1;
            if (a.columnValue < b.columnValue) return 1;
          }
          if (order === 'asc' && orderBy === 'columnValue') {
            if (a.columnValue < b.columnValue) return -1;
            if (a.columnValue > b.columnValue) return 1;
          }
          return 0;
        })
        .filter((item: any) => (search.length > 0 ? item.columnValue.includes(search) : true))
        .slice(currentPage, perPage);
      const newValues: any = {
        data: {
          data: {
            total: 11,
            items: currentItems
          }
        }
      };
      promise = Promise.resolve(newValues);
      return promise;
    }
  );

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

  test('should render navigation buttons and textfield search', async () => {
    render(<DataTable headers={[]} onLoad={mockOnLoad} />);
    await act(() => promise);
    expect(screen.getByRole('textbox', { name: 'Buscar' })).toBeInstanceOf(Node);
    expect(screen.getByRole('table')).toBeInstanceOf(Node);
    expect(screen.getAllByRole('row').length).toBe(11);
    expect(screen.getByRole('button', { name: /rows per page/i })).toBeInstanceOf(Node);
    expect(screen.getByRole('button', { name: 'first page' })).toBeInstanceOf(Node);
    expect(screen.getByRole('button', { name: 'previous page' })).toBeInstanceOf(Node);
    expect(screen.getByRole('button', { name: 'next page' })).toBeInstanceOf(Node);
    expect(screen.getByRole('button', { name: 'last page' })).toBeInstanceOf(Node);
  });

  test('should render headers', async () => {
    render(<DataTable headers={headers} onLoad={mockOnLoad} />);
    await act(() => promise);
    expect(screen.getByRole('columnheader', { name: 'columnValue' })).toBeInstanceOf(Node);
  });

  test('should render items', async () => {
    render(<DataTable headers={headers} onLoad={mockOnLoad} />);
    await act(() => promise);
    expect(screen.getAllByRole('cell')[0].textContent).toBe('a');
    expect(screen.getAllByRole('cell').length).toBe(10);
  });

  test('should click event on header for sort', async () => {
    render(<DataTable headers={headers} onLoad={mockOnLoad} />);
    await act(() => promise);
    expect(screen.getAllByRole('cell')[0].textContent).toBe('a');
    fireEvent.click(screen.getByRole('button', { name: 'columnValue' }));
    await act(() => promise);
    expect(screen.getAllByRole('cell')[0].textContent).toBe('k');
    fireEvent.click(screen.getByRole('button', { name: 'columnValue' }));
    await act(() => promise);
    expect(screen.getAllByRole('cell')[0].textContent).toBe('a');
  });

  test('should search row on table', async () => {
    render(<DataTable headers={headers} onLoad={mockOnLoad} />);
    await act(() => promise);
    expect(screen.getAllByRole('cell').length).toBe(10);
    fireEvent.change(screen.getByRole('textbox', { name: 'Buscar' }), { target: { value: 'a' } });
    await act(() => promise);
    expect(screen.getAllByRole('cell').length).toBe(2);
  });

  test('should click on next and prev buttons', async () => {
    render(<DataTable headers={headers} onLoad={mockOnLoad} />);
    await act(() => promise);
    expect(screen.getAllByRole('cell').length).toBe(10);
    fireEvent.click(screen.getByRole('button', { name: 'next page' }));
    await act(() => promise);
    expect(screen.getAllByRole('cell').length).toBe(1);
    fireEvent.click(screen.getByRole('button', { name: 'previous page' }));
    await act(() => promise);
    expect(screen.getAllByRole('cell').length).toBe(10);
  });

  test('should click on first and last buttons', async () => {
    render(<DataTable headers={headers} onLoad={mockOnLoad} />);
    await act(() => promise);
    expect(screen.getAllByRole('cell').length).toBe(10);
    fireEvent.click(screen.getByRole('button', { name: 'last page' }));
    await act(() => promise);
    expect(screen.getAllByRole('cell').length).toBe(1);
    fireEvent.click(screen.getByRole('button', { name: 'first page' }));
    await act(() => promise);
    expect(screen.getAllByRole('cell').length).toBe(10);
  });
});
