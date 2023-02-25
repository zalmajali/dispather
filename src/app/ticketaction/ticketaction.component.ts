import { Component, OnInit,Input } from '@angular/core';
import {IonReorderGroup,LoadingController, MenuController, NavController, Platform,ModalController, ToastController,AlertController} from "@ionic/angular";
import {Storage} from "@ionic/storage";
import {HttpClient} from "@angular/common/http";
import { Globalization } from '@ionic-native/globalization/ngx';
import { TranslateService } from '@ngx-translate/core';
import { Network } from '@ionic-native/network/ngx';
import {ActivatedRoute, Router} from '@angular/router';
//service
import {TicketsService} from "../service/tickets.service";
@Component({
  selector: 'app-ticketaction',
  templateUrl: './ticketaction.component.html',
  styleUrls: ['./ticketaction.component.scss'],
})
export class TicketactionComponent implements OnInit {
  @Input() mapId: string;
  public userId:any;
  public password:any;
  public userEmail:any;
  public userName:any;
  public ticketAction:any;
  public ticketActionEmpty:any;
  public operationResult:any;
  public returnTicketsData:any;
  public returnArrayTicketsFromServer:any;
  public returnTicketsArray:any = [];
  public allTicketNote:any=2;
  //dark mode classs
  public darkMode:any;
  public darkNormalCalss:any="normal";
  //----------------------------------------------------
  //this variables for system
  public checkLanguage: any=0;
  public language: string;
  public message:any;
  public toastStyle:any;
  constructor(private ticketsService: TicketsService,private activaterouter : ActivatedRoute,private globalization: Globalization,private modalController: ModalController, private translate: TranslateService,private http:HttpClient,private router : Router,private network:Network,private menu:MenuController,private storage: Storage,private platform: Platform,private navCtrl: NavController,private toastCtrl: ToastController,private loading: LoadingController) {
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
  //function close model
  closeModel(){
    this.modalController.dismiss({
    });
  }
  initialiseTranslation(){
    this.translate.get('ticket_action').subscribe((res: string) => {
      this.ticketAction = res;
    });
    this.translate.get('ticket_action_empty_title_larg').subscribe((res: string) => {
      this.ticketActionEmpty = res;
    });
  }
  //function To Get All Data
  async functionReturnData(mapId:any,userId:any){
    const loading = await this.loading.create({
      cssClass: 'my-custom-class',
      message: '',
      duration: 2000,
    });
    let sendValues = {"ticket_id":mapId};
    this.ticketsService.ticketAction(sendValues,userId).then(async data=>{
      this.returnTicketsData = data;
      this.operationResult = this.returnTicketsData.status;
      if(this.operationResult){
        this.returnTicketsArray=[];
        this.returnArrayTicketsFromServer = this.returnTicketsData.result;
        for(let i = 0; i < this.returnArrayTicketsFromServer.length;i++) {
          this.returnTicketsArray[i] = [];
          this.returnTicketsArray[i]['actionName'] = this.returnArrayTicketsFromServer[i].action_name;
          this.returnTicketsArray[i]['createdAt'] = "";
          if(this.returnArrayTicketsFromServer[i].created_at!=null && this.returnArrayTicketsFromServer[i].created_at!=undefined && this.returnArrayTicketsFromServer[i].created_at!=0 && this.returnArrayTicketsFromServer[i].created_at!=""){
            let createdAt = this.returnArrayTicketsFromServer[i].created_at.split("T");
            let createdAtTime = createdAt[1].split(".");
            let createdAtTimeHm = createdAtTime[0].split(":");
            this.returnTicketsArray[i]['createdAt'] = createdAt[0]+" "+createdAtTimeHm[0]+":"+createdAtTimeHm[1];
          }
          this.returnTicketsArray[i]['note'] = this.returnArrayTicketsFromServer[i].note;
        }
      }
      if(this.returnTicketsArray.length!=0)
        this.allTicketNote = 1;
      else
        this.allTicketNote = 0;
    });
    await loading.present();
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
      this.modalController.dismiss({
      });
      this.navCtrl.navigateRoot('login');
    }else{
      await this.functionReturnData(this.mapId,this.userId);
      await this.functionDarkMode();
    }
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
}
