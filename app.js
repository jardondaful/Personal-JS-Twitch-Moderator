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


//********************components for moderator bot are as below********************


//calls on checkTwitchChat to check most recent message sent
function message_handler(channel, userstate, message, self) 
{
  checkTwitchChat(userstate, message, channel)
}

//Outputs on compiler that the bot conencted to my channel
function connect_notification(address, port) 
{
  console.log(`Connected: ${address}:${port}`)
}

//Outputs on compiler that the bot disconnected from my channel
function disconnect_notification(reason) 
{
  console.log(`Disconnected: ${reason}`)
}

//Tells bot to give thanks to whoever is hosting my Twitch channel in chat
function hosted_notificaton(channel, username, viewers, autohost) 
{
  client.say(channel,`Thank you so much @${username} for the host of ${viewers}!`)
}

//Tells bot to give thanks to whoever is raiding my Twitch channel in chat
function raided_notification(channel, username, viewers) 
{
  client.say(channel,`Thank you so much @${username} for the raid of ${viewers}!`)
}

//Tells bot to give thanks to whoever subscribed to my Twitch channel in chat
function subscription_notification(channel, username, method, message, userstate) 
{
  client.say(channel,`Thank you so much @${username} for subscribing!`)
}

//Tells bot to give thanks to whoever cheered bits in chat and says how many bits the viewer cheered
function cheer_notification(channel, userstate, message)  
{
  client.say(channel,`Thank you so much @${userstate.username} for the ${userstate.bits} bits!`)
}

//Tells bot to give thanks to whoever subscribed to my Twitch channel in chat
function continuing_gifted_subscription_notification(channel, username, sender, userstate) 
{
  client.say(channel,`Thank you so much @${username} for continuing your gifted sub!`)
}

//Tells bot to tell viewers that my channel will be hosting another channel that is currently live
function hosting_notification(channel, target, viewers) 
{
  client.say(channel,`We are now hosting ${target} with ${viewers} viewers!`)
}

//outputs that the bot is reconnecting to my channel
function reconnect_notification() 
{
  console.log('Reconnecting...')
}

//Tells bot to give thanks to whoever resubscribed to my Twitch channel in chat
function resubscription_handler(channel, username, months, message, userstate, methods) 
{
  const cumulativeMonths = userstate['msg-param-cumulative-months']
  client.say(channel, `Thank you so much @${username} for the ${cumulativeMonths} sub! You are quite the dedicated viewer!`)
}

//Tells bot to give thanks to whoever gifted a subscription to my Twitch channel to someone in chat
function gifted_subscription_notification(channel, username, streakMonths, recipient, methods, userstate) 
{
  client.say(channel,`Thank you so much @${username} for gifting a sub to ${recipient}}.`)
}

//Tells bot to greet the viwer back for me when he/she types in the '!hello' function
function hello_notification(channel, userstate) 
{
  client.say(channel, `What's up @${userstate.username}!`)
}

//Tells bot to give the invite link to my discord channel for me to the viewer that types in the '!dc' function
function discord_notification(channel, userstate) 
{
  client.say(channel, `Feel free to join the discord channel @${userstate.username}! Here is the link: https://discord.gg/VVQFJsv8`)
}

//Tells bot to give the invite link to my discord channel for me to the viewer that types in the '!fc' function
function friend_code_notification(channel, userstate) 
{
  client.say(channel, `Here is my friend code @${userstate.username}: SW-6009-7104-9036`)
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
    //deletes the message that contains a banned word
    client.deletemessage(channel, userstate.id)
    //tells user that his/her message was deleted when he/she sends a message that contains a banned word in channel_info_and_banned_words.js
    client.say(channel, `Your message contained a foul word @${userstate.username}. Be careful next time!`)
  }
}


//********************connecting Twitch client to moderator bot's components is as shown below********************


//sets up variable client
const client = new tmi.Client(options)

//connects bot to the client
client.connect()

//Executes disconnect_notification() function (written later in program) when the bot disconnects from my Twitch channel
client.on('disconnected', (reason) => {disconnect_notification(reason)})

//Executes connect_notification() function (written later in program) when Twitch client receives a notification that a viewer cheered my channel any amount of bits
client.on('connected', (address, port) => {connect_notification(address, port)})

//Executes hosted_notification() function (written later in program) when Twitch client receives a notification that a viewer cheered my channel any amount of bits
client.on('hosted', (channel, username, viewers, autohost) => {hosted_notification(channel, username, viewers, autohost)})

//Executes subscription_notification() function (written later in program) when Twitch client receives a notification that a viewer cheered my channel bits
client.on('subscription', (channel, username, method, message, userstate) => {subscription_notification(channel, username, method, message, userstate)})

//Executes raided_notification() function (written later in program) when Twitch client receives a notification that a viewer cheered my channel bits
client.on('raided', (channel, username, viewers) => {raided_notification(channel, username, viewers)})

//Executes cheer_notification() function (written later in program) when Twitch client receives a notification that a viewer cheered my channel bits
client.on('cheer', (channel, userstate, message) => {cheer_notification(channel, userstate, message)})

//Executes gifted_subscription_notification() function (written later in program) when Twitch client receives a notification that a viewer gifted a subscription to my channel to someone else
client.on('giftpaidupgrade', (channel, username, sender, userstate) => {continuing_gifted_subscription_notification(channel, username, sender, userstate)})

//Executes hosted_notification() function (written later in program) when Twitch client receives a notification that a Twitch streamer is hosting my channel
client.on('hosting', (channel, target, viewers) => {hosted_notification(channel, target, viewers)})

//Executes reconnect_notification() function (written later in program) when the bot is reconnecting to my channel
client.on('reconnect', () => {reconnect_notification()})

//Executes resubscription_notification() function (written later in program) when Twitch client receives a notification that a viewer has subscribed to my Twitch channel
client.on('resub', (channel, username, months, message, userstate, methods) => {resubscription_notification(channel, username, months, message, userstate, methods)})

//Executes gifted_subscription_notification() function (written later in program) when Twitch client receives a notification that a viewer has subscribed to my Twitch channel
client.on('subgift', (channel, username, streakMonths, recipient, methods, userstate) => {gifted_subscription_notification(channel, username, streakMonths, recipient, methods, userstate)})

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
    hello_notification(channel, userstate)
    return
  }

  if(message.toLowerCase() === '!dc') 
  {
    discord_notification(channel, userstate)
    return
  }

  if(message.toLowerCase() === '!fc') 
  {
    friend_code_notification(channel, userstate)
    return
  }
  message_handler(channel, userstate, message, self)
})
