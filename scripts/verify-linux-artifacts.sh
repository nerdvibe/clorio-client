#!/usr/bin/env bash
set -euo pipefail

artifact_root="${1:-release/linux}"

if [[ ! -d "${artifact_root}" ]]; then
  echo "Artifact directory does not exist: ${artifact_root}" >&2
  exit 1
fi
artifact_root="$(cd "${artifact_root}" && pwd)"

mapfile_compat() {
  local pattern="$1"
  find "${artifact_root}" -type f -name "${pattern}" -print | sort
}

appimages="$(mapfile_compat '*.AppImage')"
debs="$(mapfile_compat '*.deb')"

[[ -n "${appimages}" ]] || { echo "No AppImage artifacts found" >&2; exit 1; }
[[ -n "${debs}" ]] || { echo "No deb artifacts found" >&2; exit 1; }

verify_arch() {
  local path="$1"
  local expected="$2"
  local description="$3"
  local detected

  detected="$(file -b "${path}")"
  case "${expected}" in
    x64) [[ "${detected}" == *"x86-64"* ]] ;;
    arm64) [[ "${detected}" == *"ARM aarch64"* ]] ;;
  esac || {
    echo "Wrong architecture for ${description}: ${detected}" >&2
    exit 1
  }
}

while IFS= read -r appimage; do
  [[ -x "${appimage}" ]] || chmod +x "${appimage}"
  case "${appimage}" in
    *-x64.AppImage|*-x86_64.AppImage) expected="x64" ;;
    *-arm64.AppImage) expected="arm64" ;;
    *) echo "Architecture missing from AppImage name: ${appimage}" >&2; exit 1 ;;
  esac
  verify_arch "${appimage}" "${expected}" "${appimage}"

  case "${expected}" in
    x64) unpacked_dir="${artifact_root}/linux-unpacked" ;;
    arm64) unpacked_dir="${artifact_root}/linux-arm64-unpacked" ;;
  esac
  payload="${unpacked_dir}/clorio-wallet"
  sandbox_helper="${unpacked_dir}/chrome-sandbox"
  preload="${unpacked_dir}/resources/app.asar"
  [[ -f "${payload}" ]] || { echo "Missing AppImage payload" >&2; exit 1; }
  [[ -f "${sandbox_helper}" ]] || { echo "Missing Chromium sandbox helper" >&2; exit 1; }
  [[ -f "${preload}" ]] || { echo "Missing packaged application archive" >&2; exit 1; }
  verify_arch "${payload}" "${expected}" "AppImage payload"
  echo "Verified ${appimage} (${expected})"
done <<< "${appimages}"

while IFS= read -r deb; do
  case "${deb}" in
    *-x64.deb|*-amd64.deb) expected="amd64" ;;
    *-arm64.deb) expected="arm64" ;;
    *) echo "Architecture missing from deb name: ${deb}" >&2; exit 1 ;;
  esac

  actual="$(dpkg-deb --field "${deb}" Architecture)"
  [[ "${actual}" == "${expected}" ]] || {
    echo "Wrong deb architecture for ${deb}: ${actual}, expected ${expected}" >&2
    exit 1
  }

  control_dir="$(mktemp -d)"
  dpkg-deb --control "${deb}" "${control_dir}"
  grep -q "chmod 4755.*/chrome-sandbox" "${control_dir}/postinst"
  grep -q "userns," "${control_dir}/postinst"
  rm -rf "${control_dir}"
  echo "Verified ${deb} (${actual}, SUID sandbox + AppArmor install hooks)"
done <<< "${debs}"
