# Docker TUN Experimental Deployment

[中文版本](docker.md)

Docker deployment is still experimental and is not the recommended installation path yet. It is intended for users who understand Docker, TUN, static routes, and side-router integration. For production or long-term use, prefer [Linux tarball/systemd](install/linux.md), [fnOS FPK](install/fnos-fpk.md), or [Unraid PLG](install/unraid-plg.md).

Current release: `v0.4.1.0`

Current Docker experimental image:

```text
ghcr.io/leafss1022/msa:v0.4.1.0
```

This experimental image is not pushed as `latest`. To pull or deploy the Docker experimental version, explicitly use the `v0.4.1.0` tag.

## Current Status

- Docker defaults to Mihomo TUN and no longer asks MSA to write host nftables or policy routing rules.
- Two container network modes are supported: `host-tun` and `macvlan-tun`.
- `host-tun` shares the Docker host network namespace. It is suitable for testing, host-local proxying, or side-router deployments where you can configure router static routes and host forwarding.
- `macvlan-tun` gives the container its own LAN IPv4 address and is suitable for Unraid Dockerman, `br0`, and custom network scenarios. It is currently the preferred Docker gateway mode.
- Runtime data must be mapped to a host directory. The in-container data directory is fixed at `/opt/msa`; the default examples map host `./msa-data` to `/opt/msa`.
- `msa update` and WebUI self-update installation are disabled inside the container. Image upgrades must be handled through Docker, Compose, or your container manager.

If you need a stable deployment today, use Linux, fnOS, or Unraid PLG first.

## Runtime Requirements

Both network modes require the TUN device and network administration capabilities:

```yaml
cap_add:
  - NET_ADMIN
  - NET_RAW
devices:
  - /dev/net/tun:/dev/net/tun
```

Default Docker image environment:

```text
MSA_RUNTIME=docker
MSA_DOCKER_NETWORK_MODE=host-tun
MSA_DOCKER_CLEANUP_NETWORK_ON_EXIT=false
```

In Docker TUN mode, the generated Mihomo config enables `tun.auto-route`, `tun.auto-detect-interface`, and `tun.route-address`, explicitly keeps `tun.dns-hijack=[]` and `tun.auto-redirect=false`, and sets `dns.proxy-server-nameserver`. MosDNS remains responsible for DNS splitting, while Mihomo only takes over Fake-IP and required public targets. This means MSA does not write host `table inet msa`, `fwmark 1 table 100`, or `ip rule` entries. If you use `host-tun` as a side-router gateway, add the host FakeIP route described below.

The data directory must be persisted:

```text
Host path   ->  Container path
./msa-data  ->  /opt/msa
```

MosDNS, Mihomo, Zashboard downloads, the database, configs, logs, and user-uploaded Mihomo configs are written under `/opt/msa`. If this directory is not mapped to the host, data will be lost after container recreation, and WebUI component downloads and config management cannot work reliably.

## Quick Start: host TUN

host TUN exposes the WebUI, DNS, and proxy services through the Docker host's LAN IP.

### Docker Compose

The repository already provides `docker-compose.yml`. If you need to create the file manually, copy the following content and save it as `docker-compose.yml`:

```yaml
services:
  msa:
    image: ghcr.io/leafss1022/msa:v0.4.1.0
    container_name: msa
    network_mode: host
    cap_add:
      - NET_ADMIN
      - NET_RAW
    devices:
      - /dev/net/tun:/dev/net/tun
    environment:
      MSA_RUNTIME: docker
      MSA_DATA_DIR: /opt/msa
      MSA_DOCKER_NETWORK_MODE: host-tun
      MSA_DOCKER_CLEANUP_NETWORK_ON_EXIT: "false"
    volumes:
      - ./msa-data:/opt/msa
    restart: unless-stopped
    stop_grace_period: 30s
```

Start it:

```bash
mkdir -p msa-data
docker compose up -d
```

The default compose file uses:

- Image: `ghcr.io/leafss1022/msa:v0.4.1.0`
- Network: `host`
- Data directory: `./msa-data:/opt/msa`
- WebUI: `http://<host-ip>:7777`
- Runtime marker: `MSA_RUNTIME=docker`
- Docker network mode: `MSA_DOCKER_NETWORK_MODE=host-tun`

### Plain Docker Script

On machines where Docker Compose is not suitable, run the script directly:

```bash
mkdir -p msa-data
./docker-run.sh
```

The equivalent core `docker run` arguments are:

```bash
docker run -d \
  --name msa \
  --network host \
  --cap-add NET_ADMIN \
  --cap-add NET_RAW \
  --device /dev/net/tun:/dev/net/tun \
  --restart unless-stopped \
  --stop-timeout 30 \
  -e MSA_RUNTIME=docker \
  -e MSA_DOCKER_NETWORK_MODE=host-tun \
  -e MSA_DATA_DIR=/opt/msa \
  -v "$PWD/msa-data:/opt/msa" \
  ghcr.io/leafss1022/msa:v0.4.1.0
```

## Quick Start: macvlan TUN

macvlan TUN assigns a dedicated LAN IPv4 address to the container. Router-side DHCP DNS and FakeIP static routes should point to this container IPv4 address, not the host IP.

### Docker Compose

The repository already provides `docker-compose.macvlan.yml`. If you need to create the file manually, copy the following content and save it as `docker-compose.macvlan.yml`:

```yaml
services:
  msa:
    image: ${MSA_IMAGE:-ghcr.io/leafss1022/msa:v0.4.1.0}
    container_name: ${MSA_CONTAINER_NAME:-msa}
    cap_add:
      - NET_ADMIN
      - NET_RAW
    devices:
      - /dev/net/tun:/dev/net/tun
    environment:
      MSA_RUNTIME: docker
      MSA_DATA_DIR: /opt/msa
      MSA_DOCKER_NETWORK_MODE: macvlan-tun
      MSA_DOCKER_CLEANUP_NETWORK_ON_EXIT: "false"
    volumes:
      - ${MSA_DOCKER_DATA_DIR:-./msa-data}:/opt/msa
    networks:
      msa_macvlan:
        ipv4_address: ${MSA_DOCKER_IPV4_ADDRESS:?set MSA_DOCKER_IPV4_ADDRESS}
    restart: unless-stopped
    stop_grace_period: 30s

networks:
  msa_macvlan:
    name: ${MSA_DOCKER_NETWORK_NAME:-msa-macvlan}
    driver: macvlan
    driver_opts:
      parent: ${MSA_DOCKER_PARENT_IFACE:?set MSA_DOCKER_PARENT_IFACE}
    ipam:
      config:
        - subnet: ${MSA_DOCKER_SUBNET:?set MSA_DOCKER_SUBNET}
          gateway: ${MSA_DOCKER_GATEWAY:?set MSA_DOCKER_GATEWAY}
```

Copy the example environment file and adjust it for your LAN:

```bash
cp docker.env.example .env
```

You can also copy this minimal macvlan compose `.env` example and save it as `.env`:

```text
MSA_IMAGE=ghcr.io/leafss1022/msa:v0.4.1.0
MSA_CONTAINER_NAME=msa
MSA_DOCKER_DATA_DIR=./msa-data
MSA_DOCKER_NETWORK_NAME=msa-macvlan
MSA_DOCKER_PARENT_IFACE=eth0
MSA_DOCKER_SUBNET=192.168.1.0/24
MSA_DOCKER_GATEWAY=192.168.1.1
MSA_DOCKER_IPV4_ADDRESS=192.168.1.10
```

For macvlan mode, at minimum you must change `MSA_DOCKER_PARENT_IFACE`, `MSA_DOCKER_SUBNET`, `MSA_DOCKER_GATEWAY`, and `MSA_DOCKER_IPV4_ADDRESS` to match your LAN.

Start it:

```bash
mkdir -p msa-data
docker compose -f docker-compose.macvlan.yml up -d
```

### Plain Docker Script

```bash
MSA_DOCKER_NETWORK_MODE=macvlan-tun \
MSA_DOCKER_PARENT_IFACE=eth0 \
MSA_DOCKER_SUBNET=192.168.1.0/24 \
MSA_DOCKER_GATEWAY=192.168.1.1 \
MSA_DOCKER_IPV4_ADDRESS=192.168.1.10 \
./docker-run.sh
```

The script creates the `msa-macvlan` Docker network if it does not already exist. Override the network name with `MSA_DOCKER_NETWORK_NAME` if needed.

## Unraid Dockerman IPv4 macvlan

The first Docker version supports manual Unraid Dockerman setup only. It does not provide a Community Applications container template.

1. Enable custom networks in Unraid Docker settings, and choose `macvlan` or the custom network implementation recommended for your current system.
2. Create a new container and set the image to `ghcr.io/leafss1022/msa:v0.4.1.0`.
3. Set Network Type to a custom LAN network such as `br0`.
4. Set Fixed IP address to a static IPv4 address outside your DHCP pool, for example `192.168.1.10`.
5. Add this to Extra Parameters or advanced parameters:

```text
--cap-add NET_ADMIN --cap-add NET_RAW --device /dev/net/tun:/dev/net/tun
```

6. Add environment variables:

| Variable | Value |
|---|---|
| `MSA_RUNTIME` | `docker` |
| `MSA_DOCKER_NETWORK_MODE` | `macvlan-tun` |
| `MSA_DATA_DIR` | `/opt/msa` |

7. Add a path mapping:

| Host path | Container path |
|---|---|
| `/mnt/user/appdata/msa-docker` | `/opt/msa` |

The WebUI URL is `http://<container-ipv4>:7777`.

## Router Integration

Open the WebUI for the first time and complete the setup wizard. Under Docker runtime, the setup page selects TUN mode by default.

Router-side configuration needs:

1. DHCP DNS pointing to the MSA address.
2. FakeIP static route pointing to the same MSA address.

Choose the MSA address by Docker mode:

| Docker mode | Router should point to |
|---|---|
| `host-tun` | Docker host LAN IP |
| `macvlan-tun` | Container dedicated LAN IPv4; a routable container IPv6 is also required when IPv6 is enabled |

Default FakeIP ranges:

| Type | Range |
|---|---|
| IPv4 | `28.0.0.0/8` |
| IPv6 | `f2b0::/18` |

The default macvlan acceptance path is still IPv4-first. If IPv6 is enabled, the container must have a router-reachable IPv6 address and the main router must point `f2b0::/18` to that container IPv6. See [Router integration overview](guide/en/router-integration.md) for the full router-side guide.

### Persistent host-tun FakeIP Route

`host-tun` shares the Docker host network namespace. After the router points `28.0.0.0/8` to the Docker host, the host must also send the full IPv4 FakeIP range to the Mihomo TUN interface; when IPv6 is enabled, `f2b0::/18` must also point to the Mihomo TUN interface. In some environments, Mihomo only creates `28.0.0.0/30` on the `mihomo` interface, which only covers `28.0.0.0` through `28.0.0.3`; client FakeIP targets such as `28.0.0.13` will not enter the TUN interface.

Newer builds automatically restore the FakeIP IPv4 route after Mihomo starts when Docker `host-tun` and Mihomo TUN mode are active; when IPv6 is enabled in the setup config, they also restore the FakeIP IPv6 route. They also try to disable `rp_filter` on the default egress interface. If `/proc/sys` is read-only, your firewall service replays routing rules, or you are troubleshooting an older build, keep the manual commands below as a fallback. MSA does not automatically restart `firewalld`, `nftables`, or `ufw`.

First verify the workaround on the Docker host:

```bash
sudo ip route replace 28.0.0.0/8 dev mihomo src 28.0.0.1
# If IPv6 is enabled:
sudo ip -6 route replace f2b0::/18 dev mihomo src f2b0::1

IFACE="$(ip -4 route show default | awk '/default/ {print $5; exit}')"
echo 0 | sudo tee "/proc/sys/net/ipv4/conf/$IFACE/rp_filter" >/dev/null

sudo sh -c '
if systemctl is-active --quiet firewalld 2>/dev/null; then
  systemctl restart firewalld
elif systemctl is-active --quiet nftables 2>/dev/null; then
  systemctl restart nftables
elif command -v ufw >/dev/null 2>&1; then
  ufw reload
else
  echo "no firewalld/nftables/ufw service detected, skipped"
fi
'
```

Confirm that FakeIP traffic uses `mihomo`:

```bash
ip route get 28.0.0.13
# If IPv6 is enabled:
ip -6 route get f2b0::13
cat "/proc/sys/net/ipv4/conf/$IFACE/rp_filter"
```

Expected output:

```text
28.0.0.13 dev mihomo src 28.0.0.1
f2b0::13 dev mihomo src f2b0::1
0
```

The temporary route can disappear after the container, Mihomo, or host restarts. To keep it persistent, create a systemd timer on the Docker host. It periodically checks whether the `mihomo` interface exists, then restores the FakeIP route and disables `rp_filter` on the default egress interface. If IPv6 is enabled, change `ENABLE_IPV6=0` in the script to `ENABLE_IPV6=1`:

```bash
sudo tee /usr/local/sbin/msa-host-tun-route >/dev/null <<'EOF'
#!/bin/sh
set -eu

ENABLE_IPV6=0

ip link show mihomo >/dev/null 2>&1 || exit 0

IFACE="$(ip -4 route show default | awk '/default/ {print $5; exit}')"
ip route replace 28.0.0.0/8 dev mihomo src 28.0.0.1
if [ "$ENABLE_IPV6" = "1" ]; then
  ip -6 route replace f2b0::/18 dev mihomo src f2b0::1
fi

if [ -n "$IFACE" ] && [ -w "/proc/sys/net/ipv4/conf/$IFACE/rp_filter" ]; then
  echo 0 > "/proc/sys/net/ipv4/conf/$IFACE/rp_filter"
fi
EOF

sudo chmod +x /usr/local/sbin/msa-host-tun-route

sudo tee /etc/systemd/system/msa-host-tun-route.service >/dev/null <<'EOF'
[Unit]
Description=Apply MSA Docker host-tun FakeIP route

[Service]
Type=oneshot
ExecStart=/usr/local/sbin/msa-host-tun-route
EOF

sudo tee /etc/systemd/system/msa-host-tun-route.timer >/dev/null <<'EOF'
[Unit]
Description=Refresh MSA Docker host-tun FakeIP route

[Timer]
OnBootSec=30s
OnUnitActiveSec=30s
AccuracySec=5s
Unit=msa-host-tun-route.service

[Install]
WantedBy=timers.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable --now msa-host-tun-route.timer
sudo systemctl start msa-host-tun-route.service
```

Guardrail: if your firewall service caches or replays forwarding rules, restart the active firewall service after installing the persistent workaround:

```bash
sudo sh -c '
if systemctl is-active --quiet firewalld 2>/dev/null; then
  systemctl restart firewalld
elif systemctl is-active --quiet nftables 2>/dev/null; then
  systemctl restart nftables
elif command -v ufw >/dev/null 2>&1; then
  ufw reload
else
  echo "no firewalld/nftables/ufw service detected, skipped"
fi
'
```

## Script Variables

`docker-run.sh` supports:

| Variable | Default | Purpose |
|---|---|---|
| `MSA_IMAGE` | `ghcr.io/leafss1022/msa:v0.4.1.0` | Container image |
| `MSA_CONTAINER_NAME` | `msa` | Container name |
| `MSA_DOCKER_DATA_DIR` | `$PWD/msa-data` | Host data directory |
| `MSA_DOCKER_NETWORK_MODE` | `host-tun` | `host-tun` or `macvlan-tun` |
| `MSA_DOCKER_NETWORK_NAME` | `msa-macvlan` | Docker macvlan network name |
| `MSA_DOCKER_PARENT_IFACE` | unset | macvlan parent interface |
| `MSA_DOCKER_SUBNET` | unset | macvlan IPv4 subnet |
| `MSA_DOCKER_GATEWAY` | unset | macvlan IPv4 gateway |
| `MSA_DOCKER_IPV4_ADDRESS` | unset | Container static IPv4 address |

If a container with the same name already exists, stop and remove it first:

```bash
docker stop msa
docker rm msa
```

## Troubleshooting

### LXC / Proxmox reports missing `/dev/net/tun`

If deployment fails with:

```text
error gathering device information while adding custom device "/dev/net/tun": no such file or directory
```

the runtime that hosts the Docker daemon does not expose `/dev/net/tun`. If Docker runs inside an LXC container, check inside that LXC container:

```bash
ls -l /dev/net/tun
cat /dev/net/tun
```

Normally, `cat /dev/net/tun` should return something like `File descriptor in bad state`. If the file does not exist, load and pass through TUN from the outer host. For Proxmox LXC, a typical configuration is:

```bash
modprobe tun
```

```text
features: nesting=1
lxc.cgroup2.devices.allow: c 10:200 rwm
lxc.mount.entry: /dev/net/tun dev/net/tun none bind,create=file
```

Restart the LXC container after changing its config. LXC permission models differ by platform, so use a privileged LXC or a VM if the platform cannot expose TUN reliably.

### v0.3.7 Docker TUN DNS / Fake-IP connection failures

`v0.3.7` has a defect in the default Docker TUN config: Mihomo may resolve proxy server domains to Fake-IP addresses such as `28.0.0.x`, then fail to dial them. Logs may also show repeated `127.0.0.1:8888 connection refused` messages or proxy server domain connection timeouts.

The fixed version unifies Linux TUN generation:

- `tun.stack` is `system`.
- `tun.dns-hijack` stays as an empty array so MosDNS continues DNS splitting.
- `tun.route-address` includes the Fake-IP ranges and required public targets.
- `tun.route-exclude-address` excludes LAN, loopback, link-local, and common China DNS addresses.
- `dns.proxy-server-nameserver` uses `223.5.5.5` and `119.29.29.29` so proxy server domains are not polluted by Fake-IP.

After upgrading to the fixed version, MSA automatically repairs the old TUN / DNS blocks at startup when you are still using generated config mode. If you switched Mihomo to custom config mode, MSA will not overwrite your file; adjust the fields above manually, or restore generated config from the WebUI and regenerate it.

### macvlan reports `invalid subinterface vlan name`

If deployment fails with a message like:

```text
invalid subinterface vlan name MSA_DOCKER_PARENT_IFACE:eth0, example formatting is eth0.10
```

Docker received an invalid macvlan `parent`. The `parent` must be a real interface in the Docker host environment, such as `eth0`, `ens18`, `br0`, or a VLAN subinterface like `eth0.10`.

The `.env` file must use equals-sign syntax:

```text
MSA_DOCKER_PARENT_IFACE=eth0
```

Do not write:

```text
MSA_DOCKER_PARENT_IFACE:eth0
```

In a Portainer Stack, set `MSA_DOCKER_PARENT_IFACE` as the environment variable name and `eth0` as its value. Do not enter `MSA_DOCKER_PARENT_IFACE:eth0` as one complete value. Verify the rendered compose config before deploying:

```bash
MSA_DOCKER_PARENT_IFACE=eth0 \
MSA_DOCKER_SUBNET=192.168.1.0/24 \
MSA_DOCKER_GATEWAY=192.168.1.1 \
MSA_DOCKER_IPV4_ADDRESS=192.168.1.10 \
docker compose -f docker-compose.macvlan.yml config
```

The output should contain:

```yaml
driver_opts:
  parent: eth0
```

## Update and Removal

`msa update` and WebUI self-update installation are disabled inside Docker containers. Upgrade the image by pulling the new image and recreating the container.

Docker Compose:

```bash
docker compose pull
docker compose up -d
```

Plain Docker:

```bash
docker pull ghcr.io/leafss1022/msa:v0.4.1.0
docker stop msa
docker rm msa
./docker-run.sh
```

Remove the container through Docker, Compose, or your container manager. The default host data directory is `./msa-data` in the current directory. Delete that directory manually only when you want to completely remove all persisted data.

MosDNS, Mihomo, and Zashboard component updates are still available from the WebUI.

## Common Ports

Docker TUN does not use TProxy or Redirect ports by default.

| Port | Purpose |
|---|---|
| `7777` | MSA WebUI |
| `53/tcp,udp` | MosDNS |
| `7890` | Mihomo HTTP proxy |
| `7891` | Mihomo SOCKS proxy |
| `7892` | Mihomo mixed proxy |
| `9090` | Mihomo controller / Zashboard |
| `9099` | MosDNS observability |
