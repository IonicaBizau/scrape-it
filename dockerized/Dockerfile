FROM mhart/alpine-node:5

MAINTAINER Bruno Cascio <@brunocascio>

# Installs scrape-it from npm globally
RUN npm i -g scrape-it > /dev/null

# Creates I/O data directory
RUN mkdir -p /data

# Adds the Magic sript
ADD ./scrap.sh /scrap.sh

# Adds execution permissions
RUN chmod +x /scrap.sh

# Command to execute when container is started
ENTRYPOINT ["/scrap.sh"]
