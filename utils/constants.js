const passwordResetContent = (token) => {
  return `<div>
    <h3>Password Reset</h3>
    <hr/>
    <p>We have received a password reset request for you Online Shopping App.</p>
    <a href="http://localhost:8000/user/reset?token=${token}">Click here to Reset your password</a>
    </div>`;
};

module.exports = { passwordResetContent };
