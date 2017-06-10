'use strict';

const PlantCreate = require('../controller/plant-create');
const PlantFind = require('../controller/plant-find');
const PlantDelete = require('../controller/plant-delete');

let Plant = exports;

Plant.create = async function(options) {
  return await PlantCreate.create(options);
}

Plant.find = async function(criteria) {
  return await PlantFind.find(criteria);
}

Plant.delete = async function(criteria) {
  return await PlantDelete.delete(criteria);
}
