import sys,os
from smtplib import SMTP

from email.mime.text import MIMEText
from email import encoders

SMTPserver = 'smtp.gmail.com'
PORT = '587'
sender = 'Raspberry Pi'
Destination = 'victoryphone3@gmail.com'
USERNAME = 'noreplyloghub@gmail.com'
PASSWORD = 'P@ssw0rd321'
text_subtype = 'plain'
content='Raspberry Pi Message'
subject = 'sending from Raspberry'



def send_smtp(sender1,text_subtype1,content1,subject1):
	sender = sender1
	text_subtype = text_subtype1
	content = content1
	subject = subject1
	msg = MIMEText(content,text_subtype)
	msg['Subject'] = subject
	msg['From'] = sender

	conn = SMTP()
	conn.connect(SMTPserver,PORT)
	conn.ehlo()
	conn.starttls()
	conn.ehlo()
	conn.set_debuglevel(False)
	conn.login(USERNAME, PASSWORD)

	conn.sendmail(sender,Destination,msg.as_string())
	conn.close()


