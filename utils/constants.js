const passwordResetContent = (token) => {
  return `<div>
    <h1>Password Reset</h1>
    <hr/>
    <p>We have received a password reset request for you Online Shopping App.</p>
    <a href="http://localhost:8000/user/reset?token=${token}">Click here to Reset your password</a>
    </div>`;
};
const passwordUpdateContent = () => {
  return `<div>
  <h1>Password Updated Successfully</h1>
  <p>Your password has been updated successfully. If it's not done by yourself, please report it to the customer service immediately.</p>
  <a href="http://localhost:8000/help">Click here to report unauthorized Password Updation</a>
  </div>`;
};
module.exports = { passwordResetContent, passwordUpdateContent };
