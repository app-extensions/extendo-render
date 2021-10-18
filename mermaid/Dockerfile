FROM minlag/mermaid-cli

USER root

RUN mkdir -p /render
WORKDIR /render

# Add in our npms (in particular octokit) and move them to a different location
# We can't install into the existing one as we have a different ideal tree...
COPY package.json package-lock.json ./
RUN npm ci
RUN mv ./node_modules ./extendo_modules

# Link into the previously installed mermaid npms
RUN ln -s /home/mermaidcli/node_modules ./node_modules

ENV NODE_PATH ./extendo_modules

COPY code.js index.js ./

ENTRYPOINT [ "node", "./index.js" ]