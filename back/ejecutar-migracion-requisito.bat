@echo off
REM Script para ejecutar la migración de requisitos en Windows
REM Fecha: 2026-01-04

echo ===================================
echo Migracion: Agregar campo requisito
echo ===================================
echo.

if "%1"=="" (
    echo Error: Debes proporcionar la URL de la base de datos
    echo.
    echo Uso: ejecutar-migracion-requisito.bat DATABASE_URL
    echo.
    echo Ejemplo:
    echo   ejecutar-migracion-requisito.bat postgresql://user:password@host:5432/database
    echo.
    exit /b 1
)

set DATABASE_URL=%1

echo Ejecutando migracion...
echo.

psql "%DATABASE_URL%" -f migrations\add-requisito-to-properties.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo Migracion completada exitosamente
    echo.
    echo Resumen:
    echo   - Columna 'requisito' agregada a la tabla Property
    echo   - Propiedades de alquiler actualizadas con plantilla por defecto
    echo.
) else (
    echo.
    echo Error al ejecutar la migracion
    echo.
    exit /b 1
)
