import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app'; // <--- Fíjate en el nombre (image_b3905a)

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
