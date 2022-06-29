import {
  HttpClient} from '@angular/common/http';
import {
  Injectable
} from '@angular/core';
import {
  Observable
} from 'rxjs';
import {
  Mib
} from '../_models/mib';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  REST_API_SERVER = "http://127.0.0.1:8000/";


  constructor(private http: HttpClient) {}

  getRequest(url: string): Observable < any > {
    return this.http.get(this.REST_API_SERVER + url)
  }


  uploadFile(url: string, payload: any) {

    const formData = new FormData();

    formData.append("file", payload, payload.name);

    return this.http.post < Mib > (this.REST_API_SERVER + url, formData)

  }
  postRequest(url: string, payload: any) {
    return this.http.post(this.REST_API_SERVER + url, payload);
  }

  putRequest(url: string, payload: JSON) {
    return this.http.put(this.REST_API_SERVER + url, payload)
  }
}
