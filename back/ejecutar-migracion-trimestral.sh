#!/bin/bash

# Script para ejecutar la migración de updateFrequency con soporte para 'trimestral'

echo "🚀 Ejecutando migración: Agregar 'trimestral' a updateFrequency..."

# Cargar variables de entorno
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Ejecutar la migración SQL
psql "$DATABASE_URL" -f migrations/add-trimestral-updatefrequency.sql

if [ $? -eq 0 ]; then
    echo "✅ Migración completada exitosamente"
    echo "📋 Cambios aplicados:"
    echo "   - Agregado 'trimestral' al ENUM updateFrequency"
    echo "   - Campo updateFrequency ahora es obligatorio (NOT NULL)"
    echo "   - Contratos sin updateFrequency actualizados a 'semestral'"
else
    echo "❌ Error al ejecutar la migración"
    exit 1
fi
