# app/services/email.py: Handles sending email notifications and reminders via Gmail SMTP
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.config import settings

def send_email_notification(to_email: str, subject: str, body: str):
    """
    Sends an email using standard SMTP.
    Runs synchronously (meant to be dispatched via FastAPI's BackgroundTasks).
    """
    if not settings.SMTP_USER or not settings.SMTP_PASSWORD:
        print("SMTP credentials not configured. Skipping email dispatch.")
        return

    msg = MIMEMultipart()
    msg['From'] = settings.SMTP_USER
    msg['To'] = to_email
    msg['Subject'] = subject
    
    # Render with nice HTML styling
    html_content = f"""
    <html>
      <body style="font-family: 'Plus Jakarta Sans', sans-serif; background-color: #fff5f6; padding: 24px; color: #470a1e;">
        <div style="max-width: 600px; margin: 0 auto; background: rgba(255, 255, 255, 0.8); border: 1px solid rgba(236, 72, 153, 0.2); border-radius: 20px; padding: 32px; box-shadow: 0 8px 32px 0 rgba(236, 72, 153, 0.04);">
          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="color: #ec4899; margin: 0; font-size: 24px;">InternTrack Alert</h1>
            <p style="color: #f472b6; margin: 4px 0 0 0; font-size: 14px;">Smart Internship & Progress Manager</p>
          </div>
          <hr style="border: 0; border-top: 1px solid rgba(236, 72, 153, 0.1); margin: 20px 0;">
          <div style="font-size: 15px; line-height: 1.6;">
            {body}
          </div>
          <hr style="border: 0; border-top: 1px solid rgba(236, 72, 153, 0.1); margin: 20px 0;">
          <p style="font-size: 11px; text-align: center; color: #db2777; opacity: 0.6; margin: 0;">
            This is an automated notification from your college DBMS InternTrack instance.
          </p>
        </div>
      </body>
    </html>
    """
    
    msg.attach(MIMEText(html_content, 'html'))

    try:
        server = smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT)
        server.starttls()  # Upgrade connection to secure SSL/TLS
        server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
        server.sendmail(settings.SMTP_USER, to_email, msg.as_string())
        server.quit()
        print(f"SMTP notification sent successfully to {to_email}")
    except Exception as e:
        print(f"Failed to dispatch SMTP notification email to {to_email}: {e}")
