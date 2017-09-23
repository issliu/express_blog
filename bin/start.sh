#!/usr/bin/env bash
#echo "script filename: $0, script params: $@"
[ $# == 0 ] && echo "message: param is wrong" && exit 0

cd bin
if [ ! -d ../logs ]
    then
    mkdir -p ../logs
fi
if [ ! -d ../data ]
    then
    mkdir -p ../data
fi

if [ "$1" == "dev" ]
    then
        echo "using development configure file..."
        mongod -f ../conf/mongodb.dev.conf
        supervisor ./www
elif [ "$1" == "prod" ]
    then
        echo "using production configure file..."
        mongod -f ../conf/mongodb.prod.conf
        pm2 start ./www
elif [ "$1" == "win" ]
    then
        echo "using production configure file for windows..."
        mongod -f ../conf/mongodb.dev.windows.conf
        supervisor ./www
fi

exit 0
