import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import type { Browser, BrowserContext, Page } from '@playwright/test';
import type { LoginPage } from '../pages/LoginPage';
export class QAWorld extends World {
 browser?: Browser;
 context?: BrowserContext;
 page?: Page;
 login?: LoginPage;
 constructor(options:IWorldOptions) {super(options);}
}
setWorldConstructor(QAWorld);
