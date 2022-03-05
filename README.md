# CAPTAIN HOOK

> :warning: **This project is intended for personal use and might not be suited to production usecases yet**. 
> It should mostly do what is expected, but be aware that it was not intended for production usecases.

CaptainHook is a small utility to replicate webhook functionality on APIs that don't provide one.
It will basically poll API endpoints on a regular basis (you can set the timing), and forward the API response to any other endpoint if the response changed.

## Prerequisites

You will need NodeJS 12+ and PostgreSQL to run this project.
## Configuration

There are a few required ENV variables (see `.env.sample`):

For the database connection: 

```
DATABASE_HOST
DATABASE_PORT
DATABASE_NAME
DATABASE_USER
DATABASE_PASSWORD
```

And for authenticating the requests: 

```
SECRET_TOKEN
```

> Pick a reasonably long random string.

## Run

First install the dependencies: 

```
yarn install
```

then build and run the project:

```
yarn build
yarn start:prod
```

You can also start in development mode, with code reloading:

```
yarn start:dev
```

## Docker

There is a Dockerfile available as well for running in production.

## Usage

This tool is based around objects called `Trackers`. 
A tracker monitors an endpoint and forwards the response as is to another endpoint whenever it changes.
You can create any number of trackers.

The usage is pretty simple. There are a few API enpoints you can use:

### Authentication

All the request must include an authorization header:

```
Authorization: Bearer <secret token>
```

The secret token being the one you defined in the env variables.

### GET /trackers

Lists all the trackers currently created. 

*Example response*:

```
[
	{
		"id": 42,
		"name": "Time",
		"interval": 10000,
		"trackedUrl": "http://worldtimeapi.org/api/timezone/Europe/Paris",
		"trackedUrlHeaders": {},
		"latestResponseHash": "7693a0e83121a80eb0497a0ffaae70b5",
		"targetUrl": "https://eoxyy9r8winxf3i.m.pipedream.net"
	},
  ...
]
```

### POST /trackers

Creates a new tracker.

*Payload*:

```
{
	"name": "My tracker",
  "interval": 10000,
  "trackedUrl": "http://example.com/endpoint",
	"trackedUrlHeaders": {
	},
  "targetUrl": "http://example.com/webhook"
}
```

- **name**: A name for your tracker
- **interval**: The polling interval in ms
- **trackedUrl**: The API endpoint you want to track
- **trackedUrlHeaders**: The headers you want to add to your request. Like authorization headers
- **targetUrl**: Your target URL where you want the responses to be forwarded

*Example response*:

```
{
	"name": "My tracker",
  "interval": 10000,
  "trackedUrl": "http://example.com/endpoint",
	"trackedUrlHeaders": {
	},
  "targetUrl": "http://example.com/webhook"
	"id": 42
}
```

### DELETE /trackers/:id

Delete the tracker with the ID `:id`. It will stop the polling of the target endpoint.

