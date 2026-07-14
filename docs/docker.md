# Docker TUN 瀹為獙閮ㄧ讲

[English version](docker.en.md)

Docker 閮ㄧ讲鐩墠浠嶆槸瀹為獙鎬ц兘鍔涳紝灏氭湭浣滀负鎺ㄨ崘瀹夎鏂瑰紡銆傚畠閫傚悎鐔熸倝 Docker銆乀UN銆侀潤鎬佽矾鐢卞拰鏃佽矾鐢辨帴鍏ョ殑鐢ㄦ埛楠岃瘉褰撳墠瀹炵幇锛涚敓浜ф垨闀挎湡浣跨敤浼樺厛閫夋嫨 [Linux tarball/systemd](install/linux.md)銆乕fnOS FPK](install/fnos-fpk.md) 鎴?[Unraid PLG](install/unraid-plg.md)銆?
褰撳墠鐗堟湰锛歚v0.4.2.0`

褰撳墠 Docker 瀹為獙闀滃儚锛?
```text
ghcr.io/leafss1022/msa:v0.4.2.0
```

杩欎釜瀹為獙闀滃儚涓嶄細鎺ㄩ€佸埌 `latest`銆傛媺鍙栨垨閮ㄧ讲 Docker 瀹為獙鐗堟椂蹇呴』鏄惧紡鍐欏嚭 `v0.4.2.0` tag銆?
## 褰撳墠鐘舵€?
- Docker 鐗堥粯璁や娇鐢?Mihomo TUN锛屼笉鍐嶇敱 MSA 鍐欏叆瀹夸富鏈?nftables 鎴?policy routing銆?- 鏀寔涓ょ瀹瑰櫒缃戠粶锛歚host-tun` 鍜?`macvlan-tun`銆?- `host-tun` 浣跨敤 Docker 瀹夸富鏈虹綉缁滃懡鍚嶇┖闂达紝閫傚悎娴嬭瘯銆佸涓绘満鑷韩浠ｇ悊锛屾垨宸茬粡鑳介厤缃富璺敱闈欐€佽矾鐢卞拰瀹夸富鏈鸿浆鍙戠殑鏃佽矾鐢辩幆澧冦€?- `macvlan-tun` 璁╁鍣ㄦ嫢鏈夌嫭绔?LAN IPv4锛岄€傚悎 Unraid Dockerman / br0 / 鑷畾涔夌綉缁滃満鏅紝涔熸槸褰撳墠 Docker 缃戝叧閮ㄧ讲鏇存帹鑽愮殑鏂瑰紡銆?- 杩愯鏁版嵁蹇呴』鏄犲皠鍒板涓绘満鐩綍锛涘鍣ㄥ唴鏁版嵁鐩綍鍥哄畾涓?`/opt/msa`锛岄粯璁ょず渚嬫槧灏勫埌瀹夸富鏈?`./msa-data`銆?- 瀹瑰櫒鍐呯鐢?`msa update` 鍜?WebUI 鑷洿鏂板畨瑁咃紱闀滃儚鍗囩骇蹇呴』閫氳繃 Docker / Compose / 瀹瑰櫒绠＄悊鍣ㄥ畬鎴愩€?
濡傛灉浣犵殑鐩爣鏄ǔ瀹氶儴缃诧紝璇峰厛浣跨敤 Linux銆乫nOS 鎴?Unraid PLG 瀹夎鏂瑰紡銆?
## 杩愯瑕佹眰

涓ょ妯″紡閮介渶瑕?TUN 璁惧鍜岀綉缁滅鐞嗘潈闄愶細

```yaml
cap_add:
  - NET_ADMIN
  - NET_RAW
devices:
  - /dev/net/tun:/dev/net/tun
```

Docker 闀滃儚榛樿璁剧疆锛?
```text
MSA_RUNTIME=docker
MSA_DOCKER_NETWORK_MODE=host-tun
MSA_DOCKER_CLEANUP_NETWORK_ON_EXIT=false
```

Docker TUN 妯″紡涓嬶紝Mihomo 閰嶇疆浼氬惎鐢?`tun.auto-route`銆乣tun.auto-detect-interface` 鍜?`tun.route-address`锛屾樉寮忎繚鎸?`tun.dns-hijack=[]`銆乣tun.auto-redirect=false`锛屽苟閰嶇疆 `dns.proxy-server-nameserver`銆侱NS 鍒嗘祦浠嶇敱 MosDNS 璐熻矗锛孧ihomo 鍙帴绠?Fake-IP 鍜屽繀瑕佸叕缃戠洰鏍囥€傝繖鎰忓懗鐫€ MSA 涓嶄細鍐欏涓绘満 `table inet msa`銆乣fwmark 1 table 100` 鎴?`ip rule`銆傚鏋滀綘鎶?`host-tun` 褰撲綔鏃佽矾缃戝叧浣跨敤锛岃繕闇€瑕佹寜涓嬫枃琛ュ厖瀹夸富鏈?FakeIP 璺敱銆?
鏁版嵁鐩綍蹇呴』鎸佷箙鍖栨槧灏勶細

```text
瀹夸富鏈虹洰褰? ->  瀹瑰櫒鐩綍
./msa-data  ->  /opt/msa
```

MosDNS銆丮ihomo銆乑ashboard 涓嬭浇鏂囦欢銆佹暟鎹簱銆侀厤缃€佹棩蹇楀拰鐢ㄦ埛涓婁紶鐨?Mihomo 閰嶇疆閮戒細鍐欏叆 `/opt/msa`銆傚鏋滀笉鏄犲皠杩欎釜鐩綍锛屽鍣ㄩ噸寤哄悗杩欎簺鏁版嵁浼氫涪澶憋紝WebUI 涓殑缁勪欢涓嬭浇鍜岄厤缃鐞嗕篃鏃犳硶鍙潬宸ヤ綔銆?
## 蹇€熷惎鍔細host TUN

host TUN 浣跨敤瀹夸富鏈?IP 瀵瑰鎻愪緵 WebUI銆丏NS 鍜屼唬鐞嗘湇鍔°€?
### Docker Compose

浠撳簱鏍圭洰褰曞凡缁忔彁渚?`docker-compose.yml`銆傚鏋滀綘闇€瑕佹墜宸ュ垱寤烘枃浠讹紝鍙互鐩存帴澶嶅埗涓嬮潰鍐呭淇濆瓨涓?`docker-compose.yml`锛?
```yaml
services:
  msa:
    image: ghcr.io/leafss1022/msa:v0.4.2.0
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

鍚姩锛?
```bash
mkdir -p msa-data
docker compose up -d
```

榛樿 compose 鏂囦欢浣跨敤锛?
- 闀滃儚锛歚ghcr.io/leafss1022/msa:v0.4.2.0`
- 缃戠粶锛歚host`
- 鏁版嵁鐩綍锛歚./msa-data:/opt/msa`
- WebUI锛歚http://<瀹夸富鏈篒P>:7777`
- 杩愯鏍囪瘑锛歚MSA_RUNTIME=docker`
- Docker 缃戠粶妯″紡锛歚MSA_DOCKER_NETWORK_MODE=host-tun`

### 鏅€?Docker 鑴氭湰

涓嶉€傚悎浣跨敤 Docker Compose 鐨勬満鍣ㄥ彲浠ョ洿鎺ヨ繍琛岋細

```bash
mkdir -p msa-data
./docker-run.sh
```

绛変环鐨勬牳蹇冨弬鏁版槸锛?
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
  ghcr.io/leafss1022/msa:v0.4.2.0
```

## 蹇€熷惎鍔細macvlan TUN

macvlan TUN 缁欏鍣ㄥ垎閰嶇嫭绔?LAN IPv4銆傝矾鐢卞櫒渚?DHCP DNS 鍜?FakeIP 闈欐€佽矾鐢遍兘搴旀寚鍚戣繖涓鍣?IPv4锛岃€屼笉鏄涓绘満 IP銆?
### Docker Compose

浠撳簱鏍圭洰褰曞凡缁忔彁渚?`docker-compose.macvlan.yml`銆傚鏋滀綘闇€瑕佹墜宸ュ垱寤烘枃浠讹紝鍙互鐩存帴澶嶅埗涓嬮潰鍐呭淇濆瓨涓?`docker-compose.macvlan.yml`锛?
```yaml
services:
  msa:
    image: ${MSA_IMAGE:-ghcr.io/leafss1022/msa:v0.4.2.0}
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

澶嶅埗绀轰緥鐜鍙橀噺骞舵寜浣犵殑 LAN 淇敼锛?
```bash
cp docker.env.example .env
```

涔熷彲浠ョ洿鎺ュ鍒朵笅闈㈣繖涓?macvlan compose `.env` 绀轰緥淇濆瓨涓?`.env` 鍚庝慨鏀癸細

```text
MSA_IMAGE=ghcr.io/leafss1022/msa:v0.4.2.0
MSA_CONTAINER_NAME=msa
MSA_DOCKER_DATA_DIR=./msa-data
MSA_DOCKER_NETWORK_NAME=msa-macvlan
MSA_DOCKER_PARENT_IFACE=eth0
MSA_DOCKER_SUBNET=192.168.1.0/24
MSA_DOCKER_GATEWAY=192.168.1.1
MSA_DOCKER_IPV4_ADDRESS=192.168.1.10
```

macvlan 妯″紡鑷冲皯闇€瑕佹寜浣犵殑 LAN 淇敼 `MSA_DOCKER_PARENT_IFACE`銆乣MSA_DOCKER_SUBNET`銆乣MSA_DOCKER_GATEWAY` 鍜?`MSA_DOCKER_IPV4_ADDRESS`銆?
鍚姩锛?
```bash
mkdir -p msa-data
docker compose -f docker-compose.macvlan.yml up -d
```

### 鏅€?Docker 鑴氭湰

```bash
MSA_DOCKER_NETWORK_MODE=macvlan-tun \
MSA_DOCKER_PARENT_IFACE=eth0 \
MSA_DOCKER_SUBNET=192.168.1.0/24 \
MSA_DOCKER_GATEWAY=192.168.1.1 \
MSA_DOCKER_IPV4_ADDRESS=192.168.1.10 \
./docker-run.sh
```

鑴氭湰浼氬湪 `msa-macvlan` 缃戠粶涓嶅瓨鍦ㄦ椂鍒涘缓瀹冦€傚彲鐢?`MSA_DOCKER_NETWORK_NAME` 瑕嗙洊缃戠粶鍚嶃€?
## Unraid Dockerman IPv4 macvlan

棣栫増鎸?Unraid Dockerman 鎵嬪伐閰嶇疆鏀寔锛屼笉鎻愪緵 Community Applications 瀹瑰櫒妯℃澘銆?
1. 鍦?Unraid Docker 璁剧疆涓惎鐢ㄨ嚜瀹氫箟缃戠粶锛屽苟閫夋嫨 `macvlan` 鎴栦綘褰撳墠绯荤粺鎺ㄨ崘鐨勮嚜瀹氫箟缃戠粶瀹炵幇銆?2. 鏂板缓瀹瑰櫒锛岄暅鍍忓～鍐?`ghcr.io/leafss1022/msa:v0.4.2.0`銆?3. Network Type 閫夋嫨鑷畾涔?LAN 缃戠粶锛屼緥濡?`br0`銆?4. Fixed IP address 濉啓涓€涓湭琚?DHCP 鍒嗛厤鐨勯潤鎬?IPv4锛屼緥濡?`192.168.1.10`銆?5. Extra Parameters 鎴栭珮绾у弬鏁版坊鍔狅細

```text
--cap-add NET_ADMIN --cap-add NET_RAW --device /dev/net/tun:/dev/net/tun
```

6. 娣诲姞鐜鍙橀噺锛?
| 鍙橀噺 | 鍊?|
|---|---|
| `MSA_RUNTIME` | `docker` |
| `MSA_DOCKER_NETWORK_MODE` | `macvlan-tun` |
| `MSA_DATA_DIR` | `/opt/msa` |

7. 娣诲姞璺緞鏄犲皠锛?
| 瀹夸富鏈鸿矾寰?| 瀹瑰櫒璺緞 |
|---|---|
| `/mnt/user/appdata/msa-docker` | `/opt/msa` |

WebUI 鍦板潃涓?`http://<瀹瑰櫒IPv4>:7777`銆?
## 璺敱鎺ュ叆

棣栨鎵撳紑 WebUI 鍚庡畬鎴愬垵濮嬪寲鍚戝銆侱ocker runtime 涓嬪垵濮嬪寲椤甸粯璁ら€夋嫨 TUN 妯″紡銆?
璺敱鍣ㄤ晶闇€瑕侊細

1. DHCP DNS 鎸囧悜 MSA 鍦板潃銆?2. FakeIP 闈欐€佽矾鐢辨寚鍚戝悓涓€涓?MSA 鍦板潃銆?
MSA 鍦板潃鎸夌綉缁滄ā寮忛€夋嫨锛?
| Docker 妯″紡 | 璺敱鍣ㄥ簲鎸囧悜 |
|---|---|
| `host-tun` | Docker 瀹夸富鏈?LAN IP |
| `macvlan-tun` | 瀹瑰櫒鐙珛 LAN IPv4锛涘惎鐢?IPv6 鏃惰繕闇€瑕佸鍣ㄥ彲璺敱 IPv6 |

榛樿 FakeIP 缃戞锛?
| 绫诲瀷 | 缃戞 |
|---|---|
| IPv4 | `28.0.0.0/8` |
| IPv6 | `f2b0::/18` |

macvlan 榛樿楠屾敹浠嶄互 IPv4 涓轰富銆傝嫢鍚敤 IPv6锛岄渶瑕佸鍣ㄦ嫢鏈夊彲琚富璺敱璁块棶鐨?IPv6锛屽苟鍦ㄤ富璺敱涓婃妸 `f2b0::/18` 鎸囧悜杩欎釜瀹瑰櫒 IPv6銆傚畬鏁存暀绋嬭 [璺敱鍣ㄦ帴鍏ユ€昏](guide/zh/router-integration.md)銆?
### host-tun FakeIP 璺敱鎸佷箙鍖?
`host-tun` 鍏变韩 Docker 瀹夸富鏈虹綉缁滃懡鍚嶇┖闂淬€備富璺敱鎶?`28.0.0.0/8` 闈欐€佽矾鐢辨寚鍚?Docker 瀹夸富鏈哄悗锛屽涓绘満杩樺繀椤绘妸瀹屾暣 IPv4 FakeIP 缃戞浜ょ粰 Mihomo TUN锛涘惎鐢?IPv6 鏃讹紝`f2b0::/18` 涔熼渶瑕佸悓鏍锋寚鍚?Mihomo TUN銆傞儴鍒嗙幆澧冮噷 Mihomo 鍙細缁?`mihomo` 鎺ュ彛鐢熸垚 `28.0.0.0/30`锛岃繖鍙兘瑕嗙洊 `28.0.0.0` 鍒?`28.0.0.3`锛屽鎴风鎷垮埌 `28.0.0.13` 杩欑被 FakeIP 鏃跺氨涓嶄細杩涘叆 TUN銆?
鏂扮増鏈細鍦?Docker `host-tun` + Mihomo TUN 妯″紡涓嬶紝鍦?Mihomo 鍚姩鎴愬姛鍚庤嚜鍔ㄨˉ榻?FakeIP IPv4 璺敱锛涘鏋滈厤缃腑鍚敤浜?IPv6锛屼篃浼氳嚜鍔ㄨˉ榻?FakeIP IPv6 璺敱銆傜▼搴忚繕浼氬皾璇曞叧闂粯璁ゅ嚭鍙ｇ綉鍗＄殑 `rp_filter`銆傚鏋滃涓绘満 `/proc/sys` 鍙銆佺郴缁熼槻鐏閲嶆斁浜嗚矾鐢辫鍒欙紝鎴栦綘姝ｅ湪鎺掓煡鏃х増鏈棶棰橈紝鍙互缁х画浣跨敤涓嬮潰鐨勬墜宸ュ懡浠や綔涓?fallback銆傜▼搴忎笉浼氳嚜鍔ㄩ噸鍚?`firewalld`銆乣nftables` 鎴?`ufw`銆?
鍏堝湪 Docker 瀹夸富鏈轰笂涓存椂楠岃瘉锛?
```bash
sudo ip route replace 28.0.0.0/8 dev mihomo src 28.0.0.1
# 濡傛灉鍚敤浜?IPv6:
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

纭 FakeIP 宸茬粡璧?`mihomo`锛?
```bash
ip route get 28.0.0.13
# 濡傛灉鍚敤浜?IPv6:
ip -6 route get f2b0::13
cat "/proc/sys/net/ipv4/conf/$IFACE/rp_filter"
```

鏈熸湜鐪嬪埌锛?
```text
28.0.0.13 dev mihomo src 28.0.0.1
f2b0::13 dev mihomo src f2b0::1
0
```

涓存椂鍛戒护鍦ㄥ鍣ㄣ€丮ihomo 鎴栧涓绘満閲嶅惎鍚庡彲鑳戒涪澶便€傞渶瑕佹寔涔呭寲鏃讹紝鍦?Docker 瀹夸富鏈轰笂鍒涘缓 systemd 瀹氭椂浠诲姟銆傚畠浼氬畾鏈熸鏌?`mihomo` 鎺ュ彛鏄惁瀛樺湪锛屽瓨鍦ㄦ椂琛ラ綈 FakeIP 璺敱骞跺叧闂嚭鍙ｇ綉鍗?`rp_filter`銆傚鏋滃惎鐢ㄤ簡 IPv6锛屾妸鑴氭湰閲岀殑 `ENABLE_IPV6=0` 鏀逛负 `ENABLE_IPV6=1`锛?
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

闃插憜锛氬鏋滀綘鐨勭郴缁熼槻鐏鏈嶅姟浼氱紦瀛樻垨閲嶆斁杞彂瑙勫垯锛屽畨瑁呮寔涔呭寲浠诲姟鍚庢墜鍔ㄩ噸鍚綋鍓嶆鍦ㄤ娇鐢ㄧ殑闃茬伀澧欐湇鍔★細

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

## 鑴氭湰鍙橀噺

`docker-run.sh` 鏀寔锛?
| 鍙橀噺 | 榛樿鍊?| 鐢ㄩ€?|
|---|---|---|
| `MSA_IMAGE` | `ghcr.io/leafss1022/msa:v0.4.2.0` | 瀹瑰櫒闀滃儚 |
| `MSA_CONTAINER_NAME` | `msa` | 瀹瑰櫒鍚嶇О |
| `MSA_DOCKER_DATA_DIR` | `$PWD/msa-data` | 瀹夸富鏈烘暟鎹洰褰?|
| `MSA_DOCKER_NETWORK_MODE` | `host-tun` | `host-tun` 鎴?`macvlan-tun` |
| `MSA_DOCKER_NETWORK_NAME` | `msa-macvlan` | macvlan Docker network 鍚嶇О |
| `MSA_DOCKER_PARENT_IFACE` | 鏃?| macvlan 鐖舵帴鍙?|
| `MSA_DOCKER_SUBNET` | 鏃?| macvlan IPv4 瀛愮綉 |
| `MSA_DOCKER_GATEWAY` | 鏃?| macvlan IPv4 缃戝叧 |
| `MSA_DOCKER_IPV4_ADDRESS` | 鏃?| 瀹瑰櫒闈欐€?IPv4 |

濡傛灉鍚屽悕瀹瑰櫒宸茬粡瀛樺湪锛屽厛鍋滄骞跺垹闄ゆ棫瀹瑰櫒锛?
```bash
docker stop msa
docker rm msa
```

## 甯歌闂

### LXC / Proxmox 鎻愮ず `/dev/net/tun` 涓嶅瓨鍦?
濡傛灉閮ㄧ讲鏃舵姤閿欙細

```text
error gathering device information while adding custom device "/dev/net/tun": no such file or directory
```

璇存槑 Docker daemon 鎵€鍦ㄧ殑杩愯鐜娌℃湁 `/dev/net/tun`銆傚鏋?Docker 璺戝湪 LXC 閲岋紝闇€瑕佸湪 LXC 瀹瑰櫒鍐呮鏌ワ細

```bash
ls -l /dev/net/tun
cat /dev/net/tun
```

姝ｅ父鎯呭喌涓嬶紝`cat /dev/net/tun` 搴旇繑鍥炵被浼?`File descriptor in bad state`銆傚鏋滄枃浠朵笉瀛樺湪锛岄渶瑕佸湪澶栧眰瀹夸富鏈哄姞杞藉苟閫忎紶 TUN锛屼緥濡?Proxmox LXC 鍙弬鑰冿細

```bash
modprobe tun
```

```text
features: nesting=1
lxc.cgroup2.devices.allow: c 10:200 rwm
lxc.mount.entry: /dev/net/tun dev/net/tun none bind,create=file
```

淇敼 LXC 閰嶇疆鍚庨噸鍚鍣ㄣ€備笉鍚屽钩鍙扮殑 LXC 鏉冮檺妯″瀷涓嶅畬鍏ㄤ竴鏍凤紝蹇呰鏃惰浣跨敤 privileged LXC 鎴?VM 娴嬭瘯銆?
### v0.3.7 Docker TUN 鍑虹幇 DNS / Fake-IP 杩炴帴寮傚父

`v0.3.7` 鐨?Docker TUN 榛樿閰嶇疆瀛樺湪缂洪櫡锛歁ihomo 鍙兘鎶婅妭鐐规湇鍔″櫒鍩熷悕瑙ｆ瀽鎴?`28.0.0.x` 杩欑被 Fake-IP锛岄殢鍚庢嫧鍙峰け璐ワ紱鏃ュ織閲屼篃鍙兘鍑虹幇澶ч噺 `127.0.0.1:8888 connection refused` 鎴栬妭鐐瑰煙鍚嶈繛鎺ヨ秴鏃躲€?
淇鐗堟湰浼氱粺涓€ Linux TUN 鐢熸垚閫昏緫锛?
- `tun.stack` 浣跨敤 `system`銆?- `tun.dns-hijack` 淇濇寔绌烘暟缁勶紝鐢?MosDNS 缁х画璐熻矗 DNS 鍒嗘祦銆?- `tun.route-address` 鍖呭惈 Fake-IP 缃戞鍜屽繀瑕佸叕缃戠洰鏍囥€?- `tun.route-exclude-address` 鎺掗櫎 LAN銆乴oopback銆乴ink-local 鍜屽父瑙佸浗鍐?DNS銆?- `dns.proxy-server-nameserver` 浣跨敤 `223.5.5.5`銆乣119.29.29.29`锛岄伩鍏嶈妭鐐规湇鍔″櫒鍩熷悕琚?Fake-IP 姹℃煋銆?
鍗囩骇鍒颁慨澶嶇増鏈悗锛屽鏋滀綘浠嶄娇鐢ㄧ敓鎴愰厤缃ā寮忥紝MSA 浼氬湪鍚姩鏃惰嚜鍔ㄤ慨姝ｆ棫鐨?TUN / DNS 閰嶇疆鍧椼€傝嫢浣犲凡缁忓垏鎹㈠埌 Mihomo 鑷畾涔夐厤缃ā寮忥紝MSA 涓嶄細鑷姩瑕嗙洊浣犵殑鏂囦欢锛岃鎸変笂闈㈢殑瀛楁鎵嬪姩璋冩暣锛屾垨鍦?WebUI 涓仮澶嶄负鐢熸垚閰嶇疆鍚庨噸鏂扮敓鎴愩€?
### macvlan 鎻愮ず `invalid subinterface vlan name`

濡傛灉閮ㄧ讲鏃舵姤閿欑被浼硷細

```text
invalid subinterface vlan name MSA_DOCKER_PARENT_IFACE:eth0, example formatting is eth0.10
```

璇存槑 Docker 鏀跺埌鐨?macvlan `parent` 涓嶆槸瀹為檯缃戝崱鍚嶃€俙parent` 蹇呴』鏄?Docker 鎵€鍦ㄥ涓荤幆澧冧腑鐨勭湡瀹炴帴鍙ｏ紝渚嬪 `eth0`銆乣ens18`銆乣br0` 鎴?VLAN 瀛愭帴鍙?`eth0.10`銆?
`.env` 鏂囦欢蹇呴』浣跨敤绛夊彿鍐欐硶锛?
```text
MSA_DOCKER_PARENT_IFACE=eth0
```

涓嶈鍐欐垚锛?
```text
MSA_DOCKER_PARENT_IFACE:eth0
```

鍦?Portainer Stack 閲岋紝璇锋妸 `MSA_DOCKER_PARENT_IFACE` 浣滀负鐜鍙橀噺鍚嶃€乣eth0` 浣滀负鍊煎～鍐欙紝涓嶈鎶?`MSA_DOCKER_PARENT_IFACE:eth0` 褰撴垚涓€涓畬鏁村€笺€傚彲浠ュ厛鐢ㄤ笅闈㈠懡浠ょ‘璁?compose 灞曞紑缁撴灉锛?
```bash
MSA_DOCKER_PARENT_IFACE=eth0 \
MSA_DOCKER_SUBNET=192.168.1.0/24 \
MSA_DOCKER_GATEWAY=192.168.1.1 \
MSA_DOCKER_IPV4_ADDRESS=192.168.1.10 \
docker compose -f docker-compose.macvlan.yml config
```

杈撳嚭涓簲鑳界湅鍒帮細

```yaml
driver_opts:
  parent: eth0
```

## 鏇存柊鍜屽嵏杞?
Docker 瀹瑰櫒鍐呯鐢?`msa update` 鍜?WebUI 鑷洿鏂板畨瑁呫€傞暅鍍忓崌绾у簲閫氳繃鎷夊彇鏂伴暅鍍忓苟閲嶅缓瀹瑰櫒瀹屾垚銆?
Docker Compose锛?
```bash
docker compose pull
docker compose up -d
```

鏅€?Docker锛?
```bash
docker pull ghcr.io/leafss1022/msa:v0.4.2.0
docker stop msa
docker rm msa
./docker-run.sh
```

鍗歌浇鏃堕€氳繃 Docker / Compose / 瀹瑰櫒绠＄悊鍣ㄥ垹闄ゅ鍣ㄣ€傞粯璁ゆ暟鎹洰褰曞湪瀹夸富鏈哄綋鍓嶇洰褰曠殑 `./msa-data`锛岄渶瑕佸交搴曟竻鐞嗘椂鍐嶆墜鍔ㄥ垹闄よ鐩綍銆?
MosDNS銆丮ihomo銆乑ashboard 鐨勭粍浠舵洿鏂颁粛鍙湪 WebUI 涓娇鐢ㄣ€?
## 甯歌绔彛

Docker TUN 榛樿涓嶄娇鐢?TProxy/Redirect 绔彛銆?
| 绔彛 | 鐢ㄩ€?|
|---|---|
| `7777` | MSA WebUI |
| `53/tcp,udp` | MosDNS |
| `7890` | Mihomo HTTP proxy |
| `7891` | Mihomo SOCKS proxy |
| `7892` | Mihomo mixed proxy |
| `9090` | Mihomo controller / Zashboard |
| `9099` | MosDNS observability |
