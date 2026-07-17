package server

import "syscall"

func diskUsage(path string) map[string]any {
	var stat syscall.Statfs_t
	if err := syscall.Statfs(path, &stat); err != nil {
		return map[string]any{"ok": false, "error": err.Error()}
	}
	total := stat.Blocks * uint64(stat.Bsize)
	available := stat.Bavail * uint64(stat.Bsize)
	used := total - available
	percent := float64(0)
	if total > 0 {
		percent = float64(used) / float64(total) * 100
	}
	return map[string]any{
		"ok":        true,
		"total":     int64(total),
		"used":      int64(used),
		"available": int64(available),
		"percent":   percent,
		"path":      path,
	}
}