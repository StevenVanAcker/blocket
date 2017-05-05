FROM node

RUN apt-get update && apt-get -y upgrade && apt-get -y install git apt-transport-https software-properties-common net-tools

RUN wget -O - https://debian.neo4j.org/neotechnology.gpg.key | apt-key add -
RUN echo 'deb https://debian.neo4j.org/repo stable/' | tee /etc/apt/sources.list.d/neo4j.list
RUN echo 'deb http://ftp.debian.org/debian jessie-backports main' | tee /etc/apt/sources.list.d/jessie-backports.list
RUN apt-add-repository main 
RUN apt-add-repository contrib
RUN apt-add-repository non-free

RUN apt-get update
RUN apt install -y -t jessie-backports  openjdk-8-jre-headless ca-certificates-java
RUN apt-get -y install neo4j
RUN mkdir -p /var/run/neo4j

RUN mkdir -p /opt/blocket
WORKDIR /opt/blocket
COPY . /opt/blocket/.

RUN npm install
RUN neo4j start && sleep 10 && curl --user neo4j:neo4j --data password=foobar http://localhost:7474/user/neo4j/password
CMD neo4j start && sleep 10 && npm start -- --initialize

EXPOSE 3000

### docker build -t blocket .
### docker run --rm -ti -p 8888:3000 blocket
