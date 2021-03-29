This is a Docker based Juptyer notebook rendering handler.

docker build -t jupyter . 
docker run -v c:\temp\tmp:/tmp/extendo-compute jupyter

docker run -v c:\temp\tmp:/tmp/extendo-compute -it --entrypoint bash nb