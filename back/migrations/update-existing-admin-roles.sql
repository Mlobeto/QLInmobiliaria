-- Actualizar todos los usuarios admin que no tienen rol asignado
UPDATE "Admins" 
SET role = 'admin' 
WHERE role IS NULL OR role = '';

-- Verificar la actualización
SELECT "adminId", username, role FROM "Admins";
