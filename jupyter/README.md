This is a Docker based Mermaid rendering handler. Ideally it would be a generic Docker image that adheres to an API contract somewhet like the other config handlers or Actions (or those converge) where we lay down some files in a known spot and the handler runs and gives the outputs in a known way. 

For now however, our approach to Docker support is bound to Lambda and the supplied image must be suitable for running as a lambda function.
Going forward there are a few options to explore;
* Can we [use Lambda layers and extensions](https://aws.amazon.com/blogs/compute/working-with-lambda-layers-and-extensions-in-container-images/) to inject our logic into the customer image?
* Can we generate a new image that layers on our functionality?   

docker build -t mermaid . 
docker run -v c:\temp\tmp:/tmp mermaid ./node_modules/.bin/mmdc -i /tmp/content.mmd -o /tmp/content.svg -p ./puppeteer-config.json



docker run -v c:\temp\tmp:/tmp -it mermaid bash
node --unhandled-rejections=strict ./node_modules/@mermaid-js/mermaid-cli/index.bundle.js -i /tmp/content.mmd -o /tmp/content.svg -p ./puppeteer-config.json

node ./test.js -i /tmp/content.mmd -o /tmp/content.svg -p ./puppeteer-config.json
node --unhandled-rejections=strict --trace-warnings ./test.js -i /tmp/content.mmd -o /tmp/content.svg -p ./puppeteer-config.json

node ./node_modules/@mermaid-js/mermaid-cli/test.js -i /tmp/content.mmd -o /tmp/content.svg -p ./puppeteer-config.json

node ./test.js
 