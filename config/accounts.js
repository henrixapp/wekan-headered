const passwordField = AccountsTemplates.removeField('password');
const emailField = AccountsTemplates.removeField('email');

AccountsTemplates.addFields([{
  _id: 'username',
  type: 'text',
  displayName: 'username',
  required: true,
  minLength: 2,
}, emailField, passwordField, {
  _id: 'invitationcode',
  type: 'text',
  displayName: 'Invitation Code',
  required: false,
  minLength: 6,
  template: 'invitationCode',
}]);

AccountsTemplates.configure({
  defaultLayout: 'userFormsLayout',
  defaultContentRegion: 'content',
  confirmPassword: false,
  enablePasswordChange: false,
  sendVerificationEmail: true,
  showForgotPasswordLink: true,
  onLogoutHook() {
    const homePage = 'home';
    if (FlowRouter.getRouteName() === homePage) {
      FlowRouter.reload();
    } else {
      FlowRouter.go(homePage);
    }
  },
});

['signIn', 'signUp', 'resetPwd', 'forgotPwd', 'enrollAccount'].forEach(
  (routeName) => AccountsTemplates.configureRoute(routeName));





if (Meteor.isServer) {
  ['resetPassword-subject', 'verifyEmail-subject', 'verifyEmail-text', 'enrollAccount-subject', 'enrollAccount-text'].forEach((str) => {
    const [templateName, field] = str.split('-');
    Accounts.emailTemplates[templateName][field] = (user, url) => {
      return TAPi18n.__(`email-${str}`, {
        url,
        user: user.getName(),
        siteName: Accounts.emailTemplates.siteName,
      }, user.getLanguage());
    };
  });
} else {
  Meteor.loginWithPassword = function (username, password, callback) {
  var methodArguments = {username: username, pwd: password, ldap: true, data: null};
  Accounts.callLoginMethod({
    methodArguments: [methodArguments],
    validateResult: function (result) {
    },
    userCallback: callback
  });
};
}
