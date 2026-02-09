#!/bin/bash

# Script para ejecutar la migración de campos de seguro de caución en Garantor

echo "🚀 Ejecutando migración: Agregar campos de seguro de caución a Garantor..."

# Cargar variables de entorno
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Ejecutar la migración SQL
psql "$DATABASE_URL" -f migrations/add-insurance-fields-garantor.sql

if [ $? -eq 0 ]; then
    echo "✅ Migración completada exitosamente"
    echo "📋 Cambios aplicados:"
    echo "   - Agregado campo 'insuranceCompany' para aseguradora"
    echo "   - Agregado campo 'policyNumber' para número de póliza"
    echo "   - Agregado campo 'insuredAmount' para suma asegurada"
    echo "   - Agregado campo 'insuranceStartDate' para fecha de inicio"
    echo "   - Campos opcionales para uso con seguro de caución"
else
    echo "❌ Error al ejecutar la migración"
    exit 1
fi
