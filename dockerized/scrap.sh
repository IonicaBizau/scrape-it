#!/bin/sh

# Fix to message "scrape-it module not found"
export NODE_PATH=/usr/lib/node_modules

# Output dir of scrapped sites
OUT="/data/scrapped"

# Creates if not exists
`mkdir -p "$OUT"`

# Now scrapte-it only supports .js format
OUTPUT_EXTENSION="js"

# Iterates over all *.js files inside the /data directory
for filepath in $(ls /data/*.js);
do
  # filename of site to scrap
  file=$(basename "$filepath")
  filename="${file%.*}"
  printf "Scrapping $filename: "
  (
    # Writes the scrapped output in $OUT folder with $filename name
    node "$filepath" > "${OUT}/${filename}.${OUTPUT_EXTENSION}"
  ) > /dev/null && echo "OK" || echo "FAIL"
done
