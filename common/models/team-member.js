'use strict';

module.exports = function (TeamMember) {

  //View Team
  TeamMember.ViewTeam = async function (companyId) {

    let teamMemberObj = await TeamMember.find({
      where: {
        companyId: companyId
      }
    });
    let teamMembersArr = [];
    let customUser = TeamMember.app.models.CustomUser;

    for (let i = 0; i < teamMemberObj.length; i++) {

      let customUserObj = await customUser.find({
        where: {
          id: teamMemberObj[i].customUserId
        }
      });
      let teamMemberObjTemp = {
        teamMemberUserId: customUserObj[0].id,
        firstName: customUserObj[0].firstName,
        lastName: customUserObj[0].lastName
      }
      teamMembersArr.push(teamMemberObjTemp);
      // teamMemberObj[0].firstName = customUserObj[i].firstName;
      // teamMemberObj[0].lastName = customUserObj[i].lastName;
    }

    return teamMembersArr;
  }

  //Add Team Member
  TeamMember.AddNewMember = async function (obj) {
    let teamMemberObj = await TeamMember.create(obj);
    return teamMemberObj;
  }
};
