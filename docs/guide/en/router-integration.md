# Router Integration Guide (DHCP / Static Routes)

msa runs as a **bypass router** by default: it is not the main gateway. Instead, the main router steers **DNS queries** and **traffic that should be proxied** to the msa host. To make LAN devices go through msa, the main router must do two things:

1. **Redirect DHCP DNS** — hand clients the msa host as their DNS server so MosDNS on msa (`:53`) handles name resolution.
2. **Add FakeIP static routes** — set the next hop for the FakeIP ranges (and any target ranges you want proxied) to the msa host so that traffic returns to msa for transparent proxying.

## Variables

Placeholders below stand for the real addresses in your network — substitute your own:

| Variable | Meaning | Example |
|---|---|---|
| `{msa host IPv4}` | msa bypass host LAN IPv4 | `192.168.1.2` |
| `{msa host IPv6}` | msa host IPv6 (ULA/GUA preferred) | `fd00::2` |
| Main gateway | Your main router LAN address | `192.168.1.1` |
| FakeIP v4 | msa default FakeIP IPv4 range | `28.0.0.0/8` |
| FakeIP v6 | msa default FakeIP IPv6 range | `f2b0::/18` |

> The FakeIP ranges must match what msa actually uses. If you changed the Fake-IP range in the msa setup wizard, replace `28.0.0.0/8` / `f2b0::/18` below with your values. The main router only steers these ranges; the real domain is restored on msa.

## What the main router must configure

### 1. DHCP DNS

Set the DHCP-advertised DNS server to `{msa host IPv4}` (only this one — do not add an ISP/public DNS as a secondary, or some clients will bypass msa).

### 2. FakeIP static routes (core)

| Type | Destination | Next hop |
|---|---|---|
| IPv4 | `28.0.0.0/8` | `{msa host IPv4}` |
| IPv6 | `f2b0::/18` | `{msa host IPv6}` |

### 3. Extra static routes (public DNS / service IPs)

These routes do not replace FakeIP. They capture hardcoded public DNS and keep services that connect by public IP range flowing back to msa. To reduce Telegram / Netflix failures caused by direct fixed-IP access, point the following IPv4 routes to `{msa host IPv4}`.

MosDNS and Mihomo FakeIP / public DNS:

| Destination | Next hop |
|---|---|
| `28.0.0.0/8` | `{msa host IPv4}` |
| `8.8.8.8/32` | `{msa host IPv4}` |
| `8.8.4.4/32` | `{msa host IPv4}` |
| `1.1.1.1/32` | `{msa host IPv4}` |
| `1.0.0.1/32` | `{msa host IPv4}` |

Telegram routes:

| Destination | Next hop |
|---|---|
| `149.154.160.0/22` | `{msa host IPv4}` |
| `149.154.164.0/22` | `{msa host IPv4}` |
| `149.154.172.0/22` | `{msa host IPv4}` |
| `91.108.4.0/22` | `{msa host IPv4}` |
| `91.108.20.0/22` | `{msa host IPv4}` |
| `91.108.56.0/22` | `{msa host IPv4}` |
| `91.108.8.0/22` | `{msa host IPv4}` |
| `95.161.64.0/22` | `{msa host IPv4}` |
| `91.108.12.0/22` | `{msa host IPv4}` |
| `91.108.16.0/22` | `{msa host IPv4}` |
| `67.198.55.0/24` | `{msa host IPv4}` |
| `109.239.140.0/24` | `{msa host IPv4}` |

Netflix routes:

| Destination | Next hop |
|---|---|
| `207.45.72.0/22` | `{msa host IPv4}` |
| `208.75.76.0/22` | `{msa host IPv4}` |
| `210.0.153.0/24` | `{msa host IPv4}` |
| `185.76.151.0/24` | `{msa host IPv4}` |

## Why DNS alone is not enough

FakeIP addresses are **virtual**. Once a client gets an address inside `28.0.0.0/8` / `f2b0::/18`, if the main router has no route for those ranges the traffic is dropped or sent out directly, never returning to msa to restore the real domain and proxy it. So **both** DHCP DNS **and** FakeIP static routes are required.

## Verification

On any client:

```bash
nslookup google.com
dig AAAA google.com
```

Expected:

- IPv4 result falls within `28.0.0.0/8`
- IPv6 result falls within `f2b0::/18`

If the result is not in the FakeIP range, the DHCP DNS usually isn't pointing at msa, or the client cached an old DNS (reconnect or flush DNS and retry).

## Pick your main router

- [RouterOS (MikroTik)](routeros.md)
- [iKuai](ikuai.md)
- [OpenWrt](openwrt.md)
- [UniFi (Ubiquiti)](unifi.md)

> In a single-host deployment, both DHCP DNS and the static routes point to the same msa host. If MosDNS and the transparent proxy run on separate hosts, point DHCP DNS at the MosDNS host and the FakeIP routes at the transparent-proxy host.
