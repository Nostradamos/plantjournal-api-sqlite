/* eslint-env node, mocha */
'use strict';

require('should');

const squel = require('squel');

const UtilsExpression = require('../../../src/utils/utils-expression');

describe(`UtilsExpression`, () => {
  describe(`#createGenericExpression()`, () => {
    it(`should create a TABLE.ATTR OPERATOR EQUAL expression if func is null`, () => {
      let expression = UtilsExpression.createGenericExpression(
        'TABLE', 'ATTR', 'OPERATOR', 'EQUAL');
      expression.should.eql(
        ['? OPERATOR ?', [squel.rstr('TABLE.ATTR'), 'EQUAL']]);
    });

    it(`should create a FUNC(TABLE.ATTR) OPERATOR EQUAL expression if func is FUNC`, () => {
      let expression = UtilsExpression.createGenericExpression(
        'TABLE', 'ATTR', 'OPERATOR', 'EQUAL', 'FUNC');
      expression.should.eql(
        ['FUNC(?) OPERATOR ?', [squel.rstr('TABLE.ATTR'), 'EQUAL']]);
    });

    it(`should create a FUNC(TABLE.ATTR, FUNCARG1, FUNCARG2) OPERATOR EQUAL expression func is func and funcArgs is [FUNCARG1, FUNCARG2]`, () => {
      let expression = UtilsExpression.createGenericExpression(
        'TABLE', 'ATTR', 'OPERATOR', 'EQUAL', 'FUNC', ['FUNCARG1', 'FUNCARG2']);
      expression.should.eql(
        [
          'FUNC(?, ?, ?) OPERATOR ?',
          [squel.rstr('TABLE.ATTR'), 'FUNCARG1', 'FUNCARG2', 'EQUAL']
        ]);
    });

    it(`should create a FUNC(TABLE.ATTR) OPERATOR expression if equal is null`, () => {
      let expression = UtilsExpression.createGenericExpression(
        'TABLE', 'ATTR', 'OPERATOR', null);
      expression.should.eql(
        ['? OPERATOR', [squel.rstr('TABLE.ATTR')]]);
    });
  });

  describe(`#createIsNullExpression()`, () => {
    it(`should create a IS NULL expression`, () => {
      let expression = UtilsExpression.createIsNullExpression(
        'TABLE', 'ATTR');
      expression.should.eql(
        ['? IS NULL', [squel.rstr('TABLE.ATTR')]]);
    });
  });
});
