import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
import {IonReorderGroup,LoadingController, MenuController, NavController, Platform,ModalController, ToastController,AlertController} from "@ionic/angular";
import {Storage} from "@ionic/storage";
import {HttpClient} from "@angular/common/http";
import {IonSlides } from '@ionic/angular';
import SignaturePad from 'signature_pad';
import { Globalization } from '@ionic-native/globalization/ngx';
import { IonModal } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Network } from '@ionic-native/network/ngx';
import {ActivatedRoute, Router} from '@angular/router';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
//service
import {TicketsService} from "../service/tickets.service";
@Component({
  selector: 'app-stock',
  templateUrl: './stock.page.html',
  styleUrls: ['./stock.page.scss'],
})
export class StockPage implements OnInit {
  @ViewChild('slides', { static: true }) slider: IonSlides;
  @ViewChild('canvasOne') canvasElOne: ElementRef;
  @ViewChild('canvasTow') canvasElTow: ElementRef;
  public segment = 0;
  public close:any;
  public confirm:any;
  public userId:any;
  public password:any;
  public userEmail:any;
  public userName:any;
  public stockName:any;
  public stockMapId:any;
  public stockAddress:any;
  public stockPhone:any;
  public stock:any;
  public callNumberMsgError:any;
  public newParts:any;
  public returnParts:any;
  public technicalParts:any;
  public signaturePadReturn: SignaturePad;
  public signaturePadTecnical: SignaturePad;
  public signatureImgReturn: string;
  public signatureImgTecnical: string;
  public clear: string;
  public save: string;
  public operationResult:any;
  public returnStockPartsData:any;
  public returnArraStockNewPartsFromServer:any;
  public returnArraStockPartsFromServer:any;
  public returnArraStockTechnicalPartsFromServer:any;
  public returnStockPartsArray:any = [];
  public returnStockPartsArraySelected:any = [];
  public returnStockNewPartsArray:any = [];
  public returnStockNewPartsArraySelected:any = [];
  public returnStockTechnicalPartsArray:any = [];
  public returnStockTechnicalPartsArraySelected:any = [];
  public countStockPartsArray:any=2;
  public countStockNewPartsArray:any=2;
  public countStockTechnicalPartsArray:any=2;
  public ticketActionEmpty:any;
  public stockPartsArraySelected:any = [];
  public fullDate:any;
  public returnUpdateNewStockData:any;
  public updateStockMsgSuccess:any;
  public updateStockMsgError:any;
  public stockPartsArraySelectedDelv:any = [];
  public technicalPartsArraySelectedDelv:any = [];
  public valuseStockNorA:any = 0;
  public valueStockPlos:any = 0;
  public valuseTechnicalNorA:any = 0;
  public valueTechnicalPlos:any = 0;
  public saveSignatureMsgAdd:any;
  public selectTechnical:any;
  public returnTechnicalNameData:any;
  public returnArraTechnicalNameFromServer:any;
  public returnTechnicalNameArray:any = [];
  public selectTechnicalNameForStock:any;
  public lat:any;
  public lng:any;
  //dark mode classs
  public darkMode:any;
  public darkNormalCalss:any="normal";
  public showCanvasOneSignature:boolean=false;
  public showCanvasTowSignature:boolean=false;
  public disableSignatureMsg:any;
  public enabileSignatureMsg:any;

  //----------------------------------------------------
  //this variables for system
  public checkLanguage: any=0;
  public language: string;
  public message:any;
  public toastStyle:any;
  constructor(private geolocation: Geolocation,private callNumber: CallNumber,private ticketsService: TicketsService,private activaterouter : ActivatedRoute,private globalization: Globalization,private modalController: ModalController, private translate: TranslateService,private http:HttpClient,private router : Router,private network:Network,private menu:MenuController,private storage: Storage,private platform: Platform,private navCtrl: NavController,private toastCtrl: ToastController,private loading: LoadingController) {
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
  //this function to go to select slide
  async segmentChanged(ev: any) {
    await this.slider.slideTo(this.segment);
  }
  //this function to go to select slide
  async slideChanged() {
    this.segment = await this.slider.getActiveIndex();
  }
  //start functions for Signature
  ngAfterViewInit() {
    this.signaturePadReturn = new SignaturePad(this.canvasElOne.nativeElement);
    this.signaturePadTecnical = new SignaturePad(this.canvasElTow.nativeElement);
  }
  startDrawing(event: Event) {
  }
  moved(event: Event) {
  }
  clearPad(type:any) {
    if(type == 1){
      this.signaturePadReturn.clear();
      this.signatureImgReturn="";
    }
    else{
      this.signaturePadTecnical.clear();
      this.signatureImgTecnical="";
    }
  }
  savePad(type:any) {
    if(type == 1){
      const base64DataReturn = this.signaturePadReturn.toDataURL();
      this.signatureImgReturn = base64DataReturn;
    }else{
      const base64DataTecnical = this.signaturePadTecnical.toDataURL();
      this.signatureImgTecnical = base64DataTecnical;
    }
    this.message = this.saveSignatureMsgAdd;
    this.displayResult(this.message);
  }
  initialiseTranslation(){
    this.translate.get('stock').subscribe((res: string) => {
      this.stock = res;
    });
    this.translate.get('clear').subscribe((res: string) => {
      this.clear = res;
    });
    this.translate.get('save').subscribe((res: string) => {
      this.save = res;
    });
    this.translate.get('new_parts').subscribe((res: string) => {
      this.newParts = res;
    });
    this.translate.get('return_parts').subscribe((res: string) => {
      this.returnParts = res;
    });
    this.translate.get('technical_parts').subscribe((res: string) => {
      this.technicalParts = res;
    });
    this.translate.get('call_number_msg_error').subscribe((res: string) => {
      this.callNumberMsgError = res;
    });
    this.translate.get('ticket_action_empty_title_larg').subscribe((res: string) => {
      this.ticketActionEmpty = res;
    });
    this.translate.get('update_stock_msg_success').subscribe((res: string) => {
      this.updateStockMsgSuccess = res;
    });
    this.translate.get('update_stock_msg_error').subscribe((res: string) => {
      this.updateStockMsgError = res;
    });
    this.translate.get('save_signature_msg_add').subscribe((res: string) => {
      this.saveSignatureMsgAdd = res;
    });
    this.translate.get('select_technical').subscribe((res: string) => {
      this.selectTechnical = res;
    });
    this.translate.get('close').subscribe((res: string) => {
      this.close = res;
    });
    this.translate.get('confirm').subscribe((res: string) => {
      this.confirm = res;
    });
    this.translate.get('disable_signature_msg').subscribe((res: string) => {
      this.disableSignatureMsg = res;
    });
    this.translate.get('enabile_signature_msg').subscribe((res: string) => {
      this.enabileSignatureMsg = res;
    });
  }
  //function To Get All Data
  async functionReturnData(date:any,mapId:any,userId:any){
    const loading = await this.loading.create({
      cssClass: 'my-custom-class',
      message: '',
      duration: 2000,
    });
    let sendValues = {"date":date,'stock_id':mapId};
    //return stock array
    this.ticketsService.stockParts(sendValues,userId).then(async data=>{
      this.returnStockPartsData = data;
      this.operationResult = this.returnStockPartsData.status;
      if(this.operationResult){
        this.returnStockPartsArray=[];
        this.returnStockNewPartsArray=[];
        this.returnStockTechnicalPartsArray=[];
        this.returnArraStockNewPartsFromServer = this.returnStockPartsData.new_parts;
        this.returnArraStockPartsFromServer = this.returnStockPartsData.stock_parts;
        this.returnArraStockTechnicalPartsFromServer = this.returnStockPartsData.technical_parts;
        //new
        for(let i = 0; i < this.returnArraStockNewPartsFromServer.length;i++) {
          this.returnStockNewPartsArray[i]=[];
          this.returnStockNewPartsArray[i]['id'] = this.returnArraStockNewPartsFromServer[i].id;
          this.returnStockNewPartsArray[i]['part_id'] = this.returnArraStockNewPartsFromServer[i].id;
          this.returnStockNewPartsArray[i]['name'] = this.returnArraStockNewPartsFromServer[i].name;
          this.returnStockNewPartsArray[i]['quantity'] = this.returnArraStockNewPartsFromServer[i].quantity;
          this.returnStockNewPartsArray[i]['delivered'] = 0;
        }
        ///stock
        for(let i = 0; i < this.returnArraStockPartsFromServer.length;i++) {
          this.returnStockPartsArray[i]=[];
          this.returnStockPartsArray[i]['part_id'] = this.returnArraStockPartsFromServer[i].id;
          this.returnStockPartsArray[i]['id'] = this.returnArraStockPartsFromServer[i].id;
          this.returnStockPartsArray[i]['name'] = this.returnArraStockPartsFromServer[i].name;
          this.returnStockPartsArray[i]['quantity'] = this.returnArraStockPartsFromServer[i].quantity;
          this.returnStockPartsArray[i]['returned'] = 0;
        }
        ///Technical
        for(let i = 0; i < this.returnArraStockTechnicalPartsFromServer.length;i++) {
          this.returnStockTechnicalPartsArray[i]=[];
          this.returnStockTechnicalPartsArray[i]['part_id'] = this.returnArraStockTechnicalPartsFromServer[i].id;
          this.returnStockTechnicalPartsArray[i]['id'] = this.returnArraStockTechnicalPartsFromServer[i].id;
          this.returnStockTechnicalPartsArray[i]['name'] = this.returnArraStockTechnicalPartsFromServer[i].name;
          this.returnStockTechnicalPartsArray[i]['quantity'] = this.returnArraStockTechnicalPartsFromServer[i].quantity;
          this.returnStockTechnicalPartsArray[i]['disabled'] = 'false';
          this.returnStockTechnicalPartsArray[i]['delivered'] = 0;
        }
        if(this.returnStockNewPartsArray.length != 0)
          this.countStockNewPartsArray = 1;
        else
          this.countStockNewPartsArray = 0;
        if(this.returnStockPartsArray.length != 0)
          this.countStockPartsArray = 1;
        else
          this.countStockPartsArray = 0;
        if(this.returnStockTechnicalPartsArray.length != 0)
          this.countStockTechnicalPartsArray = 1;
        else
          this.countStockTechnicalPartsArray = 0;
      }
    });
    await loading.present();
  }
  //function to select New part
  functionStockNewPartsArray(event:any,itemId:any,index:any){
    if(event.detail.checked == true){
      this.returnStockNewPartsArray[index]['delivered'] = 1;
    }else{
      this.returnStockNewPartsArray[index]['delivered'] = 0;
    }
    let selectedValNew = {'part_id':this.returnStockNewPartsArray[index]['part_id'],'delivered':this.returnStockNewPartsArray[index]['delivered']}
    this.returnStockNewPartsArraySelected.push(selectedValNew);
  }
  //function Technical Name
  selectTechnicalName(evant:any){
    this.selectTechnicalNameForStock = evant;
  }
  //function to select stock part
  functionStockPartsArray(event:any,itemId:any,index:any){
    if(event.detail.checked){
      this.returnStockPartsArray[index]['returned'] = 1;
    }else{
      this.returnStockPartsArray[index]['returned'] = 0;
    }
    let selectedValnStock = {'part_id':this.returnStockPartsArray[index]['part_id'],'returned':this.returnStockPartsArray[index]['returned']}
    this.returnStockPartsArraySelected.push(selectedValnStock);
  }
  //function to select Technical part
  functionStockTechnicalPartsArray(event:any,itemId:any,index:any){
    if(event.detail.checked){
      for(let i = 0; i < this.returnStockTechnicalPartsArray.length;i++) {
        this.returnStockTechnicalPartsArray[i]['disabled'] = 'true';
      }
      this.returnStockTechnicalPartsArray[index]['disabled'] = 'false';
      this.returnStockTechnicalPartsArray[index]['delivered'] = 1;
    }else{
      for(let i = 0; i < this.returnStockTechnicalPartsArray.length;i++) {
        this.returnStockTechnicalPartsArray[i]['disabled'] = 'false';
      }
      this.returnStockTechnicalPartsArray[index]['delivered'] = 0;
    }
    let selectedValTechnica = {'part_id':this.returnStockTechnicalPartsArray[index]['part_id'],'delivered':this.returnStockTechnicalPartsArray[index]['delivered']}
    this.returnStockTechnicalPartsArraySelected.push(selectedValTechnica);
  }
  //end functions for Signature
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
    }else{
      this.activaterouter.params.subscribe(params => {
        if(params['stockMapId']!="" && params['stockMapId']!=null && params['stockMapId']!=undefined && params['stockMapId']!=0)
          this.stockMapId = params['stockMapId'];
        else
          this.navCtrl.navigateRoot('home');
      });
      this.activaterouter.params.subscribe(params => {
        if(params['stockName']!="" && params['stockName']!=null && params['stockName']!=undefined && params['stockName']!=0)
          this.stockName = params['stockName'];
        else
          this.navCtrl.navigateRoot('home');
      });
      this.activaterouter.params.subscribe(params => {
        if(params['stockAddress']!="" && params['stockAddress']!=null && params['stockAddress']!=undefined && params['stockAddress']!=0)
          this.stockAddress = params['stockAddress'];
        else
          this.navCtrl.navigateRoot('home');
      });
      this.activaterouter.params.subscribe(params => {
        if(params['stockPhone']!="" && params['stockPhone']!=null && params['stockPhone']!=undefined && params['stockPhone']!=0)
          this.stockPhone = params['stockPhone'];
        else
          this.navCtrl.navigateRoot('home');
      });
      let selectData = new Date();
      this.fullDate = selectData.getFullYear() + "-" + (selectData.getMonth() + 1) + "-" + selectData.getDate();
      this.ticketsService.technicals(this.userId).then(async data=>{
        this.returnTechnicalNameData = data;
        this.operationResult = this.returnTechnicalNameData.status;
        if(this.operationResult){
          this.returnTechnicalNameArray=[];
          this.returnArraTechnicalNameFromServer = this.returnTechnicalNameData.result;
          for(let i = 0; i < this.returnArraTechnicalNameFromServer.length;i++) {
            this.returnTechnicalNameArray[i]=[];
            this.returnTechnicalNameArray[i]['id'] = this.returnArraTechnicalNameFromServer[i].id;
            this.returnTechnicalNameArray[i]['name'] = this.returnArraTechnicalNameFromServer[i].name;
          }
        }
      });
      this.functionReturnData(this.fullDate,this.stockMapId,this.userId);
      await this.functionDarkMode();
    }
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
  //add all stock opetion function
  functionStockNorATicket(event:any){
    if(event.detail.checked == true){
      this.valuseStockNorA= 1;
      this.signaturePadReturn.clear();
      this.signatureImgReturn="";
      this.showCanvasOneSignature = true;
      this.signaturePadReturn.off();
      this.message = this.disableSignatureMsg;
      this.displayResult(this.message);
    }else{
      this.valuseStockNorA= 1;
      this.signaturePadReturn.clear();
      this.signatureImgReturn="";
      this.showCanvasOneSignature = false;
      this.signaturePadReturn.on();
      this.message = this.enabileSignatureMsg;
      this.displayResult(this.message);
    }
  }
  //add all stock opetion function
  functionStockPlosTicket(event:any){
    if(event.detail.checked == true){
      this.valueStockPlos= 1;
    }else{
      this.valueStockPlos= 0;
    }
  }
  //add all Technical opetion function
  functionTechnicalNorATicket(event:any){
    if(event.detail.checked == true){
      this.valuseTechnicalNorA= 1;
      this.signaturePadTecnical.clear();
      this.signatureImgTecnical="";
      this.showCanvasTowSignature = true;
      this.signaturePadTecnical.off();
      this.message = this.disableSignatureMsg;
      this.displayResult(this.message);
    }else{
      this.valuseTechnicalNorA= 1;
      this.signaturePadTecnical.clear();
      this.signatureImgTecnical="";
      this.showCanvasTowSignature = false;
      this.signaturePadTecnical.on();
      this.message = this.disableSignatureMsg;
      this.displayResult(this.message);
    }
  }
  //add all Technical opetion function
  functionTechnicalPlosTicket(event:any){
    if(event.detail.checked == true){
      this.valueTechnicalPlos= 1;
    }else{
      this.valueTechnicalPlos= 0;
    }
  }
  //save new part function
  async saveNewParts(){
    this.checkInternetData();
    const loading = await this.loading.create({
      cssClass: 'my-custom-class',
      message: '',
      duration: 2000,
    });
    let sendValues = {"stock_id":this.stockMapId,'date':this.fullDate,'ticket_id':'10','action_type':'1','parts':this.returnStockNewPartsArraySelected,"lat":this.lat,"lng":this.lng};
    this.ticketsService.updateStockPart(sendValues,this.userId).then(async data=>{
      this.returnUpdateNewStockData = data;
      this.operationResult = this.returnUpdateNewStockData.status;
      if(this.operationResult){
        this.message = this.updateStockMsgSuccess;
        this.displayResult(this.message);
        this.functionReturnData(this.fullDate,this.stockMapId,this.userId)
      }else{
        this.message = this.updateStockMsgError;
        this.displayResult(this.message);
      }
      await loading.present();
    });
  }
  //save Stock part function
  async saveStockParts(){
    this.checkInternetData();
    const loading = await this.loading.create({
      cssClass: 'my-custom-class',
      message: '',
      duration: 2000,
    });
    //this.stockMapId is a stock_id
    if(this.signatureImgReturn == undefined || this.signatureImgReturn==null || this.signatureImgReturn=="")
      this.signatureImgReturn = "0";
    this.stockPartsArraySelectedDelv = [];
    for(let i = 0; i < this.returnStockPartsArraySelected.length;i++) {
      let arraySelected = {};
      if(this.returnStockPartsArraySelected[i]['returned'] == 1)
        arraySelected = {'part_id':this.returnStockPartsArraySelected[i]['part_id'],'returned':this.returnStockPartsArraySelected[i]['returned'],'image':this.signatureImgReturn,'na':this.valuseStockNorA,'plos':this.valueStockPlos}
      else
        arraySelected = {'part_id':this.returnStockPartsArraySelected[i]['part_id'],'returned':this.returnStockPartsArraySelected[i]['returned'],'image':'0','na':'0','plos':'0'}
      this.stockPartsArraySelectedDelv.push(arraySelected);
    }
    let sendValues = {"stock_id":this.stockMapId,'date':this.fullDate,'ticket_id':'10','action_type':'2','parts':this.stockPartsArraySelectedDelv,"lat":this.lat,"lng":this.lng};
    this.ticketsService.updateStockPart(sendValues,this.userId).then(async data=>{
      this.returnUpdateNewStockData = data;
      this.operationResult = this.returnUpdateNewStockData.status;
      if(this.operationResult){
        this.message = this.updateStockMsgSuccess;
        this.displayResult(this.message);
        this.functionReturnData(this.fullDate,this.stockMapId,this.userId)
      }else{
        this.message = this.updateStockMsgError;
        this.displayResult(this.message);
      }
      await loading.present();
    });
  }
  //save Technical part function
  async saveTechnicalParts(){
    this.checkInternetData();
    const loading = await this.loading.create({
      cssClass: 'my-custom-class',
      message: '',
      duration: 2000,
    });
    //this.stockMapId is a stock_id
    this.technicalPartsArraySelectedDelv = [];
    if(this.signatureImgTecnical == undefined || this.signatureImgTecnical==null || this.signatureImgTecnical=="")
      this.signatureImgTecnical = "0";
    for(let i = 0; i < this.returnStockTechnicalPartsArraySelected.length;i++) {
      let arraySelected = {};
      if(this.returnStockTechnicalPartsArraySelected[i]['delivered'] == 1)
        arraySelected = {'part_id':this.returnStockTechnicalPartsArraySelected[i]['part_id'],'delivered':this.returnStockTechnicalPartsArraySelected[i]['delivered'],'image':this.signatureImgTecnical,'na':this.valuseTechnicalNorA,'plos':this.valueTechnicalPlos,'engineer_id':this.selectTechnicalNameForStock}
      else
        arraySelected = {'part_id':this.returnStockTechnicalPartsArraySelected[i]['part_id'],'delivered':this.returnStockTechnicalPartsArraySelected[i]['delivered'],'image':'0','na':'0','plos':'0','engineer_id':'0'}
      this.technicalPartsArraySelectedDelv.push(arraySelected);
    }
    let sendValues = {"stock_id":this.stockMapId,'date':this.fullDate,'ticket_id':'10','action_type':'3','parts':this.technicalPartsArraySelectedDelv,"lat":this.lat,"lng":this.lng};
    this.ticketsService.updateStockPart(sendValues,this.userId).then(async data=>{
      this.returnUpdateNewStockData = data;
      this.operationResult = this.returnUpdateNewStockData.status;
      if(this.operationResult){
        this.message = this.updateStockMsgSuccess;
        this.displayResult(this.message);
        this.functionReturnData(this.fullDate,this.stockMapId,this.userId)
      }else{
        this.message = this.updateStockMsgError;
        this.displayResult(this.message);
      }
      await loading.present();
    });
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
