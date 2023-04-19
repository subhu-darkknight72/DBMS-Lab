import smtplib
HIDDEN_CREDENTIALS = {
    'USER': 'gracesharma47@gmail.com',
    'PASS': 'patanahi123,'
}

SEND_MAIL = "47gracesharma@gmail.com"
# creates SMTP session
s = smtplib.SMTP('smtp.gmail.com', 587)

# start TLS for security
s.starttls()

# Authentication
s.login(HIDDEN_CREDENTIALS['USER'], HIDDEN_CREDENTIALS['PASS'])

# message to be sent
message = "Message_you_need_to_send"

# sending the mail
s.sendmail(HIDDEN_CREDENTIALS['USER'], SEND_MAIL, message)

# terminating the session
s.quit()
