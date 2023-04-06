import { Injectable } from '@angular/core';
import { System_Tags_Model } from '../Models/system-tags.model';
import { API_URL } from '../Helpers/app_constants';
import { Observable, interval, map, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TagsServiceService  {

  private readonly sys_tags_enpoint = 'SystemTags';


  constructor(private http: HttpClient) { }

  get_system_tags():Observable<System_Tags_Model>{
    console.log("On tags");
    let url:string = API_URL + this.sys_tags_enpoint+`/System`
    console.log(url);
    return interval(1000).pipe(
      switchMap(() => this.http.get<System_Tags_Model>(url)),
      map(res => res || null)
    );
  }


  post_tags_to_API(tags:System_Tags_Model){
    let url = API_URL + this.sys_tags_enpoint+`/update-tags/${tags.id}`;
    let data = JSON.stringify(tags);
    let headers = { 'Content-Type': 'application/json' };

    this.http.put(url, data, { headers }).subscribe(response => {
         console.log(response);
     }, error => {
         console.error(error);
     });   
}
}
