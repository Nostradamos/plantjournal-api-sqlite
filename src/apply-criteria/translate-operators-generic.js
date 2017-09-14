'use strict';

const _ = require('lodash');

const Utils = require('../utils');
const logger = require('../logger');

const UtilsApplyCriteria = require('./utils-apply-criteria');


class TranslateOperatorsGeneric {
    static translateAndApplyOperators(selfSelf, attr, attrOptions, squelExpr, type) {
        logger.silly(
            this.name, '#translateAndApplyOperators() selfSelf',
            JSON.stringify(selfSelf), 'attr:', attr, 'attrOptions:', attrOptions,
            'squelExpr:', squelExpr, 'type:', type);
        let self = {selfSelf, attr, attrOptions, squelExpr, type};

        this.getTable(self);

        logger.silly(this.name, '#translateAndApplyOperators() self.table:', self.table);

        if(_.isPlainObject(attrOptions)) {
            this.callOperatorFuncsAndApplyCriterias(self);
        } else {
            this.checkForShortHands(self);
        }
    }

    static getTable(self) {
        self.table = undefined;
    }

    static registerOperators(self) {

    }

    static callOperatorFuncsAndApplyCriterias(self) {
        let handledOperators = 0;
        let lengthAttrOptions = self.attrOptions.length;

        let crit = {};
        for(let operator in this.OPERATORS) {
            let operatorFunc = this.OPERATORS[operator];
            let operatorOptions = self.attrOptions[operator];

            if(!_.isUndefined(operatorOptions)) {
                logger.silly(
                    this.name, '#callOperatorFuncsAndApplyCriterias() operator:',
                    operator, 'is defined operatorOptions:', operatorOptions);

                [crit.crit, crit.args]  = [null, []];
                operatorFunc(self, operatorOptions, crit);

                logger.silly(
                    this.name, '#callOperatorFuncsAndApplyCriterias()', crit);

                this._applycrit(self, crit);
                handledOperators++;
            }

            // If we checked for more operators then the object has attributes,
            // break the loop.
            if(handledOperators >= lengthAttrOptions) break;
        }
    }

    static checkForShortHands(self) {
        let crit = {crit: null, args: []};

        if (_.isString(self.attrOptions) ||
            _.isNumber(self.attrOptions) ||
            _.isBoolean(self.attrOptions) ||
            _.isNull(self.attrOptions)) {
            logger.silly(
                this.name, '#checkForShortHands() looks like String or Number/Boolean/Null short hand');
            this.processStringNumberBooleanNullShortHand(self, crit);
        } else if (_.isArray(self.attrOptions)) {
            logger.silly(
                this.name, '#checkForShortHands() looks like Array short hand');
            this.processArrayShortHand(self, crit);
        } else {
            return this.unhandledShortHand();
        }

        logger.silly(this.name, '#checkForShortHands()', crit);

        this._applycrit(self, crit);
    }

    static processStringNumberBooleanNullShortHand(self, crit) {}

    static processArrayShortHand(self, crit) {}

    static unhandledShortHand(self) {
        logger.warn("Unhandled short hand:", self.attrOptions);

    }

    static _applycrit(self, crit) {
        if(crit.crit !== null) {
            UtilsApplyCriteria.applyCriteriaToExpression(
                self.squelExpr, crit.crit, crit.args, self.type);
        } else {
            logger.warn('crit.crit is null');
        }
    }
}

TranslateOperatorsGeneric.OPERATORS = [];

module.exports = TranslateOperatorsGeneric;