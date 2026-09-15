#!/usr/bin/env bash
set -euo pipefail

if [[ "$#" -ne 3 ]]; then
  echo "Usage: $0 <release-directory> <build-command> <build-method>" >&2
  exit 1
fi

release_dir="$1"
build_command="$2"
build_method="$3"
project_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

mkdir -p "${release_dir}"
release_dir="$(cd "${release_dir}" && pwd)"
info_file="${release_dir}/BUILD-INFO.txt"
temp_file="$(mktemp)"

cleanup() {
  rm -f "${temp_file}"
}
trap cleanup EXIT

{
  echo "Clorio Wallet release"
  echo "Version: $(cd "${project_dir}" && node -p "require('./package.json').version")"
  echo "Generated (UTC): $(date -u '+%Y-%m-%dT%H:%M:%SZ')"
  echo "Build command: ${build_command}"
  echo "Build method: ${build_method}"
  echo "Build host: $(uname -srm)"
  echo
  echo "SHA-256:"
  find "${release_dir}" -type f \( \
      -name '*.dmg' -o \
      -name '*.zip' -o \
      -name '*.AppImage' -o \
      -name '*.deb' -o \
      -name '*.blockmap' \
    \) -print \
    | LC_ALL=C sort \
    | while IFS= read -r artifact; do
        checksum="$(shasum -a 256 "${artifact}" | awk '{print $1}')"
        relative_path="${artifact#"${release_dir}/"}"
        echo "${checksum}  ${relative_path}"
      done
} > "${temp_file}"

mv "${temp_file}" "${info_file}"
trap - EXIT
echo "Release information written to ${info_file}"
