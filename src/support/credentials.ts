// Alias seguros: no registrar ni adjuntar claves a reportes.
// Las credenciales suministradas son de un sitio público de demostración.
const values: Record<string, () => string> = {
 VALID_USER: () => process.env.TEST_USER || 'student',
 VALID_PASSWORD: () => process.env.TEST_PASSWORD || 'Password123',
 INVALID_USER: () => 'unknown_test_user',
 INVALID_PASS: () => 'wrong_test_password',
 EMPTY: () => ''
};
export function resolveCredential(alias: string): string {
 const lookup = values[alias];
 if (!lookup) throw new Error(`Alias de credencial desconocido: ${alias}`);
 return lookup();
}
