import { Component, OnInit,ViewChild } from '@angular/core';
import {IonReorderGroup,LoadingController, MenuController, NavController, Platform,ModalController, ToastController,AlertController} from "@ionic/angular";
import {Storage} from "@ionic/storage";
import {HttpClient} from "@angular/common/http";
import { Router } from '@angular/router';
import { Globalization } from '@ionic-native/globalization/ngx';
import { TranslateService } from '@ngx-translate/core';
import { Network } from '@ionic-native/network/ngx';
import { ItemReorderEventDetail } from '@ionic/core';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { IonInfiniteScroll } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
//service
import {TicketsService} from "../service/tickets.service";
import {TicketactionComponent} from "../ticketaction/ticketaction.component";
import {TicketattachmentComponent} from "../ticketattachment/ticketattachment.component";
declare var google:any;
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonReorderGroup) reorderGroup: IonReorderGroup;
  public map: any;
  public directionsService:any;
  public directionsDisplay:any;
  public ticketsTitle:any;
  public totalKm:any;
  public totalTime:any;
  public searchPlaceholder:any;
  public sorting:any;
  public distance:any;
  public time:any;
  public stockName:any;
  public searchValues:any;
  public orderByData:any;
  public userId:any;
  public password:any;
  public userEmail:any;
  public userName:any;
  public allpath:any=[];
  public operationResult:any;
  public returnTicketsData:any;
  public returnArrayTicketsFromServer:any;
  public returnTicketsArray:any = [];
  public ticketOrder:any = [];
  public ticketOrderNew:any = [];
  public start:any;
  public end:any;
  public returnTicketStatusData:any;
  public returnArrayTicketStatusFromServer:any;
  public returnTicketStatusArray:any = [];
  public selectStatus:any;
  public begin:any;
  public finish:any;
  public close:any;
  public confirm:any;
  public tacke:any;
  public yes:any;
  public no:any;
  public messageAlert:any;
  public returnUpdateTicketStatusData:any;
  public updateTicketStatusMsgSuccess:any;
  public updateTicketStatusMsgErrorOne:any;
  public callNumberMsgError:any;
  public returnUpdateTicketsData:any;
  public ticketOrderRouteMsgSuccess:any;
  public ticketOrderRouteMsgError:any;
  public eta:any;
  public returnTicketsNoteData:any;
  public returnArrayTicketsNoteFromServer:any;
  public returnTicketsNoteArray:any = [];
  public returnTicketsAttachmentData:any;
  public returnArrayTicketsAttachmentFromServer:any;
  public returnTicketsAttachmentArray:any = [];
  public totalKmCount:any=0;
  public totalTimeCount:any=0;
  public totalTimeCountHours:any=0;
  public lat:any;
  public lng:any;
  //dark mode classs
  public darkMode:any;
  public darkNormalCalss:any="normal";
  //----------------------------------------------------
  //this variables for system
  public checkLanguage: any=0;
  public language: string;
  public message:any;
  public toastStyle:any;
  constructor(private geolocation: Geolocation,private callNumber: CallNumber,private ticketsService: TicketsService,private alertController:AlertController,private globalization: Globalization,private modalController: ModalController, private translate: TranslateService,private http:HttpClient,private router : Router,private network:Network,private menu:MenuController,private storage: Storage,private platform: Platform,private navCtrl: NavController,private toastCtrl: ToastController,private loading: LoadingController) {
    this.storage.get('darkMode').then(darkMode=>{
      if(darkMode == 1){
        this.menu.enable(true, "inMenueDark");
        this.menu.enable(false, "inMenue");
      }else{
        this.menu.enable(false, "inMenueDark");
        this.menu.enable(true, "inMenue");
      }
    });
    this.checkInternetData();
  }
  //this function for render variables in selected lang;
  initialiseTranslation(){
    this.translate.get('tickets_title').subscribe((res: string) => {
      this.ticketsTitle = res;
    });
    this.translate.get('total_Km').subscribe((res: string) => {
      this.totalKm = res;
    });
    this.translate.get('total_time').subscribe((res: string) => {
      this.totalTime = res;
    });
    this.translate.get('search_placeholder').subscribe((res: string) => {
      this.searchPlaceholder = res;
    });
    this.translate.get('sorting').subscribe((res: string) => {
      this.sorting = res;
    });
    this.translate.get('distance').subscribe((res: string) => {
      this.distance = res;
    });
    this.translate.get('time').subscribe((res: string) => {
      this.time = res;
    });
    this.translate.get('stock_name').subscribe((res: string) => {
      this.stockName = res;
    });
    this.translate.get('select_status').subscribe((res: string) => {
      this.selectStatus = res;
    });
    this.translate.get('begin').subscribe((res: string) => {
      this.begin = res;
    });
    this.translate.get('finish').subscribe((res: string) => {
      this.finish = res;
    });
    this.translate.get('eta').subscribe((res: string) => {
      this.eta = res;
    });
    this.translate.get('close').subscribe((res: string) => {
      this.close = res;
    });
    this.translate.get('confirm').subscribe((res: string) => {
      this.confirm = res;
    });
    this.translate.get('tacke').subscribe((res: string) => {
      this.tacke = res;
    });
    this.translate.get('yes').subscribe((res: string) => {
      this.yes = res;
    });
    this.translate.get('no').subscribe((res: string) => {
      this.no = res;
    });
    this.translate.get('message_alert').subscribe((res: string) => {
      this.messageAlert = res;
    });
    this.translate.get('update_ticket_status_msg_success').subscribe((res: string) => {
      this.updateTicketStatusMsgSuccess = res;
    });
    this.translate.get('update_ticket_status_error_msg_one').subscribe((res: string) => {
      this.updateTicketStatusMsgErrorOne = res;
    });
    this.translate.get('call_number_msg_error').subscribe((res: string) => {
      this.callNumberMsgError = res;
    });
    this.translate.get('ticket_order_route_msg_success').subscribe((res: string) => {
      this.ticketOrderRouteMsgSuccess = res;
    });
    this.translate.get('ticket_order_route_msg_error').subscribe((res: string) => {
      this.ticketOrderRouteMsgError = res;
    });
  }
  //call of number
  functionCallNumber(numer:any){
    if(numer == "" || numer==undefined || numer==null || numer==0){
      this.message = this.callNumberMsgError;
      this.displayResult(this.message);
    }else{
      this.callNumber.callNumber(numer, true)
        .then(res =>{})
        .catch(err =>{
          this.message = this.callNumberMsgError;
          this.displayResult(this.message);
        });
    }
  }
  //open ticket action model
  async ticketAction(mapId:any){
    let model = await this.modalController.create({
      component:TicketactionComponent,
      animated:true,
      componentProps:{mapId:mapId},
      cssClass:"modalOpenCss"
    });
    await model.present();
  }
  //open ticket attachment model
  async ticketattachment(mapId:any){
    let model = await this.modalController.create({
      component:TicketattachmentComponent,
      animated:true,
      componentProps:{mapId:mapId},
      cssClass:"modalOpenCss"
    });
    await model.present();
  }
  //function To Get All Data
  async functionReturnData(userId:any){
    const loading = await this.loading.create({
      cssClass: 'my-custom-class',
      message: '',
      duration: 2000,
    });
    let selectData = new Date();
    let fullDate = selectData.getFullYear() + "-" + (selectData.getMonth() + 1) + "-" + selectData.getDate();
    let sendValues = {"route_date":fullDate};
    //let sendValues = {"route_date":'2023-2-9'};
    this.ticketsService.tickets(sendValues,userId).then(async data=>{
      this.returnTicketsData = data;
      this.operationResult = this.returnTicketsData.status;
      if(this.operationResult){
        let counter = 1;
        this.returnTicketsArray=[];
        this.ticketOrder=[];
        this.returnArrayTicketsFromServer = this.returnTicketsData.result;
        for(let i = 0; i < this.returnArrayTicketsFromServer.length;i++) {
          this.returnTicketsArray[i]=[];
          this.returnTicketsArray[i]['id'] = this.returnArrayTicketsFromServer[i].id;
          this.returnTicketsArray[i]['label']="";
          this.returnTicketsArray[i]['routeMapId'] = this.returnArrayTicketsFromServer[i].route_map_id;
          this.returnTicketsArray[i]['ticketId'] = this.returnArrayTicketsFromServer[i].ticket_id;
          this.returnTicketsArray[i]['customerId'] = this.returnArrayTicketsFromServer[i].customer_id;
          this.returnTicketsArray[i]['directionOrder'] = this.returnArrayTicketsFromServer[i].direction_order;
          this.returnTicketsArray[i]['mapType'] = this.returnArrayTicketsFromServer[i].map_type;
          this.returnTicketsArray[i]['mapId'] = this.returnArrayTicketsFromServer[i].map_id;
          this.returnTicketsArray[i]['createdAt'] = this.returnArrayTicketsFromServer[i].created_at;
          this.returnTicketsArray[i]['updatedAt'] = this.returnArrayTicketsFromServer[i].updated_at;
          this.returnTicketsArray[i]['callId'] = this.returnArrayTicketsFromServer[i].call_id;
          this.returnTicketsArray[i]['etaTime'] = 0;
          this.returnTicketsArray[i]['taskDuration'] = this.returnArrayTicketsFromServer[i].task_duration;
          this.returnTicketsArray[i]['allTicketAttachment'] = this.returnArrayTicketsFromServer[i].has_attachment;
          this.returnTicketsArray[i]['allTicketNote'] = this.returnArrayTicketsFromServer[i].has_action;
          if(this.returnArrayTicketsFromServer[i].task_duration == null || this.returnArrayTicketsFromServer[i].task_duration==undefined || this.returnArrayTicketsFromServer[i].task_duration==0 || this.returnArrayTicketsFromServer[i].task_duration=="")
            this.returnTicketsArray[i]['taskDuration'] = await this.storage.get('taskDuration');
          if(this.returnTicketsArray[i]['taskDuration'] == null || this.returnTicketsArray[i]['taskDuration']==undefined || this.returnTicketsArray[i]['taskDuration']==0 || this.returnTicketsArray[i]['taskDuration']=="")
            this.returnTicketsArray[i]['taskDuration'] = 0;
          this.totalTimeCount+=await this.returnTicketsArray[i]['taskDuration']*60;
          this.returnTicketsArray[i]['totalTimeCount'] = this.totalTimeCount;
          if(this.returnArrayTicketsFromServer[i].eta_time!=null && this.returnArrayTicketsFromServer[i].eta_time!=undefined && this.returnArrayTicketsFromServer[i].eta_time!=0 && this.returnArrayTicketsFromServer[i].eta_time!=""){
            let etaTime = this.returnArrayTicketsFromServer[i].eta_time.split(":");
            if(etaTime[0]!='00')
              this.returnTicketsArray[i]['etaTime'] = etaTime[0]+":"+etaTime[1];
          }
          this.returnTicketsArray[i]['statusName'] = this.returnArrayTicketsFromServer[i].status_name;
          this.returnTicketsArray[i]['customerName'] = this.returnArrayTicketsFromServer[i].customer_name;
          this.returnTicketsArray[i]['custmerPhone'] = this.returnArrayTicketsFromServer[i].custmer_phone;
          this.returnTicketsArray[i]['customerAddress'] = this.returnArrayTicketsFromServer[i].customer_address;
          this.returnTicketsArray[i]['ticketItatusId'] = this.returnArrayTicketsFromServer[i].ticket_status_id;
          this.returnTicketsArray[i]['statusName'] = this.returnArrayTicketsFromServer[i].status_name;
          this.returnTicketsArray[i]['startWork']= 0;
          this.returnTicketsArray[i]['endWork']= 0;
          if(this.returnArrayTicketsFromServer[i].begin_time!=null && this.returnArrayTicketsFromServer[i].begin_time!=undefined && this.returnArrayTicketsFromServer[i].begin_time!=0 && this.returnArrayTicketsFromServer[i].begin_time!=""){
            let startWork = this.returnArrayTicketsFromServer[i].begin_time.split(":");
            if(startWork[0]!='00')
              this.returnTicketsArray[i]['startWork'] = startWork[0]+":"+startWork[1];
          }
          if(this.returnArrayTicketsFromServer[i].finish_time!=null && this.returnArrayTicketsFromServer[i].finish_time!=undefined && this.returnArrayTicketsFromServer[i].finish_time!=0 && this.returnArrayTicketsFromServer[i].finish_time!=""){
            let endWork = this.returnArrayTicketsFromServer[i].finish_time.split(":");
            if(endWork[0]!='00')
              this.returnTicketsArray[i]['endWork'] = endWork[0]+":"+endWork[1];
          }
          this.returnTicketsArray[i]['lat'] = this.returnArrayTicketsFromServer[i].lat;
          this.returnTicketsArray[i]['lng'] = this.returnArrayTicketsFromServer[i].lng;
          this.returnTicketsArray[i]['order'] = counter;
          this.ticketOrder[i] = [this.returnTicketsArray[i]['id']];
          if(counter==this.returnArrayTicketsFromServer.length){
            this.end = {lat:parseFloat(this.returnArrayTicketsFromServer[i].lat), lng:parseFloat(this.returnArrayTicketsFromServer[i].lng)};
            this.allpath[i] = {location: {lat:parseFloat(this.returnArrayTicketsFromServer[i].lat), lng:parseFloat(this.returnArrayTicketsFromServer[i].lng)}}
          }
         else
          this.allpath[i] = {location: {lat:parseFloat(this.returnArrayTicketsFromServer[i].lat), lng:parseFloat(this.returnArrayTicketsFromServer[i].lng)}}
          counter++;
        }
      }
      if(this.returnTicketsArray.length!=0)
        await this.loadMap();
      await loading.present();
    }).catch(err=>{});
  }
  async titcketOrderNew(event: any) {
    const loading = await this.loading.create({
      cssClass: 'my-custom-class',
      message: '',
      duration: 2000,
    });
    this.ticketOrder = event.detail.complete(this.ticketOrder);
    let counter = 1
    for(let i = 0; i < this.ticketOrder.length;i++){
      this.ticketOrderNew[i] = {'id':this.ticketOrder[i][0],"direction_order":counter};
      counter++;
    }
    let sendValues = {'tickets':this.ticketOrderNew};
    this.ticketsService.ticketsOrderRoute (sendValues,this.userId).then(async data=>{
      this.returnUpdateTicketsData = data;
      this.operationResult = this.returnUpdateTicketsData.status;
      if(this.operationResult){
        this.message = this.ticketOrderRouteMsgSuccess;
        this.displayResult(this.message);
        await this.functionReturnData(this.userId);
      }else{
        this.message = this.ticketOrderRouteMsgError;
        this.displayResult(this.message);
      }
      await loading.present();
    });
  }
  //check if add data in search form
  checkSearchInput(event){
    this.searchValues = event;
  }
  //display if search value is not empty and display search
  displaySearchInput(){
  }
  //check if add data in user name form
  async selectOrderByValues(event){
    this.orderByData = event;
  }
  async ngOnInit() {
    await this.getDeviceLanguage();
    this.checkInternetData();
    this.userId = await this.storage.get('userId');
    this.password = await this.storage.get('password');
    this.userEmail = await this.storage.get('userEmail');
    this.userName = await this.storage.get('userName');
    if(this.userId == null || this.password == null || this.userEmail == null || this.userName == null){
      this.storage.remove('userId');
      this.storage.remove('password');
      this.storage.remove('userFirstName');
      this.storage.remove('userlastName');
      this.storage.remove('userGender');
      this.storage.remove('userEmail');
      this.storage.remove('userEmail');
      this.storage.remove('userName');
      this.storage.remove('userLanguage');
      this.storage.remove('userNotification');
      this.navCtrl.navigateRoot('login');
    }
    //return ticket Status of array
    this.ticketsService.ticketHomeStatus(this.userId).then(async data=>{
      this.returnTicketStatusData = data;
      this.operationResult = this.returnTicketStatusData.status;
      if(this.operationResult){
        this.returnTicketStatusArray=[];
        this.returnArrayTicketStatusFromServer = this.returnTicketStatusData.result;
        for(let i = 0; i < this.returnArrayTicketStatusFromServer.length;i++) {
          this.returnTicketStatusArray[i]=[];
          this.returnTicketStatusArray[i]['id'] = this.returnArrayTicketStatusFromServer[i].id;
          this.returnTicketStatusArray[i]['name'] = this.returnArrayTicketStatusFromServer[i].name;
        }
      }
    });
    await this.functionReturnData(this.userId);
    await this.functionDarkMode();
    await this.geolocation.getCurrentPosition().then(async (resp) => {
      this.lat = resp.coords.latitude;
      this.lng = resp.coords.longitude;
    })
  }
  //function chage to dark mode
  async functionDarkMode(){
    this.darkMode = await this.storage.get('darkMode');
    if(this.darkMode == 1){
      this.darkNormalCalss = "dark";
    }else{
      this.darkNormalCalss = "normal";
    }
  }
  loadMap() {
    // Create a map options object
    let mapOptions = {
      zoom: 8,
      center: {lat:32.106282, lng:36.095882}
    };
    // Create the map
    this.map = new google.maps.Map(document.getElementById('map'), mapOptions);
    // Initialize the directions service and display
    this.directionsService = new google.maps.DirectionsService();
    this.directionsDisplay = new google.maps.DirectionsRenderer({
      map: this.map,
    });
    // Set the start and end locations and request the directions
    let start = this.allpath[0];
    let end = this.end;
    let request = {
      origin: start,
      destination: end,
      waypoints: this.allpath,
      optimizeWaypoints: false,
      travelMode: 'DRIVING'
    };
    this.directionsService.route(request, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        let distanceCount = 0;
        for(let i = 0; i < result.routes[0].legs.length;i++) {
          distanceCount+=result.routes[0].legs[i].distance.value;
          this.totalTimeCount+=result.routes[0].legs[i].duration.value;
          //let totalTimeCountVal = parseInt(result.routes[0].legs[i].duration.value+this.returnTicketsArray[i]['totalTimeCount'])/3600;
          //if(totalTimeCountVal>1)
            //this.returnTicketsArray[i]['totalTimeCount'] = Math.ceil(parseInt(result.routes[0].legs[i].duration.value+this.returnTicketsArray[i]['totalTimeCount'])/3600)+" hours";
         // else
            //this.returnTicketsArray[i]['totalTimeCount'] = Math.ceil(parseInt(result.routes[0].legs[i].duration.value+this.returnTicketsArray[i]['totalTimeCount'])/3600)+" minutes";
        }
        this.totalKmCount = Math.floor(distanceCount/1000);
        this.totalTimeCountHours = Math.ceil(this.totalTimeCount/3600);
        let directionsRenderer = new google.maps.DirectionsRenderer({
          suppressMarkers: false,
          polylineOptions: {
            geodesic: true,
            strokeColor: "#0000FF",
            strokeOpacity: 1.0,
            strokeWeight: 2,
          },  markerOptions: {
            icon: {
              // Specify the icon image
              url: '../assets/images/lo.png',
            },

          }
        });
        directionsRenderer.setMap(this.map);
        directionsRenderer.setDirections(result);
      }
    });
  }
  async refrechAllPage(event) {
    await this.functionReturnData(this.userId);
    await this.functionDarkMode();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }
  //this function to chjange ticket status
  async changeStatuseTicket(evant:any,mapId:any){
    if(evant != 3 && evant != 4){
      let casheTime = new Date();
      this.navCtrl.navigateRoot(['/task', {mapId:mapId+'_'+casheTime.getTime(),'statuse':evant}])
    }else{
      let darkStyle = await this.storage.get('darkMode');
      let selectClass="";
      if(darkStyle == 1){
        selectClass = "alertBacdark";
      }else{
        selectClass = "alertBacNormal";
      }
      const alert = await this.alertController.create({
        cssClass: selectClass,
        mode: 'ios',
        message: this.messageAlert,
        buttons: [
          {
            text: this.yes,
            cssClass: 'alertButton',
            handler: () => {
              let sendValuesStatus = {"ticket_id":mapId,"status_id":evant,"lat":this.lat,"lng":this.lng};
              this.ticketsService.updateTicketStatus(sendValuesStatus,this.userId).then(async data=>{
                this.returnUpdateTicketStatusData = data;
                this.operationResult = this.returnUpdateTicketStatusData.status;
                if(this.operationResult){
                  this.message = this.updateTicketStatusMsgSuccess;
                  this.displayResult(this.message);
                  this.functionReturnData(this.userId)
                }else{
                  this.message = this.updateTicketStatusMsgErrorOne;
                  this.displayResult(this.message);
                }
              });
            }
          }, {
            text: this.no,
            cssClass: 'alertButton',
            handler: () => {
              this.message = this.updateTicketStatusMsgErrorOne;
              this.displayResult(this.message);
            }
          }
        ]
      });
      await alert.present();
    }
  }
  //this function to read and return lang of device or selected lang;
  async getDeviceLanguage() {
    await this.storage.get('checkLanguage').then(async checkLanguage=>{
      this.checkLanguage = checkLanguage
    });
    if(this.checkLanguage){
      this.translate.setDefaultLang(this.checkLanguage);
      this.language = this.checkLanguage;
      this.translate.use(this.language);
      this.initialiseTranslation();
    }else{
      if (window.Intl && typeof window.Intl === 'object') {
        let Val  = navigator.language.split("-");
        this.translate.setDefaultLang(Val[0]);
        if (Val[0] == "de" || Val[0] == "en")
          this.language = Val[0];
        else
          this.language = 'en';
        this.translate.use(this.language);
        this.initialiseTranslation();
      }
      else{
        this.globalization.getPreferredLanguage().then(res => {
          let Val  = res.value.split("-");
          this.translate.setDefaultLang(Val[0]);
          if (Val[0] == "de" || Val[0] == "en")
            this.language = Val[0];
          else
            this.language = 'en';
          this.translate.use(this.language);
          this.initialiseTranslation();
        }).catch(e => {console.log(e);});
      }
    }
  }
  //this function to check internet in device;
  async checkInternetData(){
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      this.message = "Please check internet connection";
      this.displayResult(this.message);
    })
  }
  //go to start tickets (begin)
  startTickets(mapId:any){
    let casheTime = new Date();
    this.navCtrl.navigateRoot(['/task', {mapId:mapId+'_'+casheTime.getTime()}])
  }
  stockTickets(stockMapId:any,stockName:any,stockAddress:any,stockPhone:any){
    this.navCtrl.navigateRoot(['/stock', {stockMapId:stockMapId,stockName:stockName,stockAddress:stockAddress,stockPhone:stockPhone}])
  }
  //this function to return result of operation;
  async displayResult(message){
    let darkStyle = await this.storage.get('darkMode');
    if(darkStyle == 1){
      this.toastStyle = "toastStyleDark";
    }else{
      this.toastStyle = "toastStyleNormal";
    }
    let toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'bottom',
      cssClass:this.toastStyle,
      color:""
    });
    await toast.present();
  }
  async functionOpenMenue(){
    let darkStyle = await this.storage.get('darkMode');
    if(darkStyle == 1){
      this.menu.enable(true, "inMenueDark");
      this.menu.open("inMenueDark");
      this.menu.enable(false, "inMenue");
      this.menu.close("inMenue");
    }else{
      this.menu.enable(false, "inMenueDark");
      this.menu.close("inMenueDark");
      this.menu.enable(true, "inMenue");
      this.menu.open("inMenue");
    }
  }
}

