@echo off
REM Script para ejecutar la migración de updateFrequency con soporte para 'trimestral' en Windows

echo 🚀 Ejecutando migración: Agregar 'trimestral' a updateFrequency...

REM Cargar variables de entorno desde .env
for /f "tokens=* delims=" %%i in ('type .env ^| findstr /v "^#"') do set %%i

REM Ejecutar la migración SQL
psql %DATABASE_URL% -f migrations/add-trimestral-updatefrequency.sql

if %ERRORLEVEL% EQU 0 (
    echo ✅ Migración completada exitosamente
    echo 📋 Cambios aplicados:
    echo    - Agregado 'trimestral' al ENUM updateFrequency
    echo    - Campo updateFrequency ahora es obligatorio (NOT NULL^)
    echo    - Contratos sin updateFrequency actualizados a 'semestral'
) else (
    echo ❌ Error al ejecutar la migración
    exit /b 1
)
