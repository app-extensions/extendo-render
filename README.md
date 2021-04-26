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

   