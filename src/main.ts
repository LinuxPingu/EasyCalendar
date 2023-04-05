/// <reference types="@angular/localize" />

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

import '@angular/localize/init'; // import the localize module

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

import('@angular/localize/init').then(() => console.log('Localized resources loaded'));