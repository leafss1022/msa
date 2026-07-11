# msa Linux 安装包

这个压缩包包含 `msa` Linux 二进制、systemd 安装脚本和卸载脚本。请下载与机器架构匹配的压缩包，例如 `linux-amd64` 或 `linux-arm64`。

## 安装

```sh
tar -xzf msa-linux-<arch>.tar.gz
cd msa-*-linux-<arch>
sudo ./install.sh
```

默认路径：

- 二进制：`/usr/local/bin/msa`
- 兼容命令：`/usr/local/bin/msm`
- 数据目录：`/opt/msa`
- WebUI：`http://<server-ip>:7777`
- systemd 服务：`msa`

自定义安装：

```sh
sudo ./install.sh --data-dir /opt/msa --host 0.0.0.0 --port 7777
```

## 停止

systemd 停止：

```sh
sudo systemctl stop msa
```

也可以直接使用二进制命令：

```sh
sudo msa stop
```

`stop` 会优雅停止 `msa` 管理进程，并由管理进程停止托管的 MosDNS 和 Mihomo 子进程。超时仍未退出时可以使用：

```sh
sudo msa stop --timeout 20s --force
```

常用 CLI：

```sh
msa status
msa restart
msa logs msa
msa logs --lines 200 mosdns
msa logs --lines 200 mihomo
msa doctor
msa license status
sudo msa update
```

## 升级

重新运行新版本安装包中的安装脚本即可。安装脚本会覆盖二进制并重启服务，但保留现有数据目录。

```sh
sudo ./install.sh
```

## 卸载

推荐直接使用二进制自带卸载命令：

```sh
sudo msa uninstall
```

`msa uninstall` 只面向 Linux tarball/systemd 安装。Docker、Unraid、fnOS FPK 请使用对应平台的容器、插件或应用管理器卸载。

也可以使用压缩包内的卸载脚本：

```sh
sudo ./uninstall.sh
```

交互式终端会询问是否删除 `/opt/msa` 数据目录；非交互环境默认保留数据。如需彻底删除数据目录、配置、数据库、日志、组件二进制和 zashboard：

```sh
sudo msa uninstall --purge --yes
sudo ./uninstall.sh --purge --yes
```

## 校验

```sh
sha256sum -c SHA256SUMS
systemctl status msa
```
