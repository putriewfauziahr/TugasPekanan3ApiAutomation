import request from 'supertest'; 
import { expect } from 'chai'; 

const baseUrl = 'https://kasir-api.zelz.my.id';

describe('CRUD User', function() {
    let accessLogin;
    let idUser;
    let nameUser;

    before(async function() {
        const response = await request(baseUrl)
        .post('/authentications')
        .send({
            email: 'store.good@mail.com',
            password: '123testing@'
        });

        expect(response.status).to.equal(201);
        expect(response.body.data).to.have.property('accessToken');
        accessLogin = response.body.data.accessToken;
    });



    it('Create New User - Validate Status Code, Status Body, Message Body and User Id', async function() {
        const response = await request(baseUrl)
            .post('/users')
            .set('Authorization', `Bearer ${accessLogin}`)
            .send({
                name: 'Tomyam Seafood',
                email: 'tomyam.seafood@mailinator.com',
                password: 'password123'
            });

        expect(response.status).to.equal(201);
        expect(response.body.status).to.equal('success');
        expect(response.body.message).to.equal('User berhasil ditambahkan');
        expect(response.body.data).to.have.property('userId');
        idUser = response.body.data.userId;
        nameUser = response.body.data.name;
    });



    it('View Specific User - Validate Status Code, Status Body, User Id and User email', async function() {
        const response = await request(baseUrl)
            .get(`/users/${idUser}`)
            .set('Authorization', `Bearer ${accessLogin}`)

        expect(response.status).to.equal(200);
        expect(response.body.status).to.equal('success');
        expect(response.body.data.user).to.have.property('id');
        expect(response.body.data.user).to.have.property('email');
        expect(response.body.data.user.name).to.equal(`${nameUser}`);
    });



    it('View List User - Validate Status Code and Status Body', async function() {
        const response = await request(baseUrl)
            .get('/users')
            .set('Authorization', `Bearer ${accessLogin}`)

        expect(response.status).to.equal(200);
        expect(response.body.status).to.equal('success');
    });



    it('Update Specific User - Validate Status Code, Status Body, Message Body and User Name', async function() {
        const response = await request(baseUrl)
            .put(`/users/${idUser}`)
            .set('Authorization', `Bearer ${accessLogin}`)
            .send({
                name: 'Chicken Katsu',
                email: 'chiken.katsu@mailinator.com',
            });

        expect(response.status).to.equal(200);
        expect(response.body.status).to.equal('success');
        expect(response.body.message).to.equal('User berhasil diupdate');
        expect(response.body.data.name).to.equal('Chicken Katsu');
    });



    it('Delete Specific User - Validate Status Code, Status Body and Message Body', async function() {
        const response = await request(baseUrl)
            .delete(`/users/${idUser}`)
            .set('Authorization', `Bearer ${accessLogin}`)

        expect(response.status).to.equal(200);
        expect(response.body.status).to.equal('success');
        expect(response.body.message).to.equal('User berhasil dihapus');
    });

});
