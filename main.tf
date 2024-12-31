provider "google" {
  project     = "tuto-requests"
  region      = "asia-southeast1"
  zone        = "asia-southeast1-a"
  credentials = file("gcloud-service-account.json")
}

# Fetch the current project ID (if you want to dynamically use the project)
data "google_project" "current" {}

# Create the Google Compute Engine instance for Docker
resource "google_compute_instance" "docker-instance" {
  name         = "nextjs-instance"
  machine_type = "e2-medium"
  tags         = ["http-server", "https-server"]

  allow_stopping_for_update = true

  service_account {
    email = "tuto-requests@appspot.gserviceaccount.com"
    scopes = ["https://www.googleapis.com/auth/cloud-platform"] # Or use specific scopes as needed
  }

  boot_disk {
    initialize_params {
      image = "projects/ubuntu-os-cloud/global/images/family/ubuntu-2004-lts"
    }
  }

  network_interface {
    network = "default"
    access_config {
      // Assign an external IP
    }
  }

  metadata = {
    # Pass the project ID into the startup script
    project_id = data.google_project.current.project_id
  }

  metadata_startup_script = <<-EOF
    #!/bin/bash
    # Update the VM and install Docker
    sudo apt-get update
    sudo apt-get install -y docker.io

    # Authenticate Docker with Google Cloud to pull from GCR
    gcloud auth configure-docker --quiet

    # Pull and run the Docker container from GCR
    sudo docker run -d --name my-docker-app -p 3000:3000 bluestorm1288/metrics-tracking:latest
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

  source_ranges = ["0.0.0.0/0"]  # Allows access from anywhere (you can restrict it if needed)
  target_tags   = ["http-server"]
}

# Output the external IP of the instance
output "nextjs_ip" {
  value = google_compute_instance.docker-instance.network_interface[0].access_config[0].nat_ip
}

