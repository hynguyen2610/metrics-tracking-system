// src/app/page.tsx
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="row justify-content-center">
      <div className="col-md-8 text-center">
        <h1 className="display-4">Metrics Tracking</h1>
        <p className="lead">Welcome to the Metrics Tracking App!</p>
        <p className="lead">
          <Link legacyBehavior href="/metrics/list">
            <a className="btn btn-primary btn-lg">See Metrics</a>
          </Link>
          <Link legacyBehavior href="/metrics/add">
            <a className="btn btn-primary btn-lg">Add new metric</a>
          </Link>
        </p>
      </div>
    </div>
  );
}
