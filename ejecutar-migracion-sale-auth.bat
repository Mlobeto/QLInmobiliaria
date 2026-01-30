@echo off
echo Ejecutando migracion: add-sale-authorization-data.sql
echo ==========================================

REM Verificar que DATABASE_URL este configurado
if "%DATABASE_URL%"=="" (
  echo ERROR: DATABASE_URL no esta configurado
  echo Por favor configura la variable de entorno DATABASE_URL
  exit /b 1
)

REM Ejecutar la migracion
echo Ejecutando SQL...
psql "%DATABASE_URL%" -f back/migrations/add-sale-authorization-data.sql

if %ERRORLEVEL% EQU 0 (
  echo Migracion completada exitosamente
) else (
  echo Error al ejecutar la migracion
  exit /b 1
)

echo ==========================================
echo Proceso completado
pause
