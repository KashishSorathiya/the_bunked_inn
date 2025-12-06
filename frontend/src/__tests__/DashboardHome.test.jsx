import React from 'react';
import axios from 'axios';
jest.mock('axios');
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DashboardHome from '../pages/admin/DashboardHome';

describe('DashboardHome', () => {
  test('loads stats and handles clicks', async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        pendingApplications: 2,
        pendingRoomChangeRequests: 3,
        unresolvedComplaints: 4,
        totalAllocatedRooms: 5,
      },
    });

    const setActiveSection = jest.fn();
    render(<DashboardHome setActiveSection={setActiveSection} />);

    expect(screen.getByText(/loading stats/i)).toBeInTheDocument();

    await waitFor(() => expect(screen.getByText(/2 pending/i)).toBeInTheDocument());
    expect(screen.getByText(/3 new requests/i)).toBeInTheDocument();
    expect(screen.getByText(/4 unresolved/i)).toBeInTheDocument();
    expect(screen.getByText(/5 rooms filled/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Hostel Applications/i).closest('.status-section'));
    expect(setActiveSection).toHaveBeenCalledWith('HostelApplications');
  });
});
