#!/bin/sh
set -e

# the named `vendor_data` volume starts empty on first run (it shadows the
# image's built-in vendor/ dir) — reinstall into it if autoload.php is missing
if [ ! -f "vendor/autoload.php" ]; then
    composer install --no-interaction --no-progress --no-security-blocking
fi

# hosts like Render assign a random port via $PORT and require the app to
# bind to it; default to 8000 for local `docker compose up` where $PORT
# isn't set. This only applies to the default `php artisan serve` CMD —
# other commands (e.g. an explicit shell) still run via exec "$@" below.
if [ "$1" = "php" ] && [ "$2" = "artisan" ] && [ "$3" = "serve" ]; then
    exec php artisan serve --host=0.0.0.0 --port="${PORT:-8000}"
fi

exec "$@"
