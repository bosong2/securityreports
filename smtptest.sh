#!/bin/bash

# Configuration
HOST="smtp.gmail.com"
PORT="465"
USER="bshomegateway@gmail.com"
# Provided API Key
PASS="xybrnmgpcaprdflz"
# Must verify domain or use onboarding@resend.dev for testing
FROM="onboarding@securityreports.pages.dev"
TO="bosong2@live.co.kr"
SUBJECT="SMTP Test from Security Reports"

echo "Creating mail content..."
cat <<EOF > mail.txt
From: $FROM
To: $TO
Subject: $SUBJECT

This is a test email to verify Resend SMTP configuration.
Sent at: $(date)
EOF

echo "Sending email to $TO via $HOST:$PORT..."

# Using curl with SMTPS
curl --ssl-reqd \
  --url "smtps://$HOST:$PORT" \
  --user "$USER:$PASS" \
  --mail-from "$FROM" \
  --mail-rcpt "$TO" \
  --upload-file mail.txt \
  --verbose

echo ""
echo "Done."
