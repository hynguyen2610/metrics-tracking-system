'use client';  // This directive ensures that the component is treated as a client-side component

import Link from 'next/link';
import { ReactNode } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import '../../styles/style.css';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Metrics Tracking</title>
      </head>
      <body>
        {/* Navigation Bar */}
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid">
            <Link href="/" className="navbar-brand">Metrics Tracking</Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link href="/metrics/add" className="nav-link">Add new metric</Link> {/* Updated to Metrics */}
                </li>
                <li className="nav-item">
                  <Link href="/metrics/list" className="nav-link">View metrics</Link> {/* Updated to Metrics */}
                </li>
                <li className="nav-item">
                  <Link href="/metrics/chart" className="nav-link">Draw chart</Link> {/* Updated to Metrics */}
                </li>
              </ul>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="container mt-4">
          {children}
        </div>

        {/* Bootstrap JS (Optional for functionality like dropdowns) */}
        <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js" async></script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.min.js" async></script>
      </body>
    </html>
  );
}
