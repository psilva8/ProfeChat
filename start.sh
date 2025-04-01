#!/bin/bash
killall python3 || true
killall node || true
lsof -ti:3000-3010 | xargs kill -9 || true
lsof -ti:5336-5500 | xargs kill -9 || true
rm -f .flask-port
npm run dev
