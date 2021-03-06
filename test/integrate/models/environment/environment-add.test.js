/* eslint-env node, mocha */
'use strict';


require('should');
const sqlite = require('sqlite');

const plantJournal = require('../../../../src/pj');

describe(`Environment()`, () => {
  describe(`#create()`, () => {
    let pj;

    beforeEach(async () => {
      pj = new plantJournal(':memory:');
      await pj.connect();
    });

    afterEach(async () => {
      pj.disconnect();
    });

    it(`should throw error if options.environmentName is not set`, async () => {
      await pj.Environment.add({environmentDescription: 'blubb'})
        .should.be.rejectedWith('options.environmentName has to be set');
    });

    it(`should throw error if options.environmentName is not a string`, async () => {
      await pj.Environment.add({environmentName: 1})
        .should.be.rejectedWith('options.environmentName has to be a string');
    });

    it(`should only create a new plant entry if options.genotypeId is set and return plant object with plant attributes + genotypeId`, async () => {
      let environment = await pj.Environment.add(
        {
          environmentName: 'Greenhouse #1',
          environmentDescription: 'Greenhouse in my garden.'
        }
      );

      let [createdAt, modifiedAt] = [
        environment.environments[1].environmentAddedAt,
        environment.environments[1].environmentModifiedAt
      ];

      environment.should.deepEqual({
        environments: {
          1: {
            environmentId: 1,
            environmentName: 'Greenhouse #1',
            environmentDescription: 'Greenhouse in my garden.',
            environmentMediums: [],
            environmentAddedAt: createdAt,
            environmentModifiedAt: modifiedAt,
          }
        }
      });

      let rowsEnvironments = await sqlite.all(
        `SELECT * FROM environments`
      );

      environment.environments[1].should
        .containDeep(rowsEnvironments[0]);
    });
  });
});
