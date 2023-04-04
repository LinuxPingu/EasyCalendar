import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingUserComponent } from './Views/landing-user/landing-user.component';
import { LoginComponent } from './Views/login/login.component';
import { RegisterComponent } from './Views/register/register.component';
import { canActivate,redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { TagsComponent } from './Views/landing-user/tags/tags.component';
import { ModalComponent } from './Views/Shared/modal/modal.component';

const routes: Routes = [
  {
    path:'',
    component: LoginComponent
  },
  {
    path:'register',
    component:RegisterComponent
  },
  {
    path:'landing-user',
    component:LandingUserComponent, 
    ...canActivate(()=> redirectUnauthorizedTo(['']))
  },
  {
    path:'tags',
    component:TagsComponent,
    ...canActivate(()=> redirectUnauthorizedTo(['']))
  },
  {
    path:'modal',
    component:ModalComponent,
    ...canActivate(()=> redirectUnauthorizedTo(['']))
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
