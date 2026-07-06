# msa Unraid Plugin

This directory builds the Unraid plugin artifacts for `msa`.

Generated files:

- `dist/unraid/msa.plg`
- `dist/unraid/msa-<version>-x86_64-1.txz`
- `msa.plg`

Build:

```bash
make unraid VERSION=0.3.7 UNRAID_VERSION=0.3.7 GITHUB_REPO=leafss1022/msa RELEASE_TAG=v0.3.7
```

Publish the generated `.txz` package and `.plg` file to the GitHub release named by `RELEASE_TAG`, then commit the generated root `msa.plg` when you want a branch-based install URL.

Example:

```bash
gh release create v0.3.7 \
  dist/unraid/msa-0.3.7-x86_64-1.txz \
  dist/unraid/msa.plg \
  dist/msa-linux-amd64.tar.gz \
  dist/msa-linux-amd64.tar.gz.sha256 \
  dist/msa-linux-arm64.tar.gz \
  dist/msa-linux-arm64.tar.gz.sha256 \
  --title "v0.3.7" \
  --notes-file /tmp/msa-v0.3.7-release-notes.md
```

Recommended install URL for the v0.3.7 release:

```text
https://github.com/leafss1022/msa/releases/download/v0.3.7/msa.plg
```

Branch install URL, only after the generated root `msa.plg` has been committed to that branch:

```text
https://raw.githubusercontent.com/leafss1022/msa/<branch>/msa.plg
```

## Runtime Behavior

- The plugin installs the `msa` binary into `/usr/local/emhttp/plugins/msa/bin/msa`.
- The plugin registers the compatibility command `/usr/local/bin/msa`.
- The WebGUI control script is `/etc/rc.d/rc.msa`.
- Persistent config is `/boot/config/plugins/msa/msa.cfg`.
- Persistent application data defaults to `/mnt/user/appdata/msa`.
- The Utilities page entry opens a lightweight Unraid plugin control page only: enablement, listen host/port, data directory, status, and Open WebUI.
- The full management interface runs in the separate msa WebUI.
- On a fresh install, before setup exists, the plugin starts only the `msa` management WebUI. After setup is completed, `msa` restores enabled Mihomo, MosDNS and nftables state on subsequent starts.
- If the data directory is under `/mnt/user`, the rc script waits until the array user share path is available.
- Online MosDNS, Mihomo, and Zashboard downloads must verify the SHA-256 digest supplied by the GitHub Release API asset before install. Local uploads are user-supplied and are marked as `local-upload`.

The MosDNS, Mihomo, and nftables behavior is controlled by `msa` itself after the user completes the setup wizard or changes service/network state in the WebUI.

## Stop and Uninstall

Stop the Unraid service without removing files:

```bash
/etc/rc.d/rc.msa stop
msa stop --config /mnt/user/appdata/msa
```

Restart it:

```bash
/etc/rc.d/rc.msa restart
msa restart --config /mnt/user/appdata/msa
```

Useful CLI commands:

```bash
msa status --config /mnt/user/appdata/msa
msa logs --config /mnt/user/appdata/msa --lines 200 mosdns
msa logs --config /mnt/user/appdata/msa --lines 200 mihomo
msa doctor --config /mnt/user/appdata/msa
msa license status
```

Do not use `msa update` or `msa uninstall` on Unraid. Updates and removal must go through the Unraid plugin manager so the `.plg` package state stays consistent.

Remove the plugin from the Unraid WebGUI plugin page. The plugin remove hook stops the rc service and removes the package files, but it keeps the application data directory by default:

```text
/mnt/user/appdata/msa
```

Delete that directory manually only when you want to remove all configuration, database, logs, downloaded components, and backups.
