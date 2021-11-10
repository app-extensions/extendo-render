# Mermaid rendering

This is a Docker based [Mermaid](https://mermaid-js.github.io/mermaid/#/) renderer that uses the [Mermaid CLI](https://github.com/mermaid-js/mermaid-cli) project's [Docker image](https://hub.docker.com/r/minlag/mermaid-cli) setup but configures and runs Mermaid directly. We could also just call the CLI but, well, this is an example. 

## Building

Standard Docker build and give it a tag so we can run locally. 

```shell
docker build -t mermaid . 
```

## Testing

You can run this renderer locally just using standard Docker commands and mount this dir as the `tmp/extendo-compute` folder for the container to use. You only need to set the `GITHUB_TOKEN` env var if your `input.json` points to a file on GitHub that requires a token to access. Note you can also embed the Mermaid diagram spec directly in the `input.json` `inputs.contents` property. 

```shell
docker run -it -v (pwd)/samples/<sample to run>:/tmp/extendo-compute -env GITHUB_TOKEN <PAT if needed> mermaid
```
So, for example, the following renders a simple diagram

```shell
docker run -it -v $(pwd)/samples/simple:/tmp/extendo-compute mermaid
```

