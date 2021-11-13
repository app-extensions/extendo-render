# Extendo-render-app

App that delivers great custom renderers for Math, Jupyter Notebooks, and Mermaid charts.

All of these are delivered by installing the app on your repo, org, or enterprise. Installation is done through
config-as-code by dropping a simple markup file like the one shown below in the appropriate GitHub config location
(e.g., `.github` folder or repo). Note that in the example below, you can name the file whatever you want but it 
must go in the `apps/installation` folder of the config location. 

**.github/apps/installation/coolRendering.yaml**
```yaml
name: extendo-render install
description: Installation of the extendo-render app
installation:
  uses: apps://extendo-render@v1.0
```

# Image based renderers

This app has a number of image based renderers. For example, the [Mermaid](https://mermaid-js.github.io/mermaid/#/) and [Jupyter Notebook]() renderers both use images as either their setup is complex (Mermaid) or they use a non-JavaScript execution environment (Jupyter). In the config for this app, the images are referenced as `image://<user/repo:tag>`. So, for example, `image://jeffmcaffer/mermaid:1`. Note the `tag` is not optional -- when you configure in an image to run it must be a fixed version.

## Building

Standard Docker build and give it a tag so we can run locally. 

```shell
docker build -t mermaid . 
```

## Testing

You can run this renderer locally just using standard Docker commands and mount this dir as the `tmp/extendo-compute` folder for the container to use. You only need to set the `GITHUB_TOKEN` env var if your `input.json` points to a file on GitHub that requires a token to access. Note you can also embed the Mermaid diagram spec directly in the `input.json` `inputs.contents` property. 

```shell
docker run -it -v (pwd)/samples/<sample to run>:/tmp/extendo-compute [-env GITHUB_TOKEN <token>] mermaid
```

So, for example, the following renders a simple diagram

```shell
docker run -it -v $(pwd)/samples/simple:/tmp/extendo-compute mermaid
```

## Publishing
Once you're happy with the operation of the code you need to publish the image to an image repository where the Extendo Compute infrastructure can find and run it. Currently that's only public Docker Hub.

Assuming you built the image with a `mermaid` tag, you'll need to first add a tag for your Docker Hub repo. Note you can skip this if you built the original image with your user/repo name to start. Note you need to tag each version you want to push.

```shell
docker tag mermaid jeffmcaffer/mermaid:1
```

Then you just need to push the image. (You'll have to auth with Docker Hub)

```shell
docker push jeffmcaffer/mermaid:1
```

## Running

In the ultimate system, when the app configuration is installed, the system detects the use of an image and spins up a set of compute resources to run the detected image. For now, that detection and infrastructure setup is manual. Before requesting compute from an image-based configuration, you need to ensure it's started. 

The first time an image version is mentioned in an installed config, you need to pull and start the image. For example, assuming the [Extendo Compute Image support](https://github.com/github/extendo-compute-image) is cloned on disk beside this repo, the following command pulls the published image, preps the image and the machine to run the image, and starts it as instance 1. 

```shell
cd mermaid
../../extendo-compute-image/tools/start.sh pull -instance 1 -t jeffmcaffer/mermaid:1
```

> Since we don't currently have any orchestration and management of user-images, you have to manage the instance ids. Each image MUST have a unique instance id (starting with 0). This is used as the basis for allocating and managing system resources like network addresses and ports. It's also important to run these commands in the folder corresponding to the image you want to run to prevent file collisions.

The `pull` process only needs to be done once per image version per machine. For subsequent system restarts, simply start the instance (omit `pull` from the command line).

```shell
../extendo-compute-image/tools/start.sh -instance 1 -t jeffmcaffer/mermaid:1
```



