import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-home',
  imports: [SelectModule,FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
   selectedYear:any;
   years: any[] = [];
   
   constructor(private router:Router){
    
   }

   ngOnInit() {
   
       this.prepareYears();
    }
  prepareYears() {
    const currentYear = new Date().getFullYear(); 

    this.selectedYear={ year:currentYear };

    for (let i = 0; i <= 5; i++) {
      this.years.push({year:currentYear - i});
    }
  }
  routesToPage(status:string){
  this.router.navigate(['/app/accounting/voucher-approval'], {
  queryParams: { status:status }
});
}
}
