'use strict';

module.exports = function (JobCategory) {

  //  Get all categories
  JobCategory.getAllCategories = async function () {
    let jobCategoryObj = await JobCategory.find();
    return jobCategoryObj;
  }

  //  Add New categories
  JobCategory.addNewCategory = async function (data) {
    let jobCategoryObj = await JobCategory.create(data);
    return jobCategoryObj;
  }

  //  Delete categories
  JobCategory.deleteCategory = async function (data) {
    await JobCategory.destroyById(data.id);
    return true;
  }
};
