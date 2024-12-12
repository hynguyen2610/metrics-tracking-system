/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import ReactFlatpickr from 'react-flatpickr'; // Import React wrapper for flatpickr
import 'flatpickr/dist/themes/material_green.css'; // Optional: Import a theme for flatpickr
import './style.css';

interface Unit {
  id: number;
  name: string;
  unit_type: string; // 'Distance' or 'Temperature'
}

interface User {
  username: string;
  full_name: string;
}

const AddMetric: React.FC = () => {
  const [allUnits, setAllUnits] = useState<Unit[]>([]); // All units with their types
  const [unitId, setUnitId] = useState<number>(0);
  const [unitType, setUnitType] = useState<string>('Distance'); // Default unit type is 'Distance'
  const [value, setValue] = useState<string>('');
  const [date, setDate] = useState<string>(''); // Store datetime as string (ISO format)
  const [error, setError] = useState<string>('');
  const [username, setUsername] = useState<string>(''); // User for metric creation
  const [allUsers, setAllUsers] = useState<User[]>([]); // All users for dropdown
  const [filteredUnits, setFilteredUnits] = useState<Unit[]>([]); // Filtered units based on type
  const router = useRouter();

  // Fetch all units and users when the page loads
  useEffect(() => {
    const fetchUnitsAndUsers = async () => {
      try {
        const unitsResponse = await axios.get('/api/units');
        setAllUnits(unitsResponse.data); // Store all units
        const usersResponse = await axios.get('/api/users');
        setAllUsers(usersResponse.data); // Store all users
      } catch (err: any) {
        setError(`Failed to fetch units or users: ${err.message}`);
      }
    };

    fetchUnitsAndUsers(); // Trigger the fetch when the component is mounted
  }, []);

  // Filter units based on selected unitType
  useEffect(() => {
    const filtered = allUnits.filter((unit) => unit.unit_type === unitType);
    setFilteredUnits(filtered); // Set filtered units based on the selected unit type
  }, [unitType, allUnits]); // Re-run when unitType or allUnits change

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous error messages
    setError('');

    // Validate the fields individually and give specific error messages
    if (!unitId) {
      setError('Please select a unit.');
      return;
    }

    if (!value) {
      setError('Please enter a value.');
      return;
    }

    // Ensure the value is a valid number
    if (isNaN(Number(value))) {
      setError('Value must be a valid decimal number.');
      return;
    }

    if (!username) {
      setError('Please select a user.');
      return;
    }

    if (!date) {
      setError('Please select a date and time.');
      return;
    }

    if (unitType === 'Distance' && Number(value) < 0) {
      setError('Distance values cannot be negative.');
      return;
    }

    // If all validations pass, proceed with metric submission
    const metricData = {
      unit_id: unitId,
      value: parseFloat(value),
      date: date,
      username: username,
    };

    try {
      await axios.post('/api/metrics', metricData);
      router.push('/metrics/list'); // Redirect to the metrics list page after submission
    } catch (err: any) {
      setError('Failed to add metric. Please try again.' + err.message);
    }
  };

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="form-container">
        <h2>Add New Metric</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Row for Unit Type, Unit, and User */}
          <div className="row">
            {/* Unit Type Filter */}
            <div className="col-md-4 mb-3">
              <label htmlFor="unitType" className="form-label">Select Unit Type</label>
              <select
                id="unitType"
                className="form-select form-control-sm"
                value={unitType}
                onChange={(e) => {
                  const newType = e.target.value;
                  setUnitType(newType); // Update unitType on change
                }}
              >
                <option value="Distance">Distance</option>
                <option value="Temperature">Temperature</option>
              </select>
            </div>

            {/* Unit Dropdown */}
            <div className="col-md-4 mb-3">
              <label htmlFor="unit" className="form-label">Select Metric Unit</label>
              <select
                id="unit"
                className="form-select form-control-sm"
                value={unitId}
                onChange={(e) => {
                  const newUnitId = Number(e.target.value);
                  setUnitId(newUnitId); // Update unitId on change
                }}
              >
                <option value={0} disabled>Select a unit</option>
                {filteredUnits.length > 0 ? (
                  filteredUnits.map((unit) => (
                    <option key={unit.id} value={unit.id}>
                      {unit.name}
                    </option>
                  ))
                ) : (
                  <option value={0} disabled>No units available</option>
                )}
              </select>
            </div>

            {/* User Dropdown */}
            <div className="col-md-4 mb-3">
              <label htmlFor="username" className="form-label">Select User</label>
              <select
                id="username"
                className="form-select form-control-sm"
                value={username}
                onChange={(e) => setUsername(e.target.value)} // Update username on change
              >
                <option value="" disabled>Select a user</option>
                {allUsers.map((user) => (
                  <option key={user.username} value={user.username}>
                    {user.full_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row for Metric Value and Date */}
          <div className="row">
            {/* Metric Value Input */}
            <div className="col-md-6 mb-3">
              <label htmlFor="value" className="form-label">Value</label>
              <input
                type="text"
                id="value"
                className="form-control form-control-sm"
                value={value}
                onChange={(e) => setValue(e.target.value)} // Update value on change
                placeholder="Enter metric value"
              />
            </div>

            {/* Date and Time Picker */}
            <div className="col-md-6 mb-3">
              <label htmlFor="date" className="form-label">Select Date and Time</label>
              <ReactFlatpickr
                id="date"
                value={date}
                onChange={(date: Date[]) => setDate(date[0].toISOString())} // Handle date change
                options={{
                  enableTime: true,
                  dateFormat: 'Y-m-d H:i:S', // Specify the date and time format
                  time_24hr: true,
                }}
                className="form-control form-control-sm"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="d-flex justify-content-center mt-3">
            <button type="submit" className="btn btn-primary btn-sm">Add Metric</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMetric;
