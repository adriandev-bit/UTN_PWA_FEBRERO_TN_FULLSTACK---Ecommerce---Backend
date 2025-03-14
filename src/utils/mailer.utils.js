import nodemailer from 'nodemailer'
import ENVIRONMENT from '../config/enviroment.config.js'


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: ENVIRONMENT.GMAIL_USERNAME,
        pass: ENVIRONMENT.GMAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
})

export const sendMail = async ({to, subject, html}) =>{
   try{
    const response = await transporter.sendMail({
        to,
        subject,
        html
    })
   }
catch{
    console.log('Error al enviar mail:',response)
}
    
}
