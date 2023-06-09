import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingUserComponent } from './Views/landing-user/landing-user.component';
import { LoginComponent } from './Views/login/login.component';
import { RegisterComponent } from './Views/register/register.component';
import { canActivate,redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { ModalComponent } from './Views/Shared/modal/modal.component';
import { ProfileComponent } from './Views/landing-user/profile/profile.component';
import { SystemTagsComponent } from './Views/landing-user/admin/system-tags/system-tags.component';
import { UserTagsComponent } from './Views/landing-user/user/user-tags/user-tags.component';

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
    path:'modal',
    component:ModalComponent,
    ...canActivate(()=> redirectUnauthorizedTo(['']))
  },
  {
    path:'my-profile',
    component:ProfileComponent,
    ...canActivate(()=> redirectUnauthorizedTo(['']))
  },
  {
    path:'system-tags',
    component:SystemTagsComponent,
    ...canActivate(()=> redirectUnauthorizedTo(['']))
  },
  {
    path:'user-tags',
    component:UserTagsComponent,
    ...canActivate(() => redirectUnauthorizedTo(['']))
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
