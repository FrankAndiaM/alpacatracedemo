import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import Button from '~atoms/Button/Button';

describe('Render Button', () => {
  const text: string = 'Test text';

  test('should render text', () => {
    render(<Button text={text} />);

    expect(screen.getByText(text)).toBeInstanceOf(Node);
    expect(screen.getByRole('button')).toBeInstanceOf(Node);
  });

  test('should disabled', () => {
    render(<Button text={text} disabled />);

    expect(screen.getByRole('button')).toBeDisabled();
  });

  test('should style', () => {
    render(<Button text={text} color="primary" variant="outlined" />);

    expect(screen.getByRole('button')).toHaveClass('MuiButton-outlined MuiButton-outlinedPrimary');
  });

  test('should is loading', () => {
    render(<Button text={text} isLoading={true} />);

    expect(screen.getByRole('button', { name: text })).toBeInstanceOf(Node);
    expect(screen.getByRole('progressbar')).toBeInstanceOf(Node);
  });

  test('should is loading and style', () => {
    render(<Button text={text} isLoading={true} progressColor="primary" />);

    expect(screen.getByRole('progressbar')).toHaveClass('MuiCircularProgress-colorPrimary');
  });

  test('should click event', () => {
    let mockValue = '';

    const mockOnClick = jest.fn(() => {
      mockValue = 'event value';
    });

    render(<Button text={text} onClick={mockOnClick} />);

    expect(screen.getByText(text)).toBeInstanceOf(Node);
    expect(mockValue).toBe('');

    fireEvent.click(screen.getByRole('button'));

    expect(mockValue).toBe('event value');
  });
});
