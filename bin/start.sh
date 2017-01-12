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
    else
    echo "using production configure file..."
    mongod -f ../conf/mongodb.prod.conf
fi
exit 0
