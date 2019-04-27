#!/usr/bin/env bash

ts-node    ./src/tools/generate-entities.ts \
    --schema=./src/tools/model-schema.yaml \
    --out-dir=./src/relational \
    --sub-dirs \
    ./src/relational/models.yaml 
