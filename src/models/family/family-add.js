'use strict';

const _ = require('lodash');

const CONSTANTS = require('../../constants');
const Utils = require('../../utils/utils');

const GenericAdd = require('../generic/generic-add');

/**
 * FamilyAdd Class. Creates a new Family and gets
 * internally called from Family.add(). If you want
 * to know how Create works internally, see
 * src/controller/generic-add.
 * If you want to know how to use the Family.add()
 * API from outside, see src/models/Family #create().
 * @private
 * @extends GenericAdd
 */
class FamilyAdd extends GenericAdd {
  /**
   * We need to validate the options.familyName property and throw
   * Error if we don't accept the input.
   * @param  {object} self
   *         Namespace/object only for the context of this class and this
   *         creation process. Not shared across differenct classes in
   *         callStack.
   * @param  {object} context
   *         Namespace/object of this creation process. It's shared across
   *         all classes in callStack.
   * @throws {Error}
   * @return {Boolean}
   *         Return true if we don't need to insert this record and this class
   *         reference and it's parents should get deleted from the callStack.
   */
  static validate(self, context) {
    let options = context.options;

    // Some additional validations if we got called from a child class
    if(context.creatingClassName !== this.name) {
      if(_.has(options, CONSTANTS.ATTR_ID_FAMILY)) {
        Utils.hasToBeInt(options, CONSTANTS.ATTR_ID_FAMILY);
        return true;
      }

      if(!options[CONSTANTS.ATTR_NAME_FAMILY]) {
        throw new Error(`options.familyId is not set. Missing familyId or attributes to create a new family.`);
      }
    }

    Utils.hasToBeSet(options, CONSTANTS.ATTR_NAME_FAMILY);
    Utils.hasToBeString(options, CONSTANTS.ATTR_NAME_FAMILY);
    Utils.hasToBeString(options, CONSTANTS.ATTR_DESCRIPTION_FAMILY);
  }
}

FamilyAdd.TABLE = CONSTANTS.TABLE_FAMILY;

FamilyAdd.ATTR_ID = CONSTANTS.ATTR_ID_FAMILY;

FamilyAdd.ATTR_ADDED_AT = CONSTANTS.ATTR_ADDED_AT_FAMILY;

FamilyAdd.ATTR_MODIFIED_AT = CONSTANTS.ATTR_MODIFIED_AT_FAMILY;

FamilyAdd.ATTR_FILL_CHILD_IDS = CONSTANTS.ATTR_GENERATIONS_FAMILY;

FamilyAdd.ATTR_CHILD_ID = CONSTANTS.ATTR_ID_GENERATION;

FamilyAdd.ATTRIBUTES = CONSTANTS.ATTRIBUTES_FAMILY;

FamilyAdd.DEFAULT_VALUES_ATTRIBUTES = {
  [CONSTANTS.ATTR_DESCRIPTION_FAMILY]: '',
  [CONSTANTS.ATTR_GENERATIONS_FAMILY]: []
};

FamilyAdd.SKIP_ATTRIBUTES = [
  CONSTANTS.ATTR_GENERATIONS_FAMILY
];

FamilyAdd.PLURAL = CONSTANTS.PLURAL_FAMILY;

module.exports = FamilyAdd;
