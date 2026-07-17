//go:build windows

package cloudflareredirect

import "os/exec"

func setProcessGroup(cmd *exec.Cmd) {
	// Windows does not support Setpgid
}