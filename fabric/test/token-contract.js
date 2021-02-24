/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { ChaincodeStub, ClientIdentity } = require('fabric-shim');
const { TokenContract } = require('..');
const winston = require('winston');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

class TestContext {

    constructor() {
        this.stub = sinon.createStubInstance(ChaincodeStub);
        this.clientIdentity = sinon.createStubInstance(ClientIdentity);
        this.logger = {
            getLogger: sinon.stub().returns(sinon.createStubInstance(winston.createLogger().constructor)),
            setLevel: sinon.stub(),
        };
    }

}

describe('TokenContract', () => {

    let contract;
    let ctx;

    beforeEach(() => {
        contract = new TokenContract();
        ctx = new TestContext();
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{"value":"token 1001 value"}'));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from('{"value":"token 1002 value"}'));
    });

    describe('#tokenExists', () => {

        it('should return true for a token', async () => {
            await contract.tokenExists(ctx, '1001').should.eventually.be.true;
        });

        it('should return false for a token that does not exist', async () => {
            await contract.tokenExists(ctx, '1003').should.eventually.be.false;
        });

    });

    describe('#createToken', () => {

        it('should create a token', async () => {
            await contract.createToken(ctx, '1003', 'token 1003 value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1003', Buffer.from('{"value":"token 1003 value"}'));
        });

        it('should throw an error for a token that already exists', async () => {
            await contract.createToken(ctx, '1001', 'myvalue').should.be.rejectedWith(/The token 1001 already exists/);
        });

    });

    describe('#readToken', () => {

        it('should return a token', async () => {
            await contract.readToken(ctx, '1001').should.eventually.deep.equal({ value: 'token 1001 value' });
        });

        it('should throw an error for a token that does not exist', async () => {
            await contract.readToken(ctx, '1003').should.be.rejectedWith(/The token 1003 does not exist/);
        });

    });

    describe('#updateToken', () => {

        it('should update a token', async () => {
            await contract.updateToken(ctx, '1001', 'token 1001 new value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"value":"token 1001 new value"}'));
        });

        it('should throw an error for a token that does not exist', async () => {
            await contract.updateToken(ctx, '1003', 'token 1003 new value').should.be.rejectedWith(/The token 1003 does not exist/);
        });

    });

    describe('#deleteToken', () => {

        it('should delete a token', async () => {
            await contract.deleteToken(ctx, '1001');
            ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
        });

        it('should throw an error for a token that does not exist', async () => {
            await contract.deleteToken(ctx, '1003').should.be.rejectedWith(/The token 1003 does not exist/);
        });

    });

});
