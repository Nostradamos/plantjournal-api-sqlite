'use strict';

const _ = require('lodash');
const zealit = require('zealit');

/**
 * @namespace CONSTANTS
 * @private
 */

// Zealit uses es6 proxies to throw an error if we try to read
// an undefined property from CONSTANTS
// @ToDo: only do this when running tests?!
const CONSTANTS = zealit({});

// Table names for database.
CONSTANTS.TABLE_FAMILY = 'families';
CONSTANTS.TABLE_GENERATION = 'generations';
CONSTANTS.TABLE_GENERATION_PARENT = 'generation_parents';
CONSTANTS.TABLE_GENOTYPE = 'genotypes';
CONSTANTS.TABLE_PLANT = 'plants';
CONSTANTS.TABLE_ENVIRONMENT = 'environments';
CONSTANTS.TABLE_MEDIUM = 'mediums';
CONSTANTS.TABLE_JOURNAL = 'journals';
CONSTANTS.TABLE_ATTACHMENT = 'attachments';

CONSTANTS.PLURAL_FAMILY = 'families';
CONSTANTS.PLURAL_GENERATION = 'generations';
CONSTANTS.PLURAL_GENOTYPE = 'genotypes';
CONSTANTS.PLURAL_PLANT = 'plants';
CONSTANTS.PLURAL_ENVIRONMENT = 'environments';
CONSTANTS.PLURAL_MEDIUM = 'mediums';
CONSTANTS.PLURAL_JOURNAL = 'journals';
CONSTANTS.PLURAL_ATTACHMENT = 'attachments';

CONSTANTS.ATTR_ID_FAMILY = 'familyId';
CONSTANTS.ATTR_NAME_FAMILY = 'familyName';
CONSTANTS.ATTR_DESCRIPTION_FAMILY = 'familyDescription';
CONSTANTS.ATTR_GENERATIONS_FAMILY = 'familyGenerations';
CONSTANTS.ATTR_ADDED_AT_FAMILY = 'familyAddedAt';
CONSTANTS.ATTR_MODIFIED_AT_FAMILY = 'familyModifiedAt';

CONSTANTS.ATTR_ID_GENERATION = 'generationId';
CONSTANTS.ATTR_NAME_GENERATION = 'generationName';
CONSTANTS.ATTR_DESCRIPTION_GENERATION = 'generationDescription';
CONSTANTS.ATTR_PARENTS_GENERATION = 'generationParents';
CONSTANTS.ATTR_GENOTYPES_GENERATION = 'generationGenotypes';
CONSTANTS.ATTR_ADDED_AT_GENERATION = 'generationAddedAt';
CONSTANTS.ATTR_MODIFIED_AT_GENERATION = 'generationModifiedAt';

CONSTANTS.ATTR_ID_GENOTYPE = 'genotypeId';
CONSTANTS.ATTR_NAME_GENOTYPE = 'genotypeName';
CONSTANTS.ATTR_DESCRIPTION_GENOTYPE = 'genotypeDescription';
CONSTANTS.ATTR_PLANTS_GENOTYPE = 'genotypePlants';
CONSTANTS.ATTR_ADDED_AT_GENOTYPE = 'genotypeAddedAt';
CONSTANTS.ATTR_MODIFIED_AT_GENOTYPE = 'genotypeModifiedAt';

CONSTANTS.ATTR_ID_PLANT = 'plantId';
CONSTANTS.ATTR_NAME_PLANT = 'plantName';
CONSTANTS.ATTR_SEX_PLANT = 'plantSex';
CONSTANTS.ATTR_CLONED_FROM_PLANT = 'plantClonedFrom';
CONSTANTS.ATTR_DESCRIPTION_PLANT = 'plantDescription';
CONSTANTS.ATTR_CLONES_PLANT = 'plantClones';
CONSTANTS.ATTR_ADDED_AT_PLANT = 'plantAddedAt';
CONSTANTS.ATTR_MODIFIED_AT_PLANT = 'plantModifiedAt';

CONSTANTS.ATTR_ID_ENVIRONMENT = 'environmentId';
CONSTANTS.ATTR_NAME_ENVIRONMENT = 'environmentName';
CONSTANTS.ATTR_DESCRIPTION_ENVIRONMENT = 'environmentDescription';
CONSTANTS.ATTR_MEDIUMS_ENVIRONMENT = 'environmentMediums';
CONSTANTS.ATTR_ADDED_AT_ENVIRONMENT = 'environmentAddedAt';
CONSTANTS.ATTR_MODIFIED_AT_ENVIRONMENT = 'environmentModifiedAt';

CONSTANTS.ATTR_ID_MEDIUM = 'mediumId';
CONSTANTS.ATTR_NAME_MEDIUM = 'mediumName';
CONSTANTS.ATTR_DESCRIPTION_MEDIUM = 'mediumDescription';
CONSTANTS.ATTR_PLANTS_MEDIUM = 'mediumPlants';
CONSTANTS.ATTR_ADDED_AT_MEDIUM = 'mediumAddedAt';
CONSTANTS.ATTR_MODIFIED_AT_MEDIUM = 'mediumModifiedAt';

CONSTANTS.ATTR_ID_JOURNAL = 'journalId';
CONSTANTS.ATTR_DATETIME_JOURNAL = 'journalDatetime';
CONSTANTS.ATTR_TYPE_JOURNAL = 'journalType';
CONSTANTS.ATTR_VALUE_JOURNAL = 'journalValue';
CONSTANTS.ATTR_ADDED_AT_JOURNAL = 'journalAddedAt';
CONSTANTS.ATTR_MODIFIED_AT_JOURNAL = 'journalModifiedAt';

CONSTANTS.ATTR_ID_ATTACHMENT = 'attachmentId';
CONSTANTS.ATTR_FILENAME_ATTACHMENT = 'attachmentFilename';
CONSTANTS.ATTR_ADDED_AT_ATTACHMENT = 'attachmentAddedAt';
CONSTANTS.ATTR_MODIFIED_AT_ATTACHMENT = 'attachmentModifiedAt';

// Plant sexes. You can't pass anything else as a value for this.
// Maybe we have to extend this from time to time.
CONSTANTS.PLANT_SEXES = ['male', 'female', 'hermaphrodite', null];

// *****************************
// * DONT EDIT BELOW THIS LINE *
// *****************************

/**
 *  .ATTRIBUTES_* all attributes without id, createdAt, modifiedAt bundled
 *  in an array
 * @type {String[]}
 */
CONSTANTS.ATTRIBUTES_FAMILY = [
  CONSTANTS.ATTR_NAME_FAMILY,
  CONSTANTS.ATTR_DESCRIPTION_FAMILY,
  CONSTANTS.ATTR_GENERATIONS_FAMILY
];

CONSTANTS.ATTRIBUTES_GENERATION = [
  CONSTANTS.ATTR_NAME_GENERATION,
  CONSTANTS.ATTR_PARENTS_GENERATION,
  CONSTANTS.ATTR_DESCRIPTION_GENERATION,
  CONSTANTS.ATTR_GENOTYPES_GENERATION,
  CONSTANTS.ATTR_ID_FAMILY
];

CONSTANTS.ATTRIBUTES_GENOTYPE = [
  CONSTANTS.ATTR_NAME_GENOTYPE,
  CONSTANTS.ATTR_DESCRIPTION_GENOTYPE,
  CONSTANTS.ATTR_PLANTS_GENOTYPE,
  CONSTANTS.ATTR_ID_GENERATION
];

CONSTANTS.ATTRIBUTES_PLANT = [
  CONSTANTS.ATTR_NAME_PLANT,
  CONSTANTS.ATTR_CLONED_FROM_PLANT,
  CONSTANTS.ATTR_SEX_PLANT,
  CONSTANTS.ATTR_DESCRIPTION_PLANT,
  CONSTANTS.ATTR_CLONES_PLANT,
  CONSTANTS.ATTR_ID_GENOTYPE,
  CONSTANTS.ATTR_ID_MEDIUM
];

CONSTANTS.ATTRIBUTES_ENVIRONMENT = [
  CONSTANTS.ATTR_NAME_ENVIRONMENT,
  CONSTANTS.ATTR_DESCRIPTION_ENVIRONMENT,
  CONSTANTS.ATTR_MEDIUMS_ENVIRONMENT
];

CONSTANTS.ATTRIBUTES_MEDIUM = [
  CONSTANTS.ATTR_NAME_MEDIUM,
  CONSTANTS.ATTR_DESCRIPTION_MEDIUM,
  CONSTANTS.ATTR_PLANTS_MEDIUM,
  CONSTANTS.ATTR_ID_ENVIRONMENT
];

CONSTANTS.ATTRIBUTES_JOURNAL = [
  CONSTANTS.ATTR_DATETIME_JOURNAL,
  CONSTANTS.ATTR_TYPE_JOURNAL,
  CONSTANTS.ATTR_VALUE_JOURNAL,
  CONSTANTS.ATTR_ID_PLANT,
  CONSTANTS.ATTR_ID_MEDIUM,
  CONSTANTS.ATTR_ID_ENVIRONMENT
];

CONSTANTS.ATTRIBUTES_ATTACHMENT = [
  CONSTANTS.ATTR_FILENAME_ATTACHMENT
];

CONSTANTS.INTERNAL_ATTRIBUTES_FAMILY = [
  CONSTANTS.ATTR_ID_FAMILY,
  CONSTANTS.ATTR_ADDED_AT_FAMILY,
  CONSTANTS.ATTR_MODIFIED_AT_FAMILY
];

CONSTANTS.INTERNAL_ATTRIBUTES_GENERATION = [
  CONSTANTS.ATTR_ID_GENERATION,
  CONSTANTS.ATTR_ADDED_AT_GENERATION,
  CONSTANTS.ATTR_MODIFIED_AT_GENERATION
];

CONSTANTS.INTERNAL_ATTRIBUTES_GENOTYPE = [
  CONSTANTS.ATTR_ID_GENOTYPE,
  CONSTANTS.ATTR_ADDED_AT_GENOTYPE,
  CONSTANTS.ATTR_MODIFIED_AT_GENOTYPE
];

CONSTANTS.INTERNAL_ATTRIBUTES_PLANT = [
  CONSTANTS.ATTR_ID_PLANT,
  CONSTANTS.ATTR_ADDED_AT_PLANT,
  CONSTANTS.ATTR_MODIFIED_AT_PLANT
];

CONSTANTS.INTERNAL_ATTRIBUTES_ENVIRONMENT = [
  CONSTANTS.ATTR_ID_ENVIRONMENT,
  CONSTANTS.ATTR_ADDED_AT_ENVIRONMENT,
  CONSTANTS.ATTR_MODIFIED_AT_ENVIRONMENT
];

CONSTANTS.INTERNAL_ATTRIBUTES_MEDIUM = [
  CONSTANTS.ATTR_ID_MEDIUM,
  CONSTANTS.ATTR_ADDED_AT_MEDIUM,
  CONSTANTS.ATTR_MODIFIED_AT_MEDIUM
];

CONSTANTS.INTERNAL_ATTRIBUTES_JOURNAL = [
  CONSTANTS.ATTR_ID_JOURNAL,
  CONSTANTS.ATTR_ADDED_AT_JOURNAL,
  CONSTANTS.ATTR_MODIFIED_AT_JOURNAL
];

CONSTANTS.INTERNAL_ATTRIBUTES_ATTACHMENT = [
  CONSTANTS.ATTR_ID_ATTACHMENT,
  CONSTANTS.ATTR_ADDED_AT_ATTACHMENT,
  CONSTANTS.ATTR_MODIFIED_AT_ATTACHMENT
];

CONSTANTS.ALL_ATTRIBUTES_FAMILY = _.concat(
  CONSTANTS.ATTRIBUTES_FAMILY,
  CONSTANTS.INTERNAL_ATTRIBUTES_FAMILY
);

CONSTANTS.ALL_ATTRIBUTES_GENERATION = _.concat(
  CONSTANTS.ATTRIBUTES_GENERATION,
  CONSTANTS.INTERNAL_ATTRIBUTES_GENERATION
);

CONSTANTS.ALL_ATTRIBUTES_GENOTYPE = _.concat(
  CONSTANTS.ATTRIBUTES_GENOTYPE,
  CONSTANTS.INTERNAL_ATTRIBUTES_GENOTYPE
);

CONSTANTS.ALL_ATTRIBUTES_PLANT = _.concat(
  CONSTANTS.ATTRIBUTES_PLANT,
  CONSTANTS.INTERNAL_ATTRIBUTES_PLANT
);


CONSTANTS.ALL_ATTRIBUTES_ENVIRONMENT = _.concat(
  CONSTANTS.ATTRIBUTES_ENVIRONMENT,
  CONSTANTS.INTERNAL_ATTRIBUTES_ENVIRONMENT
);

CONSTANTS.ALL_ATTRIBUTES_MEDIUM = _.concat(
  CONSTANTS.ATTRIBUTES_MEDIUM,
  CONSTANTS.INTERNAL_ATTRIBUTES_MEDIUM
);

CONSTANTS.ALL_ATTRIBUTES_JOURNAL = _.concat(
  CONSTANTS.ATTRIBUTES_JOURNAL,
  CONSTANTS.INTERNAL_ATTRIBUTES_JOURNAL
);

CONSTANTS.ALL_ATTRIBUTES_ATTACHMENT = _.concat(
  CONSTANTS.ATTRIBUTES_ATTACHMENT,
  CONSTANTS.INTERNAL_ATTRIBUTES_ATTACHMENT
);

CONSTANTS.RELATED_ATTRIBUTES_ENVIRONMENT = CONSTANTS.ALL_ATTRIBUTES_ENVIRONMENT;

CONSTANTS.RELATED_ATTRIBUTES_MEDIUM =
_(CONSTANTS.RELATED_ATTRIBUTES_ENVIRONMENT)
  .concat(CONSTANTS.ALL_ATTRIBUTES_MEDIUM)
  .uniq().value();

CONSTANTS.RELATED_ATTRIBUTES_FAMILY = CONSTANTS.ALL_ATTRIBUTES_FAMILY;

CONSTANTS.RELATED_ATTRIBUTES_GENERATION = _(CONSTANTS.RELATED_ATTRIBUTES_FAMILY)
  .concat(CONSTANTS.ALL_ATTRIBUTES_GENERATION)
  .uniq().value();

CONSTANTS.RELATED_ATTRIBUTES_GENOTYPE = _(CONSTANTS.RELATED_ATTRIBUTES_GENERATION)
  .concat(CONSTANTS.ALL_ATTRIBUTES_GENOTYPE)
  .uniq().value();


CONSTANTS.RELATED_ATTRIBUTES_PLANT = _(CONSTANTS.RELATED_ATTRIBUTES_GENOTYPE)
  .concat(CONSTANTS.RELATED_ATTRIBUTES_MEDIUM)
  .concat(CONSTANTS.ALL_ATTRIBUTES_PLANT)
  .uniq().value();

CONSTANTS.RELATED_ATTRIBUTES_JOURNAL = CONSTANTS.ALL_ATTRIBUTES_JOURNAL;

CONSTANTS.RELATED_ATTRIBUTES_ATTACHMENT = CONSTANTS.ALL_ATTRIBUTES_ATTACHMENT;

module.exports = CONSTANTS;
