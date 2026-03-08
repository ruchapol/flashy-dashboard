FROM lscr.io/linuxserver/openssh-server:latest

# Install Docker CLI + docker compose plugin inside the SSH host container.
# This container talks to the *host* Docker engine via /var/run/docker.sock (bind-mounted in compose).
RUN apk add --no-cache docker-cli docker-cli-compose

