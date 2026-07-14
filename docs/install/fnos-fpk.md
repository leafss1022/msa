# fnOS FPK 瀹夎

鏈〉闈㈤€傜敤浜?fnOS / 椋炵墰绯荤粺涓婄殑 `.fpk` 瀹夎鍖呫€俧nOS FPK 鐢?`fnos-fpk` 鍒嗘敮鍦ㄥ悓姝?`main` 鍚庢瀯寤猴紝杩愯鏃剁敱 fnOS / 椋炵墰搴旂敤涓績鎴?FPK 鍖呯鐞嗗櫒绠＄悊銆?
褰撳墠鐗堟湰锛歚v0.4.2.0`

## 涓嬭浇

Release 椤甸潰锛?
```text
https://github.com/leafss1022/msa/releases/tag/v0.4.2.0
```

| 鏋舵瀯 | FPK 璧勪骇 |
|---|---|
| x86 / amd64 | `https://github.com/leafss1022/msa/releases/download/v0.4.2.0/msa_0.4.2.0_x86.fpk` |
| ARM / arm64 | `https://github.com/leafss1022/msa/releases/download/v0.4.2.0/msa_0.4.2.0_arm.fpk` |

璇锋寜 fnOS 璁惧 CPU 鏋舵瀯閫夋嫨瀵瑰簲瀹夎鍖呫€傚彂甯冩椂涔熶細鎻愪緵瀵瑰簲 `.sha256` 鏍￠獙鏂囦欢銆?
## 瀹夎

鍦?fnOS / 椋炵墰搴旂敤涓績涓€夋嫨鎵嬪姩瀹夎鎴栨湰鍦板畨瑁咃紝涓婁紶瀵瑰簲 `.fpk` 鏂囦欢骞剁‘璁ゅ畨瑁呫€?
瀹夎鍚庢墦寮€搴旂敤鍏ュ彛鎴栬闂粯璁?WebUI锛?
```text
http://<fnOS涓绘満IP>:7777
```

棣栨杩涘叆浼氭樉绀哄垵濮嬪寲鍚戝銆傚畬鎴愬垵濮嬪寲鍚庯紝`msa` 浼氭寜淇濆瓨鐘舵€佹仮澶?Mihomo銆丮osDNS 鍜?nftables銆?
## 杩愯鏂瑰紡

fnOS FPK 鍖呬細鎶婁簩杩涘埗鍜屾暟鎹斁鍦?fnOS 搴旂敤鐩綍鍐咃細

| 椤圭洰 | 璺緞 |
|---|---|
| 浜岃繘鍒?| `/var/apps/msa/target/msa` |
| 鏁版嵁鐩綍 | `/var/apps/msa/var` |
| systemd service | fnOS 娉ㄥ唽鐨?`msa.service` |
| 榛樿 WebUI | `0.0.0.0:7777` |

FPK 杩愯闇€瑕?root 鏉冮檺锛屽洜涓?`msa` 闇€瑕佺粦瀹?MosDNS `:53`銆佸啓鍏?nftables銆佸啓鍏?`ip rule` / `ip route`锛屽苟绠＄悊閫忔槑浠ｇ悊鐩稿叧缃戠粶鐘舵€併€?
## 鏇存柊鍜屽嵏杞?
fnOS FPK 瀹夎蹇呴』閫氳繃 fnOS / 椋炵墰搴旂敤涓績鎴?FPK 鍖呯鐞嗗櫒鏇存柊銆佸仠姝㈠拰鍗歌浇銆?
涓嶈鍦?fnOS FPK 鐜涓墽琛岃繖浜?Linux tarball 鍛戒护锛?
```bash
sudo msa update
sudo msa uninstall
sudo msa service install
sudo msa service uninstall
```

杩欎簺鍛戒护鍦?fnOS FPK 鐜涓細琚嫤鎴苟鎻愮ず浣跨敤骞冲彴绠＄悊鍣ㄣ€俉ebUI 鑷洿鏂板叆鍙ｅ悓鏍蜂細鎻愮ず閫氳繃 fnOS / 椋炵墰搴旂敤涓績鎴?FPK 鍖呯鐞嗗櫒鍗囩骇銆?
杩欐牱鍋氭槸涓轰簡閬垮厤 Linux tarball 瀹夎娴佺▼鍦?`/opt/msa` 鍒涘缓鍙︿竴濂楀畨瑁咃紝鎴栫粫杩?fnOS 鐨勫寘鐘舵€併€?
## 甯哥敤鎺掓煡

鎵撳紑 WebUI 鍚庡鏋滆繕娌℃湁瀹屾垚鍒濆鍖栵紝鍙細鍚姩 `msa` 绠＄悊鐣岄潰锛涘畬鎴愬垵濮嬪寲鍚庢墠浼氭寜閰嶇疆鎭㈠ Mihomo銆丮osDNS 鍜?nftables銆?
濡傛灉闇€瑕佺‘璁ゆ暟鎹洰褰曪紝鍙湪 CLI 鎴栨棩蹇椾腑鏌ユ壘锛?
```text
/var/apps/msa/var
```

Cloudflare Redirect 閰嶇疆鏂囦欢浣嶄簬锛?
```text
/var/apps/msa/var/configs/cloudflare-redirect/cfyouxuan.yaml
```

杩愯鐩綍鍜岀鍙ｈ鏄庤 [杩愯鍙傝€僝(../reference/runtime.md)銆?
