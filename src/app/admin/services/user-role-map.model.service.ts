import { Injectable } from '@angular/core';
import { UserRoleMap } from '../models/UserRoleMap.model';
import { GlobalMethods } from '../../shared/models/javascriptMethods';

@Injectable({
  providedIn: 'root'
})
export class UserRoleMapModelService {
  userRoleMapModelList:UserRoleMap[]=[];
  selectedUserNames:any[]=[];
  ddlUserNames:any[]=[];
  selectedEmpNames:any[]=[];
  ddlEmpNames:any[]=[];
  selectedRoleNames:any[]=[];
  ddlRoleNames:any[]=[];

  //Filter
  filterUserNames: string[] = [];
  filterEmpNames: string[] = [];
  filterRoleNames: string[] = [];
  prepareUserMapList(data){
    try {
      this.userRoleMapModelList=data;
      this.ddlEmpNames=GlobalMethods.getDistinctBy(this.userRoleMapModelList,'empName');
      this.ddlRoleNames=GlobalMethods.getDistinctBy(this.userRoleMapModelList,'roleName');
      this.ddlUserNames=GlobalMethods.getDistinctBy(this.userRoleMapModelList,'userName');
    } catch (error) {
      throw error;
    }
  }
}
