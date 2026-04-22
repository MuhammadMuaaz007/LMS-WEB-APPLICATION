import nodemailer, { type Transporter } from "nodemailer";
import { fileURLToPath } from 'url'; // Required for ESM
import ejs from 'ejs'
import path from "path"
import dotenv from "dotenv"
dotenv.config();
interface EmailOption{
    email:string;
    subject:string,
    template:string,
    data:{[key:string]:any}
}



// Standard ESM boilerplate for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sendMailer=async (option:EmailOption):Promise <void>=>{
    const transporter:Transporter=nodemailer.createTransport({
        host:process.env.SMTP_HOST,
        port:parseInt(process.env.SMTP_PORT||'587'),
        service:process.env.SMTP_SERVICE,
        auth:{
            user:process.env.SMTP_MAIL,
            pass:process.env.SMTP_PASSWORD,
        }
    })

    const {email,subject,template,data}=option;
    const templatePath=path.join(__dirname,'../mails',template);
    const html:string=await ejs.renderFile(templatePath,data);
    const mailOption={
        from:process.env.SMTP_MAIL,
        to:email,
        subject,
        html
    };
    await transporter.sendMail(mailOption)
}
export default sendMailer