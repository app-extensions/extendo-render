FROM minlag/mermaid-cli

WORKDIR /

RUN ln -s /usr/local/share/.config/yarn/global/node_modules /node_modules

ENTRYPOINT [ "node", "/mermaid.js" ]
COPY render.js mermaid.js /
