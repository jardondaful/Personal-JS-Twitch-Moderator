import tmi from 'tmi.js'
import { BOT_USERNAME , OAUTH_TOKEN, CHANNEL_NAME, BLOCKED_WORDS } from './channel_info_and_banned_words'

//Specifications for bot so it knows which Twitch channel to connect to and how to do so
const options = 
{
	options: { debug: true },
	connection: 
  {
    reconnect: true,
    secure: true,
    timeout: 180000,
    reconnectDecay: 1.4,
    reconnectInterval: 1000,
	},

	identity: 
  {
		username: BOT_USERNAME,
		password: OAUTH_TOKEN
	},
  
	channels: [ CHANNEL_NAME ]
}


//calls on checkTwitchChat to check most recent message sent by viewer
function onMessageHandler (channel, userstate, message, self) 
{
  checkTwitchChat(userstate, message, channel)
}

//Outputs on compiler that the bot conencted to my channel
function onConnectedHandler(address, port) 
{
  console.log(`Connected: ${address}:${port}`)
}

//Outputs on compiler that the bot disconnected from my channel
function onDisconnectedHandler(reason) 
{
  console.log(`Disconnected: ${reason}`)
}

//Tells bot to give thanks to whoever is hosting my Twitch channel in chat
function onHostedHandler (channel, username, viewers, autohost) 
{
  client.say(channel,`Thank you so much @${username} for the host of ${viewers}!`)
}

//Tells bot to give thanks to whoever is raiding my Twitch channel in chat
function onRaidedHandler(channel, username, viewers) 
{
  client.say(channel,`Thank you so much @${username} for the raid of ${viewers}!`)
}

//Tells bot to give thanks to whoever subscribed to my Twitch channel in chat
function onSubscriptionHandler(channel, username, method, message, userstate) 
{
  client.say(channel,`Thank you so much @${username} for subscribing!`)
}

//Tells bot to give thanks to whoever cheered bits in chat and says how many bits the viewer cheered
function onCheerHandler(channel, userstate, message)  
{
  client.say(channel,`Thank you so much @${userstate.username} for the ${userstate.bits} bits!`)
}

//Tells bot to give thanks to whoever subscribed to my Twitch channel in chat
function onGiftPaidUpgradeHandler(channel, username, sender, userstate) 
{
  client.say(channel,`Thank you so much @${username} for continuing your gifted sub!`)
}

//Tells bot to tell viewers that my channel will be hosting another channel that is currently live
function onHostingHandler(channel, target, viewers) 
{
  client.say(channel,`We are now hosting ${target} with ${viewers} viewers!`)
}

//outputs that the bot is reconnecting to my channel
function reconnectHandler() 
{
  console.log('Reconnecting...')
}

//Tells bot to give thanks to whoever resubscribed to my Twitch channel in chat
function resubHandler(channel, username, months, message, userstate, methods) 
{
  const cumulativeMonths = userstate['msg-param-cumulative-months']
  client.say(channel, `Thank you so much @${username} for the ${cumulativeMonths} sub! You are quite the dedicated viewer!`)
}

//Tells bot to give thanks to whoever gifted a subscription to my Twitch channel to someone in chat
function subGiftHandler(channel, username, streakMonths, recipient, methods, userstate) 
{
  client.say(channel,`Thank you so much @${username} for gifting a sub to ${recipient}}.`)
}

//Tells bot to greet me when I go live
function hello(channel, userstate) 
{
  client.say(channel, `@${userstate.username}, heya!`)
}

//Tells bot to delete a message from a viewer that contains an explicit word mentioned
function checkTwitchChat(userstate, message, channel) 
{
  console.log(message)
  message = message.toLowerCase()
  let shouldSendMessage = false
  shouldSendMessage = BLOCKED_WORDS.some(blockedWord => message.includes(blockedWord.toLowerCase()))
  if (shouldSendMessage) 
  {
    //tells user that his/her message was deleted when he/she sends a message that contains a banned word in channel_info_and_banned_words.js
    client.say(channel, `@${userstate.username}, sorry!  You message was deleted.`)
    //deletes the message that contains a banned word
    client.deletemessage(channel, userstate.id)
  }
}


//sets up variable client
const client = new tmi.Client(options)

//connects bot to the client
client.connect()

//Executes onDisconnectedHandler() function (written later in program) when the bot disconnects from my Twitch channel
client.on('disconnected', (reason) => {onDisconnectedHandler(reason)})

//Executes onSubscriptionHandler() function (written later in program) when Twitch client receives a notification that a viewer cheered my channel any amount of bits
client.on('connected', (address, port) => {onConnectedHandler(address, port)})

//Executes onSubscriptionHandler() function (written later in program) when Twitch client receives a notification that a viewer cheered my channel any amount of bits
client.on('hosted', (channel, username, viewers, autohost) => {onHostedHandler(channel, username, viewers, autohost)})

//Executes onSubscriptionHandler() function (written later in program) when Twitch client receives a notification that a viewer cheered my channel bits
client.on('subscription', (channel, username, method, message, userstate) => {onSubscriptionHandler(channel, username, method, message, userstate)})

//Executes onRaidedHandler() function (written later in program) when Twitch client receives a notification that a viewer cheered my channel bits
client.on('raided', (channel, username, viewers) => {onRaidedHandler(channel, username, viewers)})

//Executes onHostingHandler() function (written later in program) when Twitch client receives a notification that a viewer cheered my channel bits
client.on('cheer', (channel, userstate, message) => {onCheerHandler(channel, userstate, message)})

//Executes onGiftPaidUpgradeHandler() function (written later in program) when Twitch client receives a notification that a viewer gifted a subscription to my channel to someone else
client.on('giftpaidupgrade', (channel, username, sender, userstate) => {onGiftPaidUpgradeHandler(channel, username, sender, userstate)})

//Executes onHostingHandler() function (written later in program) when Twitch client receives a notification that a Twitch streamer is hosting my channel
client.on('hosting', (channel, target, viewers) => {onHostingHandler(channel, target, viewers)})

//Executes reconnectHandler() function (written later in program) when the bot is reconnecting to my channel
client.on('reconnect', () => {reconnectHandler()})

//Executes resubHandler() function (written later in program) when Twitch client receives a notification that a viewer has subscribed to my Twitch channel
client.on('resub', (channel, username, months, message, userstate, methods) => {resubHandler(channel, username, months, message, userstate, methods)})

//Executes subGiftHandler() function (written later in program) when Twitch client receives a notification that a viewer has subscribed to my Twitch channel
client.on('subgift', (channel, username, streakMonths, recipient, methods, userstate) => {subGiftHandler(channel, username, streakMonths, recipient, methods, userstate)})

//Executes code within when Twitch client receives a message from my channel
client.on('message', (channel, userstate, message, self) => 
{
  if(self) 
  {
    return
  }

  if (userstate.username === BOT_USERNAME) 
  {
    console.log(`Not checking bot's messages.`)
    return
  }

	if(message.toLowerCase() === '!hello') 
  {
    hello(channel, userstate)
    return
  }

  onMessageHandler(channel, userstate, message, self)
})
