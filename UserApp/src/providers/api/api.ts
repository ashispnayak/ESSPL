import {Injectable} from '@angular/core';
import {Http,Headers} from '@angular/http';
import 'rxjs/Rx'
/*
  Generated class for the ApiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ApiProvider {
	oneSignalUrl: string;

  constructor(public http: Http) {
   this.oneSignalUrl="https://onesignal.com/api/v1/notifications/";
			
  }
  sendSosNotifications(long,lat){
  	let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Authorization','Basic YjYwYzFjOGQtYjlmNy00MTBmLTgwZjYtOWFlZTNjMjllYmJi');
      let body={
"app_id": "d19097c8-aa4f-4eeb-86d7-f79a56a32630",
"included_segments": ["All"],
"contents": {"en": "Help! Someone is in Emergency"},
"data": {"lat": lat,"long": +long,"root":"victimLocation"}
}

      return this.http.post(this.oneSignalUrl,JSON.stringify(body),{headers:headers}).map(res=>res.json());
  }

}
