const Mastodon = require('@lagunehq/core');

const {INSTANCE_DOMAIN, ACCESS_TOKEN} = process.env

if (!INSTANCE_DOMAIN) {
	throw new Error('INSTANCE_DOMAIN environment var is missing')
}

if (!ACCESS_TOKEN) {
	throw new Error('ACCESS_TOKEN environment var is missing')
}

const client = new Mastodon.default()

client.setUrl(`https://${INSTANCE_DOMAIN}`)
client.setStreamingUrl(`wss://${INSTANCE_DOMAIN}`)
client.setToken(ACCESS_TOKEN)

client.stream('user', message => {
	if (message.event === 'notification') {
		const notification = JSON.parse(message.payload);

		if (notification.type === 'follow') {
			client.createStatus(`Welcome @${notification.account.acct} !`, {
				visibility: 'direct'
			})
		}
	}
})
