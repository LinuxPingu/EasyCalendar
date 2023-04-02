import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/Services/user.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private router:Router, private service: UserService){

  }

  async sign_up_google(){
    let result = await this.service.login_with_google();
    console.log(result);
  }
}
