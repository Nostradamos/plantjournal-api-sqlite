const should = require('should');
const plantJournal = require('../lib/pj');
const sqlite = require('sqlite');

describe('Family()', function() {

    describe('#create()', function() {
      let pj;

      beforeEach(async function() {
        pj = new plantJournal(':memory:');
        await pj.connect();
      });

      it('should create a new Family and return family object', async function() {
        let family = await pj.Family.create({familyName: 'testName'});
        family.should.deepEqual(
          {
            families: {
              1: {
                familyId: 1,
                familyName: 'testName'
              }
            }
          }
        );
        let rows = await sqlite.all('SELECT familyId, familyName FROM families');
        rows.should.deepEqual([{'familyId': 1, 'familyName': 'testName'}]);
      });

      it('should throw `Missing options.familyName` error if no options.familyName is provided', async function() {
        let catched = false;
        try {
          await pj.Family.create({});
        } catch (err) {
          catched = true;
          err.message.should.equal('Missing options.familyName');
        }
        catched.should.be.true();
      });

      afterEach(async function() {
        await pj.disconnect();
      });
    });

    describe('#get()', function() {
      let pj;

      before(async function() {
        pj = new plantJournal(':memory:');
        await pj.connect();
        await pj.Family.create({familyName: 'test1'});
        await pj.Family.create({familyName: 'testB'});
        await pj.Family.create({familyName: 'test3'});
        await pj.Family.create({familyName: 'testD'});
      });

      it('should return all families', async function() {
        let families = await pj.Family.get();
        families.should.deepEqual({
          families: {
            '1': { familyId: 1, familyName: 'test1' },
            '2': { familyId: 2, familyName: 'testB' },
            '3': { familyId: 3, familyName: 'test3' },
            '4': { familyId: 4, familyName: 'testD' }
          }
        });
      });

      it('should only return the first two families if options.limit=2', async function() {
        let families = await pj.Family.get({limit: 2});
        families.should.deepEqual({
          families: {
            '1': { familyId: 1, familyName: 'test1' },
            '2': { familyId: 2, familyName: 'testB' }
          }
        });
      });

      it('should only return the the last two families if options.offset=2 and options.limit=2', async function() {
        let families = await pj.Family.get({offset: 2, limit: 2});
        families.should.deepEqual({
          families: {
            '3': { familyId: 3, familyName: 'test3' },
            '4': { familyId: 4, familyName: 'testD' }
          }
        });
      });

      // ToDo: Improve fields, change this test
      /*it('should only return fields specified in options.fields', async function() {
        let families = await pj.Family.get({fields: ['familyName']});
        families.should.deepEqual({
          families: {
            '1': { familyName: 'test1' },
            '2': { familyName: 'testB' },
            '3': { familyName: 'test3' },
            '4': { familyName: 'testD' }
          }
        })
      });*/

      it('should only return families where options.where.ALLOWEDATTRIBUTENAME = SOMEINTEGER matches extactly', async function() {
        let families = await pj.Family.get(
          {
            where : {
              'familyId': 3
            }
          }
        );
        families.should.deepEqual({
          families: {
            '3': { familyId: 3, familyName: 'test3' }
          }
        });
      });

      it('should only return families where options.where.ALLOWEDATTRIBUTENAME = SOMESTRING matches extactly', async function() {
        let families = await pj.Family.get(
          {
            where : {
              'familyName': 'testD'
            }
          }
        );
        families.should.deepEqual({
          families: {
            '4': { familyId: 4, familyName: 'testD' }
          }
        });
      });

      after(async function() {
        await pj.disconnect();
      })
    });
});
