import { Injectable } from '@angular/core';
import { Event_Model } from '../Models/event.model';
import { User_Events_Model } from '../Models/user_events.model';
import { API_URL } from '../Helpers/app_constants';
import { Observable, interval, map, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  private readonly usr_events_enpoint = 'Events';
  constructor(private http: HttpClient) { }

  get_user_events(uid:string):Observable<User_Events_Model>{
    let url:string = API_URL + this.usr_events_enpoint+`/${uid}`
    return this.http.get<User_Events_Model>(url).pipe(
      map(res => res || null)
    );
  }

  post_events_to_API(user_events:User_Events_Model){
    let url = API_URL + this.usr_events_enpoint+`/manage-user-events/${user_events.uid}`;
    let data = JSON.stringify(user_events);
    let headers = { 'Content-Type': 'application/json' };

    this.http.put(url, data, { headers }).subscribe(response => {
         console.log(response);
     }, error => {
         console.error(error);
     });   
}
}
