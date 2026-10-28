import { Page, expect } from '@playwright/test';
export class LoginPage {
 constructor(private readonly page: Page) {}
 async open() {
  await this.page.goto(process.env.BASE_URL || 'https://practicetestautomation.com/practice-test-login/', {waitUntil:'domcontentloaded'});
 }
 async login(user: string, password: string) {
  await this.page.locator('#username').fill(user);
  await this.page.locator('#password').fill(password);
  await this.page.getByRole('button',{name:'Submit'}).click();
 }
 async assertSuccess() {
  await expect(this.page).toHaveURL(/logged-in-successfully\/?/);
  await expect(this.page.getByText(/congratulations|successfully logged in/i).first()).toBeVisible();
 }
 async assertRejected() {
  await expect(this.page).toHaveURL(/practice-test-login/);
 }
 async assertMessage(message: string) {
  await expect(this.page.locator('#error')).toContainText(message);
 }
 async assertLogout(visible: boolean) {
  const logout = this.page.getByRole('link',{name:/log out/i});
  if (visible) await expect(logout).toBeVisible();
  else await expect(logout).toHaveCount(0);
 }
}
