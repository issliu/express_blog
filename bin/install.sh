#!/usr/bin/env bash
npm install
npm install -g pm2
pm2 start ./bin/www
