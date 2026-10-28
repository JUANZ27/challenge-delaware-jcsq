import { Before, After, Status } from '@cucumber/cucumber';
import { chromium, firefox, webkit, type BrowserType, type Browser } from '@playwright/test';
import { QAWorld } from './world';
import { LoginPage } from '../pages/LoginPage';
import fs from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

Before(async function (this: QAWorld) {
  const engines: Record<string, BrowserType<Browser>> = { chromium, firefox, webkit };
  const name = process.env.BROWSER || 'chromium';
  const engine = engines[name];
  if (!engine) throw new Error('BROWSER inválido. Utilice chromium, firefox o webkit');
  await fs.mkdir('reports/evidencias', { recursive: true });
  await fs.mkdir('reports/metadatos', { recursive: true });
  await fs.mkdir('reports/videos', { recursive: true });
  this.browser = await engine.launch({ headless: process.env.HEADED !== 'true' });
  this.context = await this.browser.newContext({
    acceptDownloads: false,
    ignoreHTTPSErrors: false,
    recordVideo: { dir: 'reports/videos', size: { width: 1280, height: 720 } }
  });
  this.page = await this.context.newPage();
  this.login = new LoginPage(this.page);
});

After(async function (this: QAWorld, scenario) {
  const id = randomUUID();
  const failed = scenario.result?.status === Status.FAILED;
  const video = this.page?.video();
  const meta: Record<string, string | null> = {
    name: scenario.pickle.name, status: scenario.result?.status ?? 'UNKNOWN', screenshot: null, video: null
  };
  try {
    if (this.page && !this.page.isClosed()) {
      try {
        // Ocultar campos de contraseña y otros controles sensibles en capturas.
        const screenshot = await this.page.screenshot({
          fullPage: true, animations: 'disabled',
          mask: [this.page.locator('input[type="password"], input[autocomplete="cc-number"], input[autocomplete="cc-csc"]')],
          timeout: 15000
        });
        const filename = `${id}.png`;
        await fs.writeFile(path.join('reports/evidencias', filename), screenshot);
        meta.screenshot = `evidencias/${filename}`;
        await this.attach(screenshot, 'image/png');
      } catch (error) {
        await this.attach(`Captura no disponible: ${String(error)}`, 'text/plain');
      }
    }
  } finally {
    try {
      await this.context?.close(); // Garantiza que el video esté finalizado.
      if (video) {
        try {
          const videoPath = await video.path();
          // Guardar videos tanto de PASS como FAIL para mostrarlos en la galería.
          const name = `${id}.webm`;
          const dest = path.join('reports/evidencias', name);
          await fs.copyFile(videoPath, dest);
          meta.video = `evidencias/${name}`;
          // Adjuntarlo también al reporte Cucumber si falla (evita HTML enorme en éxitos).
          if (failed) await this.attach(await fs.readFile(dest), 'video/webm');
          await fs.rm(videoPath, { force: true });
        } catch (error) {
          await this.attach(`Video no disponible: ${String(error)}`, 'text/plain');
        }
      }
      await fs.writeFile(path.join('reports/metadatos', `${id}.json`), JSON.stringify(meta, null, 2));
    } finally {
      await this.browser?.close();
    }
  }
});
