# Reto QA — Playwright TypeScript + Cucumber/Gherkin

## Requisitos
Node.js 20+ (recomendado 22), npm. Proyecto sobre sitio público de práctica; no probar credenciales privadas sin autorización.

## Instalación y ejecución
```bash
npm install
npx playwright install chromium
npm test
npm run typecheck
```

Para ejecutar en navegador visible: `HEADED=true npm test` (Linux/macOS) o `$env:HEADED='true'; npm test` (PowerShell). Para otros navegadores: `BROWSER=firefox npm test` tras instalar el navegador.

## Modificar datos de prueba
Edite exclusivamente `features/login.feature`, en las tablas `Examples`, utilizando alias `VALID_USER`, `VALID_PASSWORD`, `INVALID_USER`, `INVALID_PASS`, `EMPTY`. Para agregar un alias, actualice `src/support/credentials.ts`. Los secretos reales deben provenir de variables de entorno `TEST_USER` y `TEST_PASSWORD`, nunca del Gherkin ni del repositorio. Valores de ejemplo corresponden al portal público del reto.

## Seguridad
- Secretos por variables de entorno / GitHub Secrets, no en feature files.
- Sin trazas de payload ni logging de contraseñas.
- Evidencia solo ante fallo; capturas pueden mostrar datos sensibles en otros proyectos: revisar y anonimizar antes de compartir.
- `ignoreHTTPSErrors: false`; sin bypass de TLS.
- No realizar fuzzing ni pruebas agresivas contra servicios externos.

## Reporte y evidencias
- `reports/cucumber.html`: reporte HTML de Cucumber.
- `reports/cucumber.json`: reporte JSON.
- En TODOS los escenarios: captura PNG adjunta al reporte Cucumber HTML (incluidos escenarios aprobados). Al fallar: video WebM adjunto. Para conservar video también en casos aprobados, configurar `VIDEO_ALL=true`. El campo de contraseña se enmascara al capturar. Los videos de escenarios aprobados también se conservan en la galería visual.
- Nota: los videos se graban durante todo el escenario y se adjuntan después del cierre del contexto.

## CI/CD
Workflow en `.github/workflows/qa-main.yml`. Para resultados reproducibles, confirmar selectores y textos con el sitio real: la ejecución requiere acceso a internet y dependencias instaladas.


## GitHub Actions – repositorio challenge-delaware-jcsq.git

El archivo `.github/workflows/qa-main.yml` ejecuta las pruebas en cada `push` a `main`, en `pull_request` dirigido a `main` y mediante ejecución manual (`workflow_dispatch`). Incluye Node.js 22, instalación de Chromium, `npm run typecheck`, `npm test` y publicación de `reports/` como artefacto incluso si falla un test. Si se necesitan credenciales distintas de las públicas del portal de prueba, cree los secrets `TEST_USER` y `TEST_PASSWORD` en **Settings → Secrets and variables → Actions**. No almacene credenciales privadas en Git.

Ejemplo de subida al repositorio existente (configure su URL de remoto real):
```bash
git clone https://github.com/JUANZ27/challenge-delaware-jcsq.git
# copie los archivos de este ZIP a la raíz del repositorio
git checkout main
git add .
git commit -m "ci: add Playwright Cucumber workflow for main"
git push origin main
```

Los resultados se descargan desde **Actions → ejecución → Artifacts**. La versión inicial del proyecto no contiene `package-lock.json`, por ello el workflow usa `npm install` en lugar de `npm ci`. Se recomienda generar y versionar el lockfile tras instalar dependencias para lograr builds reproducibles.

## Ver imágenes y videos en el reporte
1. Ejecute `npm test` (o `npm run test:smoke`).
2. Abra `reports/cucumber.html` en un navegador. Expanda cada escenario: se verá la captura PNG incrustada como adjunto.
3. Si falla un escenario, aparecerá además el video WebM como adjunto. También podrá encontrarse en `reports/videos/`.
4. En GitHub Actions: Actions → ejecución → Artifacts → descargue el ZIP → extraiga y abra `cucumber.html`.
5. Para comprobar la evidencia de fallo intencionalmente, modifique temporalmente una expectativa, ejecute `npm test`, revise screenshot/video y revierta el cambio antes de subir.

**Privacidad:** las capturas enmascaran el campo de contraseña, pero podrían contener otros datos visibles; no usar datos reales en el sitio de demostración.

## Reporte visual con capturas y videos (versión corregida)

Ejecute `npm install`, `npx playwright install chromium` y `npm test`. **Abra `reports/evidencias.html`** para ver cada captura y reproducir el video de cada escenario (PASS o FAIL). También se generan `reports/cucumber.html` y `reports/cucumber.json`, y las capturas PNG quedan adjuntas a los escenarios de Cucumber. Los archivos originales estarán en `reports/evidencias/`.

En GitHub Actions, descargue el artifact de la ejecución, **extraiga todo el ZIP** y abra `reports/evidencias.html` (las imágenes y videos se cargan por rutas relativas). El comando `npm test` borra primero `reports/` para evitar mezclar archivos antiguos con la ejecución actual. Esta versión conserva videos de todos los escenarios para la evaluación; no use información bancaria real, porque un video puede registrar datos digitados incluso si el screenshot enmascara el password.
