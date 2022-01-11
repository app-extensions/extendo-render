# Jupyter rendering

This is a Docker based Jupyter notebook rendering handler that uses [nbconvert](https://github.com/jupyter/nbconvert) to illustrate doing arbitrary compute (python). For added fun we look at the notebook to see if has any special dependency markup and preload the required files and include those in the rendering.

## Running
Assuming you've setup your machine according to the [Getting started instructions](https://github.com/github/extendo-compute-image/README.md#getting-started), use [start](start.sh) and [trigger](trigger.sh) scripts (helpers for the [Extendo-compute image tools](https://github.com/github/extendo-compute-image/tools)) to start a farm of Firecracker VMs that uses your image. See `./start.sh help` and `./trigger.sh help` for details. 

Either build the image from the `Dockerfile` in this folder
```shell
./start.sh build -slots 1
```

or use the prebuilt image from dockerhub
```shell
./start.sh pull -t jeffmcaffer/jupyter -slots 1
```

Then trigger rendering with a sample input file as shown in the command line below:

```shell
./trigger.sh samples/lorenz/input.json
```

You should see some pretty printed JSON indicating success (`code: 0, status: "success"`) and a `return` value that include some `html` and perhaps some `styles` and `scripts` like the example below.

```json
{
  "code": 0,
  "status": "success",
  "return": {
    "html": "<!DOCTYPE html>\n<html>\n<head><meta charset=\" ..."
  }
}
```

> Note: If you spec's an `-instance` with the `start` command, you need to include that with `trigger` as well.

## Inputs
A rendering request is can either carry the full Jupyter Notebook or point to a notebook file in a GitHub repo. Typically the latter is more common as notebook files are somewhat larger. [The Lorenz sample](samples/lorenz/input.json) shows how you include the location details of the file to render. 

If the caller (you) needs permissions to access the file (e.g., it's in a private repo), ensure that the `GITHUB_TOKEN` env var is set to an appropriate token before triggering rendering. 

> Note: for normal use from the ExtendoHub UI, the GitHub token will be provided automatically.

```json
{
  "inputs": {
    "content": { "owner": "app-extensions", "repo": "extendo-render-app", "path": "mermaid/samples/structure/structure.mmd" }
  }
}
```
