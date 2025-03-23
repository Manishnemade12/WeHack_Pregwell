import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    // host: 'smtp.gmail.com',
    // port: 465,
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

export default transporter;
// import nodemailer from 'nodemailer';
// import dotenv from 'dotenv';

// dotenv.config();

// const transporter = nodemailer.createTransport({
//   service: 'gmail', // Use Gmail as the email service
//   auth: {
//     user: process.env.SMTP_USER, // Your email
//     pass: process.env.SMTP_PASS, // Your app password
//   },
// });

// export default transporter;