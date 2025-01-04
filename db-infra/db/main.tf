provider "google" {
  project     = "tuto-requests"
  region      = "asia-southeast1"
  zone        = "asia-southeast1-a"
  credentials = file("gcloud-service-account.json")
}

# Fetch the current project ID (if you want to dynamically use the project)
data "google_project" "current" {}
# Create the Google Compute Engine instance for PostgreSQL 17
resource "google_compute_instance" "postgres-instance" {
  name         = "postgres-17"
  machixne_type = "e2-medium"
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

    # Update the package list
    echo "Updating package list..."
    sudo apt update

    # Install required prerequisites (for managing repositories over HTTPS)
    echo "Installing prerequisites..."
    sudo apt install -y wget ca-certificates

    # Add PostgreSQL repository key
    echo "Adding PostgreSQL repository key..."
    wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -

    # Add the PostgreSQL PGDG repository to your system
    echo "Adding PostgreSQL repository..."
    sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt/ $(lsb_release -c | awk "{print \$2}")-pgdg main" > /etc/apt/sources.list.d/pgdg.list'

    # Update the package list again after adding the repository
    echo "Updating package list after adding PostgreSQL repository..."
    sudo apt update

    # Install PostgreSQL 17
    echo "Installing PostgreSQL 17..."
    sudo apt install -y postgresql-17 postgresql-client-17

    # Verify the installation
    echo "Verifying the installation..."
    psql --version

    # Finished
    echo "PostgreSQL 17 installation completed!"


  # Enable PostgreSQL to start on boot
  sudo systemctl enable postgresql

  # Start PostgreSQL
  sudo systemctl start postgresql

  # Allow external access to PostgreSQL (optional, can be adjusted)
  sudo sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '*'/" /etc/postgresql/17/main/postgresql.conf
  echo "host    all             all             0.0.0.0/0            md5" | sudo tee -a /etc/postgresql/17/main/pg_hba.conf

  # Restart PostgreSQL to apply changes
  sudo systemctl restart postgresql

  # Set a password for the postgres user (for convenience in testing)
  sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'postgres';"

  # Create the metrics database
  sudo -u postgres psql -c "CREATE DATABASE metrics;"

  # Restore the metrics database from the backup file (optional)
  gsutil cp gs://hdn-metrics-bucket/metrics.backup /tmp/metrics.backup

  gsutil cp gs://hdn-metrics-bucket/metrics-script.sql /tmp/

  # Restore the metrics database from the backup file
  sudo -u postgres pg_restore -d metrics /tmp/metrics.backup

  EOF
}

# Create a firewall rule to allow PostgreSQL traffic on port 5432
resource "google_compute_firewall" "allow_postgres_17" {
  name    = "allow-postgres-17"
  network = "default"

  allow {
    protocol = "tcp"
    ports    = ["5432"]
  }

  source_ranges = ["0.0.0.0/0"] # Adjust this as necessary for your security needs
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
