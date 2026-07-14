# Unraid PLG 瀹夎

鏈〉闈㈤€傜敤浜?Unraid WebGUI 鐨?`.plg` 鎻掍欢瀹夎鏂瑰紡銆俇nraid PLG 鏄ǔ瀹氭敮鎸佺殑瀹夎鏂瑰紡锛屾洿鏂板拰鍗歌浇閮藉簲閫氳繃 Unraid 鎻掍欢绠＄悊椤甸潰瀹屾垚銆?
褰撳墠鐗堟湰锛歚v0.4.2.0`

## 瀹夎

鍦?Unraid WebGUI 涓墦寮€ **Plugins / Install Plugin**锛屽～鍏ユ彃浠跺湴鍧€锛?
```text
https://github.com/leafss1022/msa/releases/download/v0.4.2.0/msa.plg
```

瀹夎瀹屾垚鍚庢墦寮€ **Settings / MSA Free**锛岃繘鍏ヨ交閲忔彃浠舵帶鍒堕〉锛屽啀鐐瑰嚮鎵撳紑 WebUI銆傚畬鏁寸鐞嗙晫闈㈣繍琛屽湪鐙珛 WebUI 涓紝涓嶅祵鍏?Unraid Settings 椤甸潰銆?
榛樿 WebUI锛?
```text
http://<Unraid涓绘満IP>:7777
```

## 杩愯鏂瑰紡

Unraid 鎻掍欢榛樿璺緞锛?
| 椤圭洰 | 璺緞 |
|---|---|
| 鎻掍欢浜岃繘鍒?| `/usr/local/emhttp/plugins/msa/bin/msa` |
| 鍏煎鍛戒护 | `/usr/local/bin/msa` |
| 鎺у埗鑴氭湰 | `/etc/rc.d/rc.msa` |
| 鎻掍欢閰嶇疆 | `/boot/config/plugins/msa/msa.cfg` |
| 榛樿鏁版嵁鐩綍 | `/mnt/user/appdata/msa` |

Unraid 杩愯閫昏緫锛?
- 鍏ㄦ柊瀹夎涓斿皻鏈垵濮嬪寲鏃讹紝鍙惎鍔?`msa` 绠＄悊 WebUI銆?- 瀹屾垚鍒濆鍖栧紩瀵煎悗锛岄粯璁ゅ惎鐢?Mihomo銆丮osDNS 鍜?nftables銆?- Unraid 閲嶅惎鎴栨彃浠舵湇鍔￠噸鍚悗锛宍msa` 浼氭寜宸蹭繚瀛樼姸鎬佹仮澶?Mihomo銆丮osDNS 鍜?nftables銆?- 濡傛灉鐢ㄦ埛鍦?WebUI 涓墜鍔ㄥ仠姝㈡湇鍔℃垨娓呴櫎 nftables锛屼笅娆″惎鍔ㄤ細灏婇噸杩欎釜鍏抽棴鐘舵€併€?- 鍦ㄧ嚎瀹夎 MosDNS銆丮ihomo銆乑ashboard 鏃朵細鍏堟牎楠?GitHub release asset SHA-256 digest锛涙湰鍦颁笂浼犳牳蹇冩爣璁颁负 `local-upload`銆?
## 鍋滄鍜岄噸鍚?
鍋滄 Unraid 鏈嶅姟浣嗕笉鍒犻櫎鏂囦欢锛?
```bash
/etc/rc.d/rc.msa stop
```

閲嶅惎锛?
```bash
/etc/rc.d/rc.msa restart
```

甯哥敤 CLI锛?
```bash
msa status --config /mnt/user/appdata/msa
msa logs --config /mnt/user/appdata/msa --lines 200 mosdns
msa logs --config /mnt/user/appdata/msa --lines 200 mihomo
msa doctor --config /mnt/user/appdata/msa
```

## 鏇存柊鍜屽嵏杞?
Unraid 涓婁笉瑕佷娇鐢細

```bash
msa update
msa uninstall
```

鏇存柊鍜屽嵏杞藉簲閫氳繃 Unraid 鎻掍欢绠＄悊椤甸潰瀹屾垚锛岄伩鍏嶇粫杩?`.plg` 鍖呯姸鎬併€?
鍗歌浇璇峰湪 WebGUI 鐨勬彃浠剁鐞嗛〉闈㈠垹闄?`msa` 鎻掍欢銆傛彃浠跺嵏杞戒細鍋滄 WebUI 鏈嶅姟骞剁Щ闄ゆ彃浠舵枃浠讹紝榛樿淇濈暀搴旂敤鏁版嵁鐩綍锛?
```text
/mnt/user/appdata/msa
```

鍙湁鍦ㄧ‘瀹氳鍒犻櫎閰嶇疆銆佹暟鎹簱銆佹棩蹇椼€佷笅杞界粍浠跺拰澶囦唤鏃讹紝鎵嶆墜鍔ㄥ垹闄よ鐩綍銆?
## 鍙戝竷璧勪骇

Unraid 鍙戝竷璧勪骇鍖呮嫭锛?
- `msa.plg`
- `msa-0.4.2.0-x86_64-1.txz`
- 瀵瑰簲 `.sha256` 鏍￠獙鏂囦欢

Unraid 鎵撳寘寮€鍙戣鏄庤 [packaging/unraid/README.md](../../packaging/unraid/README.md)銆傝繍琛岀洰褰曞拰绔彛璇存槑瑙?[杩愯鍙傝€僝(../reference/runtime.md)銆?
