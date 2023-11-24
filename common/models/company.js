'use strict';

module.exports = function (Company) {

  //Create Company Profile
  Company.CreateCompany = async function (data) {
    let socialLink = Company.app.models.SocialLink;

    let socialLinkObj = {
      facebook: data.facebook,
      instagram: data.instagram,
      twitter: data.twitter,
      linkedIn: data.linkedIn,
    }

    let socialLinkObjRes = await socialLink.create(socialLinkObj);

    console.log('socialLinkObjRes');
    console.log(socialLinkObjRes);

    let companyObj = {
      name: data.name,
      slogan: data.slogan,
      customUserId: data.customUserId,
      description: data.description,
      address: data.address,
      city: data.city,
      country: data.country,
      postalcode: data.postalcode,
      socialLinkId: socialLinkObjRes.id
    }

    let companyObjRes = await Company.create(companyObj);
    return companyObjRes;

  }

  //View Company Profile
  Company.ViewCompany = async function (customUserId) {

    let res = {};
    let socialLink = Company.app.models.SocialLink;

    let CompanyObj = await Company.find({
      where: {
        customUserId: customUserId
      }
    });
    console.log('CompanyObj');
    console.log(CompanyObj);

    if (CompanyObj.length == 0) {
      console.log('no company found..!');
      return false;

    } else {
      let socialLinkObj = await socialLink.find({
        where: {
          CompanyId: CompanyObj[0].id
        }
      });

      res.CompanyObj = CompanyObj;
      res.socialLinkObj = socialLinkObj;
      return res;
    }
  }

  //Edit Company Profile
  Company.EditCompany = async function (obj) {

    let CompanyObj = await Company.updateAll({
      customUserId: customUserId
    }, {
      name: obj.name
    });

    return CompanyObj;
  }

  //  Get ompany id Against UserId
  Company.getCompanyIdAgainstUser = async function (customUserId) {
    let companyObj = await Company.find({
      where: {
        customUserId: customUserId
      }
    });

    let companyId = 0;
    if (companyObj.length > 0) {
      companyId = companyObj[0].id
    }
    return companyId;
  }
  // View only company list
  Company.getAllCompaniesList = async function () {
    let companyObj = Company.find();
    return companyObj;
  }
};
