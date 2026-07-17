//go:build windows

package server

import "os/exec"

func setProcessGroup(cmd *exec.Cmd) {
	// Windows does not support Setpgid
}