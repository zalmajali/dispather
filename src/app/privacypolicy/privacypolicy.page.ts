import { Component, OnInit } from '@angular/core';
import {MenuController, Platform, ToastController} from "@ionic/angular";
import {Storage} from "@ionic/storage";
import {HttpClient} from "@angular/common/http";
import { Router } from '@angular/router';
import { Globalization } from '@ionic-native/globalization/ngx';
import { TranslateService } from '@ngx-translate/core';
import { Network } from '@ionic-native/network/ngx';
@Component({
  selector: 'app-privacypolicy',
  templateUrl: './privacypolicy.page.html',
  styleUrls: ['./privacypolicy.page.scss'],
})
export class PrivacypolicyPage implements OnInit {
  //this variables for page
  public pageTitle:any;
  public userId:any;
  public password:any;
  public userEmail:any;
  public userName:any;
  //dark mode classs
  public darkMode:any;
  public darkNormalCalss:any="normal";
  //----------------------------------------------------
  //this variables for system
  public checkLanguage: any=0;
  public language: string;
  public message:any;
  public toastStyle:any;
  constructor(private globalization: Globalization,private translate: TranslateService,private http:HttpClient,private router : Router,private network:Network,private menu:MenuController,private storage: Storage,private platform: Platform,private toastCtrl: ToastController) {
    this.returnSelectedMenue();
    this.menu.enable(true,"outMenue");
    this.checkInternetData();
  }
  //this function for render variables in selected lang;
  initialiseTranslation(){
    this.translate.get('menu_label_policy').subscribe((res: string) => {
      this.pageTitle = res;
    });
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
  async ngOnInit() {
    await this.getDeviceLanguage();
    this.checkInternetData();
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
  async returnSelectedMenue(){
    this.userId = await this.storage.get('userId');
    this.password = await this.storage.get('password');
    this.userEmail = await this.storage.get('userEmail');
    this.userName = await this.storage.get('userName');
    if(this.userId == null || this.password == null || this.userEmail == null || this.userName == null){
      this.menu.enable(true,"outMenue");
    }else{
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
  async functionOpenMenue(){
    this.userId = await this.storage.get('userId');
    this.password = await this.storage.get('password');
    this.userEmail = await this.storage.get('userEmail');
    this.userName = await this.storage.get('userName');
    if(this.userId == null || this.password == null || this.userEmail == null || this.userName == null){
      this.menu.enable(true,"outMenue");
      this.menu.open("outMenue");
    }else{
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
}
