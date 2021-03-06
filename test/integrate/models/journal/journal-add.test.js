/* eslint-env node, mocha */
'use strict';

const should = require('should');
const _ = require('lodash');
const sqlite = require('sqlite');

const plantJournal = require('../../../../src/pj');

describe(`Journal()`, () => {
  describe(`#create()`, () => {
    let pj;

    beforeEach(async () => {
      pj = new plantJournal(':memory:');
      await pj.connect();
      await pj.Environment.add({environmentName: 'testEnv1'});
      await pj.Medium.add({mediumName: 'testMed1', environmentId: 1});

      await pj.Family.add({familyName: 'testFam1'});
      await pj.Generation.add({generationName: 'testGen1', familyId: 1});
      await pj.Plant.add(
        {plantName: 'testPlant1', mediumId: 1, generationId: 1});
    });

    afterEach(async () => {
      pj.disconnect();
    });

    it(`should throw error if none of options.{plantId|mediumId|environmentId} is set`, async () => {
      await pj.Journal.add({})
        .should.be.rejectedWith('A journal has to be assigned to a plant, medium or environment. Therefore options.plantId,mediumId or environmentId has to be set');
    });

    it(`should throw error if more than one of options.{plantId|mediumId|environmentId} is set`, async () => {
      await pj.Journal.add({plantId:1, environmentId: 1})
        .should.be.rejectedWith(
          'Journal can only be assigned to a plant OR medium OR environment');
    });

    it(`should throw error if options.journalDatetime is not set`, async () => {
      await pj.Journal.add({plantId: 1})
        .should.be.rejectedWith('options.journalDatetime has to be set');
    });


    it(`should throw error if options.journalDatetime is not a integer`, async () => {
      await pj.Journal.add({plantId: 1, journalDatetime: '123'})
        .should.be.rejectedWith(
          'options.journalDatetime has to be an integer');
    });

    it(`should throw error if options.journalType is not set`, async () => {
      await pj.Journal.add({plantId: 1, journalDatetime: 1111})
        .should.be.rejectedWith('options.journalType has to be set');
    });

    it(`should throw error if options.journalType is not a string`, async () => {
      await pj.Journal.add(
        {plantId: 1, journalDatetime: 1111, journalType: 123})
        .should.be.rejectedWith('options.journalType has to be a string');
    });


    it(`should throw error if options.journalValue is not set`, async () => {
      await pj.Journal.add(
        {plantId: 1, journalDatetime: 1111, journalType: 'log'})
        .should.be.rejectedWith('options.journalValue has to be set');
    });

    it(`should create new journal record and return the journal object`, async () => {
      let journal = await pj.Journal.add(
        {
          plantId: 1, journalDatetime: 1111,
          journalType: 'log', journalValue: 'test test'
        }
      );

      let [createdAt, modifiedAt] = [
        journal.journals[1].journalAddedAt,
        journal.journals[1].journalModifiedAt
      ];

      journal.journals.should.deepEqual({
        1: {
          journalId: 1,
          journalDatetime: 1111,
          journalType: 'log',
          journalValue: 'test test',
          journalAddedAt: createdAt,
          journalModifiedAt: modifiedAt,
          plantId: 1
        }
      });

      let rowsJournals = await sqlite.all(
        `SELECT * FROM journals WHERE journalId = 1`
      );

      rowsJournals[0].should.containDeep(
        _.omit(journal.journals[1], 'journalValue'));
      rowsJournals[0].journalValue.should.eql(
        '"' + journal.journals[1].journalValue + '"');
      should(rowsJournals[0]['mediumId']).be.null();
      should(rowsJournals[0]['environmentId']).be.null();
    });

    it(`should be possible to insert a journal where journalValue is a boolean`, async () => {
      let journal = await pj.Journal.add(
        {
          plantId: 1, journalDatetime: 1111,
          journalType: 'log', journalValue: true
        }
      );

      journal.journals.should.containDeep({
        1: {
          journalId: 1,
          journalType: 'log',
          journalValue: true,
        }
      });

      let rowsJournals = await sqlite.all(
        `SELECT journalValue FROM journals WHERE journalId = 1`
      );

      rowsJournals[0].journalValue.should.eql('true');
    });

    it(`should be possible to pass journalValue as an object`, async () => {
      let journalValue = {foo: 'bar'};
      let journal = await pj.Journal.add(
        {
          plantId: 1,
          journalDatetime: 1111,
          journalType: 'watering',
          journalValue
        }
      );

      journal.journals.should.containDeep({
        1: {
          journalId: 1,
          journalType: 'watering',
          journalValue: {
            foo: 'bar'
          },
        }
      });
      let rowsJournals = await sqlite.all(
        `SELECT journalValue FROM journals WHERE journalId = 1`
      );

      rowsJournals[0].journalValue.should.eql(JSON.stringify(journalValue));
    });

    it(`should quote journalValue if we pass valid JSON as string`, async () => {
      let journalValue = '{"foo":"bar"}';
      let journal = await pj.Journal.add({
        plantId: 1,
        journalDatetime: 1111,
        journalType: 'test',
        journalValue
      });

      journal.journals.should.containDeep({
        1: {
          journalId: 1,
          journalType: 'test',
          journalValue: journalValue,
        }
      });
      let rowsJournals = await sqlite.all(`
        SELECT journalValue FROM journals WHERE journalId = 1`);

      rowsJournals[0].journalValue.should.eql(JSON.stringify(journalValue));
    });
  });
});
