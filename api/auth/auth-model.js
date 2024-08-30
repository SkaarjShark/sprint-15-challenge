const db = require('../../data/dbConfig')

function find() {
    return db('users').select('id', 'username')
}
  
function findBy(filter) {
    return db('users').where(filter)
}

async function add(newUser) {
    const [id] = await db('users').insert(newUser)

    return findById(id)
}

module.exports = {
    find,
    findBy,
    add
}