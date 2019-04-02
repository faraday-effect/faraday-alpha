#!/usr/bin/env bash

dropdb --host=localhost --user=faraday faraday
createdb --host=localhost --user=faraday --owner=faraday faraday
