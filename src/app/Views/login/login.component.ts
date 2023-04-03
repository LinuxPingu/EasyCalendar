import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/Services/user.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private router:Router, private service: UserService){ }

  @Input() email:string ="";
  @Input() password:string ="";

  sign_up_with_email(){
    let result = this.service.login_with_email(this.email,this.password)
    .then( res => {
      this.router.navigate(['landing-user'])
    })
    .catch(err => { 
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.message,
      })
    })
  };

  async sign_up_google(){
    let result = await this.service.login_with_google();
    if(result instanceof Error){
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: result.message,
      })
    }else if(result){
      this.router.navigate(['landing-user'])
    }
  }
}
