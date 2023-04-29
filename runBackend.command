#!/bin/bash

cd ground
export NODE_OPTIONS=--openssl-legacy-provider
cd telemetry
npm run start