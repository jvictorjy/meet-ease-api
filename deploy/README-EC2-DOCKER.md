Deployment via GitHub Actions to EC2 using Docker

Prerequisites on EC2:
- Docker installed and user has permission to run docker (or prefix with sudo).
- Create directory /opt/meet-ease-api and put a .env file with required variables, e.g.:
  DATABASE_URL=postgresql://user:pass@host:5432/db
  JWT_PUBLIC_KEY=...
  JWT_PRIVATE_KEY=...

GitHub Secrets required:
- DOCKERHUB_USERNAME: Docker Hub username
- DOCKERHUB_TOKEN: Docker Hub access token
- EC2_HOST: EC2 public IP or DNS
- EC2_USER: e.g., ubuntu
- EC2_SSH_KEY: Private key content (PEM) for SSH
- EC2_PORT: Optional. Default 22

Workflow:
- On push to main, builds Docker image (Node 22), pushes :latest to Docker Hub, SSH into EC2, pulls image, restarts container on port 3000.

Local build:
- docker build -t meet-ease-api:dev .
- docker run --env-file .env -p 3000:3000 meet-ease-api:dev
