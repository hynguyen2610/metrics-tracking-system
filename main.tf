provider "google" {
  project     = "tuto-requests"
  region      = "asia-southeast1"
  zone        = "asia-southeast1-a"
  credentials = file("gcloud-service-account.json")
}

# Fetch the current project ID (if you want to dynamically use the project)
data "google_project" "current" {}

# Create the Google Compute Engine instance for Docker (Next.js)
resource "google_compute_instance" "docker-instance" {
  name         = "nextjs-instance"
  machine_type = "e2-medium"
  tags         = ["http-server", "https-server"]

  allow_stopping_for_update = true

  service_account {
    email = "tuto-requests@appspot.gserviceaccount.com"
    scopes = ["https://www.googleapis.com/auth/cloud-platform"]
  }

  boot_disk {
    initialize_params {
      image = "projects/ubuntu-os-cloud/global/images/family/ubuntu-2004-lts"
    }
  }

  network_interface {
    network = "default"
    access_config {}
  }

  metadata = {
    project_id = data.google_project.current.project_id
  }

  metadata_startup_script = <<-EOF
    #!/bin/bash
    # Install Docker if it's not already installed
    sudo apt-get update
    sudo apt-get install -y docker.io

    # Authenticate with Artifact Registry using the Google Cloud SDK
    gcloud auth configure-docker asia-southeast1-docker.pkg.dev --quiet

    # Pull the Docker image from Artifact Registry
    sudo docker pull asia-southeast1-docker.pkg.dev/tuto-requests/metrics-tracking-repo/metrics-tracking:latest

    # Run the Docker container and pass DB_HOST dynamically as internal IP of the Postgres instance
    sudo docker run -d --name my-docker-app -p 3000:3000 \
      -e DB_HOST=${google_compute_instance.postgres-instance.network_interface[0].network_ip} \
      -e DB_USER=postgres -e DB_PASSWORD=postgres -e DB_PORT=5432 -e DB_NAME=metrics \
      asia-southeast1-docker.pkg.dev/tuto-requests/metrics-tracking-repo/metrics-tracking:latest

    # Write a log message to indicate the app is ready
    echo "app read" >> /var/log/app-logs/app-read.log
  EOF
}

# Create a firewall rule to allow HTTP traffic on port 3000
resource "google_compute_firewall" "allow_http" {
  name    = "allow-http"
  network = "default"

  allow {
    protocol = "tcp"
    ports    = ["3000"]
  }

  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["http-server"]
}

# Output the external IP of the Next.js instance
output "nextjs_ip" {
  value = google_compute_instance.docker-instance.network_interface[0].access_config[0].nat_ip
}

# Create the Google Compute Engine instance for PostgreSQL 12
resource "google_compute_instance" "postgres-instance" {
  name         = "postgres-instance"
  machine_type = "e2-medium"
  tags         = ["postgres", "db-server"]

  allow_stopping_for_update = true

  service_account {
    email = "tuto-requests@appspot.gserviceaccount.com"
    scopes = ["https://www.googleapis.com/auth/cloud-platform"]
  }

  boot_disk {
    initialize_params {
      image = "projects/ubuntu-os-cloud/global/images/family/ubuntu-2004-lts"
    }
  }

  network_interface {
    network = "default"
    access_config {}
  }

  metadata_startup_script = <<-EOF
    #!/bin/bash
    # Update and install PostgreSQL 12
    sudo apt-get update
    sudo apt-get install -y postgresql-12 postgresql-client-12

    # Enable PostgreSQL to start on boot
    sudo systemctl enable postgresql

    # Start PostgreSQL
    sudo systemctl start postgresql

    # Allow external access to PostgreSQL (optional, can be adjusted)
    sudo sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '*'/" /etc/postgresql/12/main/postgresql.conf
    echo "host    all             all             0.0.0.0/0            md5" | sudo tee -a /etc/postgresql/12/main/pg_hba.conf

    # Restart PostgreSQL to apply changes
    sudo systemctl restart postgresql

    # Set a password for the postgres user (for convenience in testing)
    sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'postgres';"
  EOF
}

# Create a firewall rule to allow PostgreSQL traffic on port 5432
resource "google_compute_firewall" "allow_postgres" {
  name    = "allow-postgres"
  network = "default"

  allow {
    protocol = "tcp"
    ports    = ["5432"]
  }

  source_ranges = ["0.0.0.0/0"]  # Adjust this as necessary for your security needs
  target_tags   = ["postgres", "db-server"]
}

# Output the external IP of the PostgreSQL instance
output "postgres_ip" {
  value = google_compute_instance.postgres-instance.network_interface[0].access_config[0].nat_ip
}

# Output the internal IP of the PostgreSQL instance (for reference)
output "postgres_internal_ip" {
  value = google_compute_instance.postgres-instance.network_interface[0].network_ip
}
