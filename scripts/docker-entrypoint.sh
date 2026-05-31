#!/bin/sh
set -e

if [ "${IS_IN_DOCKER_COMPOSE}" = "true" ] && [ -n "${DOCKER_COMPOSE_DATABASE_URL}" ]; then
  export DATABASE_URL="${DOCKER_COMPOSE_DATABASE_URL}"
fi

exec "$@"
