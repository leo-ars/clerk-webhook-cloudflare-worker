import { Hono } from 'hono';
import { verifyWebhook } from '@clerk/backend/webhooks';

const app = new Hono<{ Bindings: { CLERK_WEBHOOK_SIGNING_SECRET: string } }>();

app.post('/user-created', async (c) => {
	const signingSecret = c.env.CLERK_WEBHOOK_SIGNING_SECRET;
	if (!signingSecret) {
		console.error('CLERK_WEBHOOK_SIGNING_SECRET is not set');
		return c.text('Signing secret not set', 500);
	}

	try {
		// verifyWebhook expects a Request and options with signingSecret
		const evt = await verifyWebhook(c.req.raw, { signingSecret });
		console.log('Received Clerk webhook:', evt);
		return c.text('Webhook received', 200);
	} catch (err) {
		console.error('Error verifying webhook:', err);
		return c.text('Error verifying webhook', 400);
	}
});

export default app;