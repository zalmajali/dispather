import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders} from "@angular/common/http";
@Injectable({
  providedIn: 'root'
})
export class TicketsService {
//url
  private baseUrl = "https://fsm-dev.nj-digits.de/api";
  public result:any;
  constructor(private http:HttpClient) {
  }
  async tickets(item:any,userId:any){
    let userIdVal = userId.toString();
    let httpOptionsVal = {
      headers: new HttpHeaders({
        'appKey': '2sMZrnQciB',
        'authId': userIdVal,
        'Content-Type': 'application/json'
      })
    }
    return new Promise(resolve => {
      this.http.post(this.baseUrl+'/'+"get_technical_route",JSON.stringify(item),httpOptionsVal).subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  async ticketsComplete(item:any,userId:any){
    let userIdVal = userId.toString();
    let httpOptionsVal = {
      headers: new HttpHeaders({
        'appKey': '2sMZrnQciB',
        'authId': userIdVal,
        'Content-Type': 'application/json'
      })
    }
    return new Promise(resolve => {
      this.http.post(this.baseUrl+'/'+"get_technical_route_complete",JSON.stringify(item),httpOptionsVal).subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  async ticketsOrderRoute(item:any,userId:any){
    let userIdVal = userId.toString();
    let httpOptionsVal = {
      headers: new HttpHeaders({
        'appKey': '2sMZrnQciB',
        'authId': userIdVal,
        'Content-Type': 'application/json'
      })
    }
    return new Promise(resolve => {
      this.http.post(this.baseUrl+'/'+"order_route",JSON.stringify(item),httpOptionsVal).subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  async ticketAction(item:any,userId:any){
    let userIdVal = userId.toString();
    let httpOptionsVal = {
      headers: new HttpHeaders({
        'appKey': '2sMZrnQciB',
        'authId': userIdVal,
        'Content-Type': 'application/json'
      })
    }
    return new Promise(resolve => {
      this.http.post(this.baseUrl+'/'+"get_ticket_action",JSON.stringify(item),httpOptionsVal).subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  async ticketAttachment(item:any,userId:any){
    let userIdVal = userId.toString();
    let httpOptionsVal = {
      headers: new HttpHeaders({
        'appKey': '2sMZrnQciB',
        'authId': userIdVal,
        'Content-Type': 'application/json'
      })
    }
    return new Promise(resolve => {
      this.http.post(this.baseUrl+'/'+"get_ticket_attachment",JSON.stringify(item),httpOptionsVal).subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  async stockParts(item:any,userId:any){
    let userIdVal = userId.toString();
    let httpOptionsVal = {
      headers: new HttpHeaders({
        'appKey': '2sMZrnQciB',
        'authId': userIdVal,
        'Content-Type': 'application/json'
      })
    }
    return new Promise(resolve => {
      this.http.post(this.baseUrl+'/'+"get_stock_part",JSON.stringify(item),httpOptionsVal).subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  async ticketStatus(userId:any){
    let userIdVal = userId.toString();
    let httpOptionsVal = {
      headers: new HttpHeaders({
        'appKey': '2sMZrnQciB',
        'authId': userIdVal,
        'Content-Type': 'application/json'
      })
    }
    return new Promise(resolve => {
      this.http.post(this.baseUrl+'/'+"get_ticket_status",'',httpOptionsVal).subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  async technicals(userId:any){
    let userIdVal = userId.toString();
    let httpOptionsVal = {
      headers: new HttpHeaders({
        'appKey': '2sMZrnQciB',
        'authId': userIdVal,
        'Content-Type': 'application/json'
      })
    }
    return new Promise(resolve => {
      this.http.post(this.baseUrl+'/'+"get_technicals",'',httpOptionsVal).subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  async updateTicket(item:any,userId:any){
    let userIdVal = userId.toString();
    let httpOptionsVal = {
      headers: new HttpHeaders({
        'appKey': '2sMZrnQciB',
        'authId': userIdVal,
        'Content-Type': 'application/json'
      })
    }
    return new Promise(resolve => {
      this.http.post(this.baseUrl+'/'+"update_ticket",JSON.stringify(item),httpOptionsVal).subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  async updateStockPart(item:any,userId:any){
    let userIdVal = userId.toString();
    let httpOptionsVal = {
      headers: new HttpHeaders({
        'appKey': '2sMZrnQciB',
        'authId': userIdVal,
        'Content-Type': 'application/json'
      })
    }
    return new Promise(resolve => {
      this.http.post(this.baseUrl+'/'+"update_stock_part",JSON.stringify(item),httpOptionsVal).subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  async ticketHomeStatus(userId:any){
    let userIdVal = userId.toString();
    let httpOptionsVal = {
      headers: new HttpHeaders({
        'appKey': '2sMZrnQciB',
        'authId': userIdVal,
        'Content-Type': 'application/json'
      })
    }
    return new Promise(resolve => {
      this.http.post(this.baseUrl+'/'+"get_home_ticket_status",'',httpOptionsVal).subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  async updateTicketStatus(item:any,userId:any){
    let userIdVal = userId.toString();
    let httpOptionsVal = {
      headers: new HttpHeaders({
        'appKey': '2sMZrnQciB',
        'authId': userIdVal,
        'Content-Type': 'application/json'
      })
    }
    return new Promise(resolve => {
      this.http.post(this.baseUrl+'/'+"update_ticket_status",JSON.stringify(item),httpOptionsVal).subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  async ticketDetails(item:any,userId:any){
    let userIdVal = userId.toString();
    let httpOptionsVal = {
      headers: new HttpHeaders({
        'appKey': '2sMZrnQciB',
        'authId': userIdVal,
        'Content-Type': 'application/json'
      })
    }
    return new Promise(resolve => {
      this.http.post(this.baseUrl+'/'+"get_ticket_details",JSON.stringify(item),httpOptionsVal).subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  async ticketsStatuse(item:any,userId:any){
    let userIdVal = userId.toString();
    let httpOptionsVal = {
      headers: new HttpHeaders({
        'appKey': '2sMZrnQciB',
        'authId': userIdVal,
        'Content-Type': 'application/json'
      })
    }
    return new Promise(resolve => {
      this.http.post(this.baseUrl+'/'+"get_ticket_details",JSON.stringify(item),httpOptionsVal).subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  async ticketsPartStatus(userId:any){
    let userIdVal = userId.toString();
    let httpOptionsVal = {
      headers: new HttpHeaders({
        'appKey': '2sMZrnQciB',
        'authId': userIdVal,
        'Content-Type': 'application/json'
      })
    }
    return new Promise(resolve => {
      this.http.post(this.baseUrl+'/'+"get_part_status",'',httpOptionsVal).subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
}
