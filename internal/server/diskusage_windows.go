//go:build !linux

package server

func diskUsage(path string) map[string]any {
	return map[string]any{"ok": false, "error": "disk usage not available on this platform"}
}