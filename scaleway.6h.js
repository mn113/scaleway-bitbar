#!/usr/bin/env /usr/local/bin/node

//const http = require('http');
const fs = require('fs');
//const path = require('path');
const exec = require('child_process').exec;

// Icons:
const SCALEWAY_ICON = '⚖';
const PARIS = '🇫🇷';
const AMSTERDAM = '🇳🇱';
const RUNNING = '🔵';
const STOPPED = '🔴';

const REGIONS = {
	'par1': PARIS,
	'ams1': AMSTERDAM
};

var APIKEY;


outputBefore();

// Start by reading in the API key file:
fs.readFile(__dirname +'/apikey', 'utf8', function (err, data) {
	if (err) { throw err; }
	APIKEY = data.trim();
	// Make one request for each region:
	Object.keys(REGIONS).forEach(region => {
		doCurl(region);
	});
});

// Perform curl request to Scaleway API:
function doCurl(region) {
	var resource = 'servers';
	//images
	//volumes
	//users/{user_id}
	//snapshots

	const scalewayApiUrl = 'https://cp-'+region+'.scaleway.com/';
	const headers = `-H 'X-Auth-Token: ${APIKEY}' -H 'Content-Type: application/json'`;
	const curl_scaleway = `curl ${headers} --url ${scalewayApiUrl}${resource}`;

	exec(curl_scaleway, (error, stdout, stderr) => {
	    if (error) {
	        console.error('stderr', stderr);
	        throw error;
	    }
		var response = JSON.parse(stdout);
		//console.warn(response);

		outputServers(response, region);
	});
}

// Render the menu:
function outputServers(response, region) {
	response.servers.forEach(server => {
		var icon = (server.state == 'running') ? RUNNING : STOPPED;
		console.log(REGIONS[region], icon, '['+server.commercial_type+']', server.hostname);
		console.log("--"+server.image.name);
		console.log("--"+server.volumes[0].name);
		console.log("--"+server.state, ',', server.state_detail);
		console.log("--"+server.private_ip, 'private');
		console.log("--"+server.public_ip.address, 'public');
	});
	if (region == 'ams1') outputAfter();
}

function outputBefore() {
	console.log(SCALEWAY_ICON);
	console.log("---");
	console.log("Servers");
}

function outputAfter() {
	// Menubar afters:
	console.log("Options");
	console.log("--Open script file | bash='${EDITOR:-nano}' param1="+__filename);
	console.log("--Reload plugin | refresh=true terminal=false");
}
