#!/usr/bin/sh

mkdir bin
deno compile --output bin/srscene --allow-net main.ts
