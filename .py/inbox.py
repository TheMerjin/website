import mailbox
import email
from bs4 import BeautifulSoup
import json


def extract_body(msg):
    if msg.is_multipart():
        for part in msg.walk():
            ctype = part.get_content_type()
            disp = str(part.get("Content-Disposition"))

            if ctype == "text/html":
                payload = part.get_payload(decode=True)
                if payload:
                    return BeautifulSoup(payload, "html.parser").get_text()

            if ctype == "text/plain" and "attachment" not in disp:
                payload = part.get_payload(decode=True)
                if payload:
                    return payload.decode(errors="ignore")
    else:
        payload = msg.get_payload(decode=True)
        if payload:
            return payload.decode(errors="ignore")

    return ""


mbox = mailbox.mbox("mails.mbox")

emails = []

for msg in mbox:
    emails.append(
        {
            "message_id": msg.get("Message-ID"),
            "in_reply_to": msg.get("In-Reply-To"),
            "references": msg.get("References"),
            "subject": msg.get("Subject"),
            "from": msg.get("From"),
            "date": msg.get("Date"),
            "body": extract_body(msg),
        }
    )

with open("emails.json", "w") as f:
    json.dump(emails, f, indent=2)
