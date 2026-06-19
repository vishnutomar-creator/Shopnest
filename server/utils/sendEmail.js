const sendEmail = async (to, subject, text) => {
  try {
    const brevoApiKey = (process.env.BREVO_API_KEY || process.env.BREVO_PASS || "").trim();
    const brevoSender = (process.env.BREVO_USER || "").trim();

    if (!brevoApiKey || !brevoSender) {
      console.error("Brevo credentials (BREVO_PASS or BREVO_USER) are missing in environment variables.");
      return;
    }

    const payload = {
      sender: {
        name: "ShopNest",
        email: brevoSender,
      },
      to: [
        {
          email: to.trim(),
        },
      ],
      subject: subject,
      textContent: text,
    };

    // If global fetch is available (Node.js 18+)
    if (typeof fetch === "function") {
      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "accept": "application/json",
          "api-key": brevoApiKey,
          "content-type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseBody = await response.text();
      let data;
      try {
        data = JSON.parse(responseBody);
      } catch (e) {
        data = { message: responseBody };
      }

      if (response.ok) {
        console.log("Email sent successfully via Brevo API:", data.messageId || data);
      } else {
        console.error("Brevo API error sending email:", data);
      }
    } else {
      // Fallback to https module for older Node.js versions
      const https = require("https");
      const postData = JSON.stringify(payload);
      const options = {
        hostname: "api.brevo.com",
        port: 443,
        path: "/v3/smtp/email",
        method: "POST",
        headers: {
          "accept": "application/json",
          "api-key": brevoApiKey,
          "content-type": "application/json",
          "content-length": Buffer.byteLength(postData),
        },
      };

      await new Promise((resolve) => {
        const req = https.request(options, (res) => {
          let body = "";
          res.on("data", (chunk) => {
            body += chunk;
          });
          res.on("end", () => {
            try {
              const data = JSON.parse(body);
              if (res.statusCode >= 200 && res.statusCode < 300) {
                console.log("Email sent successfully via Brevo API (fallback):", data.messageId || data);
              } else {
                console.error("Brevo API error sending email (fallback):", data);
              }
            } catch (e) {
              console.error("Error parsing Brevo API response (fallback):", e);
            }
            resolve();
          });
        });

        req.on("error", (error) => {
          console.error("HTTP request error sending email (fallback):", error);
          resolve();
        });

        req.write(postData);
        req.end();
      });
    }
  } catch (error) {
    console.error("Email failed via Brevo API:", error);
  }
};

module.exports = sendEmail;