import React from 'react';
import { render, screen } from '@testing-library/react';
import AudioRecorder from '~organisms/AudioRecorder/AudioRecorder';

describe('Render AudioRecorder', () => {
  // const children: React.ReactNode = <div>children</div>;

  test('should render', () => {
    const { container } = render(<AudioRecorder />);
    expect(container).toMatchSnapshot();
  });

  test('should disabled', () => {
    render(<AudioRecorder disabled={true} />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  test('should render text', () => {
    render(<AudioRecorder textTime="test text" />);
    expect(screen.getByText(/test text/i)).not.toBeNull();
  });

  // test('should recording', () => {
  //   let audioResult: Blob | null = null;
  //   const mockOnSuccess = (audio: Blob) => {
  //     audioResult = audio;
  //   };

  //   render(<AudioRecorder time={2} onSuccess={mockOnSuccess} />);
  //   fireEvent.click(screen.getByRole('button'));
  // });
});
