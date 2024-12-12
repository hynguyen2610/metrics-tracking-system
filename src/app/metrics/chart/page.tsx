"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Unit } from "../../models/interfaces";
import Chart from "./chart";
import ReactFlatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_green.css";
import ChartTable from './chart-table';

const ChartPage: React.FC = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [metricsChartData, setMetricsChartData] = useState<any[]>([]);
    const [unitOptions, setUnitOptions] = useState<Unit[]>([]);
    const [selectedUnitType, setSelectedUnitType] = useState<string>("Distance");
    const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
    const [fromDate, setFromDate] = useState<string>("");
    const [toDate, setToDate] = useState<string>("");
    const [dateRangeOption, setDateRangeOption] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [toDateError, setToDateError] = useState<string>("");

    useEffect(() => {
        const fetchUnitOptions = async () => {
            try {
                const unitsResponse = await axios.get("/api/units");
                setUnitOptions(unitsResponse.data);
            } catch (error) {
                console.error("Error fetching units:", error);
            }
        };

        fetchUnitOptions();
    }, []);

    useEffect(() => {
        const fetchChartData = async () => {
            if (errorMessage || toDateError) {
                return;
            }

            try {
                const response = await axios.get("/api/chart", {
                    params: {
                        unitType: selectedUnitType,
                        fromDate: fromDate,
                        toDate: toDate,
                        convertToUnit: selectedUnit?.unit || "",
                    },
                });
                setMetricsChartData(response.data);
            } catch (error) {
                console.error("Error fetching chart data:", error);
            }
        };

        if (fromDate && toDate && !errorMessage && !toDateError) {
            fetchChartData();
        }
    }, [selectedUnitType, fromDate, toDate, selectedUnit, errorMessage, toDateError]);

    const handleUnitTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedUnitType(e.target.value);
        setSelectedUnit(null);
    };

    const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedUnitName = e.target.value;
        const unit = unitOptions.find((unit) => unit.unit === selectedUnitName) || null;
        setSelectedUnit(unit);
    };

    const handleDateRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedRange = e.target.value;
        setDateRangeOption(selectedRange);

        const currentDate = new Date();
        let newFromDate: Date;
        const newToDate = currentDate;

        switch (selectedRange) {
            case "Last7Days":
                newFromDate = new Date(currentDate);
                newFromDate.setDate(currentDate.getDate() - 7);
                setFromDate(newFromDate.toISOString().split("T")[0]);
                setToDate(newToDate.toISOString().split("T")[0]);
                setErrorMessage("");
                break;
            case "Last1Month":
                newFromDate = new Date(currentDate);
                newFromDate.setMonth(currentDate.getMonth() - 1);
                setFromDate(newFromDate.toISOString().split("T")[0]);
                setToDate(newToDate.toISOString().split("T")[0]);
                setErrorMessage("");
                break;
            case "Last2Months":
                newFromDate = new Date(currentDate);
                newFromDate.setMonth(currentDate.getMonth() - 2);
                setFromDate(newFromDate.toISOString().split("T")[0]);
                setToDate(newToDate.toISOString().split("T")[0]);
                setErrorMessage("");
                break;
            case "Custom":
                break;
            default:
                break;
        }
    };

    const handleToDateChange = (date: Date[]) => {
        const selectedToDate = date[0];
        const currentFromDate = new Date(fromDate);

        if (selectedToDate < currentFromDate) {
            setToDateError("The 'To Date' cannot be before the 'From Date'.");
        } else {
            setToDateError("");
        }

        setToDate(selectedToDate.toISOString());
    };

    const handleFromDateChange = (date: Date[]) => {
        const selectedFromDate = date[0];
        const currentDate = new Date();

        if (selectedFromDate > currentDate) {
            setErrorMessage("The 'From Date' cannot be in the future.");
        } else {
            setErrorMessage("");
        }

        setFromDate(selectedFromDate.toISOString());
    };

    return (
        <div className="container mt-5">
            <h2>Metrics Charts</h2>

            <div className="section-container">
                {/* Date Range Filters (From Date, To Date) */}
                <div className="section-group">
                    <label htmlFor="dateRangeOption" className="form-label">
                        Select Date Range
                    </label>
                    <select
                        id="dateRangeOption"
                        className="form-select"
                        value={dateRangeOption}
                        onChange={handleDateRangeChange}
                    >
                        <option value="">Select a Range</option>
                        <option value="Last7Days">Last 7 Days</option>
                        <option value="Last1Month">Last 1 Month</option>
                        <option value="Last2Months">Last 2 Months</option>
                        <option value="Custom">Custom Range</option>
                    </select>
                </div>

                {/* Error Messages */}
                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                {toDateError && <div className="alert alert-danger">{toDateError}</div>}

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="fromDate" className="form-label">
                            From Date
                        </label>
                        <ReactFlatpickr
                            id="fromDate"
                            className={`form-control ${errorMessage ? "is-invalid" : ""}`}
                            value={fromDate}
                            onChange={handleFromDateChange}
                            options={{
                                dateFormat: "Y-m-d",
                            }}
                        />
                    </div>

                    <div className="col-md-6 mb-3">
                        <label htmlFor="toDate" className="form-label">
                            To Date
                        </label>
                        <ReactFlatpickr
                            id="toDate"
                            className={`form-control ${toDateError ? "is-invalid" : ""}`}
                            value={toDate}
                            onChange={handleToDateChange}
                            options={{
                                dateFormat: "Y-m-d",
                            }}
                        />
                        {toDateError && <div className="text-danger mt-1">{toDateError}</div>}
                    </div>
                </div>
            </div>

            <div className="section-container">
                {/* Unit Type Filter (Distance / Temperature) */}
                <div className="section-group">
                    <label htmlFor="unitType" className="form-label">
                        Select Unit Type
                    </label>
                    <select
                        id="unitType"
                        className="form-select"
                        value={selectedUnitType}
                        onChange={handleUnitTypeChange}
                    >
                        <option value="Distance">Distance</option>
                        <option value="Temperature">Temperature</option>
                    </select>
                </div>

                {/* Unit Conversion Dropdown */}
                <div className="section-group">
                    <label htmlFor="unit" className="form-label">
                        Select Unit for Conversion
                    </label>
                    <select
                        id="unit"
                        className="form-select"
                        value={selectedUnit?.unit || ""}
                        onChange={handleUnitChange}
                    >
                        <option value="">None</option>
                        {unitOptions
                            .filter((unit) => unit.unit_type === selectedUnitType)
                            .map((unit) => (
                                <option key={unit.name} value={unit.unit}>
                                    {unit.name}
                                </option>
                            ))}
                    </select>
                </div>
            </div>

            {/* Render Metrics Table and Chart */}
            {selectedUnit && selectedUnit.unit && (
                <>
                    <ChartTable metrics={metricsChartData} />
                    <Chart metrics={metricsChartData} selectedUnit={selectedUnit} />
                </>
            )}
        </div>
    );
};

export default ChartPage;
