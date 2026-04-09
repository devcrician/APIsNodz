#!/bin/bash

LOG_FILE="server.log"
DATE_FORMAT="+%Y-%m-%d %H:%M:%S"

log_message() {
    echo "[$(date "$DATE_FORMAT")] $1" | tee -a "$LOG_FILE"
}

log_message "🚀 Iniciando servidor APISNODZ..."

while :
do
    log_message "▶️  Executando node Server.js"
    
    NODE_ENV=production node Server.js 2>&1 | tee -a "$LOG_FILE"
    
    EXIT_CODE=$?
    log_message "⚠️  Servidor encerrado com código $EXIT_CODE"
    log_message "🔄 Reiniciando em 2 segundos..."
    
    sleep 2
done