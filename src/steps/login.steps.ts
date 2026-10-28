import {Given, When, Then} from '@cucumber/cucumber';
import {expect} from '@playwright/test';
import {QAWorld} from '../support/world';
import {resolveCredential} from '../support/credentials';
Given('que ingreso al formulario de autenticación',async function(this:QAWorld){await this.login!.open();});
When('inicio sesión con usuario {string} y clave {string}',async function(this:QAWorld,usuario:string,clave:string){
 await this.login!.login(resolveCredential(usuario),resolveCredential(clave));
});
Then('el acceso debe ser {string}',async function(this:QAWorld,resultado:string){
 if(resultado==='exitoso') await this.login!.assertSuccess();
 else if(resultado==='rechazado') await this.login!.assertRejected();
 else throw new Error(`Resultado no soportado: ${resultado}`);
});
Then('la URL debe contener {string}',async function(this:QAWorld,ruta:string){
 await expect(this.page!).toHaveURL(new RegExp(ruta));
});
Then('debe mostrarse la opción {string}',async function(this:QAWorld,opcion:string){
 if(opcion!=='Log out') throw new Error('Opción desconocida');
 await this.login!.assertLogout(true);
});
Then('no debe mostrarse la opción {string}',async function(this:QAWorld,opcion:string){
 if(opcion!=='Log out') throw new Error('Opción desconocida');
 await this.login!.assertLogout(false);
});
Then('debe mostrarse el error {string}',async function(this:QAWorld,mensaje:string){
 await this.login!.assertMessage(mensaje);
});
