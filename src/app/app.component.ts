import { Component } from '@angular/core';
import {NavController, Platform,AlertController} from "@ionic/angular";
import {Storage} from "@ionic/storage";
import {HttpClient} from "@angular/common/http";
import { Router } from '@angular/router';
import { Globalization } from '@ionic-native/globalization/ngx';
import { TranslateService } from '@ngx-translate/core';
import { Network } from '@ionic-native/network/ngx';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  //this variables for check login user
  public userId:any;
  public password:any;
  public userEmail:any;
  public userName:any;
  public menuLabelLogin:any;
  public menuLabelPolicy:any;
  public menuLabelConditions:any;
  public menuLabelProfils:any;
  public menuLabelSetting:any;
  public menuLabelTickets:any;
  public menuLabelLogout:any;
  public appWithoutLogInPage:any=[];
  public appWithLoginPage:any=[];
  public messageAlert:any;
  public yes:any;
  public no:any;
  //dark mode classs
  public darkMode:any;
  public darkNormalCalss:any="normal";
//-----------------------------------------------------------
  //this variables for system
  public checkLanguage: any=0;
  public language: string;
  public message:any;
  public toastStyle:any;
  public ticketsComplete:any;
  constructor(private globalization: Globalization,private alertController:AlertController,private translate: TranslateService,private http:HttpClient,private router:Router,private network:Network,private storage: Storage,private platform: Platform,private navCtrl: NavController) {
    this.platform.ready().then(() => {
    });
    this.checkLogin();
  }
  //this function for render variables in selected lang;
  initialiseTranslation(lang){
    if(lang == 'de'){
      this.menuLabelLogin = "Login";
      this.menuLabelPolicy = "Privacy Policy";
      this.menuLabelConditions = "Terms & Conditions";
      this.menuLabelProfils = "Profils";
      this.menuLabelSetting = "Setting";
      this.menuLabelTickets = "Tickets";
      this.menuLabelLogout = "Logout";
      this.messageAlert = "Are You Sure !";
      this.ticketsComplete = "Tickets Completed";
      this.yes = "Yes";
      this.no = "No";
    }else{
      this.menuLabelLogin = "Login";
      this.menuLabelPolicy = "Privacy Policy";
      this.menuLabelConditions = "Terms & Conditions";
      this.menuLabelProfils = "Profils";
      this.menuLabelSetting = "Setting";
      this.menuLabelTickets = "Tickets";
      this.menuLabelLogout = "Logout";
      this.messageAlert = "Are You Sure !";
      this.ticketsComplete = "Tickets Completed";
      this.yes = "Yes";
      this.no = "No";
    }
    //this array for when user not login
    this.appWithoutLogInPage = [
      { title:this.menuLabelLogin, url: '/login',icon:"log-in-outline"},
      { title:this.menuLabelPolicy, url: '/privacypolicy',icon:"pricetag-outline"},
      { title:this.menuLabelConditions, url: '/termsconditions',icon:"pricetags-outline"}
    ];
    //this array for when user login to account
    this.appWithLoginPage = [
      { title:this.menuLabelTickets, url: '/home',icon:"file-tray-full-outline"},
      { title:this.ticketsComplete, url: '/ticketscomplete',icon:"file-tray-full-outline"},
      { title:this.menuLabelProfils, url: '/profile',icon:"person-outline"},
      { title:this.menuLabelSetting, url: '/setting',icon:"settings-outline"},
      { title:this.menuLabelLogout, url: '/policy',icon:"log-out-outline"}
    ];

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
  //this function to check if login or not to go selected page;
  async checkLogin(){
    this.userId = await this.storage.get('userId');
    this.password = await this.storage.get('password');
    this.userEmail = await this.storage.get('userEmail');
    this.userName = await this.storage.get('userName');
    if(this.userId == null || this.password == null || this.userEmail == null || this.userName == null){
      this.navCtrl.navigateRoot('login');
    }else
      this.navCtrl.navigateRoot('home');
    await this.getDeviceLanguage();
    await this.functionDarkMode();
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
      await this.initialiseTranslation(this.checkLanguage);
    }else{
      if (window.Intl && typeof window.Intl === 'object') {
        let Val  = navigator.language.split("-");
        this.translate.setDefaultLang(Val[0]);
        if (Val[0] == "de" || Val[0] == "en")
          this.language = Val[0];
        else
          this.language = 'en';
        this.translate.use(this.language);
        await this.initialiseTranslation(this.language);
      }
      else{
        this.globalization.getPreferredLanguage().then(async res => {
          let Val  = res.value.split("-");
          this.translate.setDefaultLang(Val[0]);
          if (Val[0] == "de" || Val[0] == "en")
            this.language = Val[0];
          else
            this.language = 'en';
          this.translate.use(this.language);
          await this.initialiseTranslation(this.language);
        }).catch(e => {console.log(e);});
      }
    }
  }
  //function go to selected page
  functionGoPage(url:any){
    this.navCtrl.navigateRoot(url);
  }
  //this function for log out from account in app
  async signOut(){
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
        handler: async () => {
          await this.storage.remove('userId');
          await this.storage.remove('password');
          await this.storage.remove('userFirstName');
          await this.storage.remove('userlastName');
          await this.storage.remove('userGender');
          await this.storage.remove('userEmail');
          await this.storage.remove('userName');
          await this.storage.remove('userLanguage');
          await this.storage.remove('userNotification');
          await this.storage.remove('taskDuration');
          await this.storage.remove('stockName');
          await this.storage.remove('stockAddress');
          await this.storage.remove('stockPhone');
          await this.storage.remove('darkMode');
          this.navCtrl.navigateRoot('login');
        }
      }, {
          text: this.no,
          cssClass: 'alertButton',
          handler: () => {
          }
        }
      ]
    });
    await alert.present();
  }
}
