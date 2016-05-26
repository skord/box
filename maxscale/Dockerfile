FROM ubuntu:14.04.4
RUN apt-get update
RUN apt-get -y install vim curl wget
WORKDIR /root
RUN wget https://downloads.mariadb.com/enterprise/mv8n-qc1d/generate/10.1/mariadb-enterprise-repository.deb
RUN dpkg -i mariadb-enterprise-repository.deb
RUN apt-get update
RUN apt-get install -y maxscale
ADD maxscale.cnf /etc/maxscale.cnf
CMD ["maxscale","-d"]
