import {Account, AccountApi, Configuration, followLocationHeaderInterceptor, apiKey} from "../src";
import {expect} from 'chai';
import globalAxios from "axios";

describe('Account Api', () => {

    let accountApi: AccountApi;
    let account: Account;
    let externalKey: string;

    before(() => {

        const axios = globalAxios.create();
        axios.interceptors.response.use(followLocationHeaderInterceptor)

        var config = new Configuration({
            username: 'admin',
            password: 'password',
            apiKey: apiKey('bob', 'lazar'),
            basePath: 'http://127.0.0.1:8080'
        });

        accountApi = new AccountApi(config, null, axios);
        externalKey = new Date().getTime().toString();

    });

    it('should create account', (done) => {
        account = {name: `Test Account ${externalKey}`, externalKey: externalKey};
        accountApi.createAccount(account, 'created-by')
            .then(result => {
                account = result.data;
                expect(account.externalKey).equals(externalKey);
                done();
            })
            .catch(error => done(error));
    });

    it('should get account by id', (done) => {
        accountApi.getAccount(account.accountId)
            .then(result => {
                let a = result.data;
                expect(a.accountId).equals(account.accountId);
                expect(a.externalKey).equals(externalKey);
                done();
            })
            .catch(error => done(error))
    });

    it('should update account', (done) => {
        account.name = `${account.name} updated!`
        accountApi.updateAccount(account, account.accountId, 'created-by')
            .then(result => {
                expect(result.status).equals(204);
                done();
            })
            .catch(error => done(error));
    });

    it('should search accounts', (done) => {
        accountApi.searchAccounts(externalKey)
            .then(result => {
                expect(result.data.length).greaterThan(0);
                done();
            })
            .catch(error => done(error));
    });

});