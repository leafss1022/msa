# 更新日志

## Unreleased

### 中文

### English

## v0.3.9.3 - 2026-07-10

### 中文

#### 修复

- 修复 Linux tarball 打包问题：Release 发布的 msa-linux-amd64.tar.gz 缺少 install.sh、uninstall.sh、systemd/msa.service 等安装脚本，导致 sudo ./install.sh 报 command not found。
- 新的 tarball 已包含正确的安装脚本和 systemd 服务文件。
- 统一更新版本号为 v0.3.9.3。

### English

#### Fixed

- Fixed Linux tarball packaging: the released msa-linux-amd64.tar.gz was missing install.sh, uninstall.sh, systemd/msa.service etc., causing sudo ./install.sh to fail with command not found.
- The new tarball now contains the correct install scripts and systemd service file.
- Updated version references to v0.3.9.3.

## v0.3.9.2 - 2026-06-30

### 中文

#### 说明

- 这是一次 Mihomo 配置管理热修复发布，用于替换并下架存在 provider 同步问题的 v0.3.9 / v0.3.9.1。
- 本版本 GitHub Release 资产数量与 v0.3.9 保持一致：Linux amd64/arm64 tarball、Unraid .txz/.plg，以及从同步后的 nos-fpk 分支构建的 fnOS x86/arm .fpk 包，共 12 个 release assets。
- Docker 镜像额外以 ghcr.io/leafss1022/msa:v0.3.9.2 发布，不推送 latest。

#### 包含 v0.3.9 的正确改动

- Docker host-tun + Mihomo TUN 启动后自动补齐 FakeIP IPv4 路由，例如 28.0.0.0/8 dev mihomo src 28.0.0.1，避免客户端 FakeIP 流量到达 Docker 宿主机后没有进入 mihomo TUN。
- Docker host-tun + Mihomo TUN 在显式启用 IPv6 时自动补齐 FakeIP IPv6 路由，例如 2b0::/18 dev mihomo src f2b0::1；IPv4 / IPv6 任一路由修复失败都只写 warning，不阻断服务启动。
- Docker host-tun + Mihomo TUN 会尝试关闭默认出口网卡的 p_filter；失败时只写 warning，不阻断 Mihomo 启动。
- Mihomo 配置管理不再把内部运行副本 configs/mihomo/config.yaml 当作用户配置展示；打开页面会优先显示正在应用的用户配置，没有用户配置时显示"默认配置"。
- 默认 Mihomo 配置只允许修改 proxy-providers 并继续保持默认模式；其他 YAML 字段一旦保存会转为用户自定义配置。
- 保存、覆盖或复制已应用的 Mihomo 用户配置时会同步内部运行副本，避免配置列表与实际运行配置漂移。
- MosDNS、MSA 通用配置管理和 Mihomo 配置管理共用的 YAML 编辑器高亮对齐 VS Code Dark+ 风格，改善 key、字符串、数字、布尔、注释、锚点和 tag 的颜色识别。

#### v0.3.9.2 修复

- Mihomo 初始化配置里的订阅链接/自定义节点与"代理节点 > 管理代理供应商"统一同步到顶层 proxy-providers 引用字段；已应用用户配置只替换该 section，不再写入订阅下载后的节点内容。
- 自定义节点分享链接再次打开仍保持"分享链接模式"，不会被运行用的 msa_manual.yaml 反向覆盖成 proxies: YAML 文本。
- Mihomo 配置页"运行中"旁恢复配置模式标签，用"默认配置 / 用户自定义配置"区分当前运行配置来源，同时继续隐藏内部运行副本 configs/mihomo/config.yaml。

#### 说明

- 程序不会自动重启 irewalld、
ftables 或 ufw。如果防火墙服务会缓存或重放规则，仍需按 Docker 文档手动重启对应防火墙服务。
- Docker IPv6 默认仍保持关闭；只有用户显式启用 IPv6 后才会生成并修复 2b0::/18。
- 内部 Mihomo 运行副本仍然存在并用于启动核心，只是不再作为普通配置文件让用户直接管理。

#### 受影响用户

- 如果您在 v0.3.9 或 v0.3.9.1 期间通过系统设置或"代理节点 > 管理代理供应商"添加/管理过代理订阅链接，已应用的用户配置可能被错误写入订阅下载后的节点内容。
- MSA 不会自动猜测和修复这类污染配置。请删除受污染的用户配置后重新创建，避免继续编辑或沿用错误内容。

### English

#### Notes

- This is a Mihomo config-management hotfix release that replaces and retires v0.3.9 / v0.3.9.1, which had incorrect provider synchronization behavior.
- GitHub Release assets remain aligned with v0.3.9: Linux amd64/arm64 tarballs, Unraid .txz/.plg, and fnOS x86/arm .fpk packages built from the synced nos-fpk branch, for 12 release assets total.
- The Docker image is additionally published as ghcr.io/leafss1022/msa:v0.3.9.2. The latest tag is not pushed.

