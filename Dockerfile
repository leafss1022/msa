# syntax=docker/dockerfile:1

FROM --platform=$BUILDPLATFORM node:24-bookworm-slim AS web-build
WORKDIR /src

COPY web/package*.json ./web/
RUN cd web && npm ci

COPY web ./web
COPY internal/server/web ./internal/server/web
RUN cd web && npm run build

FROM --platform=$BUILDPLATFORM golang:1.24-bookworm AS go-build
WORKDIR /src

ARG TARGETOS
ARG TARGETARCH
ARG VERSION=0.1.0-dev

COPY go.mod go.sum ./
RUN go mod download

COPY . .
COPY --from=web-build /src/internal/server/web/dist ./internal/server/web/dist
RUN CGO_ENABLED=0 GOOS=${TARGETOS:-linux} GOARCH=${TARGETARCH:-amd64} go build -trimpath -ldflags "-s -w -X main.version=${VERSION}" -o /out/msa ./cmd/msa

FROM debian:12-slim AS runtime

RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates iproute2 nftables curl tar unzip gzip \
  && rm -rf /var/lib/apt/lists/*

ENV MSA_DATA_DIR=/opt/msa \
    MSA_RUNTIME=docker \
    MSA_DOCKER_NETWORK_MODE=host-tun \
    MSA_DOCKER_CLEANUP_NETWORK_ON_EXIT=false

COPY --from=go-build /out/msa /usr/local/bin/msa

RUN mkdir -p /opt/msa
VOLUME ["/opt/msa"]

EXPOSE 7777 53/tcp 53/udp 7890 7891 7892 9090 9099
STOPSIGNAL SIGTERM

ENTRYPOINT ["/usr/local/bin/msa"]
CMD ["serve", "--config", "/opt/msa", "--host", "0.0.0.0", "--port", "7777"]
