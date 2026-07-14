package main

import (
	"os"
	"os/exec"
	"strings"
	"testing"
)

func TestDockerRunScriptHostTunDryRun(t *testing.T) {
	out, err := runDockerRunScriptDry(t, map[string]string{
		"MSA_DOCKER_NETWORK_MODE": "host-tun",
	})
	if err != nil {
		t.Fatalf("docker-run.sh host dry run failed: %v\n%s", err, out)
	}
	for _, want := range []string{
		"--network host",
		"--device /dev/net/tun:/dev/net/tun",
		"-e MSA_DOCKER_NETWORK_MODE=host-tun",
		"ghcr.io/leafss1022/msa:v0.4.1.0",
	} {
		if !strings.Contains(out, want) {
			t.Fatalf("host dry run missing %q:\n%s", want, out)
		}
	}
}

func TestDockerRunScriptMacvlanRequiresNetworkFields(t *testing.T) {
	out, err := runDockerRunScriptDry(t, map[string]string{
		"MSA_DOCKER_NETWORK_MODE": "macvlan-tun",
	})
	if err == nil {
		t.Fatalf("docker-run.sh macvlan dry run should fail without required fields:\n%s", out)
	}
	if !strings.Contains(out, "MSA_DOCKER_PARENT_IFACE is required") {
		t.Fatalf("macvlan validation should report missing parent iface:\n%s", out)
	}
}

func TestDockerRunScriptMacvlanDryRun(t *testing.T) {
	out, err := runDockerRunScriptDry(t, map[string]string{
		"MSA_DOCKER_NETWORK_MODE": "macvlan-tun",
		"MSA_DOCKER_PARENT_IFACE": "eth0",
		"MSA_DOCKER_SUBNET":       "192.168.1.0/24",
		"MSA_DOCKER_GATEWAY":      "192.168.1.1",
		"MSA_DOCKER_IPV4_ADDRESS": "192.168.1.10",
		"MSA_DOCKER_NETWORK_NAME": "msa-macvlan",
	})
	if err != nil {
		t.Fatalf("docker-run.sh macvlan dry run failed: %v\n%s", err, out)
	}
	for _, want := range []string{
		"docker network create -d macvlan --subnet 192.168.1.0/24 --gateway 192.168.1.1 -o parent=eth0 msa-macvlan",
		"--network msa-macvlan",
		"--ip 192.168.1.10",
		"-e MSA_DOCKER_NETWORK_MODE=macvlan-tun",
	} {
		if !strings.Contains(out, want) {
			t.Fatalf("macvlan dry run missing %q:\n%s", want, out)
		}
	}
}

func runDockerRunScriptDry(t *testing.T, env map[string]string) (string, error) {
	t.Helper()
	cmd := exec.Command("sh", "../../docker-run.sh")
	cmd.Env = append(os.Environ(),
		"MSA_DOCKER_DRY_RUN=true",
		"MSA_DOCKER_DATA_DIR="+t.TempDir(),
	)
	for key, value := range env {
		cmd.Env = append(cmd.Env, key+"="+value)
	}
	out, err := cmd.CombinedOutput()
	return string(out), err
}
