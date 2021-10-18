# Start off with a slimmed down Node image and install python.  The python base images seem
# to have too much and it confuses jupyter
FROM node:buster-slim 

RUN apt-get update && apt-get -y update
RUN apt-get install -y build-essential python3 python3-pip python3-dev
RUN pip3 -q install pip --upgrade

RUN python3 -m pip install ipykernel
RUN python3 -m ipykernel install
RUN python3 -m pip install notebook
RUN python3 -m pip install nbconvert
RUN python3 -m pip install matplotlib
RUN python3 -m pip install ipywidgets
RUN python3 -m pip install numpy
RUN python3 -m pip install scipy

WORKDIR /

# Point python and matplotlib working directories to /tmp since in lambda that's the only writable spot
ENV IPYTHONDIR=/tmp/_ipython
ENV TMPDIR=/tmp
ENV TEMP=/tmp
ENV TMP=/tmp
ENV MPLCONFIGDIR=/tmp
ENV JUPYTER_CONFIG_DIR=/tmp/jupyter

# Copy our little GitHub adapter. Split the package install and file copy to speed 
# innerloop iteration on our code
COPY package.json package-lock.json /
RUN npm ci
COPY index.js code.js /

ENTRYPOINT [ "node", "/index.js" ]
