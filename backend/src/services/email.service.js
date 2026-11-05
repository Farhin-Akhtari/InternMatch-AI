import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email, verificationUrl) => {
    const { data, error } = await resend.emails.send({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: "Verify your InternMatch AI company account",
        html: `
         <h2>Welcome to InternMatch AI!</h2>
            <p>Please verify your email address by clicking the link below:</p>
            <a href="${verificationUrl}">Verify Email</a>
            <p>This verification link will expire soon.</p>
            `,
    });

    if(error) { 
        throw new Error(error.message);
    }
    return data;
}