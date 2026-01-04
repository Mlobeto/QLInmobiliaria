#!/bin/bash

# Script para ejecutar la migración de requisitos
# Fecha: 2026-01-04

echo "==================================="
echo "Migración: Agregar campo requisito"
echo "==================================="
echo ""

# Verificar si se proporcionó la URL de la base de datos
if [ -z "$1" ]; then
    echo "❌ Error: Debes proporcionar la URL de la base de datos"
    echo ""
    echo "Uso: ./ejecutar-migracion-requisito.sh <DATABASE_URL>"
    echo ""
    echo "Ejemplo:"
    echo "  ./ejecutar-migracion-requisito.sh postgresql://user:password@host:5432/database"
    echo ""
    exit 1
fi

DATABASE_URL=$1

echo "📋 Ejecutando migración..."
echo ""

# Ejecutar la migración
psql "$DATABASE_URL" -f migrations/add-requisito-to-properties.sql

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Migración completada exitosamente"
    echo ""
    echo "📊 Resumen:"
    echo "  - Columna 'requisito' agregada a la tabla Property"
    echo "  - Propiedades de alquiler actualizadas con plantilla por defecto"
    echo ""
else
    echo ""
    echo "❌ Error al ejecutar la migración"
    echo ""
    exit 1
fi
