'use strict';

const _ = require('lodash');
const squel = require('squel');

const Utils = require('./utils');
const UtilsChildAttributes = require('./utils-child-attributes');
const CONSTANTS = require('../constants');


/**
 * Set of utils mainly used for query building.
 * @namespace UtilsQuery
 */
let UtilsQuery = exports;


/**
 * Join all related tables of Generations. Does NOT join generation itsel.
 * With the joinGenerationParents flag you can set if we want to join
 * GenerationParents too or not.
 * Mutates queryObj.
 *
 * @param {squel} queryObj
 *        Squel Query Builder to add joins
 * @param {boolean} [joinGenerationParents=true]
 *        True if we want to join generationParents
 */
UtilsQuery.joinRelatedGenerations = (queryObj, joinGenerationParents=true) => {
  if (joinGenerationParents === true) {
    UtilsQuery.joinGenerationParentsFromGenerations(queryObj);
  }
  UtilsQuery.joinFamiliesFromGenerations(queryObj);
};


/**
 * Join to all related tables of Genotypes.
 * This will also execute UtilsQuery.joinRelatedGenerations(queryObj).
 * Mutates queryObj.
 *
 * @param {squel} queryObj
 *        Squel Query Builder to add joins
 * @returns {undefined}
 */
UtilsQuery.joinRelatedGenotypes = function(queryObj) {
  UtilsQuery.joinGenerationsAndGenerationParentsFromGenotypes(queryObj);

  // Because with UtilsQuery.joinGenerations we already join
  // generation_parents and generations, we don't have to join
  // generation_parents again, therefore set false
  UtilsQuery.joinRelatedGenerations(queryObj, false);
};


/**
 * Joins all related tables of Plant. So joins all genotypes, joins all related
 * tables of genotype (which joins generations, which joins all related tables
 * of generation...)
 * And we also join Mediums and all related to mediums, which is currently
 * only Environment.
 * Mutates queryObj.
 * @param {squel} queryObj
 *        Squel Query Builder to add joins
 * @returns {undefined}
 */
UtilsQuery.joinRelatedPlants = function(queryObj) {
  UtilsQuery.joinGenotypesFromPlants(queryObj);
  UtilsQuery.joinRelatedGenotypes(queryObj);
  UtilsQuery.joinMediumsFromPlants(queryObj);
  UtilsQuery.joinRelatedMediums(queryObj);
};


UtilsQuery.joinRelatedMediums = function(queryObj) {
  UtilsQuery.joinEnvironmentsFromMediums(queryObj);
};

/**
 * Left joins generations by referencing to families.familyId.
 * @param  {squel} query - Squel query capable of an .left_join()
 */
UtilsQuery.joinGenerationsAndGenerationParentsFromFamilies = function(query) {
  UtilsQuery.joinGenerationsFromFamilies(query);

  UtilsQuery.joinGenerationParentsFromGenerations(query);
};

/**
 * Helper function to simplify the building of LEFT JOINS.
 * @param  {squel} query
 * Squel query capable of an .left_join()
 * @param  {String} lTable
 * Name of the left Table, should be an already joined or "selected from" table.
 * @param  {String} rTable
 * Name of the right table, this should be the table which gets newly joined.
 * @param  {String} lAttr
 * Name of the attribute on the left side
 * @param  {String|null} [rAttr=null]
 * Name of the attribute on the right side, set null to use the same attribute
 * as for lAttr.
 * @param  {String|null} [alias=null]
 * Name of the join alias. Leave null to use rTable
 */
UtilsQuery.join = (query, lTable, rTable, lAttr, rAttr=null, alias=null) => {
  if(rAttr === null) rAttr = lAttr;

  let fullLeftAttr = Utils.explicitColumn(lTable, lAttr);
  let fullRightAttr = Utils.explicitColumn(rTable, rAttr);
  query.left_join(rTable, alias, `${fullLeftAttr} = ${fullRightAttr}`);
};

UtilsQuery.joinGenerationsFromFamilies = function(query) {
  UtilsQuery.join(
    query,
    CONSTANTS.TABLE_FAMILY,
    CONSTANTS.TABLE_GENERATION,
    CONSTANTS.ATTR_ID_FAMILY);
};

/**
 * Left joins Genotypes by referencing to generations.generationId
 * @param  {squel} query - Squel query capable of an .left_join()
 */
UtilsQuery.joinGenotypesFromGenerations = function(query) {
  UtilsQuery.join(
    query,
    CONSTANTS.TABLE_GENERATION,
    CONSTANTS.TABLE_GENOTYPE,
    CONSTANTS.ATTR_ID_GENERATION);
};

/**
 * Left joins Plants by referencing to genotypes.genotypeId
 * @param  {squel} query - Squel query capable of an .left_join()
 */
UtilsQuery.joinPlantsFromGenotypes = function(query) {
  UtilsQuery.join(
    query,
    CONSTANTS.TABLE_GENOTYPE,
    CONSTANTS.TABLE_PLANT,
    CONSTANTS.ATTR_ID_GENOTYPE);
};

UtilsQuery.joinMediumsFromPlants = function(query) {
  UtilsQuery.join(
    query,
    CONSTANTS.TABLE_PLANT,
    CONSTANTS.TABLE_MEDIUM,
    CONSTANTS.ATTR_ID_MEDIUM);
};

UtilsQuery.joinEnvironmentsFromMediums = function(query) {
  UtilsQuery.join(
    query,
    CONSTANTS.TABLE_MEDIUM,
    CONSTANTS.TABLE_ENVIRONMENT,
    CONSTANTS.ATTR_ID_ENVIRONMENT);
};

/**
 * Left joins families by referencing to generations.familyId. Mutates query
 * @param  {squel} query
 *         Squel query capable of an .left_join()
 */
UtilsQuery.joinFamiliesFromGenerations = function(query) {
  UtilsQuery.join(
    query,
    CONSTANTS.TABLE_GENERATION,
    CONSTANTS.TABLE_FAMILY,
    CONSTANTS.ATTR_ID_FAMILY);
};

/**
 * Left joins generations and generation_parents by referencing to
 * genotypes.generationId. Mutates query
 * @param  {squel} query
 *         Squel query capable of an .left_join()
 */
UtilsQuery.joinGenerationsAndGenerationParentsFromGenotypes = function(query) {
  // First join generations
  UtilsQuery.joinGenerationsFromGenotypes(query);
  // Now we can also join generation parents
  UtilsQuery.joinGenerationParentsFromGenerations(query);
};

UtilsQuery.joinGenerationsFromGenotypes = function(query) {
  UtilsQuery.join(
    query,
    CONSTANTS.TABLE_GENOTYPE,
    CONSTANTS.TABLE_GENERATION,
    CONSTANTS.ATTR_ID_GENERATION);
};

/**
 * Only join generation parents. Mutates query.
 * @param  {squel} query
 *         Squel query which can take an .left_join()
 */
UtilsQuery.joinGenerationParentsFromGenerations = function(query) {
  UtilsQuery.join(
    query,
    CONSTANTS.TABLE_GENERATION,
    CONSTANTS.TABLE_GENERATION_PARENT,
    CONSTANTS.ATTR_ID_GENERATION);
};

/**
 * Left joins genotypes by referencing to plants.genotypeId. Mutates query
 * @param  {squel} query
 *         Squel query capable of an .left_join()
 */
UtilsQuery.joinGenotypesFromPlants = function(query) {
  UtilsQuery.join(
    query,
    CONSTANTS.TABLE_PLANT,
    CONSTANTS.TABLE_GENOTYPE,
    CONSTANTS.ATTR_ID_GENOTYPE);
};

UtilsQuery.joinPlantsFromMediums = function(query) {
  UtilsQuery.join(
    query,
    CONSTANTS.TABLE_MEDIUM,
    CONSTANTS.TABLE_PLANT,
    CONSTANTS.ATTR_ID_MEDIUM);
};

UtilsQuery.joinMediumsFromEnvironments = function(query) {
  UtilsQuery.join(
    query,
    CONSTANTS.TABLE_ENVIRONMENT,
    CONSTANTS.TABLE_MEDIUM,
    CONSTANTS.ATTR_ID_ENVIRONMENT);
};



/**
 * Sets attributes to select for squel query object.
 * For this we take a criteriaAttributes array which holds all attributes in a
 * use wants to have. We check them againt allowedAttributes and only select
 * attributes which are allowed. If criteriaAttributes is empty, we simply use
 * all allowedAttributes. Mutates query object.
 * @todo use whole criteria object and not only criteria.attributes
 * @param {squel} query
 *        Squel obejct. Has to be in select() state or similiar to take a
 *        field() call.
 * @param {String[]} allowedAttributes
 *        Array of attributes which are allowed to select.
 * @param {String[]} criteriaAttributes
 *        Array of attributes a user wants to select.
 * @param {Dict} [overWriteTableLookup=null]
 *        If you want to overwrite the used table for specific attributes, set
 *        them here. Key should be the attribute, value the new table. .
 */
UtilsQuery.applyCriteriaAttributes =
(query, allowedAttributes, criteriaAttributes, overWriteTableLookup=null) => {
  let attributesToSelect;

  if (_.isEmpty(criteriaAttributes)) {
    // if criteriaAttributes is empty, just select all allowedAttributes
    attributesToSelect = allowedAttributes;
  } else {
    // otherwise we only want attributes which are in both, criteriaAttributes
    // and allowedAttributes.
    attributesToSelect = _.intersection(
      allowedAttributes, criteriaAttributes);
  }

  for (let attr of attributesToSelect) {
    if (UtilsChildAttributes.isChildAttribute(attr)) {
      let tableConcat = UtilsChildAttributes
        .getTableOfChildAttribute(attr);
      let tableWhere = UtilsQuery.getTableOfField(attr);
      let attrConcat, attrWhere;

      if(attr === CONSTANTS.ATTR_GENERATIONS_FAMILY) {
        attrConcat = CONSTANTS.ATTR_ID_GENERATION;
        attrWhere = CONSTANTS.ATTR_ID_FAMILY;
      } else if(attr === CONSTANTS.ATTR_GENOTYPES_GENERATION) {
        attrConcat = CONSTANTS.ATTR_ID_GENOTYPE;
        attrWhere = CONSTANTS.ATTR_ID_GENERATION;
      } else if(attr === CONSTANTS.ATTR_PARENTS_GENERATION) {
        tableWhere = CONSTANTS.TABLE_GENERATION;
        attrConcat = CONSTANTS.ATTR_ID_PLANT;
        attrWhere = CONSTANTS.ATTR_ID_GENERATION;
      } else if(attr === CONSTANTS.ATTR_PLANTS_GENOTYPE) {
        attrConcat = CONSTANTS.ATTR_ID_PLANT;
        attrWhere = CONSTANTS.ATTR_ID_GENOTYPE;
      } else if(attr === CONSTANTS.ATTR_CLONES_PLANT) {
        attrConcat = CONSTANTS.ATTR_ID_PLANT;
        attrWhere = CONSTANTS.ATTR_CLONED_FROM_PLANT;
      } else if(attr === CONSTANTS.ATTR_MEDIUMS_ENVIRONMENT) {
        attrConcat = CONSTANTS.ATTR_ID_MEDIUM;
        attrWhere = CONSTANTS.ATTR_ID_ENVIRONMENT;
      } else if(attr === CONSTANTS.ATTR_PLANTS_MEDIUM) {
        attrConcat = CONSTANTS.ATTR_ID_PLANT;
        attrWhere = CONSTANTS.ATTR_ID_MEDIUM;
      } else {
        throw new Error('Unimplemented childAttribute');
      }

      let subQuery = squel.select().from(tableConcat)
        .field(
          `GROUP_CONCAT(${Utils.explicitColumn(tableConcat, attrConcat)})`)
        .where(
          '? = ?',
          Utils.explicitColumnRstr(tableConcat, attrWhere),
          Utils.explicitColumnRstr(tableWhere, attrWhere));

      query.field(subQuery, attr);
    } else {
      let table = UtilsQuery.getTableOfField(attr, overWriteTableLookup);
      query.field(Utils.explicitColumn(table, attr));
    }
  }
};

/**
 * Takes an squel query object and sets limit() and offset() depending on the
 * given criteria object. Default limit is 10, default offset 0.
 * Mutates query object.
 * @param {squel} query
 *        Squel obejct. Has to be in a state to take a limit() and offset()
 *        function call.
 * @param {object} criteria
 *        criteria object. Can be empty.
 * @param {int} [criteria.limit=10]
 *        Limit to set. If empty, will set to 10.
 * @param {int} [criteria.offset=0]
 *        Offset to set. If empty, will set to 0.
 */
UtilsQuery.applyCriteriaLimitAndOffset = function (query, criteria) {
  let limit = criteria.limit || 10;
  let offset = criteria.offset || 0;

  query.limit(limit).offset(offset);
};

/**
 * Translates and applies criteria.sort instructions to squel query builder.
 * This allows you to sort by one or more attributes ascending or descending
 * (also mixed).
 * See this criteria examples:
 * Sort by generationId ascending
 * {
 *  sort: "generationId ASC"
 * }
 *
 * Sort by generationId ascending
 * {
 *  sort: "generationId"
 * }
 *
 * Sort by generation descending
 * {
 *  sort: "generationId DESC"
 * }
 *
 * Sort by generationId ascending AND by familyId descending.
 * {
 *  sort: ["generationId ASC", "familyId DESC"]
 * }
 * @param {squel} query
 *        Squel obejct. Has to be in select() state or similiar to take a
 *        sort() call.
 * @param {String[]} allowedAttributes
 *        Array of attributes which are allowed to sort.
 * @param {Object} criteria
 *        Criteria object. If this method should do anything, set
 *        criteria.sort.
 * @param {String|String[]} criteria.sort
 *        criteria.sort can be a string or an array of strings.
 *        In both cases strings have to be in the following format:
 *        "<attributeName> <ASC|DESC" or only "<attributeName>" if you
 *        want to sort ascending.
 * @param {Dict} [overWriteTableLookup=null]
 *        If you want to overwrite the used table for specific attributes, set
 *        them here. Key should be the attribute, value the new table.
 * @throws {Error}
 *         If attribute is illegal (not in allowedAttributes) or the order type
 *         is unknown (not ASC or DESC).
 */
UtilsQuery.applyCriteriaSort =
(query, allowedAttributes, criteria, overWriteTableLookup=null) => {
  if (_.isEmpty(criteria.sort)) return;
  if (!_.isArray(criteria.sort)) criteria.sort = [criteria.sort];

  for(let sortStr of criteria.sort) {
    // Check if this is a valid format
    let attr, sortType;

    if (_.indexOf(sortStr, ' ') === -1) {
      // No whitespace means, attribute is the whole string
      // and we use ASC as the default sort type.
      attr = sortStr;
      sortType = 'ASC';
    } else {
      [attr, sortType] = _.split(sortStr, ' ');
      // upperCase sortType to be a bit more fault tollerant
      sortType = _.upperCase(sortType);
    }

    if (_.indexOf(allowedAttributes, attr) === -1) {
      // attr not in allowedAttributes array
      throw new Error(`Illegal attribute: ${attr}`);
    }


    // Sometimes it's needed to use the current table when we don't join the
    // referenced table.
    // Eg: we don't join families but still want to sort by familyId.
    // #getTableOfField() would return families as table, but we need
    // generations.
    let table = UtilsQuery.getTableOfField(attr, overWriteTableLookup);

    if (sortType === 'ASC') {
      query.order('?.?', true, table, attr);
    } else if (sortType === 'DESC') {
      query.order('?.?', false, table, attr);
    } else {
      // Split it again to get un-uppercased sort type
      throw new Error(`Illegal sort type: ${_.split(sortStr, ' ')[1]}`);
    }
  }
};

/**
 * Determines in which table this column is. This works because all column names
 * use a prefix, which should be equivalent to the table name.
 * Eg: familyId => family, plantClonedFrom => plant
 * @param  {String} attr
 *         Attribute name. Eg. familyId, familyName, generationId,
 *         generationName, generationParent, genotypeId...
 * @param  {Dict}  [overWriteTableLookup=null]
 *         If you want to overwrite the returned table for specific attributes,
 *         set this to an dict where key is attribute, value is the returned
 *         table name. You can of course set multiple attributes.
 * @return {String}
 *         Determined Table name
 */
UtilsQuery.getTableOfField = function (attr, overWriteTableLookup = null) {
  // determine which table we need
  let table;

  if (overWriteTableLookup !== null && _.has(overWriteTableLookup, attr)) {
    return overWriteTableLookup[attr];
  } else if (_.startsWith(attr, 'plantLog')) {
    table = CONSTANTS.TABLE_PLANT_LOG;
  } else if (_.startsWith(attr, 'plant')) {
    table = CONSTANTS.TABLE_PLANT;
  } else if (_.startsWith(attr, 'genotype')) {
    table = CONSTANTS.TABLE_GENOTYPE;
  } else if (attr === 'generationParents') {
    table = CONSTANTS.TABLE_GENERATION_PARENT;
  } else if (_.startsWith(attr, 'generation')) {
    table =  CONSTANTS.TABLE_GENERATION;
  } else if (_.startsWith(attr, 'family')) {
    table = CONSTANTS.TABLE_FAMILY;
  } else if (_.startsWith(attr, 'environment')) {
    table = CONSTANTS.TABLE_ENVIRONMENT;
  } else if (_.startsWith(attr, 'medium')) {
    table = CONSTANTS.TABLE_MEDIUM;
  } else if (_.startsWith(attr, 'journal')) {
    table = CONSTANTS.TABLE_JOURNAL;
  } else {
    throw new Error('cannot associate attribute with a table');
  }
  return table;
};

/**
 * This method removes newline characters and multiple whitespaces from sql
 * string.
 * @param  {String} sql
 *         SQL String which should get stripped.
 * @return {String}
 *         Stripped sql string.
 */
UtilsQuery.stripSQL = function(sql) {
  // Delete whitespaces after a whitespace
  sql = sql.replace(/\s\s+/g, ' ');
  // Delete new lines
  sql = sql.replace(/\r?\n/g, '');
  // Delete whitespaces before ),(,[,]
  sql = sql.replace(/\s+([),(,[,\]])/g, '$1');
  // Delete whitespaces after ),(,[,]
  sql = sql.replace(/([),(,[,\]])\s+/g, '$1');

  return sql;
};
