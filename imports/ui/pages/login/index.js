import './login.html'
import swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

Template.LoginPage.onRendered(function () {
  // $('body').addClass('login-body');
});

Template.LoginPage.onCreated(function () {
  // set default tab to 'login'
  this.currentTab = new ReactiveVar("LoginSection");
});

Template.LoginPage.events({

  'submit .login-form'(event, template) {
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    const target = event.target;
    const username = target.username.value;
    const password = target.password.value;

    // Login
    Meteor.loginWithPassword(username, password, (error) => {
      if (error) swal('Error', error.reason, 'error')
    });

    // Clear form
    target.username.value = '';
    target.password.value = '';
  },

  'click .switchButton': function (event, template) {
    template.currentTab.get() == 'LoginSection' ? template.currentTab.set('SignupSection') : template.currentTab.set('LoginSection');
  }

});

Template.LoginPage.helpers({
  tab: function () {
    return Template.instance().currentTab.get();
  }
});

Template.LoginPage.onDestroyed(function () {
  // remove the class so it does not appear on other routes
  $('body').removeClass('login-body');
});

// SIGN UP

Template.SignupSection.events({
  'submit .signup-form'(event) {
    event.preventDefault();

    const target = event.target;
    const first_name = target.first_name.value;
    const last_name = target.last_name.value;
    const username = target.username.value;
    const email = target.email.value;
    const password = target.password.value;
    const password_confirmation = target.password_confirmation.value;
    let check = true;

    // restore errors
    $('.signup-form #first_name').removeClass('form-control-danger').parent().parent().removeClass('has-danger');
    $('.signup-form #last_name').removeClass('form-control-danger').parent().removeClass('has-danger');
    $('.signup-form #email').removeClass('form-control-danger').parent().removeClass('has-danger');
    $('.signup-form #username').removeClass('form-control-danger').parent().removeClass('has-danger');
    $('.signup-form #password').removeClass('form-control-danger').parent().removeClass('has-danger');
    $('.signup-form #password_confirmation').removeClass('form-control-danger').parent().removeClass('has-danger');
    $('.signup-form #password_feedback_1').hide();
    $('.signup-form #password_feedback_2').hide();
    $('.signup-form #info_feedback').hide();
    $('.signup-form #email_feedback_1').hide();
    $('.signup-form #email_feedback_2').hide();
    $('.signup-form #username_feedback_1').hide();
    $('.signup-form #username_feedback_2').hide();

    // check for first and last name not to be empty
    if (_.isEqual(first_name, '') || _.isEqual(last_name, '')) {
      check = false;

      $('.signup-form #last_name').addClass('form-control-danger');
      $('.signup-form #first_name').addClass('form-control-danger').parent().parent().addClass('has-danger');
      $('.signup-form #info_feedback').show()
    }

    if (_.isEqual(username, '')) {
      check = false;

      $('.signup-form #username').addClass('form-control-danger').parent().addClass('has-danger');
      $('.signup-form #username_feedback_2').show()
    }

    if (_.isEqual(email, '')) {
      check = false;

      $('.signup-form #email').addClass('form-control-danger').parent().addClass('has-danger');
      $('.signup-form #email_feedback_2').show()
    }

    // check for empty passwords
    if (_.isEqual(password, '') || _.isEqual(password_confirmation, '')) {
      check = false;

      $('.signup-form #password').addClass('form-control-danger');
      $('.signup-form #password_confirmation').addClass('form-control-danger').parent().parent().addClass('has-danger');
      $('.signup-form #password_feedback_2').show()
    }

    // check for equal passwords
    if (password != password_confirmation) {
      check = false;

      $('.signup-form #password').addClass('form-control-danger').parent().addClass('has-danger');
      $('.signup-form #password_confirmation').addClass('form-control-danger').parent().addClass('has-danger');
      $('.signup-form #password_feedback_2').hide();
      $('.signup-form #password_feedback_1').show()
    }

    if (check) {
      Accounts.createUser({
        username: username,
        email: email,
        password: password,
        profile: {
          first_name: first_name,
          last_name: last_name,
          allowed_participants: 20
        }
      }, (error) => {
        if (error) {
          switch (error.error) {
            case 400:
              $('.signup-form #email').addClass('form-control-danger').parent().addClass('has-danger');
              $('.signup-form #email_feedback_1').show();
              break;
            case 403:
              $('.signup-form #username').addClass('form-control-danger').parent().addClass('has-danger');
              $('.signup-form #username_feedback_1').show();
              break;
            case 'profile.lastName':
              $('.signup-form #last_name').addClass('form-control-danger').parent().addClass('has-danger');
              break;
            case 'username':
              $('.signup-form #username').addClass('form-control-danger').parent().addClass('has-danger');
              $('.signup-form #username-feedback').removeClass('hidden');
              break;
            default:
              // TODO: only for debugging
              swal('Error ' + error.error, error.reason, 'error')
          }
        }
      });
    }
  }
});