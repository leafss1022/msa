# Linux tarball/systemd 瀹夎

鏈〉闈㈤€傜敤浜庢櫘閫?Linux 涓绘満涓婄殑 `msa-linux-amd64.tar.gz` / `msa-linux-arm64.tar.gz` 瀹夎鍖呫€侺inux tarball/systemd 鏄綋鍓嶆帹鑽愮殑閫氱敤瀹夎鏂瑰紡锛屼篃鏄敮涓€鏀寔 `msa update` 鍜?`msa uninstall` 鐨勫畨瑁呮柟寮忋€?
褰撳墠鐗堟湰锛歚v0.4.2.0`

## 涓嬭浇

| 鏋舵瀯 | 涓嬭浇鍦板潃 |
|---|---|
| x86_64 / amd64 | `https://github.com/leafss1022/msa/releases/download/v0.4.2.0/msa-linux-amd64.tar.gz` |
| ARM64 / aarch64 | `https://github.com/leafss1022/msa/releases/download/v0.4.2.0/msa-linux-arm64.tar.gz` |

Release 椤甸潰锛?
```text
https://github.com/leafss1022/msa/releases/tag/v0.4.2.0
```

## 瀹夎

x86_64 / amd64锛?
```bash
curl -L -o msa-linux-amd64.tar.gz \
  https://github.com/leafss1022/msa/releases/download/v0.4.2.0/msa-linux-amd64.tar.gz

tar -xzf msa-linux-amd64.tar.gz -C /tmp
sudo /tmp/msa-0.4.2.0-linux-amd64/install.sh
```

ARM64 / aarch64锛?
```bash
curl -L -o msa-linux-arm64.tar.gz \
  https://github.com/leafss1022/msa/releases/download/v0.4.2.0/msa-linux-arm64.tar.gz

tar -xzf msa-linux-arm64.tar.gz -C /tmp
sudo /tmp/msa-0.4.2.0-linux-arm64/install.sh
```

瀹夎鑴氭湰榛樿瀹屾垚杩欎簺鎿嶄綔锛?
- 瀹夎浜岃繘鍒跺埌 `/usr/local/bin/msa`
- 娉ㄥ唽鍏煎鍛戒护 `/usr/local/bin/msm`
- 鍒濆鍖栨暟鎹洰褰?`/opt/msa`
- 瀹夎 systemd 鏈嶅姟 `msa.service`
- 鍚姩 WebUI锛岄粯璁ょ洃鍚?`0.0.0.0:7777`

鑷畾涔夋暟鎹洰褰曘€佺洃鍚湴鍧€鍜岀鍙ｏ細

```bash
sudo ./install.sh --data-dir /opt/msa --host 0.0.0.0 --port 7777
```

瀹夎瀹屾垚鍚庢墦寮€锛?
```text
http://<鏈嶅姟鍣↖P>:7777
```

棣栨杩涘叆浼氭樉绀哄垵濮嬪寲鍚戝銆傚畬鎴愬垵濮嬪寲鍚庯紝`msa` 浼氭寔涔呭寲杩愯鎬侊紱鍚庣画閲嶅惎鏃朵細鎸夐厤缃仮澶?Mihomo銆丮osDNS 鍜?nftables锛岄櫎闈炵敤鎴峰湪 WebUI 涓樉寮忓仠姝㈡湇鍔℃垨娓呴櫎 nftables銆?
## 甯哥敤鍛戒护

systemd锛?
```bash
sudo systemctl status msa
sudo systemctl stop msa
sudo systemctl restart msa
sudo journalctl -u msa -f
```

CLI锛?
```bash
sudo msa status
sudo msa stop
sudo msa restart
sudo msa logs
sudo msa logs --lines 200 mosdns
sudo msa logs --lines 200 mihomo
sudo msa doctor
sudo msa cloudflare-redirect status
sudo msa update
```

`msm` 鍜?`msa` 鎸囧悜鍚屼竴濂?CLI銆俙msa stop` 浼氬悜姝ｅ湪杩愯鐨勭鐞嗚繘绋嬪彂閫佷紭闆呭仠姝俊鍙凤紝绠＄悊杩涚▼閫€鍑哄墠浼氬仠姝㈠畠鎵樼鐨?MosDNS 鍜?Mihomo 瀛愯繘绋嬨€?
闇€瑕佸己鍒跺仠姝㈡椂锛?
```bash
sudo msa stop --timeout 20s --force
```

## 鍗囩骇

鎺ㄨ崘浣跨敤锛?
```bash
sudo msa update
```

涔熷彲浠ラ噸鏂拌繍琛屾柊鐗堟湰瀹夎鍖呬腑鐨勫畨瑁呰剼鏈細

```bash
sudo ./install.sh
```

瀹夎鑴氭湰浼氳鐩栦簩杩涘埗骞堕噸鍚湇鍔★紝榛樿淇濈暀鐜版湁鏁版嵁鐩綍銆俙msa update` 浼氫紭鍏堝鐢ㄥ綋鍓嶅畨瑁呯殑鐪熷疄鏁版嵁鐩綍銆佺洃鍚?host 鍜?port锛岄伩鍏嶆洿鏂板悗鍚姩鍒扮┖鐩綍銆?
## 鍗歌浇

Linux tarball/systemd 瀹夎鍙互鐩存帴浣跨敤锛?
```bash
sudo msa uninstall
```

浜や簰寮忕粓绔細璇㈤棶鏄惁鍒犻櫎 `/opt/msa` 鏁版嵁鐩綍锛涢潪浜や簰鐜榛樿淇濈暀鏁版嵁銆傞渶瑕佽繛閰嶇疆銆佹暟鎹簱銆佹棩蹇椼€佺粍浠朵簩杩涘埗鍜?zashboard 涓€璧峰垹闄ゆ椂锛屾樉寮忔墽琛岋細

```bash
sudo msa uninstall --purge --yes
```

濡傛灉杩樹繚鐣欑潃瑙ｅ帇鍚庣殑鍙戝竷鍖咃紝涔熷彲浠ュ湪鍖呯洰褰曞唴杩愯锛?
```bash
sudo ./uninstall.sh
sudo ./uninstall.sh --purge --yes
```

`msa uninstall` 鍙潰鍚?Linux tarball/systemd 瀹夎銆侱ocker銆乁nraid銆乫nOS FPK 璇蜂娇鐢ㄥ搴斿钩鍙扮殑瀹瑰櫒銆佹彃浠舵垨搴旂敤绠＄悊鍣ㄥ嵏杞姐€?
## 鏁版嵁鐩綍

榛樿鏁版嵁鐩綍锛?
```text
/opt/msa
```

涓昏鍐呭锛?
- `configs/mosdns`
- `configs/mihomo`
- `configs/network`
- `data/binaries`
- `logs`
- `database`
- `backups`

杩愯鐩綍銆佺鍙ｅ拰瀹屾暣鏂囦欢缁撴瀯瑙?[杩愯鍙傝€僝(../reference/runtime.md)銆?
