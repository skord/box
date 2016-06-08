FROM centos:centos7
RUN yum -y install epel-release
RUN yum -y install git gcc gcc-c++ ncurses-devel bison flex glibc-devel cmake libgcc perl \
     make libtool openssl openssl-devel libaio libaio-devel librabbitmq-devel \
     libcurl-devel pcre-devel tcl tcl-devel systemtap-sdt-devel libuuid libuuid-devel
WORKDIR /root
ADD maxscale /root/MaxScale
RUN curl -L -o mariadb-connector-c-2.2.3-src.tar.gz https://downloads.mariadb.org/f/connector-c-2.2.3/mariadb-connector-c-2.2.3-src.tar.gz/from/http%3A//fr.mirror.babylon.network/mariadb/?serve
RUN tar zxvf mariadb-connector-c-2.2.3-src.tar.gz
WORKDIR /root/mariadb-connector-c-2.2.3-src
RUN cmake .
RUN make && make install
RUN echo "/usr/local/lib/mariadb/" > /etc/ld.so.conf.d/mariadb.conf && ldconfig
WORKDIR /root/MaxScale
RUN git checkout develop
RUN mkdir build
WORKDIR /root/MaxScale/build
RUN cmake .. -DBUILD_TESTS=Y -DWITH_SCRIPTS=FALSE
RUN make && make install
ADD maxscale.cnf /etc/maxscale.cnf
RUN mkdir -p /var/run/maxscale
CMD ["maxscale","-d"]
