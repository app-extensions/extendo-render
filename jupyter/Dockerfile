# https://github.com/jgoldfar/pandoc-nbconvert-docker
FROM python:3.9.2-buster

# install node
RUN apt-get update -y && \
    apt-get install -y -o Acquire::Retries=10 --no-install-recommends \
    nodejs

RUN pip3 install nbconvert

RUN python3 -m pip install ipykernel
RUN python3 -m ipykernel install --user
RUN python3 -m pip install --user matplotlib
RUN python3 -m pip install --user ipywidgets
RUN python3 -m pip install --user numpy
RUN python3 -m pip install --user scipy

# Set CWD to /source on entry.
# Add -v `pwd`:/source to your run command to make the files in your working
# directory available to pandoc or jupyter
# WORKDIR /source

WORKDIR /

# Expose /source as an external volume
# VOLUME /source

# ENTRYPOINT ["/usr/local/bin/jupyter"]
# CMD ["--help"]

COPY jupyter.js render.js /
COPY ./node_modules ./node_modules
ENTRYPOINT [ "node", "/jupyter.js" ]
