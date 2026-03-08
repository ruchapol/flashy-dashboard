#!/bin/sh
set -e
# Substitute BACKEND_URL into nginx config (default: backend on host when using Docker Desktop)
BACKEND_URL="${BACKEND_URL:-http://host.docker.internal:8000}"
export BACKEND_URL
envsubst '${BACKEND_URL}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf
exec nginx -g 'daemon off;'
