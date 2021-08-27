import sgMail from "@sendgrid/mail"

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

export const sendEmail = async recipient => {
  const msg = {
    to: recipient,
    from: "sarasalomonn@gmail.com",
    subject: "Sending with Twilio SendGrid is Fun",
    // text: "and easy to do anywhere, even with Node.js",
    html: "<strong>and easy to do anywhere, even with Node.js</strong>",
  }

  await sgMail.send(msg)
  
}