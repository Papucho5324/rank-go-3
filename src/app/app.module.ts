import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
  ],
  providers: [
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)), // ✅ Mover a providers
    provideFirestore(() => getFirestore()), // ✅ Mover a providers
    provideAuth(() => getAuth()), // ✅ Mover a providers
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
