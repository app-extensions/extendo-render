FROM minlag/mermaid-cli

WORKDIR /

COPY render.js index.js package.json package-lock.json /

# Add in our npms (in particular octokit) and move them to a different location
# We can't install into the existing one as we have a different ideal tree...
RUN npm ci
RUN mv /node_modules /extendo_modules

# Link into the previously installed mermaid npms
RUN ln -s /usr/local/share/.config/yarn/global/node_modules /node_modules

ENV NODE_PATH /extendo_modules

ENTRYPOINT [ "node", "/index.js" ]
