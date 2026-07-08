#!/bin/sh
set -e

# the named `vendor_data` volume starts empty on first run (it shadows the
# image's built-in vendor/ dir) — reinstall into it if autoload.php is missing
if [ ! -f "vendor/autoload.php" ]; then
    composer install --no-interaction --no-progress --no-security-blocking
fi

exec "$@"
