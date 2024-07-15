import React from 'react';
import { render, screen, queryByAttribute, queryAllByAttribute, fireEvent } from '@testing-library/react';
import SelectField from '~atoms/SelectField/SelectField';

describe('Render SelectField', () => {
  const getByName = queryByAttribute.bind(null, 'name');

  const id: string = 'test-id';
  const name: string = 'test-name';
  const label: string = 'test-label';

  // Plain

  const value: string = 'mock-value-1';

  const items: any = ['mock-value-1', 'mock-value-2', 'mock-value-3'];

  // Object

  const jsonValue = {
    id: 1,
    title: 'mock-value-1'
  };

  const jsonItems: any = [
    {
      id: 1,
      title: 'mock-value-1'
    },
    {
      id: 2,
      title: 'mock-value-2'
    },
    {
      id: 3,
      title: 'mock-value-3'
    }
  ];

  test('should have a id, name and label', () => {
    const getAllById = queryAllByAttribute.bind(null, 'id');

    const { container } = render(<SelectField id={id} label={label} name={name} items={[]} value={null} />);

    expect(getAllById(container, id).length).toBe(2);
    expect(getByName(container, name)).toBeInstanceOf(Node);
  });

  test('should disabled', () => {
    render(<SelectField id={id} label={label} name={name} items={[]} value={value} disabled={true} />);

    expect(screen.getByRole('button')).toHaveClass('Mui-disabled');
  });

  test('should render options', () => {
    render(<SelectField id={id} label={label} name={name} items={items} value={value} />);
    fireEvent.mouseDown(screen.getByRole('button'));
    expect(screen.getAllByRole('option').length).toBe(3);
  });

  // test('should render errors', () => {
  //   const errors: any = {
  //     'test-name': 'ERRORS'
  //   };

  //   const touched: any = {
  //     'test-name': true
  //   };

  //   render(
  //     <SelectField id={id} name={name} label={label} items={items} value={value} errors={errors} touched={touched} />
  //   );

  //   expect(screen.getByText('ERRORS')).toHaveClass('Mui-error');
  //   expect(screen.getByText('ERRORS')).toBeInstanceOf(Node);
  // });

  describe('plain values', () => {
    test('should render value', () => {
      const { container } = render(<SelectField id={id} name={name} label={label} items={items} value={value} />);

      expect(getByName(container, name)).toHaveValue('mock-value-1');
    });

    test('should change value', () => {
      let currentName: string = '';
      let currentValue: any = '';

      const mockOnChange = jest.fn((testName: string, testValue: any) => {
        currentName = testName;
        currentValue = testValue;
      });

      const { container } = render(
        <SelectField id={id} name={name} label={label} items={items} value={null} onChange={mockOnChange} />
      );

      expect(getByName(container, name)).toHaveValue('');

      fireEvent.mouseDown(screen.getByRole('button'));
      fireEvent.click(screen.getByRole('option', { name: 'mock-value-3' }));

      expect(currentName).toBe(name);
      expect(currentValue).toBe('mock-value-3');
      expect(getByName(container, name)).toHaveValue('mock-value-3');
    });
  });

  describe('object values', () => {
    test('should render selectedValue', () => {
      const { container } = render(
        <SelectField id={id} name={name} label={label} items={jsonItems} value={jsonValue} />
      );
      expect(getByName(container, name)).toHaveValue('[object Object]');
    });

    // test('should render selectedValue with itemText', () => {
    //   const { container } = render(
    //     <SelectField id={id} name={name} label={label} items={jsonItems} value={jsonValue} itemText="title" />
    //   );
    //   expect(getByName(container, name)).toHaveValue('mock-value-1');
    // });

    // test('should change value', () => {
    //   render(<SelectField id={id} name={name} label={label} items={jsonItems} value={null} itemText="title" />);

    //   expect(screen.getByRole('textbox')).toHaveValue('');

    //   fireEvent.mouseDown(screen.getByRole('button'));
    //   fireEvent.click(screen.getByRole('option', { name: 'ccc' }));

    //   expect(screen.getByRole('textbox')).toHaveValue('ccc');
    // });

    test('should change value with onChange and itemValue', () => {
      let currentName: string = '';
      let currentValue: any = '';

      const mockOnChange = jest.fn((testName: string, testValue: any) => {
        currentName = testName;
        currentValue = testValue;
      });

      const { container } = render(
        <SelectField
          id={id}
          name={name}
          label={label}
          items={jsonItems}
          value={null}
          onChange={mockOnChange}
          itemText="title"
          itemValue="id"
        />
      );

      expect(getByName(container, name)).toHaveValue('');

      fireEvent.mouseDown(screen.getByRole('button'));
      fireEvent.click(screen.getByRole('option', { name: 'mock-value-2' }));

      expect(currentName).toBe(name);
      expect(currentValue).toBe(2);
      // expect(getByName(container, name)).toHaveValue('mock-value-2');
    });
  });
});
