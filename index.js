/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Messenger Platform Quick Start Tutorial
 *
 * This is the completed code for the Messenger Platform quick start tutorial
 *
 * https://developers.facebook.com/docs/messenger-platform/getting-started/quick-start/
 *
 * To run this code, you must do the following:
 *
 * 1. Deploy this code to a server running Node.js
 * 2. Run `npm install`
 * 3. Update the VERIFY_TOKEN
 * 4. Add your PAGE_ACCESS_TOKEN to your environment vars
 *
 */

'use strict';
const PAGE_ACCESS_TOKEN = "EAAOXmdcrZBCUBALPVPcUwh8gBbRHeImlTdqLewPe5RaRq1IATILOjK3NVTLjvUydFOl6XfmthPr2uhdbpP3fqvvaEwY03XpG974HqJP7uLJiCz1RpszZAAyNmPKIv0OfYIHkuQB9heH91HfaDfkS4U7Oxho73360n055hInQZDZD";
// Imports dependencies and set up http server
const 
  request = require('request'),
  express = require('express'),
  body_parser = require('body-parser'),
  app = express().use(body_parser.json()); // creates express http server

// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));

// Accepts POST requests at /webhook endpoint
app.post('/webhook', (req, res) => {  

  // Parse the request body from the POST
  console.log(req)
  let body = req.body;

  // Check the webhook event is from a Page subscription
  if (body.object === 'page') {

    body.entry.forEach(function(entry) {

      // Gets the body of the webhook event
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);

      // Get the sender PSID
      let sender_psid = webhook_event.sender.id;
      console.log('Sender ID: ' + sender_psid);

      // Check if the event is a message or postback and
      // pass the event to the appropriate handler function
      if (webhook_event.message) {
        handleMessage(sender_psid, webhook_event.message);        
      } else if (webhook_event.postback) {
        
        handlePostback(sender_psid, webhook_event.postback);
      }
      
    });
    // Return a '200 OK' response to all events
    res.status(200).send('EVENT_RECEIVED');

  } else {
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }

});


// Accepts GET requests at the /webhook endpoint
app.get('/webhook', (req, res) => {
  
  /** UPDATE YOUR VERIFY TOKEN **/
  const VERIFY_TOKEN = "pipa-token";
  
  // Parse params from the webhook verification request
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];
    
  // Check if a token and mode were sent
  if (mode && token) {
  
    // Check the mode and token sent are correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      
      // Respond with 200 OK and challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);      
    }
  }
});


function handleMessage(sender_psid, received_message) {
  let response;
  
  // Checks if the message contains text
  if (received_message.text) {    
    // Create the payload for a basic text message, which
    // will be added to the body of our request to the Send API
	
	response ={
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements":[
           {
            "title":"Welcome!",
            "image_url":"https://scontent-cdt1-1.xx.fbcdn.net/v/t31.0-8/s960x960/12916799_775383962597533_4700375958288038482_o.jpg?_nc_cat=102&_nc_ohc=vTISMUSqmSAAQns9NN4zaccbLgUys6BTWQcppzZlMJ50BYjOZ9AL3ypyA&_nc_ht=scontent-cdt1-1.xx&oh=13d0b980aa085cf41eac3724a8232ee2&oe=5E75EE10",
            "subtitle":"Welcome to the Socializus welcoming page. You can find some options below to find yours answers.",
            "default_action": {
              "type": "web_url",
              "url": "https://petersfancybrownhats.com/view?item=103",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.socializus.com/",
                "title":"View Our Website"
              },{
                "type":"postback",
                "title":"Start Chatting",
                "payload":"chatting"
              },{
                "type":"postback",
                "title":"Free Ticket Plan?",
                "payload":"free ticket"
              },{
                "type":"postback",
                "title":"Downloads Apps Mobile?",
                "payload":"downloads app"
              },{
                "type":"postback",
                "title":"Share/Invite friends?",
                "payload":"share to friends"
              }       			  
            ]      
          }
        ]
      }
	}
  }
  } else if (received_message.attachments) {
    // Get the URL of the message attachment
    let attachment_url = received_message.attachments[0].payload.url;
    response = {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": [{
            "title": "Is this the right screenshot?",
            "subtitle": "Tap a button to answer.",
            "image_url": attachment_url,
            "buttons": [
              {
                "type": "postback",
                "title": "Yes!",
                "payload": "yes2",
              },
              {
                "type": "postback",
                "title": "No!",
                "payload": "no2",
              }
            ],
          }]
        }
      }
    }
  } 
  
  // Send the response message
  callSendAPI(sender_psid, response);    
}

function handlePostback(sender_psid, received_postback) {
  console.log('ok')
   let response;
  // Get the payload for the postback
  let payload = received_postback.payload;

  // Set the response based on the postback payload
  if (payload === 'yes') {
    response = { "text": "Ok good choice and trust me it won't be long..All you have to do is to post a review on the pubsurfing page on TripAdvisor. Once your review posted on TripAdvisor make sure to send me back as an attachment a proof by taking a screenshot of your rewiew posted. So now i'am waiting for you to send me the screenshot and if its ok after this i will ask you to send me your email to know where to send the invitation. Good luck i'll be back soon ;)" }
  } else if (payload === 'no') {
    response = { "text": "Oops, try sending another image." }
  } else if (payload === 'yes2') {
    response = { "text": "Perfect what a pleasure to collaborate with you. So now let me know your email and i will send you an invitation to the next pubsurfing. You can also talk to your friend about this opportunity. Thank you to support us ;)" }
  } else if (payload === 'no2') {
    response = { "text": "Oops, try sending another image." }
  } else if(payload === 'free ticket')
  {
	  response = {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": [{
            "title": "Hello? Are you interested having a free pubsurfing ticket for the next trip?",
            "subtitle": "Tap a button to answer.",
            "image_url": "https://images.squarespace-cdn.com/content/5d227ba8bff56b0001b7c6f8/1567312055793-5VANB5VNCF64RN1LHFR7/free-ticket-imag.png?content-type=image%2Fpng",
            "buttons": [
              {
                "type": "postback",
                "title": "Yes!",
                "payload": "yes",
              },
              {
                "type": "postback",
                "title": "No!",
                "payload": "no",
              }
            ],
          }]
        }
      }
    }
  }
  else if(payload === 'downloads app')
  {
	  response = {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": [{
            "title": "Have you already installed the application Socializus on your Mobile? If not don't wait anymore...its available on both platforms. So take a look below ;)",
            "subtitle": "Tap a button to answer.",
            "image_url": "https://www.appsessment.com/img/news/appsessment_v1_5_android_ios_app.jpg",
            "buttons": [
              {
                "type":"web_url",
                "url":"https://www.socializus.com/",
                "title":"Android"
              },
              {
                "type":"web_url",
                "url":"https://www.socializus.com/",
                "title":"Ios"
              }
            ],
          }]
        }
      }
    }
  }
  else if(payload === 'share to friends')
  {
	 response = {
	  "type": "element_share",
	  "share_contents": { 
		"attachment": {
		  "type": "template",
		  "payload": {
			"template_type": "generic",
			"elements": [
			  {
				"title": "Share and invite your friend below",
				"subtitle": "",
				"image_url": "https://www.drupal.org/files/project-images/drupal-addtoany-share-buttons_1.png",
				"default_action": {
				  "type": "web_url",
				  "url": "https://www.facebook.com/sharer/sharer.php?kid_directed_site=0&sdk=joey&u=https%3A%2F%2Fwww.facebook.com%2Fsocializus.org%2F&display=popup&ref=plugin&src=share_button"
				},
				"buttons": [
				  {
					"type": "web_url",
					"url": "https://www.facebook.com/sharer/sharer.php?kid_directed_site=0&sdk=joey&u=https%3A%2F%2Fwww.facebook.com%2Fsocializus.org%2F&display=popup&ref=plugin&src=share_button", 
					"title": "Share"
				  }
				]
			  }
			]
		  }
		}
	  }
	}
  }
  // Send the message to acknowledge the postback
  callSendAPI(sender_psid, response);
}

function callSendAPI(sender_psid, response) {
  // Construct the message body
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response
  }

  // Send the HTTP request to the Messenger Platform
  request({
    "uri": "https://graph.facebook.com/v2.6/me/messages",
    "qs": { "access_token": PAGE_ACCESS_TOKEN },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent!')
    } else {
      console.error("Unable to send message:" + err);
    }
  }); 
}