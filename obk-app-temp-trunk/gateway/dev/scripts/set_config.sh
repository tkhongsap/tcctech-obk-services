#!/bin/bash

# check if at least two arguments are provided
if [ $# -lt 2 ]; then
    echo "Usage: $0 <json_file> <directory1> <directory2> ..."
    exit 1
fi

# assign arguments to variables
jsonFile=$1
shift   # shift command line arguments, discarding the first one

# loop through the directories
for directory in "$@"; do
    # check if directory exists
    if [ -d "$directory" ]; then
        # find all js and json files in the directory
        for file in $(find "$directory" -type f \( -name "*.js" -o -name "*.json" \)); do
            # loop through all keys in the json file
            for key in $(jq -r 'keys[]' $jsonFile); do
                value=$(jq -r --arg key $key '.[$key]' $jsonFile)
                # replace placeholders with values in the file
                sed -i "s/\$\{\{$key\}\}/$value/g" $file
            done
        done
    else
        echo "Warning: directory $directory not found."
    fi
done
