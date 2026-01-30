#!/bin/bash

echo "🚀 Ejecutando migración: add-sale-authorization-data.sql"
echo "=========================================="

# Cargar variables de entorno desde .env si existe
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
fi

# Verificar que DATABASE_URL esté configurado
if [ -z "$DATABASE_URL" ]; then
  echo "❌ ERROR: DATABASE_URL no está configurado"
  echo "Por favor configura la variable de entorno DATABASE_URL"
  exit 1
fi

# Ejecutar la migración
echo "📝 Ejecutando SQL..."
psql "$DATABASE_URL" -f back/migrations/add-sale-authorization-data.sql

if [ $? -eq 0 ]; then
  echo "✅ Migración completada exitosamente"
else
  echo "❌ Error al ejecutar la migración"
  exit 1
fi

echo "=========================================="
echo "🎉 Proceso completado"
