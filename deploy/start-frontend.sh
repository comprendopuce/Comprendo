#!/bin/sh
# Next.js standalone — hereda el entorno de Render; solo fija puerto/host internos.
cd /app/frontend
export PORT=3000
export HOSTNAME=0.0.0.0
export NODE_ENV=production
exec node server.js
