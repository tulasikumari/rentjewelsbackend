const nodemailer=require('nodemailer');

//  krom xwzg jbbu txtn
 
const sendEmail = (params, callback) => {

  var transporter = nodemailer.createTransport({
            service: "Gmail",
            host: 'smtp.gmail.com',
            secure: true,
            port: 465,
            auth: {
              user: "shasalini65@gmail.com",
              pass: "krom xwzg jbbu txtn",
            },
          });
        
          var mailOption = {
            from: "shasalini65@gmail.com",
            to: params.email,
            subject: "password reset link",
            text: params.body,
          };
 
    transporter.sendMail(mailOption, function (error, info) {
        if (error) {
            return callback(error);
        } else {
            // console.log("line 24 of emailer service, email sent successfully");
            // console.log(info.response);
            return callback(null, info.response);
        }
    });
};
 
module.exports= { sendEmail };
 