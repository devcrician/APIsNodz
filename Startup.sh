#!/bin/bash
echo "[$(date)] Iniciando servidor..." >> server.log
while :
do
  node Server.js >> server.log 2>&1
  echo "[$(date)] Servidor reiniciado" >> server.log
  sleep 1
done