import React from 'react';
import axios from 'axios';
jest.mock('axios');
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ApplyHostel from '../pages/student/ApplyHostel';

describe('ApplyHostel', () => {
  beforeEach(() => {
    axios.post.mockReset();
    window.localStorage.setItem('token', 't');
  });

  test('submits application', async () => {
    axios.post.mockResolvedValueOnce({ data: { message: 'Submitted' } });

    render(<ApplyHostel />);

    fireEvent.change(screen.getByPlaceholderText('Roll Number'), { target: { value: '2020A01' } });
    fireEvent.change(screen.getByPlaceholderText('Course/Department'), { target: { value: 'CS' } });
    const radios = screen.getAllByRole('radio');
    const maleRadio = radios.find(r => r.value === 'male');
    fireEvent.click(maleRadio);
    fireEvent.click(screen.getByRole('button', { name: /submit application/i }));

    await waitFor(() => expect(axios.post).toHaveBeenCalled());

    const [[url, body, config]] = axios.post.mock.calls;
    expect(url).toMatch(/hostel-application\/apply/);
    expect(body).toEqual({ rollNumber: '2020A01', course: 'CS', gender: 'male' });
    expect(config.headers.Authorization).toBe('Bearer t');

    await waitFor(() => expect(screen.getByPlaceholderText('Roll Number')).toHaveValue(''));
  });
});
