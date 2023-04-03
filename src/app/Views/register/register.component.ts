import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/Services/user.service';
import { User_Model } from 'src/app/Models/user.model';
import Swal from 'sweetalert2';
import { Helper } from 'src/app/Helpers/helper';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  constructor(private router: Router, private service: UserService) { }

  @Input() password2: string = "";

  public new_user: User_Model = {
    id_User: 'temp',
    email: '',
    username: '',
    password: '',
    is_Admin: false,
    is_Active: true
  };

  async register() {
    /*Checks if all spaces are filled*/
    if (Helper.isObjectFullyFilled(this.new_user) && this.password2 != "") {
      /*Checks if passwords match*/
      if (this.new_user.password === this.password2) {
        let result = await this.service.register_by_email(this.new_user);

        if (result === true) {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: `User ${this.new_user.username} created! `,
            showConfirmButton: false,
            timer: 1500
          })
        } else if (result instanceof Error) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: result.message,
          })
        }
      }else{
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Passwords dont match',
        })
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Not all spaces are filled',
      })
    }
  }
}
