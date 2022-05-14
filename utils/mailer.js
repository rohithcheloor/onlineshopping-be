const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendMail = (req, res) => {
  const mailDetails = {
    from: process.env.EMAIL_ADDRESS,
    to: req.mailto,
    subject: req.subject,
    html: req.content,
  };
  transporter.sendMail(mailDetails, (mailErr, mailRes) => {
    if (mailErr) {
      console.log(mailErr);
      res.status(500).json({ success: false, err: mailErr });
    } else {
      res.status(200).json({
        success: true,
        message: req.successMessage,
      });
    }
  });
};

module.exports = sendMail;
