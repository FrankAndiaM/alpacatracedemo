import React from 'react';
import { render, screen, fireEvent, cleanup, queryByAttribute } from '@testing-library/react';
import TextField from '~atoms/TextField/TextField';

afterEach(cleanup);

describe('Render TextField', () => {
  const id: string = 'test-id';
  const name: string = 'test-name';
  const label: string = 'test-label';
  const value: string = 'test-value';
  const testId = 'TextField';

  test('should render', () => {
    const { container } = render(<TextField id={id} name={name} value={value} label={label} />);
    expect(container).toMatchSnapshot();
  });

  test('should have a id, name, label, value and testId', () => {
    const getById = queryByAttribute.bind(null, 'id');
    const getByName = queryByAttribute.bind(null, 'name');

    const { container } = render(<TextField id={id} name={name} value={value} label={label} />);
    expect(getById(container, id)).toBeInstanceOf(Node);
    expect(getByName(container, name)).toBeInstanceOf(Node);
    expect(screen.getByRole('textbox', { name: label })).toBeInstanceOf(Node);
    expect(screen.getByRole('textbox', { name: label })).toHaveValue(value);
    expect(screen.getByTestId(testId)).not.toBeNull();
  });

  test('should change value', () => {
    let changeValue: string = 'prev-text';
    const mockOnChange = jest.fn((e: any) => {
      changeValue = e.target.value;
    });

    const { rerender } = render(
      <TextField id={id} name={name} value={changeValue} label={label} onChange={mockOnChange} />
    );

    expect(screen.getByRole('textbox', { name: label })).toHaveValue(changeValue);
    fireEvent.change(screen.getByRole('textbox', { name: label }), { target: { value: 'newValue' } });

    rerender(<TextField id={id} name={name} value={changeValue} label={label} />);
    expect(screen.getByRole('textbox', { name: label })).toHaveValue('newValue');
  });

  test('should display error message', () => {
    const errors: any = {
      'test-name': 'ERRORS'
    };

    const touched: any = {
      'test-name': true
    };

    render(<TextField id={id} name={name} value={value} label={label} errors={errors} touched={touched} />);
    //container.className.includes('Miu-error')

    expect(screen.getByText('ERRORS')).toHaveClass('Mui-error');
    expect(screen.getByText('ERRORS')).toBeInstanceOf(Node);
  });
});
