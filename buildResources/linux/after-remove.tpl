#!/bin/bash
set -e

if type update-alternatives >/dev/null 2>&1; then
  update-alternatives --remove '${executable}' '/opt/${sanitizedProductName}/${executable}' || true
else
  rm -f '/usr/bin/${executable}'
fi

profile_path='/etc/apparmor.d/${executable}'
if [ -f "${profile_path}" ]; then
  if command -v apparmor_parser >/dev/null 2>&1; then
    apparmor_parser -R "${profile_path}" || true
  fi
  rm -f "${profile_path}"
fi
