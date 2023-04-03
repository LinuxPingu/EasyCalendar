import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingUserComponent } from './Views/landing-user/landing-user.component';
import { LoginComponent } from './Views/login/login.component';
import { RegisterComponent } from './Views/register/register.component';
import { canActivate,redirectUnauthorizedTo } from '@angular/fire/auth-guard';

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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
