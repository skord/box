FROM centos:centos7
RUN yum -y install epel-release
RUN yum -y install gcc gcc-c++ ncurses-devel bison flex glibc-devel cmake libgcc git perl make libtool openssl openssl-devel libaio libaio-devel librabbitmq-devel \
    libcurl-devel pcre-devel libedit-devel rpm-build jemalloc-devel libxml2-devel systemtap-sdt-devel expectk tk
WORKDIR /root
RUN git clone https://github.com/MariaDB/server.git
WORKDIR /root/server
RUN cmake . -DWITH_SSL=system -DWITH_ZLIB=bundled -DENABLED_LOCAL_INFILE=1 -DWITH_JEMALLOC=system -DWITH_WSREP=ON -DWITH_INNODB_DISALLOW_WRITES=ON -DWITH_EMBEDDED_SERVER=ON -DCMAKE_INSTALL_PREFIX=/root/mariadb10.1
RUN make && make install
WORKDIR /root
ADD maxscale /root/MaxScale
WORKDIR /root/MaxScale
RUN git checkout develop
RUN mkdir build
WORKDIR /root/MaxScale/build
RUN yum install -y pcre2-devel doxygen mariadb-devel libuuid-devel
RUN cmake .. -DMYSQL_EMBEDDED_INCLUDE_DIR=/root/mariadb10.1/include/mysql -DMYSQL_EMBEDDED_LIBRARIES=/root/mariadb10.1/lib/libmysqld.a -DERRMSG=/root/mariadb10.1/share/english/errmsg.sys -DWITH_SCRIPTS=FALSE
RUN make && make install
ADD maxscale.cnf /etc/maxscale.cnf
RUN mkdir -p /var/run/maxscale
CMD ["maxscale","-d"]
