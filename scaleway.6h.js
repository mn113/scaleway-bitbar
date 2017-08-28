#!/usr/bin/env /usr/local/bin/node

const http = require('http');
const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;

const REGION = 'ams';
const BASEURL = 'https://cp-'+REGION+'1.scaleway.com/';
var APIKEY;

const RUNNING = '🔵';
const STOPPED = '🔴';
const SCALEWAY_ICON = '⚖';


// Start by reading in the API key file:
fs.readFile(__dirname +'/apikey', 'utf8', function (err, data) {
	if (err) { throw err; }
	APIKEY = data.trim();
	doCurl();
});

// Perform curl request to Scaleway API:
function doCurl() {
	var resource = 'servers';
	//images
	//volumes
	//users/{user_id}
	//snapshots

	var curl_scaleway = `curl -H 'X-Auth-Token: ${APIKEY}' -H 'Content-Type: application/json' --url ${BASEURL}${resource}`;

	exec(curl_scaleway, (error, stdout, stderr) => {
	    if (error) {
	        console.error('stderr', stderr);
	        throw error;
	    }
		var response = JSON.parse(stdout);

		output(response);
	});
}

// Render the menu:
function output(response) {
	console.log(SCALEWAY_ICON);
	console.log("---");
	//console.warn(response);
	console.log("Servers");
	response.servers.forEach(server => {
		var icon = (server.state == 'running') ? RUNNING : STOPPED;
		console.log(icon, '['+server.commercial_type+']', server.hostname);
		console.log("--"+server.image.name);
		console.log("--"+server.volumes[0].name);
		console.log("--"+server.state, ',', server.state_detail);
		console.log("--"+server.private_ip, 'private');
		console.log("--"+server.public_ip.address, 'public');
	});
	// Menubar afters:
	console.log("Options");
	console.log("--Open script file | bash='${EDITOR:-nano}' param1="+__filename);
	console.log("--Reload plugin | refresh=true terminal=false");
}
