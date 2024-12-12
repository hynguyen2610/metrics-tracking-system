'use client';

import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { Metric, Unit } from '../../models/interfaces';
import MetricsTable from './metric-table';
import LoadingSpinner from './loading-spinner';

const MetricsPage: React.FC = () => {
  const [, setMetrics] = useState<Metric[]>([]); 
  const [filteredMetrics, setFilteredMetrics] = useState<Metric[]>([]);
  const [unitType, setUnitType] = useState<string>('Distance'); 
  const [convertToUnit, setConvertToUnit] = useState<string>(''); 
  const [unitOptions, setUnitOptions] = useState<Unit[]>([]);
  const [userOptions, setUserOptions] = useState<{ username: string, full_name: string }[]>([]); 
  const [selectedUser, setSelectedUser] = useState<string>(''); 
  const [isLoading, setIsLoading] = useState<boolean>(true); // Track loading state

  const fetchData = async (unitType: string, convertToUnit: string, username: string) => {
    try {
      setIsLoading(true); // Start loading
      const params = { unitType, convertToUnit, username };
      const metricsResponse = await axios.get('/api/metrics', { params });
      const unitsResponse = await axios.get('/api/units');

      setMetrics(metricsResponse.data);
      setFilteredMetrics(metricsResponse.data); // Initially show all metrics
      setUnitOptions(unitsResponse.data);
    } catch (err) {
      console.error('Failed to fetch metrics or unit options:', err);
    } finally {
      setIsLoading(false); // End loading
    }
  };

  useEffect(() => {
    fetchData(unitType, convertToUnit, selectedUser);
  }, [unitType, convertToUnit, selectedUser]);

  useEffect(() => {
    const cachedUserOptions = localStorage.getItem('userOptions');
    if (cachedUserOptions) {
      setUserOptions(JSON.parse(cachedUserOptions));
    } else {
      const fetchUsers = async () => {
        try {
          const usersResponse = await axios.get('/api/users');
          setUserOptions(usersResponse.data); // [{ username, full_name }]
          localStorage.setItem('userOptions', JSON.stringify(usersResponse.data));
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      };
      fetchUsers();
    }
  }, []);

  const handleUnitTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUnitType = event.target.value;
    setUnitType(selectedUnitType);
    setConvertToUnit(''); 
  };

  const handleConvertToUnitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setConvertToUnit(event.target.value);
  };

  const handleUserChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedUser(event.target.value);
  };

  const availableUnits = useMemo(() => {
    return unitOptions.filter((unit) => unit.unit_type === unitType);
  }, [unitOptions, unitType]);

  return (
    <div className="container mt-5">
      <h2>Metrics List</h2>

      {/* Display loading spinner if data is loading */}
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="row">
            {/* Unit Type Filter Dropdown */}
            <div className="col-md-4 mb-3">
              <label htmlFor="unitType" className="form-label">Filter by Unit Type</label>
              <select
                id="unitType"
                className="form-select"
                value={unitType}
                onChange={handleUnitTypeChange}
              >
                <option value="Distance">Distance</option>
                <option value="Temperature">Temperature</option>
              </select>
            </div>

            {/* Convert To Unit Dropdown */}
            <div className="col-md-4 mb-3">
              <label htmlFor="convertToUnit" className="form-label">Convert to Unit</label>
              <select
                id="convertToUnit"
                className="form-select"
                value={convertToUnit}
                onChange={handleConvertToUnitChange}
              >
                <option value="">None</option>
                {availableUnits.map((unit) => (
                  <option key={unit.unit} value={unit.unit}>
                    {unit.name}
                  </option>
                ))}
              </select>
            </div>

            {/* User Selection Dropdown */}
            <div className="col-md-4 mb-3">
              <label htmlFor="user" className="form-label">Filter by User</label>
              <select
                id="user"
                className="form-select"
                value={selectedUser}
                onChange={handleUserChange}
              >
                <option value="">All Users</option>
                {userOptions.map((user) => (
                  <option key={user.username} value={user.username}>
                    {user.full_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Render MetricsTable Component */}
          <MetricsTable metrics={filteredMetrics} />
        </>
      )}
    </div>
  );
};

export default MetricsPage;
