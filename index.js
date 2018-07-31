const assert = require('assert')
const Mastodon = require('@lagunehq/core')

const {MWB_INSTANCE_DOMAIN, MWB_ACCESS_TOKEN, MWB_MESSAGE} = process.env

assert(MWB_INSTANCE_DOMAIN, 'MWB_INSTANCE_DOMAIN environment var is required')
assert(MWB_ACCESS_TOKEN, 'MWB_ACCESS_TOKEN environment var is required')
assert(MWB_MESSAGE, 'MWB_MESSAGE environment var is required')

const client = new Mastodon.default()

client.setUrl(`https://${MWB_INSTANCE_DOMAIN}`)
client.setStreamingUrl(`wss://${MWB_INSTANCE_DOMAIN}`)
client.setToken(MWB_ACCESS_TOKEN)

client.stream('user', message => {
	if (message.event === 'notification') {
		const notification = JSON.parse(message.payload);

		if (notification.type === 'follow' && notification.account.statuses_count === 0) {
			client.createStatus(`@${notification.account.acct} ${MWB_MESSAGE}`, {
				visibility: 'direct'
			})
		}
	}
})
