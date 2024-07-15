import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Dialog from '~molecules/Dialog/Dialog';

describe('Render Dialog', () => {
  const title: string = 'Test title';
  const actions: React.ReactNode = <div>actions</div>;
  const children: React.ReactNode = <div>children</div>;

  test('should no render', () => {
    const { container } = render(<Dialog onClose={() => null} open={false} />);
    expect(container).toMatchSnapshot();
  });

  test('should render title', () => {
    render(<Dialog onClose={() => null} open={true} title={title} />);
    expect(screen.getByText(title)).toBeInstanceOf(Node);
  });

  test('should render actions', () => {
    render(<Dialog onClose={() => null} open={true} actions={actions} />);
    expect(screen.getByText('actions')).toBeInstanceOf(Node);
  });

  test('should render children', () => {
    render(
      <Dialog onClose={() => null} open={true}>
        {children}
      </Dialog>
    );
    expect(screen.getByText('children')).toBeInstanceOf(Node);
  });

  test('should open and close', () => {
    let isOpen: boolean = true;

    const handleOnClose = jest.fn(() => {
      isOpen = false;
    });

    const button: React.ReactNode = <button onClick={handleOnClose}> click </button>;

    const { rerender } = render(<Dialog onClose={handleOnClose} open={isOpen} actions={button} />);
    expect(screen.getByRole('dialog')).toBeInstanceOf(Node);
    fireEvent.click(screen.getByText(/click/i));
    expect(isOpen).toBe(false);
    rerender(<Dialog onClose={handleOnClose} open={isOpen} actions={button} />);
    expect(screen.getByRole('dialog')).toBeInstanceOf(Node);
    // expect(container.firstChild).toBeNull();
  });
});
