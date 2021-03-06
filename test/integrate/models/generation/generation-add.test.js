/* eslint-env node, mocha */
'use strict';

require('should');
const CONSTANTS = require('../../../../src/constants');
const plantJournal = require('../../../../src/pj');
const sqlite = require('sqlite');

describe(`Generation()`, () => {
  describe(`#create()`, () => {
    let pj;

    beforeEach(async () => {
      pj = new plantJournal(':memory:');
      await pj.connect();
      await pj.Family.add({familyName: 'testName'});
    });

    after(async () => {await pj.disconnect();});

    it(`should throw error if options.familyId is not an integer`, async () => {
      await pj.Generation.add(
        {generationName: 'testGeneration2', familyId: '1'})
        .should.be.rejectedWith('options.familyId has to be an integer');
    });

    it(`should throw error if options.familyId is not set`, async () => {
      await pj.Generation.add(
        {generationName: 'testGeneration2'})
        .should.be.rejectedWith('options.familyId is not set. Missing familyId or attributes to create a new family.');
    });

    it(`should throw error if options.generationName is not set`, async () => {
      await pj.Generation.add({familyId: 1})
        .should.be.rejectedWith('options.generationName has to be set');
    });

    it(`should throw error if options.generationName is not a string`, async () => {
      await pj.Generation.add({familyId: 1, generationName: 1})
        .should.be.rejectedWith('options.generationName has to be a string');
    });

    it(`should throw error if generationParents is set but not an array`, async () => {
      await pj.Generation.add(
        {familyId: 1, generationName: 'test', generationParents: {}})
        .should.be.rejectedWith(
          'options.generationParents has to be an array of integers');
    });

    it(`should throw Error if familyId does not reference an entry in families`, async () => {
      await pj.Generation.add(
        {familyId: 1337, generationName: 'testGeneration3'})
        .should.be.rejectedWith(
          'options.familyId does not reference an existing Family');

      let result = await sqlite.all(`
        SELECT
          ${CONSTANTS.ATTR_ID_FAMILY},
          ${CONSTANTS.ATTR_ID_GENERATION},
          ${CONSTANTS.ATTR_NAME_GENERATION}
        FROM ${CONSTANTS.TABLE_GENERATION}
        WHERE ${CONSTANTS.ATTR_NAME_GENERATION} = "testGeneration3"`);

      result.should.deepEqual([]);
    });

    it(`should throw error if options is not set or not an associative array`, async () => {
      let tested = 0;
      let values = [[1,2], null, 'string', 1, true, undefined];

      for (let value in values) {
        await pj.Generation.add(value).should.be.rejectedWith(
          'First argument has to be an associative array');
        tested++;
      }
      tested.should.eql(6);
    });

    it(`should create a new generations entry and return generation object`, async () => {
      let generation = await pj.Generation.add(
        {
          familyId: 1,
          generationName: 'testGeneration',
          generationDescription: 'test description'
        }
      );

      let [createdAt, modifiedAt] = [
        generation.generations[1].generationAddedAt,
        generation.generations[1].generationModifiedAt];

      createdAt.should.eql(modifiedAt);
      generation.should.deepEqual({
        generations: {
          1: {
            generationId: 1,
            generationDescription: 'test description',
            generationName: 'testGeneration',
            generationParents: [],
            generationGenotypes: [],
            familyId: 1,
            generationAddedAt: createdAt,
            generationModifiedAt: modifiedAt
          }
        }
      });

      let rows = await sqlite.all(`
        SELECT
          ${CONSTANTS.ATTR_ID_GENERATION},
          ${CONSTANTS.ATTR_DESCRIPTION_GENERATION},
          ${CONSTANTS.ATTR_NAME_GENERATION},
          ${CONSTANTS.ATTR_ID_FAMILY},
          ${CONSTANTS.ATTR_ADDED_AT_GENERATION},
          ${CONSTANTS.ATTR_MODIFIED_AT_GENERATION}
        FROM ${CONSTANTS.TABLE_GENERATION}`);
      generation.generations[1].should.containDeep(rows[0]);
    });

    it(`should set generationDescription = '' if generationDescription is not defined`, async () => {
      let generation = await pj.Generation.add({
        familyId: 1,
        generationName: 'testGeneration'
      });

      generation.generations[1].should.containDeep({
        generationId: 1,
        generationDescription: '',
      });

      let rows = await sqlite.all(`
        SELECT
          ${CONSTANTS.ATTR_ID_GENERATION},
          ${CONSTANTS.ATTR_DESCRIPTION_GENERATION}
        FROM ${CONSTANTS.TABLE_GENERATION}
        WHERE ${CONSTANTS.ATTR_ID_GENERATION} = 1`);
      generation.generations[1].should.containDeep(rows[0]);
    });

    it(`should be possible to create a generation and family in one request`, async () => {
      let generation = await pj.Generation.add({
        generationName: 'F1',
        familyName: 'Haze X Haze'
      });

      let createdAt = generation
        .generations[1][CONSTANTS.ATTR_ADDED_AT_GENERATION];

      generation.should.deepEqual({
        generations: {
          1: {
            generationId: 1,
            generationDescription: '',
            generationName: 'F1',
            generationAddedAt: createdAt,
            generationModifiedAt: createdAt,
            generationGenotypes: [],
            generationParents: [],
            familyId: 2
          }
        },
        families: {
          2: {
            familyId: 2,
            familyName: 'Haze X Haze',
            familyDescription: '',
            familyGenerations: [1],
            familyAddedAt: createdAt,
            familyModifiedAt: createdAt
          }
        }
      });
    });

  });

  describe(`#create() (with options.generationParents)`, () => {
    let pj;

    before(async () => {
      pj = new plantJournal(':memory:');
      await pj.connect();
      await pj.Family.add({familyName: 'testName'});
      await pj.Generation.add({familyId: 1, generationName: 'F1'});
      await pj.Plant.add({generationId: 1, plantName: 'testPlant1'});
      await pj.Plant.add({generationId: 1, plantName: 'testPlant2'});
    });

    after(async () => {
      await pj.disconnect();
    });

    it(`should also add parents if options.generationParents is specified`, async () => {
      let generation = await pj.Generation.add(
        {
          familyId: 1,
          generationName: 'testWithParents',
          generationParents: [1,2]
        }
      );
      let [createdAt, modifiedAt] = [
        generation.generations[2].generationAddedAt,
        generation.generations[2].generationModifiedAt];

      generation.should.deepEqual({
        generations: {
          2: {
            generationId: 2,
            generationDescription: '',
            generationName: 'testWithParents',
            generationParents: [1,2],
            generationGenotypes: [],
            generationAddedAt: createdAt,
            generationModifiedAt: modifiedAt,
            familyId: 1
          }
        }
      });
      let rows = await sqlite.all('SELECT * FROM generation_parents');

      rows.should.deepEqual([
        {parentId: 1, generationId: 2, plantId: 1},
        {parentId: 2, generationId: 2, plantId: 2}
      ]);
    });

    it(`should throw error if options.generationParents does not reference existing plants and not add generation`, async () => {
      await pj.Generation.add(
        {
          familyId: 1,
          generationName: 'testWithParents2',
          generationParents: [1, 42]
        }
      ).should.be.rejectedWith('options.generationParents contains at least one plantId which does not reference an existing plant');

      let rowsGen = await sqlite.all(`
        SELECT
          ${CONSTANTS.ATTR_ID_GENERATION},
          ${CONSTANTS.ATTR_NAME_GENERATION}
        FROM ${CONSTANTS.TABLE_GENERATION}
        WHERE ${CONSTANTS.ATTR_NAME_GENERATION} = "testWithParents2"`);
      rowsGen.should.deepEqual([]);
    });
  });
});
