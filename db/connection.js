import Knex from 'knex';

export default Knex({
    client: 'pg',
    connection: 'postgres://postgres:1q1Q1q1Q@localhost:5432/testapp'
});
