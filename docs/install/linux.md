# Linux tarball/systemd 安装

本页面适用于普通 Linux 主机上的 `msa-linux-amd64.tar.gz` / `msa-linux-arm64.tar.gz` 安装包。Linux tarball/systemd 是当前推荐的通用安装方式，也是唯一支持 `msa update` 和 `msa uninstall` 的安装方式。

当前版本：`v0.4.3.0`

## 下载

| 架构 | 下载地址 |
|---|---|
| x86_64 / amd64 | `https://github.com/leafss1022/msa/releases/download/v0.4.3.0/msa-linux-amd64.tar.gz` |
| ARM64 / aarch64 | `https://github.com/leafss1022/msa/releases/download/v0.4.3.0/msa-linux-arm64.tar.gz` |

Release 页面：

```text
https://github.com/leafss1022/msa/releases/tag/v0.4.3.0
```

## 安装

x86_64 / amd64：

```bash
curl -L -o msa-linux-amd64.tar.gz \
  https://github.com/leafss1022/msa/releases/download/v0.4.3.0/msa-linux-amd64.tar.gz

tar -xzf msa-linux-amd64.tar.gz -C /tmp
sudo /tmp/msa-0.4.3.0-linux-amd64/install.sh
```

ARM64 / aarch64：

```bash
curl -L -o msa-linux-arm64.tar.gz \
  https://github.com/leafss1022/msa/releases/download/v0.4.3.0/msa-linux-arm64.tar.gz

tar -xzf msa-linux-arm64.tar.gz -C /tmp
sudo /tmp/msa-0.4.3.0-linux-arm64/install.sh
```

安装脚本默认完成这些操作：

- 安装二进制到 `/usr/local/bin/msa`
- 注册兼容命令 `/usr/local/bin/msm`
- 初始化数据目录 `/opt/msa`
- 安装 systemd 服务 `msa.service`
- 启动 WebUI，默认监听 `0.0.0.0:7777`

自定义数据目录、监听地址和端口：

```bash
sudo ./install.sh --data-dir /opt/msa --host 0.0.0.0 --port 7777
```

安装完成后打开：

```text
http://<服务器IP>:7777
```

首次进入会显示初始化向导。完成初始化后，`msa` 会持久化运行态；后续重启时会按配置恢复 Mihomo、MosDNS 和 nftables，除非用户在 WebUI 中显式停止服务或清除 nftables。

## 常用命令

systemd：

```bash
sudo systemctl status msa
sudo systemctl stop msa
sudo systemctl restart msa
sudo journalctl -u msa -f
```

CLI：

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

`msm` 和 `msa` 指向同一套 CLI。`msa stop` 会向正在运行的管理进程发送优雅停止信号，管理进程退出前会停止它托管的 MosDNS 和 Mihomo 子进程。

需要强制停止时：

```bash
sudo msa stop --timeout 20s --force
```

## 升级

推荐使用：

```bash
sudo msa update
```

也可以重新运行新版本安装包中的安装脚本：

```bash
sudo ./install.sh
```

安装脚本会覆盖二进制并重启服务，默认保留现有数据目录。`msa update` 会优先复用当前安装的真实数据目录、监听 host 和 port，避免更新后启动到空目录。

## 卸载

Linux tarball/systemd 安装可以直接使用：

```bash
sudo msa uninstall
```

交互式终端会询问是否删除 `/opt/msa` 数据目录；非交互环境默认保留数据。需要连配置、数据库、日志、组件二进制和 zashboard 一起删除时，显式执行：

```bash
sudo msa uninstall --purge --yes
```

如果还保留着解压后的发布包，也可以在包目录内运行：

```bash
sudo ./uninstall.sh
sudo ./uninstall.sh --purge --yes
```

`msa uninstall` 只面向 Linux tarball/systemd 安装。Docker、Unraid、fnOS FPK 请使用对应平台的容器、插件或应用管理器卸载。

## 数据目录

默认数据目录：

```text
/opt/msa
```

主要内容：

- `configs/mosdns`
- `configs/mihomo`
- `configs/network`
- `data/binaries`
- `logs`
- `database`
- `backups`

运行目录、端口和完整文件结构见 [运行参考](../reference/runtime.md)。
