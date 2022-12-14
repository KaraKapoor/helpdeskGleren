module.exports = {
    EMAIL_OTP_TEMPLATE: `<div> Hi Operations Team,</div><br>
    <div>Please use the verification code below on the Helpdesk portal. OTP is valid for 5 minute.<br>
    <label><b>{otp} </b></label> <br>
    <label>If you don't request this, you can ignore this email or let us know </label> <br>
    </div>
    <div> 
    Thanks,<br>
    Gleren Team
    </div>`,
    EMAIL_OTP_SUBJECT: "OTP For Helpdesk Gleren",
    BUG_REPORT_EMAIL_TEMPLATE: `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <title>Bug Report</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
            href="https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap"
            rel="stylesheet" />
        <style>
            * {
                font-family: "Public Sans", sans-serif;
                box-sizing: border-box;
            }
            body {
                margin: 0;
                background: #F7F9FF;
            }
            .heading3 {
                font-style: normal;
                font-weight: 700;
                font-size: 14px;
                margin-top: 16px;
                margin-bottom: 16px;
            }
            .para {
                font-style: normal;
                font-weight: 400;
                font-size: 14px;
                line-height: 140%;
                margin-top: 16px;
                margin-bottom: 16px;
            }
        </style>
    </head>
    
    <body>
        <div>
            <p class="heading3">Hi Support Team</p>
            <p class="para">
                Following Bug is reported by <strong>Tenant ID: {tenantId}</strong>
            </p>
            <p class="para"> " <strong><i>{bugDescription}"</i></strong></p>
        </div>
    </body>
    
    </html>`,
    BUG_REPORT_SUBJECT: "Bug Reported In Helpdesk",
    FORGET_PASSWORD_EMAIL_TEMPLATE: `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <title>Forget Password</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
            href="https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap"
            rel="stylesheet" />
        <style>
            * {
                font-family: "Public Sans", sans-serif;
                box-sizing: border-box;
            }
            body {
                margin: 0;
                background: #F7F9FF;
            }
            .heading3 {
                font-style: normal;
                font-weight: 700;
                font-size: 14px;
                margin-top: 16px;
                margin-bottom: 16px;
            }
            .para {
                font-style: normal;
                font-weight: 400;
                font-size: 14px;
                line-height: 140%;
                margin-top: 16px;
                margin-bottom: 16px;
            }
        </style>
    </head>
    
    <body>
        <div>
            <p class="heading3">Hi {firstName}</p>
            <p class="para">
                Please click on the below link to reset your password
            </p>
            <a href={passwordResetLink}><strong><i>Reset Password</i></strong></a><br></br>

            <p class="para">Regards,</p>
            <p class="para">Team Gleren</p>
        </div>
    </body>
    
    </html>`,
    FORGET_PASSWORD_SUBJECT: "Reset Password For Helpdesk Gleren",
    NEW_USER_REGISTER_EMAIL_TEMPLATE: `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <title>New User Invitation</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
            href="https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap"
            rel="stylesheet" />
        <style>
            * {
                font-family: "Public Sans", sans-serif;
                box-sizing: border-box;
            }
            body {
                margin: 0;
                background: #F7F9FF;
            }
            .heading3 {
                font-style: normal;
                font-weight: 700;
                font-size: 14px;
                margin-top: 16px;
                margin-bottom: 16px;
            }
            .para {
                font-style: normal;
                font-weight: 400;
                font-size: 14px;
                line-height: 140%;
                margin-top: 16px;
                margin-bottom: 16px;
            }
        </style>
    </head>
    
    <body>
        <div>
            <p class="heading3">Hi {firstName}</p>
            <p class="para">
                You have been invited to access Helpdesk Gleren.
            </p>
            <p class="para">Click on the below link to generate your password.</p>
            <p class="para">Please note your Login Username is your <Strong>Email Address</Strong>.</p>
            <a href={passwordResetLink}><strong><i>Generate Password</i></strong></a><br></br>

            <p class="para">Regards,</p>
            <p class="para">Team Gleren</p>
        </div>
    </body>
    
    </html>`,
    NEW_USER_SUBJECT: "Invitation for Helpdesk Gleren",
    CREATE_TICKET_TEMPLATE: `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <title>New User Invitation</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
            href="https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap"
            rel="stylesheet" />
        <style>
            * {
                font-family: "Public Sans", sans-serif;
                box-sizing: border-box;
            }
            body {
                margin: 0;
                background: #F7F9FF;
            }
            .heading3 {
                font-style: normal;
                font-weight: 700;
                font-size: 14px;
                margin-top: 16px;
                margin-bottom: 16px;
            }
            .para {
                font-style: normal;
                font-weight: 400;
                font-size: 14px;
                line-height: 140%;
                margin-top: 16px;
                margin-bottom: 16px;
            }
        </style>
    </head>
    
    <body>
        <div>
            <p class="heading3">Hi {username}</p>
            <p class="para">
                 Ticket ID {ticketNumber} is created.
            </p><br></br>

            <p class="para">Regards,</p>
            <p class="para">Team Gleren</p>
        </div>
    </body>
    
    </html>`,
    NEW_TICKET_SUBJECT: "New Ticket Created",
    UPDATE_TICKET_ASSIGNEE_TEMPLATE: `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <title>Ticket Assignee Changed</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
            href="https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap"
            rel="stylesheet" />
        <style>
            * {
                font-family: "Public Sans", sans-serif;
                box-sizing: border-box;
            }
            body {
                margin: 0;
                background: #F7F9FF;
            }
            .heading3 {
                font-style: normal;
                font-weight: 700;
                font-size: 14px;
                margin-top: 16px;
                margin-bottom: 16px;
            }
            .para {
                font-style: normal;
                font-weight: 400;
                font-size: 14px;
                line-height: 140%;
                margin-top: 16px;
                margin-bottom: 16px;
            }
        </style>
    </head>
    
    <body>
        <div>
         

            <p class="para">Regards,</p>
            <p class="para">Team Gleren</p>
        </div>
    </body>
    
    </html>`,
    UPDATE_TICKET_SUBJECT: " Ticket Updated",

    UPDATE_TICKET_TEMPLATE: `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <title>Ticket Has Been Updated</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
            href="https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap"
            rel="stylesheet" />
        <style>
            * {
                font-family: "Public Sans", sans-serif;
                box-sizing: border-box;
            }
            body {
                margin: 0;
                background: #F7F9FF;
            }
            .heading3 {
                font-style: normal;
                font-weight: 700;
                font-size: 14px;
                margin-top: 16px;
                margin-bottom: 16px;
            }
            .para {
                font-style: normal;
                font-weight: 400;
                font-size: 14px;
                line-height: 140%;
                margin-top: 16px;
                margin-bottom: 16px;
            }
        </style>
    </head>
    
    <body>
        <div>
         

            <p class="para">Regards,</p>
            <p class="para">Team Gleren</p>
        </div>
    </body>
    
    </html>`,
    UPDATE_TICKET_SUBJECT: " Ticket Updated",
}