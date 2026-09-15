#!/bin/bash
set -e

if type update-alternatives >/dev/null 2>&1; then
  if [ -L '/usr/bin/${executable}' ] && [ -e '/usr/bin/${executable}' ] && [ "$(readlink '/usr/bin/${executable}')" != '/etc/alternatives/${executable}' ]; then
    rm -f '/usr/bin/${executable}'
  fi
  update-alternatives --install '/usr/bin/${executable}' '${executable}' '/opt/${sanitizedProductName}/${executable}' 100 || \
    ln -sf '/opt/${sanitizedProductName}/${executable}' '/usr/bin/${executable}'
else
  ln -sf '/opt/${sanitizedProductName}/${executable}' '/usr/bin/${executable}'
fi

# Chromium's setuid helper is the fallback when unprivileged user namespaces
# are unavailable. Never silently launch the wallet with --no-sandbox.
chown root:root '/opt/${sanitizedProductName}/chrome-sandbox'
chmod 4755 '/opt/${sanitizedProductName}/chrome-sandbox'

# Ubuntu 24.04+ restricts user namespaces for unconfined applications. Giving
# the installed executable an AppArmor identity lets Chromium retain its sandbox.
if [ -d /etc/apparmor.d ]; then
  profile_path='/etc/apparmor.d/${executable}'
  printf '%s\n' \
    'abi <abi/4.0>,' \
    'include <tunables/global>' \
    'profile ${executable} "/opt/${sanitizedProductName}/${executable}" flags=(unconfined) {' \
    '  userns,' \
    '  include if exists <local/${executable}>' \
    '}' > "${profile_path}"
  if command -v apparmor_parser >/dev/null 2>&1; then
    # Older AppArmor releases do not understand the userns rule and do not
    # need this Ubuntu 24.04-specific profile. Avoid leaving an invalid policy.
    apparmor_parser -r "${profile_path}" || rm -f "${profile_path}"
  fi
fi

if command -v update-mime-database >/dev/null 2>&1; then
  update-mime-database /usr/share/mime || true
fi

if command -v update-desktop-database >/dev/null 2>&1; then
  update-desktop-database /usr/share/applications || true
fi
