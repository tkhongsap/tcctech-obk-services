#!/bin/bash

# Check if at least one parameter is provided
if [ "$#" -lt 1 ]; then
    echo "Usage: $0 <URL> [<POST_DATA>]"
    exit 1
fi

# Parameters
URL=$1
POST_DATA=$2

# Output file
LOGFILE="response.log"

# Check if POST_DATA is provided
if [ -z "$POST_DATA" ]; then
    # If no POST_DATA, perform a GET request
    echo "Making GET request to $URL"
    response=$(curl -s -w "%{http_code}" -o /tmp/curl_response.txt "$URL")
else
    # If POST_DATA is provided, perform a POST request
    echo "Making POST request to $URL with data: $POST_DATA"
    response=$(curl -s -w "%{http_code}" -o /tmp/curl_response.txt -X POST -d "$POST_DATA" -H "Content-Type: application/json" "$URL")
fi

# Capture HTTP status code
status_code="${response: -3}"
echo "HTTP Status Code: $status_code"

# Save response body to logfile
cat /tmp/curl_response.txt > "$LOGFILE"

# Check if the request was successful
if [ "$status_code" -eq 200 ]; then
    echo "Request successful. Response saved to $LOGFILE."
else
    echo "Request failed with status code $status_code. Check $LOGFILE for details."
fi

# Clean up
rm /tmp/curl_response.txt
