# 🗄️ Guía de Backup Automático - PostgreSQL Neon

## 📋 Índice
1. [Instalación de PostgreSQL Client](#instalación)
2. [Backup Manual](#backup-manual)
3. [Backup Automático en Windows](#windows)
4. [Backup Automático en Linux/Mac](#linux)
5. [Restauración de Backup](#restauración)
6. [Proceso de Migración Seguro](#migración)

---

## 🔧 Instalación de PostgreSQL Client

### Windows
1. Descargar PostgreSQL desde: https://www.postgresql.org/download/windows/
2. Ejecutar el instalador (solo necesitas "Command Line Tools")
3. Agregar a PATH: `C:\Program Files\PostgreSQL\16\bin`
4. Verificar: `pg_dump --version`

### Linux/Ubuntu
```bash
sudo apt-get update
sudo apt-get install postgresql-client
```

### macOS
```bash
brew install postgresql
```

---

## 💾 Backup Manual

### Windows
```bash
backup-database.bat
```

### Linux/Mac
```bash
chmod +x backup-database.sh
./backup-database.sh
```

**Los backups se guardan en:** `backups/neondb_backup_YYYY-MM-DD_HHMMSS.sql.gz`

---

## ⏰ Backup Automático en Windows

### Opción 1: Programador de Tareas (Recomendado)

1. **Abrir Programador de Tareas**
   - Presionar `Win + R`
   - Escribir: `taskschd.msc`
   - Enter

2. **Crear Tarea Básica**
   - Clic derecho en "Biblioteca del Programador de Tareas"
   - Seleccionar "Crear tarea básica..."

3. **Configurar la Tarea**
   - **Nombre:** `Backup PostgreSQL Neon`
   - **Descripción:** `Backup diario de la base de datos de producción`
   - Clic en "Siguiente"

4. **Desencadenador (Trigger)**
   - Seleccionar: **"Diariamente"**
   - Hora: **3:00 AM** (hora con poco tráfico)
   - Clic en "Siguiente"

5. **Acción**
   - Seleccionar: **"Iniciar un programa"**
   - **Programa:** `C:\Users\merce\Desktop\QLInmobiliaria\backup-database.bat`
   - **Iniciar en:** `C:\Users\merce\Desktop\QLInmobiliaria`
   - Clic en "Siguiente"

6. **Configuración Avanzada**
   - Marcar: **"Ejecutar tanto si el usuario inició sesión como si no"**
   - Marcar: **"Ejecutar con los privilegios más altos"**
   - **Configurar para:** Windows 10

7. **Completar**
   - Clic en "Finalizar"
   - Ingresar contraseña de Windows si se solicita

### Opción 2: Script de Tarea Programada (PowerShell)

Ejecutar PowerShell como administrador y ejecutar:

```powershell
# Crear tarea programada
$action = New-ScheduledTaskAction -Execute "C:\Users\merce\Desktop\QLInmobiliaria\backup-database.bat" -WorkingDirectory "C:\Users\merce\Desktop\QLInmobiliaria"
$trigger = New-ScheduledTaskTrigger -Daily -At 3:00AM
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable
$principal = New-ScheduledTaskPrincipal -UserId "$env:USERDOMAIN\$env:USERNAME" -LogonType S4U -RunLevel Highest

Register-ScheduledTask -TaskName "Backup PostgreSQL Neon" -Action $action -Trigger $trigger -Settings $settings -Principal $principal -Description "Backup diario automático de base de datos Neon"

Write-Host "✅ Tarea programada creada exitosamente!"
```

### Verificar Tarea Programada

```powershell
Get-ScheduledTask -TaskName "Backup PostgreSQL Neon"
```

### Ejecutar Tarea Manualmente (para probar)

```powershell
Start-ScheduledTask -TaskName "Backup PostgreSQL Neon"
```

---

## 🐧 Backup Automático en Linux/Mac

### Configurar Cronjob

1. **Editar crontab:**
```bash
crontab -e
```

2. **Agregar línea para backup diario a las 3:00 AM:**
```bash
0 3 * * * cd /ruta/a/QLInmobiliaria && ./backup-database.sh >> logs/backup.log 2>&1
```

3. **Para backup cada 12 horas:**
```bash
0 */12 * * * cd /ruta/a/QLInmobiliaria && ./backup-database.sh >> logs/backup.log 2>&1
```

4. **Para backup cada 6 horas:**
```bash
0 */6 * * * cd /ruta/a/QLInmobiliaria && ./backup-database.sh >> logs/backup.log 2>&1
```

### Verificar Cronjobs

```bash
crontab -l
```

### Crear directorio de logs

```bash
mkdir -p logs
```

---

## 🔄 Restauración de Backup

### Listar backups disponibles
```bash
# Windows
dir backups

# Linux/Mac
ls -lh backups/
```

### Restaurar desde backup

#### Windows
```bash
restore-database.bat
```

#### Linux/Mac
```bash
chmod +x restore-database.sh
./restore-database.sh
```

Sigue las instrucciones en pantalla y **confirma con "SI"** cuando se solicite.

---

## 🚀 Proceso de Migración Seguro

### ANTES de aplicar migraciones:

1. **Hacer backup inmediato:**
   ```bash
   # Windows
   backup-database.bat
   
   # Linux/Mac
   ./backup-database.sh
   ```

2. **Verificar que el backup se creó correctamente:**
   ```bash
   # Verificar archivo existe
   dir backups
   ```

3. **Probar en entorno local (opcional pero recomendado):**
   - Restaurar backup en base de datos local
   - Ejecutar migraciones en local
   - Verificar que todo funciona

### APLICAR migraciones:

4. **Ejecutar migración trimestral:**
   ```bash
   ejecutar-migracion-trimestral.bat
   ```

5. **Verificar resultado:**
   - Revisar output del script
   - Confirmar que no hay errores

6. **Ejecutar migración insurance:**
   ```bash
   ejecutar-migracion-insurance.bat
   ```

7. **Verificar resultado:**
   - Revisar output del script
   - Confirmar que no hay errores

### DESPUÉS de migraciones:

8. **Reiniciar backend:**
   ```bash
   cd back
   npm run dev
   ```

9. **Probar funcionalidad:**
   - Crear un contrato con frecuencia "trimestral"
   - Crear un contrato con garantía "seguro de caución"
   - Verificar que los PDFs se generan correctamente
   - Revisar el editor de contratos

10. **Backup post-migración:**
    ```bash
    backup-database.bat
    ```

### En caso de ERROR:

Si algo sale mal, **restaurar el backup:**

```bash
# Windows
restore-database.bat

# Linux/Mac
./restore-database.sh
```

Seleccionar el backup más reciente antes de las migraciones.

---

## 📊 Gestión de Backups

### Política de Retención

Los scripts automáticamente:
- ✅ Comprimen los backups (ahorra ~70% de espacio)
- ✅ Eliminan backups mayores a 7 días
- ✅ Mantienen historial de última semana

### Cambiar período de retención

Editar el script `backup-database.bat`:

```bat
REM Cambiar -7 por el número de días deseado
forfiles /P "backups" /M *.sql* /D -30 /C "cmd /c del @path" 2>nul
```

### Backups externos (recomendado)

Considera copiar backups a:
- ☁️ Google Drive / OneDrive
- 💾 Disco externo
- 🌐 Servicio de backup en la nube (AWS S3, Azure Blob)

---

## ⚠️ Notas de Seguridad

1. **Credenciales en scripts:**
   - Los scripts contienen credenciales en texto plano
   - **NO subir estos scripts a repositorios públicos**
   - Agregar a `.gitignore`:
     ```
     backup-database.bat
     backup-database.sh
     restore-database.bat
     restore-database.sh
     backups/
     ```

2. **Permisos:**
   - Linux/Mac: `chmod 700 backup-database.sh restore-database.sh`
   - Restringe acceso solo al propietario

3. **Verificación:**
   - Probar restauración periódicamente
   - Un backup no probado puede estar corrupto

---

## 🆘 Solución de Problemas

### Error: "pg_dump no reconocido"
- **Solución:** Instalar PostgreSQL client tools
- Verificar que esté en PATH

### Error: "Connection refused"
- **Solución:** Verificar conectividad a internet
- Neon requiere conexión activa

### Error: "Authentication failed"
- **Solución:** Verificar credenciales en el script
- La contraseña puede haber cambiado

### Backup muy grande
- **Solución:** Los scripts comprimen automáticamente
- Archivo .sql ~100MB → .gz ~30MB

### No hay espacio en disco
- **Solución:** Limpiar backups antiguos manualmente
- Reducir período de retención

---

## 📞 Contacto

Si tienes dudas sobre el proceso de backup y migración, consulta con el equipo de desarrollo antes de proceder.

**¡NUNCA apliques cambios en producción sin un backup reciente!**

---

**Última actualización:** 9 de Febrero, 2026
