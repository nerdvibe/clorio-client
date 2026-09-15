#!/usr/bin/env bash
set -euo pipefail

project_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
output_dir="${project_dir}/release/linux"

mkdir -p "${output_dir}"

for platform in linux/amd64 linux/arm64; do
  arch="${platform#linux/}"
  case "${arch}" in
    amd64) artifact_arch="x64" ;;
    arm64) artifact_arch="arm64" ;;
    *) echo "Unsupported Docker architecture: ${arch}" >&2; exit 1 ;;
  esac

  echo "Building Linux AppImage and deb for ${artifact_arch} (${platform})"
  docker buildx build \
    --platform "${platform}" \
    --file "${project_dir}/Dockerfile.linux" \
    --target artifacts \
    --output "type=local,dest=${output_dir}/${artifact_arch}" \
    "${project_dir}"
done

bash "${project_dir}/scripts/write-release-info.sh" \
  "${output_dir}" \
  "npm run compile:linux:docker" \
  "Docker Buildx; Node 22 Bookworm; native dependency rebuild per linux/amd64 and linux/arm64"

echo "Linux artifacts written to ${output_dir}"
