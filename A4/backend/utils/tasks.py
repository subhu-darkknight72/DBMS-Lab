from django.core.mail import send_mail
# from django.conf import settings
from backend import settings

def send_weekly_email():
    # compose the email message
    subject = "Weekly update"
    message = "Hello, this is your weekly update."
    from_email = settings.DEFAULT_FROM_EMAIL
    recipient_list = ['gracesharma47@gmail.com',]
    # send the email
    send_mail(subject, message, from_email, recipient_list)
    print("sent")