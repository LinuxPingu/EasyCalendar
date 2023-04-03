import {Injectable} from '@angular/core';
import { Auth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, user } from '@angular/fire/auth';
import { User_Model } from '../Models/user.model';
import { API_URL } from '../Helpers/app_constants';
import { HttpClient } from '@angular/common/http';
import { fetchSignInMethodsForEmail, signInWithPopup, signOut, UserCredential } from 'firebase/auth';
import { Observable } from 'rxjs';

@Injectable({
    providedIn:'root'
})
export class UserService{

    private readonly user_enpoint = 'UserData';

    private cur_uid:string = "";

    constructor(private fbAuth:Auth, private http: HttpClient) { 
       
    }
   
    post_user_to_API(new_user:User_Model){
        let url = API_URL + this.user_enpoint;
        let data = JSON.stringify(new_user);
        let headers = { 'Content-Type': 'application/json' };

        this.http.post(url, data, { headers }).subscribe(response => {
             console.log(response);
         }, error => {
             console.error(error);
         });   
    }

    async register_by_email(new_user:User_Model):Promise<boolean | Error>{
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

    async register_by_google(result:UserCredential){
            /*Build User*/
            let new_user: User_Model={
                id_User: result.user.uid,
                email: result.user.email ?? 'no_mail',
                username: result.user.displayName ?? 'no_username',
                password: 'by_Google',
                is_Admin: false,
                is_Active: true
            }

            this.post_user_to_API(new_user);
    }

    async login_with_google():Promise<boolean | Error>{
        this.logout();
        try {
            let provider = new GoogleAuthProvider();
            let result = await signInWithPopup(this.fbAuth,provider);
            let signInMethods =  await fetchSignInMethodsForEmail(this.fbAuth,result.user.email ?? "none");

            if(signInMethods.includes('google.com')){
               this.refersh_auth();
               this.get_user_by_UID(result.user.uid).subscribe(
                    doc =>{
                        if(doc === null){
                          this.register_by_google(result)
                       }
                    }
                )
            }

            return true;
        } catch (error) {
            let asError = error as Error;
            console.error(error);
            return asError;
        }
    }

    login_with_email(email:string,password:string){
        this.logout();
        return signInWithEmailAndPassword(this.fbAuth,email,password);
    }

    get_user_by_UID(uid?:string):Observable<User_Model | null>{
        this.refersh_auth();
        let url = "";
        if(this.cur_uid === null || this.cur_uid === ""){
            url = API_URL + this.user_enpoint+`/users/${uid}`
        }else{
            url = API_URL + this.user_enpoint+`/users/${this.cur_uid}`
        }
        
        return this.http.get<User_Model | null>(url); 
    }

    refersh_auth(){
        if(this.fbAuth.currentUser != null){
            this.cur_uid = this.fbAuth.currentUser.uid;
        }
    }

    logout() {
        if(this.fbAuth.currentUser != null){
            console.log(`logging out user: ${this.fbAuth.currentUser.displayName}`);
        }
      return signOut(this.fbAuth);
    }
}