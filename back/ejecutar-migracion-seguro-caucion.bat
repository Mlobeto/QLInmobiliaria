@echo off
REM Script para ejecutar la migración de campos de seguro de caución en Garantor

echo 🚀 Ejecutando migración: Agregar campos de seguro de caución a Garantor...
echo.

REM Configurar conexión a Neon database
set PGHOST=ep-withered-sky-a5n8x0ut-pooler.us-east-2.aws.neon.tech
set PGPORT=5432
set PGUSER=neondb_owner
set PGPASSWORD=TF5BUXksz4cY
set PGDATABASE=neondb

REM Ejecutar la migración SQL
psql --host=%PGHOST% --port=%PGPORT% --username=%PGUSER% --dbname=%PGDATABASE% --no-password -f migrations/add-insurance-fields-garantor.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Migración completada exitosamente
    echo 📋 Cambios aplicados:
    echo    - Agregado campo 'insuranceCompany' para aseguradora
    echo    - Agregado campo 'policyNumber' para número de póliza
    echo    - Agregado campo 'insuredAmount' para suma asegurada
    echo    - Agregado campo 'insuranceStartDate' para fecha de inicio
    echo    - Campos opcionales para uso con seguro de caución
) else (
    echo.
    echo ❌ Error al ejecutar la migración
    pause
    exit /b 1
)

echo.
pause
