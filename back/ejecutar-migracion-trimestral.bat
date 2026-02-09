@echo off
REM Script para ejecutar la migración de updateFrequency con soporte para 'trimestral' en Windows

echo 🚀 Ejecutando migración: Agregar 'trimestral' a updateFrequency...
echo.

REM Configurar conexión a Neon database
set PGHOST=ep-withered-sky-a5n8x0ut-pooler.us-east-2.aws.neon.tech
set PGPORT=5432
set PGUSER=neondb_owner
set PGPASSWORD=TF5BUXksz4cY
set PGDATABASE=neondb

REM Ejecutar la migración SQL
psql --host=%PGHOST% --port=%PGPORT% --username=%PGUSER% --dbname=%PGDATABASE% --no-password -f migrations/add-trimestral-updatefrequency.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Migración completada exitosamente
    echo 📋 Cambios aplicados:
    echo    - Agregado 'trimestral' al ENUM updateFrequency
    echo    - Campo updateFrequency ahora es obligatorio (NOT NULL^)
    echo    - Contratos sin updateFrequency actualizados a 'semestral'
) else (
    echo.
    echo ❌ Error al ejecutar la migración
    pause
    exit /b 1
)

echo.
pause
