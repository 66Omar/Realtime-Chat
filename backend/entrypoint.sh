#!/bin/sh

npx drizzle-kit migrate

npm run build

npm run seed

exec "$@"