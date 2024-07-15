import React from 'react';
import { fireEvent, render, screen, queryByAttribute } from '@testing-library/react';
import Autocomplete from '~atoms/Autocomplete/Autocomplete';

describe('Render Autocomplete', () => {
  const id: string = 'test-id';
  const name: string = 'test-name';
  const label: string = 'test-label';

  //
  // const value: any = 'aaa';

  // const defaultValue: any = 'aaa';

  const selectedValue = 'aaa';

  const items: any = ['aaa', 'bbb', 'ccc'];

  // Object
  // const jsonValue: any = {
  //   id: 1,
  //   title: 'aaa'
  // };

  // const jsonDefaultValue: any = {
  //   id: 1,
  //   title: 'aaa'
  // };

  const jsonSelectedValue = {
    id: 1,
    title: 'aaa'
  };

  const jsonItems: any = [
    {
      id: 1,
      title: 'aaa'
    },
    {
      id: 2,
      title: 'bbb'
    },
    {
      id: 3,
      title: 'ccc'
    }
  ];

  test('should render', () => {
    const { container } = render(
      <Autocomplete id={id} name={name} label={label} items={[]} value={null} defaultValue={null} />
    );
    expect(container).toMatchSnapshot();
  });

  test('should disabled', () => {
    const { container } = render(
      <Autocomplete id={id} name={name} label={label} items={[]} value={null} defaultValue={null} disabled={true} />
    );
    expect(container).toMatchSnapshot();
  });

  test('should render id, name and label', () => {
    const getById = queryByAttribute.bind(null, 'id');
    const getByName = queryByAttribute.bind(null, 'name');
    const { container } = render(
      <Autocomplete id={id} name={name} label={label} items={items} value={null} defaultValue={null} />
    );

    expect(getById(container, id)).toBeInstanceOf(Node);
    expect(getByName(container, name)).toBeInstanceOf(Node);
    expect(screen.getByText(label)).toBeInstanceOf(Node);
  });

  test('should render options', () => {
    render(<Autocomplete id={id} name={name} label={label} items={items} value={null} defaultValue={null} />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getAllByRole('option').length).toBe(3);
  });

  test('should render errors', () => {
    const errors: any = {
      'test-name': 'ERRORS'
    };

    const touched: any = {
      'test-name': true
    };

    render(
      <Autocomplete
        id={id}
        name={name}
        label={label}
        items={items}
        value={null}
        defaultValue={null}
        errors={errors}
        touched={touched}
      />
    );

    expect(screen.getByText('ERRORS')).toHaveClass('Mui-error');
    expect(screen.getByText('ERRORS')).toBeInstanceOf(Node);
  });

  test('should disableClearable', () => {
    const { container } = render(
      <Autocomplete
        id={id}
        name={name}
        label={label}
        items={items}
        value={null}
        defaultValue={null}
        disableClearable={false}
      />
    );

    expect(container).toMatchSnapshot();
  });

  describe('plain values', () => {
    test('should render selectedValue', () => {
      render(
        <Autocomplete
          id={id}
          name={name}
          label={label}
          items={items}
          value={null}
          defaultValue={null}
          selectedValue={selectedValue}
        />
      );
      expect(screen.getByRole('textbox')).toHaveValue('aaa');
    });

    test('should change value', () => {
      let currentName: string = '';
      let currentValue: any = '';

      const mockOnChange = jest.fn((testName: string, testValue: any) => {
        currentName = testName;
        currentValue = testValue;
      });

      render(
        <Autocomplete
          id={id}
          name={name}
          label={label}
          items={items}
          value={null}
          defaultValue={null}
          onChange={mockOnChange}
        />
      );

      expect(screen.getByRole('textbox')).toHaveValue('');

      fireEvent.click(screen.getByRole('button'));
      fireEvent.click(screen.getByRole('option', { name: 'bbb' }));

      expect(currentName).toBe(name);
      expect(currentValue).toBe('bbb');
      expect(screen.getByRole('textbox')).toHaveValue('bbb');
    });
  });

  describe('object values', () => {
    test('should render selectedValue', () => {
      render(
        <Autocomplete
          id={id}
          name={name}
          label={label}
          items={jsonItems}
          value={null}
          defaultValue={null}
          selectedValue={jsonSelectedValue}
        />
      );
      expect(screen.getByRole('textbox')).toHaveValue('[object Object]');
    });

    test('should render selectedValue with itemText', () => {
      render(
        <Autocomplete
          id={id}
          name={name}
          label={label}
          items={jsonItems}
          value={null}
          defaultValue={null}
          selectedValue={jsonSelectedValue}
          itemText="title"
        />
      );
      expect(screen.getByRole('textbox')).toHaveValue('aaa');
    });

    test('should change value', () => {
      render(
        <Autocomplete
          id={id}
          name={name}
          label={label}
          items={jsonItems}
          value={null}
          defaultValue={null}
          itemText="title"
        />
      );

      expect(screen.getByRole('textbox')).toHaveValue('');

      fireEvent.click(screen.getByRole('button'));
      fireEvent.click(screen.getByRole('option', { name: 'ccc' }));

      expect(screen.getByRole('textbox')).toHaveValue('ccc');
    });

    test('should change value with onChange and itemValue', () => {
      let currentName: string = '';
      let currentValue: any = '';

      const mockOnChange = jest.fn((testName: string, testValue: any) => {
        currentName = testName;
        currentValue = testValue;
      });

      render(
        <Autocomplete
          id={id}
          name={name}
          label={label}
          items={jsonItems}
          value={null}
          defaultValue={null}
          onChange={mockOnChange}
          itemText="title"
          itemValue="id"
        />
      );

      expect(screen.getByRole('textbox')).toHaveValue('');

      fireEvent.click(screen.getByRole('button'));
      fireEvent.click(screen.getByRole('option', { name: 'ccc' }));

      expect(currentName).toBe(name);
      expect(currentValue).toBe(3);
      expect(screen.getByRole('textbox')).toHaveValue('ccc');
    });
  });
});
