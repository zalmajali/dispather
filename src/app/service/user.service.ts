import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders} from "@angular/common/http";
@Injectable({
  providedIn: 'root'
})
export class UserService {
  //url
  private baseUrl = "https://fsm-dev.nj-digits.de/api";
  public result:any;
  constructor(private http:HttpClient) {
  }
  httpOptionsVal = {
    headers: new HttpHeaders({
      'appKey': '2sMZrnQciB',
      'Content-Type': 'application/json'
    })
  }
  async login(item:any){
    return new Promise(resolve => {
      this.http.post(this.baseUrl+'/'+"login",JSON.stringify(item),this.httpOptionsVal).subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  async userSetting(userId:any){
    return new Promise(resolve => {
      let headers = new HttpHeaders()
        .set('appKey', '2sMZrnQciB')
        .set('authId', userId)
        .set('Content-Type', 'application/json');
      this.http.post(this.baseUrl+'/'+"setting",'',{ headers }).subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  async updateSetting(item:any,userId:any){
    return new Promise(resolve => {
      let headers = new HttpHeaders()
        .set('appKey', '2sMZrnQciB')
        .set('authId', userId)
        .set('Content-Type', 'application/json');
      this.http.post(this.baseUrl+'/'+"setting_update",JSON.stringify(item),{ headers }).subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  async forgetPassword(item:any){
    return new Promise(resolve => {
      this.http.post(this.baseUrl+'/'+"forget_password",JSON.stringify(item),this.httpOptionsVal).subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  async changePassword(item:any,userId:any){
    let headers = new HttpHeaders()
      .set('appKey', '2sMZrnQciB')
      .set('authId', userId)
      .set('Content-Type', 'application/json');
    return new Promise(resolve => {
      this.http.post(this.baseUrl+'/'+"change_password",JSON.stringify(item),this.httpOptionsVal).subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
}
