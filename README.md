# SMS Validation API
## Access the app through https://smsvalidationapi.herokuapp.com/
The app has been deployed on Heroku.

Redis has been used for caching. Redis server runs on Redis Enterprise Cloud.
## Starting the service

Clone the repository and follow the commands:

        >cd ValidationAPI

        >npm install

        >npm start

Sever will start on port 5000
## Usage
Sending a POST request to __/inbound/sms__ JSON format:

        {
            "from": "123456",
        	"to": "3456789",
            "text": "Hello"
        }
You will get a response like this:

        {
        	"message": "inbound sms is ok",
            "error": ""
        }
If a required parameter is missing, for example:

        {
        	"to": "3456789",
            "text": "Hello"
        }
You will get a response like this:
        
        {
             "message": "",
             "error": " <from> is missing"
        }
If a parameter is invalid, for example:

        {
            "from": "aaa776",
        	"to": "3456789",
            "text": "Hello"
        }
You will get a response like this:
        
        {
             "message": "",
             "error": " <from> is invalid"
        }
In case of an unexpected error, you will get a response like this:
        
        {
             "message": "",
             "error": " unkown failure"
        }
When text is STOP or STOP\n or STOP\r or STOP\r\n, the ‘from’ and ‘to’ pair will be cached:
 
         {
            "from": "123456",
        	"to": "3456789",
            "text": "STOP"
        }
You will get a response like this:
 
        {
        	"message": "inbound sms is ok",
            "error": ""
        }
If a POST request is sent to __/outbound/sms__ when the pair of ‘from’ and ‘to’ matches the cached pair(STOP), for example:
 
        {
            "from": "123456",
        	"to": "3456789",
            "text": "Hello"
        }
You will get a response like this:
         
        {
             "message": "",
             "error": " sms from <123456> to <3456789> blocked by STOP request"
        }
More than 50 API requests using the same ‘from’ number will return a response like this:

        {
             "message": "",
             "error": " limit reached for <987654>"
        }


