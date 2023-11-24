'use strict';

module.exports = function (Job) {

  Job.showNewJobsAgainstCompany = async function (companyId) {
    let res;

    res = await Job.find({
      where: {
        companyId: companyId,
        status: 'inProgress',
        isAcceptedByCompany: false
      },
      include: [{
        relation: 'jobCategory',
      }]
    });
    return res;
  };

  Job.showInProgressJobsAgainstCompany = async function (companyId) {
    let res;

    res = await Job.find({
      where: {
        companyId: companyId,
        status: 'inProgress',
        teamMemberId: {
          lt: 1
        },
        isAcceptedByCompany: true
      },
      include: [{
        relation: 'jobCategory',
      }]
    });
    return res;
  };

  Job.showInProgressJobsAgainstTeamMember = async function (companyId) {
    let res;
    let resArr = [];
    // for service provider
    res = await Job.find({
      where: {
        companyId: companyId,
        teamMemberId: {
          gt: 0,
          neq: null
        },
        status: 'inProgress',
      },
      include: [{
          relation: 'jobCategory',
        },
        {
          relation: 'teamMember',
        }
      ]
    });

    let teamMember = Job.app.models.TeamMember;
    let customUser = Job.app.models.CustomUser;
    let jobCategory = Job.app.models.JobCategory;

    for (let i = 0; i < res.length; i++) {
      let title = res[i].title;
      let status = res[i].status;
      let description = res[i].description;
      let jobCategoryId = res[i].jobCategoryId;

      let jobCategoryObj = await jobCategory.find({
        where: {
          id: jobCategoryId
        }
      });

      let teamMemberId = res[i].teamMemberId;
      let teamMemberObj = await teamMember.find({
        where: {
          id: teamMemberId
        }
      });
      let customUserId = teamMemberObj[0].customUserId;
      let customUserObj = await customUser.find({
        where: {
          id: customUserId
        }
      });
      let resObj = {
        title: title,
        firstName: customUserObj[0].firstName,
        lastName: customUserObj[0].lastName,
        status: status,
        description: description,
        jobCategoryName: jobCategoryObj[0].name
      }
      resArr.push(resObj);
    }


    // 
    // 
    // let jobId = res[0].id;
    // let teamMember = Job.app.models.TeamMember;
    // let teamMemberObj = await teamMember.find({
    //   where: {
    //     jobCategoryId: jobId
    //   }
    // });

    // let customUserId = teamMemberObj[0].customUserId;
    // console.log('customUserId: ' + customUserId);
    // let customUser = Job.app.models.CustomUser;
    // let customUserObj = await customUser.find({
    //   where: {
    //     id: customUserId
    //   }
    // });

    // let customUserArr = {
    //   firstName: customUserObj[0].firstName,
    //   lastName: customUserObj[0].lastName,
    // }
    // console.log('customUserArr');
    // console.log(customUserArr);

    return resArr;
  };

  Job.createJob = async function (obj) {
    let jobObj = await Job.create(obj);

    return jobObj;
  }

  Job.acceptJob = async function (obj) {

    await Job.updateAll({
      id: obj.jobId
    }, {
      status: 1,
      acceptRejectororId: obj.acceptorId
    });
    return {
      isSuccess: true
    };
  }

  Job.rejectJob = async function (obj) {

    await Job.updateAll({
      id: obj.jobId
    }, {
      status: 0,
      acceptRejectororId: obj.rejectorId
    });
    return {
      isSuccess: true
    };
  }

  Job.assignJob = async function (obj) {

    await Job.updateAll({
      id: obj.jobId
    }, {
      companyId: obj.companyId
    });

    return {
      isSuccess: true
    };
  }

  Job.assignJobToTeamMember = async function (obj) {

    let jobObj = await Job.find({
      where: {
        id: obj.jobId
      }
    });
    let companyId = jobObj[0].companyId;

    let teamMember = Job.app.models.TeamMember;
    let teamMemberObj = await teamMember.find({
      where: {
        customUserId: obj.teamMemberId,
        companyId: companyId
      }
    });

    let teamMemberId = teamMemberObj[0].id;

    await Job.updateAll({
      id: obj.jobId
    }, {
      teamMemberId: teamMemberId
    });

    return {
      isSuccess: true
    };
  }

  Job.accomplishJob = async function (obj) {

    await Job.updateAll({
      id: obj.jobId
    }, {
      status: 3,
    });

    return {
      isSuccess: true
    };
  }

  Job.showAssignedJobsAgainstSystemAdmin = async function () {
    let res;
    // dashboard api
    res = await Job.find({
      where: {

        status: 'inProgress',
        'or': [{
            companyId: {
              eq: 0
            },
          },
          {
            companyId: {
              eq: null
            },
          },
        ],
        // companyId: {
        //   neq: null
        // }
      },
      include: [{
        relation: 'jobCategory',
      }]
    });
    return res;
  };

  Job.showNewJobsAgainstSystemAdmin = async function () {
    let res;

    res = await Job.find({
      where: {
        status: 'new',
        'or': [{
            companyId: '0',
          },
          {
            companyId: {
              eq: null
            },
          }
        ]
      },
      include: [{
        relation: 'jobCategory',
      }]
    });
    return res;
  };

  Job.showInProgressJobsAgainstCompanyForAdmin = async function () {
    let res;
    //  for admin. jobs assigned to companies.
    res = await Job.find({
      where: {
        companyId: {
          gt: 0
        },
        status: 'inProgress',
      },
      include: [{
          relation: 'jobCategory',
        },
        {
          relation: 'company'
        }
      ]
    });
    return res;
  };

  Job.getAllJobsAgainstServiceTaker = async function (customUserId) {
    let res;
    // This will show all the jobs. done, inProgress, discarded
    res = await Job.find({
      where: {
        customUserId: customUserId,
      },
      include: [{
        relation: 'jobCategory',
      }]
    });
    return res;
  }

  Job.getJobsAgainstServiceTakerWithFilter = async function (customUserId, status) {
    let res;
    // This will show all the jobs. done, inProgress, discarded
    res = await Job.find({
      where: {
        customUserId: customUserId,
        status: status
      },
      include: [{
        relation: 'jobCategory',
      }]
    });
    return res;
  }

  Job.getJobsAgainstTeamMemberWithFilter = async function (teamMemberId, status) {
    let res;
    // This will show all the inProgress || completed Jobs against team member
    let teamMember = Job.app.models.TeamMember;
    let teamMemberObj = await teamMember.find({
      where: {
        customUserId: teamMemberId
      }
    });
    // let teamMemberId = teamMemberObj[0].id;
    res = await Job.find({
      where: {
        teamMemberId: teamMemberObj[0].id,
        status: status
      },
      include: [{
        relation: 'jobCategory',
      }]
    });
    return res;
  }

  Job.JobAcceptanceBySystemAdmin = async function (data) {
    await Job.updateAll({
      id: data.jobId
    }, {
      status: 'inProgress'
    });
    return true;
  }

  Job.JobAcceptanceByCompany = async function (data) {
    await Job.updateAll({
      id: data.jobId
    }, {
      isAcceptedByCompany: true
    });
    return true;
  }

  Job.MarkJobAsDone = async function (data) {
    await Job.updateAll({
      id: data.jobId
    }, {
      status: 'completed'
    });
    return true;
  }
};
