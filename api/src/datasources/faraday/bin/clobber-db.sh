#!/usr/bin/env bash

PGDATABASE=faraday
PGHOST=localhost
PGUSER=faraday

echo Dropping $PGDATABASE
dropdb --host=$PGHOST --user=$PGUSER $PGDATABASE

echo Creating $PGDATABASE
createdb --host=$PGHOST --user=$PGUSER --owner=$PGUSER $PGDATABASE

echo Complete
