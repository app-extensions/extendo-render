# Mermaid rendering

This is a Docker based Mermaid rendering handler based on [mermaid-cli](https://github.com/mermaid-js/mermaid-cli) with 
a little bit of GitHub rendering layered on top. We run this as an image (rather than an `ncc`'d Node module) because it
required Puppeteer and Chromium which are complicated installs. Besides, the mermaid-cli folks have already done a good
job of figuring it all out and handling rendering options etc. 

## Running
Assuming you've setup your machine according to the [Getting started instructions](https://github.com/github/extendo-compute-image/README.md#getting-started), use the [Extendo-compute image tools](https://github.com/github/extendo-compute-image/tools) start a farm of Firecracker VMs using the `start` tool build a runnable filesystem from an image and launch a compute control plane using that filesystem. 

Either build the image from the `Dockerfile` in this folder
```shell
./start.sh build -slots 1
```

or use the prebuilt image from dockerhub
```shell
./start.sh pull -t jeffmcaffer/mermaid -slots 1
```

Then trigger rendering with a sample input file as shown in the command line below:

```shell
./trigger.sh samples/simple/input.json
```

You should see some pretty printed JSON indicating success (`code: 0, status: "success"`) and a `return` value that include some `html` and perhaps some `styles` and `scripts` like the example below.

```json
{
  "code": 0,
  "status": "success",
  "return": {
    "html": "<svg id=\"mermaid-1638830838991\" width=\"100%\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" ..."
  }
}
```

> Note: If you spec's an `-instance` with the `start` command, you need to include that with `trigger` as well.

## Inputs
A rendering request is can either carry the full Mermaid diagram description or point to the diagram as a file in a GitHub repo.
[Simplest diagrams](samples/simple/input.json) can be embedded right in the request content.

```json
{
  "inputs": {
    "content": "graph TD;\n    A-->B;\n    A-->C;\n    B-->D;\n    C-->D;"
  }
}
```

A request that fetches a GitHub file (e.g., [the structure sample](samples/structure/input.json) needs to include the location details of the file to render. 

If the caller (you) needs permissions to access the file (e.g., it's in a private repo), ensure that the `GITHUB_TOKEN` env var is set to an appropriate token before triggering rendering. 

> Note: for normal use from the ExtendoHub UI, the GitHub token will be provided automatically.

```json
{
  "inputs": {
    "content": { "owner": "app-extensions", "repo": "extendo-render-app", "path": "mermaid/samples/structure/structure.mmd" }
  }
}
```
