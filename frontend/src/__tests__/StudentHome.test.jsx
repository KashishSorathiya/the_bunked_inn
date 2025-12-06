import React from 'react';
import { render, screen } from '@testing-library/react';
import StudentHome from '../pages/student/StudentHome';

describe('StudentHome', () => {
  test('renders status and actions', () => {
    const studentData = {
      name: 'Alex',
      hostelStatus: { applied: true, verified: false, roomNumber: 42 },
    };

    render(<StudentHome studentData={studentData} setSelectedSection={() => {}} />);

    expect(screen.getByText(/welcome, alex/i)).toBeInTheDocument();
    expect(screen.getByText(/yes/i)).toBeInTheDocument();
    expect(screen.getByText(/no/i)).toBeInTheDocument();
    expect(screen.getByText(/42/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /apply for hostel/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /request room change/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /view complaints/i })).toBeInTheDocument();
  });
});
