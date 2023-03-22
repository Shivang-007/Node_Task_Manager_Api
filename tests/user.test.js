const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const { userOneId, userOne, setupDatabase } = require('../tests/fixtures/db')

beforeEach(setupDatabase)


test('should signup a new user', async () => {
    const response = await request(app).post('/users').send({
        name: 'shivang',
        email: 'shivang@gmail.com',
        password: 'shivang@123'
    }).expect(201)

    //assert that database was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    //assertion about response
    expect(response.body.user.name).toBe('shivang')

    expect(response.body.user.password).not.toBe('shivang@123')
})

test('should login existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)
    const user = await User.findById(userOneId)
    expect(response.body.token).toBe(user.tokens[1].token)

})


test('should not login non-existing user', async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: 'thisismypassword'
    }).expect(400)
})

test('should get profile authenticated user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('should not get profile for unauthenticated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('should delete profile of authenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

test('should not delete profile of unauthenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('should update valid user fields', async () => {
    await request(app)
        .put('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            "name": "mehul"
        })
        .expect(200)
    const user = await User.findById(userOneId)
    expect(user.name).toEqual('mehul')
})

test('should not update valid user fields', async () => {
    await request(app)
        .put('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            "location": "India"
        })
        .expect(400)
})

// test('should upload avatar image',async () => {
//     await request(app)
//     .post('/users/me/avatar')
//     .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
//     .attach('avatar','tests/fixtures/1920x1080.png')
//     .expect(200)

//     const user = await User.findById(userOneId)
//     expect(user.avatar).toEqual(expect.any(Buffer))
// })