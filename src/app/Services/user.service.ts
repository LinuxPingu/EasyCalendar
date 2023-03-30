import {Injectable} from '@angular/core';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import {User} from '../Models/user.model';
import { API_URL } from '../Helpers/app_constants';
import { HttpClient } from '@angular/common/http';


@Injectable({
    providedIn:'root'
})
export class UserService{

    private readonly user_enpoint = 'UserData';


    constructor(private fbAuth:Auth, private http: HttpClient) { }
    
    post_user_to_API(new_user:User){
        let url = API_URL + this.user_enpoint;
        let data = JSON.stringify(new_user);
        let headers = { 'Content-Type': 'application/json' };

        this.http.post(url, data, { headers }).subscribe(response => {
             console.log(response);
         }, error => {
             console.error(error);
         });   
    }

    async register_by_email(new_user:User):Promise<boolean | Error>{
        try{
            let fb_result = await createUserWithEmailAndPassword(this.fbAuth,new_user.email,new_user.password);
            let user = fb_result.user;  
            new_user.id_User = user.uid;
            this.post_user_to_API(new_user);
            return true;
        }catch(error:unknown){
            let asError = error as Error;
            console.error(error);
            return asError;
        }
    }
}