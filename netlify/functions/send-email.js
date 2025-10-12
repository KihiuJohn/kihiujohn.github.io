const emailjs = require('@emailjs/nodejs');

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ success: false, error: 'Method Not Allowed' })
        };
    }

    let body;
    try {
        body = JSON.parse(event.body);
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({ success: false, error: 'Invalid JSON payload' })
        };
    }

    const { from_name, from_email, subject, message } = body;

    // Validation
    if (!from_name || !from_email || !subject || !message) {
        return {
            statusCode: 400,
            body: JSON.stringify({ success: false, error: 'All fields are required' })
        };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(from_email)) {
        return {
            statusCode: 400,
            body: JSON.stringify({ success: false, error: 'Invalid email address' })
        };
    }

    try {
        await emailjs.init({ publicKey: process.env.EMAILJS_USER_ID });
        await emailjs.send(
            process.env.EMAILJS_SERVICE_ID,
            process.env.EMAILJS_TEMPLATE_ID,
            {
                from_name,
                from_email,
                subject,
                message
            }
        );
        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, message: 'Message sent successfully' })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false, error: 'Failed to send message' })
        };
    }
};