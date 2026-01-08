import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Authsvc } from '../shared/services/authsvc';
import { LoginDataService } from '../shared/services/login.data.service';
import { CommonModule } from '@angular/common';
import { SidebartoggleDataService } from '../shared/services/sidebartoggle.data.service';
import { InformationService } from '../shared/services/information-service';
import { LoadingService } from '../shared/services/loading-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    DividerModule,
    InputTextModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {
  loginForm!: FormGroup;
  status:string='';
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: Authsvc,
    private dataSvc: LoginDataService,
    private sidebar: SidebartoggleDataService,
    private msgSvc: InformationService,
    private loadingService: LoadingService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.route.queryParams.subscribe(params => {
    const userName = params['userName'];
    const password = params['password'];
    const status = params['status'];

    if (userName) {
      this.loginForm.patchValue({ userName });
    }
    if (password) {
      this.loginForm.patchValue({ password });
    }

    this.status=status;
    if(userName && password)
       this.login();
  });
  }

  login(): void {
    if (this.loginForm.invalid) return;
    this.loadingService.show();
    setTimeout(() => {
      const { userName, password } = this.loginForm.value;

      this.dataSvc.login(userName, password).subscribe({
        next: (response: any) => {
          const res=response.data;
          if (res) {            
            this.authService.login(res.userInfo, res.token);
            localStorage.setItem('userInfo', JSON.stringify(res.userInfo));
            localStorage.setItem('isCollapsed', 'true');
            localStorage.setItem('access_token', res.token);
            this.sidebar.toggleCollapsed();            
            //this.sidebar.updateMenuItems(res.userInfo);
            this.authService.startAutoLogoutWatcher();
            this.loadingService.hide();
       
              switch(this.status){
                case 'CheckPending':
                  this.router.navigate(['/accounting/voucher-approval'], { queryParams: { status: 'CheckPending' } });
                  break;
                case 'ReferralPending':
                  this.router.navigate(['/accounting/voucher-approval'], { queryParams: { status: 'ReferralPending' } });
                  break;
                case 'ApprovalPending':
                  this.router.navigate(['/accounting/voucher-approval'], { queryParams: { status: 'ApprovalPending' } });
                  break; 
                default:
                  this.router.navigate(['/dashboard']);
                  break; 
              }
              
            this.msgSvc.showSuccessMsg('Loggedin Successfully.');
          }
        },
        error: (err) => {
          this.loadingService.hide();
          this.msgSvc.showWarningMsg('Loggedin failed.Please provide vaild username and password.');
          console.error('Login failed', err);
        }
      });
    }, 0);
  }
}
