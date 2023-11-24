'use strict';
const loopback = require('loopback');
const path = require('path');

module.exports = function (CustomUser) {

  CustomUser.on('resetPasswordRequest', function (info) {
    console.log(info);
    //Step 1: Prpare Your Url
    // var url = `http://192.168.1.8:3000/api/custom-users/reset`;
    // var data = {
    //   fullName: info.email,
    //   confirmLink: url + '/' + info.accessToken.id,
    //   projectTitle: 'Cascoode Service Provider App',
    //   ButtonTitle: 'Reset Password',
    // };
    // var template = loopback.template(path.resolve(__dirname, '../../server/templates/email-reset-password.ejs'));
    // var body = template(data);
    // data = {
    //   baseUrl: `http://192.168.1.8:3000`,
    //   body: body,
    // };
    // template = loopback.template(path.resolve(__dirname, '../../server/templates/layout-email.ejs'));
    // var htmlbody = template(data);
    // CustomUser.app.models.Email.send({
    //   to: info.email,
    //   from: 'noreply@ard-pro.com',
    //   subject: 'Password reset...!',
    //   redirect: '/reset',
    //   html: htmlbody,
    // }, function (err) {
    //   if (err) return console.log('> error sending email', err);
    //   console.log('> Email Sent to change the Password :', info.email);
    // });

  });

  CustomUser.afterRemote('resetPasswordRequest', function (context, user, next) {
    console.log('resetPasswordRequest after remote called ...!');
    context.result = {
      isSuccess: true,
    };
    next();
  });

  CustomUser.afterRemote('setPassword', function (context, user, next) {
    console.log('Your Password has been reset successfully');
    next();
  })

  // creating role mapping
  CustomUser.createCustomUser = async function (data) {
    console.log("custome user is called");
    let customUserObj;
    customUserObj = await CustomUser.create({
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.username,
      password: data.password,
      email: data.email,
      phoneNo: data.phoneNo,
      gender: data.gender,
      customRoleId: data.customRoleId
    });

    // let roleMapping = await CustomUser.app.models.RoleMapping;
    // await roleMapping.create({
    //   principalType: 'USER',
    //   principalId: customUserObj.id,
    //   roleId: data.customRoleId
    // });

    await CustomUser.updateAll({
      id: customUserObj.id
    }, {
      emailVerified: true
    });
    return true;
  };

  CustomUser.afterRemote('create', async function (context, user, next) {
    // console.log('after remote called');

    // let options = {
    //   type: 'email',
    //   to: user.email,
    //   from: 'noreply@ard-pro.com',
    //   subject: 'Thanks for registering.',
    //   user: user,
    //   templateFn: function (verifyOptions, options, cb) {
    //     verifyOptions.fullName = user.name;
    //     verifyOptions.confirmLink = verifyOptions.verifyHref;
    //     verifyOptions.projectTitle = 'Email Verification';
    //     verifyOptions.ButtonTitle = 'Confirm Email';
    //     let template = loopback.template(path.resolve(__dirname, '../../server/templates/email-verify-new-email.ejs'));
    //     let body = template(verifyOptions);
    //     let data = {
    //       baseUrl: `http://192.168.1.8/`,
    //       body: body,
    //     };
    //     template = loopback.template(path.resolve(__dirname, '../../server/templates/layout-email.ejs'));
    //     let htmlbody = template(data);
    //     cb(null, htmlbody);
    //   },
    //   host: `192.168.0.103`,
    //   port: 3000,
    // };
    // user.verify(options, function (err, response) {
    //   console.log('verify')
    //   console.log(response)
    //   if (err) {
    //     return next(err);
    //   }
    //   next();
    // });

  })

  // CustomUser.beforeRemote('login', function (context, unused, next) {
  // Login...
  // CustomUser.findOne(

  //   {
  //     where: {
  //       email: context.req.body.email
  //     }
  //   },
  //   function (err, user) {
  //     if (err || !user) {
  //       return next(err || (new Error('No user found')));
  //     }

  //     if (!user.emailVerified) {
  //       return next(new Error('You need to verify your email first!'));
  //     } else if (!user.isPhoneVerified || !user.isAccountApproved) {
  //       return next(new Error('You need to verify your Phone first!'));
  //     } else if (!user.isAccountApproved) {
  //       return next(new Error('You need to verify your acount first!'));
  //     }
  //     next();
  //   });
  // });

  CustomUser.getAllCustomUser = async function () {
    // let abc = await CustomUser.find();
    let models = CustomUser.app.models();
    let modelName = models[6];
    modelName.sharedClass.methods().forEach(function (method) {
      console.log(method.name)
    });

    return true;
  }

  CustomUser.getAllCustomUser1 = async function () {
    // let abc = await CustomUser.find();

    let models = CustomUser.app.models();
    models.forEach(async function (Model) {
      console.log('ModelName' + Model.name);
      // console.log(++count);

    });


    return abc;
  }

  CustomUser.showUsersListForOneToOneChat = async function (customUserId) {

    let customUserObj = await CustomUser.find({
      where: {
        id: {
          neq: customUserId
        }
      }
    });
    return customUserObj;
  }

  // 
  // ........................................CASCOODE APIs......................................
  // 

  // Invite
  CustomUser.Invite = async function (email) {
    var re = /\S+@\S+\.\S+/;
    if (!re.test(email)) {
      return "Email is not valid!"
    } else {

      var myMessage = {
        heading: "Welcome to MyCompany",
        text: "We are happy to have you on board."
      };
      var renderer = loopback.template(path.resolve(__dirname, '../../server/templates/email-invitation.ejs'));
      let html_body = renderer(myMessage);
      CustomUser.app.models.Email.send({
        to: email,
        from: 'noreply@ard-pro.com',
        subject: 'my subject',
        text: 'my text',
        html: html_body
      }, function (err, mail) {
        if (err) {
          console.log(err)
        }
        console.log(mail)
      });

    }
  }
  //Register user
  CustomUser.RegisterCustomUser = async function (obj) {
    let customUserObj = await CustomUser.create(obj);
    return customUserObj;
  }
  //View user profile
  CustomUser.ViewServiceProviderProfile = async function (customUserId) {
    let customUserObj = await CustomUser.find({
      where: {
        id: customUserId
      }
    });
    customUserObj = customUserObj[0];
    // Getting user role
    let customRole = CustomUser.app.models.CustomRole;
    let customRoleObj = await customRole.find({
      where: {
        id: customUserObj.customRoleId
      }
    });

    // Getting the Company Name
    let company = CustomUser.app.models.Company;
    let companyObj = await company.find({
      where: {
        customUSerId: customUserId
      }
    });
    let totalCompanyObj = await company.find();

    customUserObj.companyName = companyObj[0].name;

    // Getting the Total team members
    let teamMember = CustomUser.app.models.TeamMember;
    let teamMemberObj = await teamMember.find({
      where: {
        companyId: companyObj[0].id
      },
      include: [{
        relation: 'jobCategory',
      }]
    });
    // Getting all categories
    let jobCategory = CustomUser.app.models.JobCategory;
    let jobCategoryObj = await jobCategory.find();

    // Getting first 10 completed jobs of a service taker
    let job = CustomUser.app.models.Job;
    let jobObj = await job.find({
      where: {
        customUserId: customUserId,
        status: 'inProgress'
      }
    });
    let completedJobsArr = [];
    for (let i = 0; i < jobObj.length; i++) {
      if (i <= 10) {
        completedJobsArr.push(jobObj[i]);
      }
    }


    customUserObj.totalTeamMembers = teamMemberObj.length;
    customUserObj.teamMembersList = teamMemberObj;
    customUserObj.totalCompanies = totalCompanyObj.length;
    customUserObj.companiesList = totalCompanyObj;
    customUserObj.roleName = customRoleObj[0].name;
    customUserObj.jobCategoryObj = jobCategoryObj;
    customUserObj.completedJobsArr = completedJobsArr;

    return customUserObj;
  }
  //Edit user profile
  CustomUser.EditServiceProviderProfile = function (user, cb) {
    console.log(user)

    CustomUser.updateAll({
        id: user.id
      }, {
        phoneNo: user.phoneNo,
        firstName: user.firstName,
        secondName: user.secondName,
        description: user.description
      },
      function (err, res) {
        console.log(res);
        cb(null, res);
      }
    );
  }
};
