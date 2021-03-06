import { Component, OnInit } from '@angular/core';
import { Agendamento } from '../entities/agendamento';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { BarbeariaService } from '../services/barbearia.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Servico } from '../entities/servico';

@Component({
  selector: 'app-agendamento',
  templateUrl: './agendamento.page.html',
  styleUrls: ['./agendamento.page.scss'],
})
export class AgendamentoPage implements OnInit {
  public barbearia$:any;
  horaA:string = "";
  horaB:string = "";
  public agendamento = new Agendamento();
  private d1;
  private d2;
  public cor:string = "";
  public hours:any = [];
  private s:Servico = new Servico();

  constructor(private router:Router,
    private route: ActivatedRoute,
    private barberiaService:BarbeariaService,
    public AuthService: AngularFireAuth
    ) {
      
      this.route.queryParams.subscribe(params => {
        let getNav = this.router.getCurrentNavigation();
        if (getNav.extras.state) {
          this.agendamento.idBarbearia = getNav.extras.state.obj;
          this.barbearia$ = this.barberiaService.get(this.agendamento.idBarbearia);
          this.barbearia$.subscribe(
            data => {

              this.horaA = data['horarioAbert'];
              this.horaB = data['horarioFecha'];
              this.d1 = new Date('2017-01-19 '+this.horaA+':00');
              this.d2 = new Date('2017-01-19 '+this.horaB+':00').getHours()
              while(this.d1.getHours() < this.d2){
                this.hours.push(this.d1.getTime());
                this.d1.setMinutes( this.d1.getMinutes() + 30);
              }
            }
            )
          }
          
        });
    }
    
    ngOnInit() {
  
  }

  getDate(e){
    this.agendamento.dataDoAgendamento =  e.detail.value;
  }
  getService(e){
    
    let txt = e.detail.value;
    let txt1 = txt.split("         ")
    console.log(txt1)
    this.s.key = null;
    this.s.nome = txt1[0];
    this.s.preco = parseFloat(txt1[1].replace("R$", ""));
   this.agendamento['servico'].push(this.s);

  console.log(this.s);
  }

  getHora(e){
    this.agendamento.horaDoAgendamento = e;
  //  console.log(e)
  }

 getCorHour(){
   this.cor = ".fundo1";
 }

 goConfirmar(){
   this.AuthService.user.subscribe( res => this.agendamento.idCliente = res.uid)
   this.agendamento.momento = new Date().getMilliseconds();
  // console.log(this.agendamento)
  let navigationExtras: NavigationExtras = {
    state: {
    obj : this.agendamento
    }
  }
  this.router.navigateByUrl('/confirma-agendamento', navigationExtras);
 }
}
