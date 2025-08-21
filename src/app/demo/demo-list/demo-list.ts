import { Component } from '@angular/core';
import { DemoModelService } from '../services/demo.model.service';
import { InformationService } from '../../shared/services/information-service';
import { DemoDataService } from '../services/demo.data.service';
import { TableModule } from 'primeng/table';
import { BooleanToYesNoPipe } from '../../shared/pipes/boolean-to-yes-no-pipe';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-demo-list',
  imports: [TableModule, BooleanToYesNoPipe,FormsModule,DatePipe],
  templateUrl: './demo-list.html',
  styleUrl: './demo-list.css'
})
export class DemoList {
  constructor(private dataSvc: DemoDataService,public modelSvc: DemoModelService,private msgSvc:InformationService,private router: Router,) {

  }

  ngOnInit(){
    this.getDemoList();
  }

  getDemoList(){
    try {
      this.dataSvc.getDemoList().subscribe({
        next:(res:any)=>{
          debugger
             this.modelSvc.prepareDemoList(res.data.list);
        },
        error:(error)=>{
          this.msgSvc.showErrorMsg(error);
        }
      });
    } catch (error) {
      this.msgSvc.showErrorMsg(error);
    }
  }

  routesToPage(id: number) {
    try {
      this.router.navigate(['/app/demo/demo-entry'], {
        queryParams: { id: id }
      });
    } catch (error) {
      this.msgSvc.showErrorMsg(error);
    }
  }
}
