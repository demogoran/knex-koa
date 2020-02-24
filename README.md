# Description

Small POC for knex/koa arch

# Setup

`yarn && cd client && yarn`

then
`yarn dev`

Run one of commands to recreate tables from models(it could wipe all tabels and then create it again)
`yarn initdb`

# Comments

All controllers and models are autoloaded.

Babel used for controller-based routes(required for decorators)

All tabels has autoincrement id column and created/updated fields by default(nested from db/main.js)

Config for db is in the db/connection.js

Routes are supposed to work as aggregators: you could specify required fields for GET, POST and PUT could update only setted fields

Postgres is used as DB
