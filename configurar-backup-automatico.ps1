# ============================================
# Configurar Backup Automático - PostgreSQL Neon
# ============================================

Write-Host "Configurando backup automático diario..." -ForegroundColor Cyan

$workspaceDir = "C:\Users\merce\Desktop\QLInmobiliaria"

$action = New-ScheduledTaskAction `
    -Execute "$workspaceDir\backup-database.bat" `
    -WorkingDirectory "$workspaceDir"

$trigger = New-ScheduledTaskTrigger -Daily -At 3:00AM

$settings = New-ScheduledTaskSettingsSet `
    -AllowStartIfOnBatteries `
    -DontStopIfGoingOnBatteries `
    -StartWhenAvailable

$principal = New-ScheduledTaskPrincipal `
    -UserId "$env:USERDOMAIN\$env:USERNAME" `
    -LogonType S4U `
    -RunLevel Highest

try {
    Register-ScheduledTask `
        -TaskName "Backup PostgreSQL Neon" `
        -Action $action `
        -Trigger $trigger `
        -Settings $settings `
        -Principal $principal `
        -Description "Backup diario automático de base de datos Neon a las 3:00 AM" `
        -Force | Out-Null
    
    Write-Host ""
    Write-Host "============================================" -ForegroundColor Green
    Write-Host "✅ Backup automático configurado!" -ForegroundColor Green
    Write-Host "============================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Configuración:" -ForegroundColor Yellow
    Write-Host "  - Horario: Diariamente a las 3:00 AM" -ForegroundColor White
    Write-Host "  - Comando: backup-database.bat" -ForegroundColor White
    Write-Host "  - Ubicación: $workspaceDir" -ForegroundColor White
    Write-Host ""
    
    # Verificar tarea creada
    $task = Get-ScheduledTask -TaskName "Backup PostgreSQL Neon" -ErrorAction SilentlyContinue
    if ($task) {
        Write-Host "Estado de la tarea:" -ForegroundColor Yellow
        Write-Host "  - Estado: $($task.State)" -ForegroundColor White
        Write-Host "  - Último resultado: $($task.LastTaskResult)" -ForegroundColor White
        Write-Host "  - Próxima ejecución: $((Get-ScheduledTaskInfo -TaskName 'Backup PostgreSQL Neon').NextRunTime)" -ForegroundColor White
    }
    
    Write-Host ""
    Write-Host "Para probar la tarea ahora, ejecuta:" -ForegroundColor Cyan
    Write-Host '  Start-ScheduledTask -TaskName "Backup PostgreSQL Neon"' -ForegroundColor Gray
    
} catch {
    Write-Host ""
    Write-Host "============================================" -ForegroundColor Red
    Write-Host "❌ Error al configurar backup automático" -ForegroundColor Red
    Write-Host "============================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Asegúrate de ejecutar PowerShell como Administrador" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Read-Host "Presiona Enter para continuar"
