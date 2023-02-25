import { Component, OnInit } from '@angular/core';
import {LoadingController, MenuController, NavController, Platform,ModalController, ToastController,AlertController} from "@ionic/angular";
import {Storage} from "@ionic/storage";
import {HttpClient} from "@angular/common/http";
import { Router } from '@angular/router';
import { Globalization } from '@ionic-native/globalization/ngx';
import { TranslateService } from '@ngx-translate/core';
import { Network } from '@ionic-native/network/ngx';
//service
import {UserService} from "../service/user.service";
@Component({
  selector: 'app-setting',
  templateUrl: './setting.page.html',
  styleUrls: ['./setting.page.scss'],
})
export class SettingPage implements OnInit {
//this variables for page
  public settingTitle: any;
  public userId: any;
  public password: any;
  public userEmail: any;
  public userName: any;
  public settingChangeLang: any;
  public settingPushNotifications: any;
  public settingDarkMode: any;
  public menuLabelPolicy: any;
  public menuLabelConditions: any;
  public isAllowPushNotifications: any;
  public isAllowPushNotificationsToF: boolean;
  public selectedLang: any;
  public selectedDarkMode: any;
  public selectedDarkModeToF: boolean;
  public operationResult:any;
  public returnArrayUserSettingFromServer:any;
  public returnUserSettingData:any;
  public returnUpdateSettingData:any;
  public updateSettingMsgSuccess:any;
  public updateSettingMsgError:any;
  //dark mode classs
  public darkMode:any;
  public darkNormalCalss:any="normal";
  //----------------------------------------------------
  //this variables for system
  public checkLanguage: any = 0;
  public language: string;
  public message: any;
  public toastStyle: any;

  constructor(private userService:UserService,private globalization: Globalization, private modalController: ModalController, private translate: TranslateService, private http: HttpClient, private router: Router, private network: Network, private menu: MenuController, private storage: Storage, private platform: Platform, private navCtrl: NavController, private toastCtrl: ToastController, private loading: LoadingController) {
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
  initialiseTranslation() {
    this.translate.get('setting_title').subscribe((res: string) => {
      this.settingTitle = res;
    });
    this.translate.get('setting_change_lang').subscribe((res: string) => {
      this.settingChangeLang = res;
    });
    this.translate.get('setting_push_notifications').subscribe((res: string) => {
      this.settingPushNotifications = res;
    });
    this.translate.get('setting_dark_mode').subscribe((res: string) => {
      this.settingDarkMode = res;
    });
    this.translate.get('menu_label_policy').subscribe((res: string) => {
      this.menuLabelPolicy = res;
    });
    this.translate.get('menu_label_conditions').subscribe((res: string) => {
      this.menuLabelConditions = res;
    });
    this.translate.get('update_setting_msg_success').subscribe((res: string) => {
      this.updateSettingMsgSuccess = res;
    });
    this.translate.get('update_setting_msg_error').subscribe((res: string) => {
      this.updateSettingMsgError = res;
    });
  }
  async functionReturnData(userId:any){
    this.userService.userSetting(userId).then(async data=>{
      this.returnUserSettingData = data;
      this.operationResult = this.returnUserSettingData.status;
      if(this.operationResult){
        this.returnArrayUserSettingFromServer = this.returnUserSettingData.result;
        if(this.returnArrayUserSettingFromServer.notification == 1){
          this.isAllowPushNotificationsToF = true;
          this.isAllowPushNotifications= 1;
        }
        else{
          this.isAllowPushNotificationsToF = false;
          this.isAllowPushNotifications= 0;
        }
        this.selectedLang = this.returnArrayUserSettingFromServer.language
      }
    });
  }
  async ngOnInit() {
    await this.getDeviceLanguage();
    this.checkInternetData();
    this.userId = await this.storage.get('userId');
    this.password = await this.storage.get('password');
    this.userEmail = await this.storage.get('userEmail');
    this.userName = await this.storage.get('userName');
    if (this.userId == null || this.password == null || this.userEmail == null || this.userName == null) {
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
    }else{
      this.darkMode = await this.storage.get('darkMode');
      if(this.darkMode == 1)
        this.selectedDarkModeToF = true;
      else
        this.selectedDarkModeToF = false;
      await this.functionDarkMode();
      await this.functionReturnData(this.userId);
    }
  }
  //this function to read and return lang of device or selected lang;
  async getDeviceLanguage() {
    await this.storage.get('checkLanguage').then(async checkLanguage => {
      this.checkLanguage = checkLanguage
    });
    if (this.checkLanguage) {
      this.translate.setDefaultLang(this.checkLanguage);
      this.language = this.checkLanguage;
      this.translate.use(this.language);
      this.initialiseTranslation();
    } else {
      if (window.Intl && typeof window.Intl === 'object') {
        let Val = navigator.language.split("-");
        this.translate.setDefaultLang(Val[0]);
        if (Val[0] == "de" || Val[0] == "en")
          this.language = Val[0];
        else
          this.language = 'en';
        this.translate.use(this.language);
        this.initialiseTranslation();
      } else {
        this.globalization.getPreferredLanguage().then(res => {
          let Val = res.value.split("-");
          this.translate.setDefaultLang(Val[0]);
          if (Val[0] == "de" || Val[0] == "en")
            this.language = Val[0];
          else
            this.language = 'en';
          this.translate.use(this.language);
          this.initialiseTranslation();
        }).catch(e => {
          console.log(e);
        });
      }
    }
  }
  async selectSendOrNotPush(event){
    if(event.detail.checked == true){
      this.isAllowPushNotifications= 1;
    }else{
      this.isAllowPushNotifications= 0;
    }
    const loading = await this.loading.create({
      cssClass: 'my-custom-class',
      message: '',
      duration: 2000,
    });
    let sendValues = {"language":this.selectedLang, "notification":this.isAllowPushNotifications}
    this.userService.updateSetting(sendValues,this.userId).then(async data=>{
      this.returnUpdateSettingData = data;
      this.operationResult = this.returnUpdateSettingData.status;
      if(this.operationResult){
        this.message = this.updateSettingMsgSuccess;
        this.displayResult(this.message);
        this.functionReturnData(this.userId);
      }else{
        this.message = this.updateSettingMsgError;
        this.displayResult(this.message);
        this.functionReturnData(this.userId);
      }
      await loading.present();
    });
  }
  async selectDarkMode(event){
    if(event.detail.checked == true){
      this.selectedDarkMode= 1;
      this.selectedDarkModeToF = true;
    }else{
      this.selectedDarkMode= 0;
      this.selectedDarkModeToF = false;
    }
    await this.storage.set('darkMode',this.selectedDarkMode);
    await this.functionDarkMode();
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
  //this function to check internet in device;
  async checkInternetData() {
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
  //this function to change lang of app
  async changeLange(event){
    if(event == 1)
      await this.storage.set('checkLanguage','de');
    else
      await this.storage.set('checkLanguage','en');
    const loading = await this.loading.create({
      cssClass: 'my-custom-class',
      message: '',
      duration: 2000,
    });
    let sendValues = {"language":event, "notification":this.isAllowPushNotifications}
    this.userService.updateSetting(sendValues,this.userId).then(async data=>{
      this.returnUpdateSettingData = data;
      this.operationResult = this.returnUpdateSettingData.status;
      if(this.operationResult){
        this.message = this.updateSettingMsgSuccess;
        this.displayResult(this.message);
        this.functionReturnData(this.userId);
      }else{
        this.message = this.updateSettingMsgError;
        this.displayResult(this.message);
        this.functionReturnData(this.userId);
      }
      await loading.present();
    });
    await this.getDeviceLanguage()
  }
  //this function to open policy page
  functionOpenPolicy(){
    this.navCtrl.navigateRoot('privacypolicy');
  }
  //this function to open conditions page;
  functionOpenConditions(){
    this.navCtrl.navigateRoot('termsconditions');
  }
  //OPEN MENUE
  async functionOpenMenue() {
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
