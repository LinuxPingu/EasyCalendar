import {Injectable} from '@angular/core';
import { Auth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, user } from '@angular/fire/auth';
import { User_Model } from '../Models/user.model';
import { API_URL } from '../Helpers/app_constants';
import { HttpClient } from '@angular/common/http';
import { fetchSignInMethodsForEmail, signInWithPopup, signOut, UserCredential } from 'firebase/auth';
import { interval, map, Observable, switchMap } from 'rxjs';
import { User_Info_Model } from '../Models/user-info.model';
import { Helper } from 'src/app/Helpers/helper';

@Injectable({
    providedIn:'root'
})
export class UserService{

    private readonly user_enpoint = 'UserData';
    private readonly user_info_enpoint = 'UserInfo';

    users_list:User_Model[] = [];

    private cur_uid:string = "";

    private helper:Helper = new Helper();

    cur_user:User_Model={
        id_User: '',
        email: '',
        username: '',
        password: '',
        is_Admin: false,
        is_Active: false
    }

    cur_user_info:User_Info_Model={
        id_User: this.cur_user.id_User,
        name: '',
        last_name: '',
        phone: '',
        birthday: ''
    }

    constructor(private fbAuth:Auth, private http: HttpClient) { }
   
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

    post_user_info_to_API(new_user_info:User_Info_Model){
        let url = API_URL + this.user_info_enpoint;
        let data = JSON.stringify(new_user_info);
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

    get_user_info_by_UID(uid?:string):Observable<User_Info_Model | null>{
        this.refersh_auth();
        let url = "";
        if(this.cur_uid === null || this.cur_uid === ""){
            url = API_URL + this.user_info_enpoint+`/${uid}`
        }else{
            url = API_URL + this.user_info_enpoint+`/${this.cur_uid}`
        }
        
        return this.http.get<User_Info_Model | null>(url); 
    }

    get_all_users():User_Model[] {

        let url:string = API_URL + this.user_enpoint+`/get-all`
        let list:User_Model[] = [];

        this.http.get<any[]>(url).pipe(
            map((response: any[]) => {
              if (!response) {
                return [];
              }
              return response.map((item) => ({
                id_User: item.id_User,
                email: item.email,
                username: item.username,
                password: item.password,
                is_Admin: item.is_Admin,
                is_Active: item.is_Active
              }));
            })
          ).subscribe((data: User_Model[]) => {
            data.forEach(element => {
                list.push(element);
                console.log(` pushed ${element}`);    
            });
          });

        return list;
    }

    get_users_obvs():Observable<User_Model[]>{
        
        let url = API_URL + this.user_enpoint+`/get-all`;
        return interval(5000).pipe(
            switchMap(() => this.http.get<User_Model[]>(url)),
            map(users => users.map(user => ({
              id_User: user.id_User,
              email: user.email,
              username: user.username,
              password: user.password,
              is_Admin: user.is_Admin,
              is_Active: user.is_Active
            }
           )))
        );
    }

    refersh_auth(){
        if(this.fbAuth.currentUser != null){
            this.cur_uid = this.fbAuth.currentUser.uid;
        }
    }

    get_current_logged_user():User_Model{
        this.refersh_auth();
        this.get_user_by_UID().subscribe(
          doc =>{
            if(doc != null){
              this.build_user(doc.id_User,doc.email,doc.username,doc.password,doc.is_Admin,doc.is_Active)
            }
          }
        )
        return this.cur_user
    }

    get_uid():string | null{
        if(this.fbAuth.currentUser != null){
            return this.fbAuth.currentUser.uid;
        }else{
            return null;
        }
    }

    async get_current_user_info():Promise<User_Info_Model | null>{
        this.refersh_auth();
        return new Promise<User_Info_Model | null>((resolve, reject)=>{
            this.get_user_info_by_UID().subscribe(
                (info) =>{
                    if (info != null){
                        this.cur_user_info = Helper.build_user_info(info.id_User, info.name, info.last_name, info.phone, info.birthday);
                        console.log(this.cur_user_info);  
                        resolve(this.cur_user_info);
                    }else{
                        resolve(null);
                    }
                },
                (error) => {
                    reject(error);
                }
            );
        });
    }

    build_user(id:string,email:string,username:string,password:string,isAdmin:boolean,isActive:boolean){
        this.cur_user.id_User =id ;
        this.cur_user.email = email;
        this.cur_user.username = username;
        this.cur_user.password = password;
        this.cur_user.is_Admin = isAdmin;
        this.cur_user.is_Active = isActive;
    
        console.log(`Built user ${this.cur_user.email}`);
    }

    update_user(user:User_Model){
        let url = API_URL + this.user_enpoint+`/update-user/${user.id_User}`
        return this.http.put(url,user);
    }

    update_user_info(user_info:User_Info_Model){
        let url = API_URL + this.user_info_enpoint+`/update-user-info/${user_info.id_User}`
        return this.http.put(url,user_info);
    }

    delete_user(user:User_Model){
        let url = API_URL + this.user_enpoint+`/delete-user/${user.id_User}`
        console.log(url)
        return this.http.delete(url);
    }

    logout() {
        if(this.fbAuth.currentUser != null){
            console.log(`logging out user: ${this.fbAuth.currentUser.displayName}`);
        }
      return signOut(this.fbAuth);
    }
}