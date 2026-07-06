#!/usr/bin/env sh
set -eu

IMAGE="${MSA_IMAGE:-ghcr.io/leafss1022/msa:v0.3.9.2}"
NAME="${MSA_CONTAINER_NAME:-msa}"
DATA_DIR="${MSA_DOCKER_DATA_DIR:-$(pwd)/msa-data}"
NETWORK_MODE="${MSA_DOCKER_NETWORK_MODE:-host-tun}"
NETWORK_NAME="${MSA_DOCKER_NETWORK_NAME:-msa-macvlan}"
TUN_DEVICE="${MSA_DOCKER_TUN_DEVICE:-/dev/net/tun}"
CLEANUP_ON_EXIT="${MSA_DOCKER_CLEANUP_NETWORK_ON_EXIT:-false}"
DRY_RUN="${MSA_DOCKER_DRY_RUN:-false}"

normalize_network_mode() {
  case "$(printf '%s' "$1" | tr '[:upper:]' '[:lower:]')" in
    host|host-tun)
      printf '%s\n' "host-tun"
      ;;
    macvlan|macvlan-tun)
      printf '%s\n' "macvlan-tun"
      ;;
    *)
      echo "unsupported MSA_DOCKER_NETWORK_MODE: $1" >&2
      echo "expected host-tun or macvlan-tun" >&2
      exit 2
      ;;
  esac
}

is_dry_run() {
  case "$(printf '%s' "$DRY_RUN" | tr '[:upper:]' '[:lower:]')" in
    1|true|yes|on) return 0 ;;
    *) return 1 ;;
  esac
}

run() {
  if is_dry_run; then
    printf '+'
    for arg in "$@"; do
      printf ' %s' "$arg"
    done
    printf '\n'
    return 0
  fi
  "$@"
}

require_var() {
  name="$1"
  eval "value=\${$name:-}"
  if [ -z "$value" ]; then
    echo "$name is required when MSA_DOCKER_NETWORK_MODE=macvlan-tun" >&2
    exit 2
  fi
}

ensure_macvlan_network() {
  require_var MSA_DOCKER_PARENT_IFACE
  require_var MSA_DOCKER_SUBNET
  require_var MSA_DOCKER_GATEWAY
  require_var MSA_DOCKER_IPV4_ADDRESS

  if is_dry_run; then
    run docker network create \
      -d macvlan \
      --subnet "$MSA_DOCKER_SUBNET" \
      --gateway "$MSA_DOCKER_GATEWAY" \
      -o parent="$MSA_DOCKER_PARENT_IFACE" \
      "$NETWORK_NAME"
    return 0
  fi

  if ! docker network inspect "$NETWORK_NAME" >/dev/null 2>&1; then
    docker network create \
      -d macvlan \
      --subnet "$MSA_DOCKER_SUBNET" \
      --gateway "$MSA_DOCKER_GATEWAY" \
      -o parent="$MSA_DOCKER_PARENT_IFACE" \
      "$NETWORK_NAME" >/dev/null
  fi
}

NETWORK_MODE="$(normalize_network_mode "$NETWORK_MODE")"
run mkdir -p "$DATA_DIR"

case "$NETWORK_MODE" in
  host-tun)
    if is_dry_run; then
      run docker run -d \
        --name "$NAME" \
        --network host \
        --cap-add NET_ADMIN \
        --cap-add NET_RAW \
        --device "$TUN_DEVICE:/dev/net/tun" \
        --restart unless-stopped \
        --stop-timeout 30 \
        -e MSA_RUNTIME=docker \
        -e MSA_DOCKER_NETWORK_MODE=host-tun \
        -e MSA_DATA_DIR=/opt/msa \
        -e MSA_DOCKER_CLEANUP_NETWORK_ON_EXIT="$CLEANUP_ON_EXIT" \
        -v "$DATA_DIR:/opt/msa" \
        "$IMAGE"
      exit 0
    fi
    exec docker run -d \
      --name "$NAME" \
      --network host \
      --cap-add NET_ADMIN \
      --cap-add NET_RAW \
      --device "$TUN_DEVICE:/dev/net/tun" \
      --restart unless-stopped \
      --stop-timeout 30 \
      -e MSA_RUNTIME=docker \
      -e MSA_DOCKER_NETWORK_MODE=host-tun \
      -e MSA_DATA_DIR=/opt/msa \
      -e MSA_DOCKER_CLEANUP_NETWORK_ON_EXIT="$CLEANUP_ON_EXIT" \
      -v "$DATA_DIR:/opt/msa" \
      "$IMAGE"
    ;;
  macvlan-tun)
    ensure_macvlan_network
    if is_dry_run; then
      run docker run -d \
        --name "$NAME" \
        --network "$NETWORK_NAME" \
        --ip "$MSA_DOCKER_IPV4_ADDRESS" \
        --cap-add NET_ADMIN \
        --cap-add NET_RAW \
        --device "$TUN_DEVICE:/dev/net/tun" \
        --restart unless-stopped \
        --stop-timeout 30 \
        -e MSA_RUNTIME=docker \
        -e MSA_DOCKER_NETWORK_MODE=macvlan-tun \
        -e MSA_DATA_DIR=/opt/msa \
        -e MSA_DOCKER_CLEANUP_NETWORK_ON_EXIT="$CLEANUP_ON_EXIT" \
        -v "$DATA_DIR:/opt/msa" \
        "$IMAGE"
      exit 0
    fi
    exec docker run -d \
      --name "$NAME" \
      --network "$NETWORK_NAME" \
      --ip "$MSA_DOCKER_IPV4_ADDRESS" \
      --cap-add NET_ADMIN \
      --cap-add NET_RAW \
      --device "$TUN_DEVICE:/dev/net/tun" \
      --restart unless-stopped \
      --stop-timeout 30 \
      -e MSA_RUNTIME=docker \
      -e MSA_DOCKER_NETWORK_MODE=macvlan-tun \
      -e MSA_DATA_DIR=/opt/msa \
      -e MSA_DOCKER_CLEANUP_NETWORK_ON_EXIT="$CLEANUP_ON_EXIT" \
      -v "$DATA_DIR:/opt/msa" \
      "$IMAGE"
    ;;
esac
