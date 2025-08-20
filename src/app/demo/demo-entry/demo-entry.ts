import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

// PrimeNG modules
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { DatePickerModule } from 'primeng/datepicker';
import { FileUploadModule, UploadEvent } from 'primeng/fileupload';
@Component({
  selector: 'app-demo-entry',
  standalone: true,
  templateUrl: './demo-entry.html',
  styleUrls: ['./demo-entry.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    TextareaModule,
    DatePickerModule,
    CheckboxModule,
    ButtonModule,
    DividerModule,
    CardModule,
    TableModule,
    FileUploadModule
  ],
})
export class DemoEntry {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      id: 0,
      name: [null, Validators.required],
      createDate: null,
      isActive: false,
      demoItems: this.fb.array([]),
    });

    // Add one default item
    this.addItem();
  }

  get demoItems(): FormArray {
    return this.form.get('demoItems') as FormArray;
  }

  attachmentsAt(i: number): FormArray {
    return this.demoItems.at(i).get('demoItemFileAttachments') as FormArray;
  }

  private buildItem(): FormGroup {
    return this.fb.group({
      id: 0,
      name: [null, Validators.required],
      title: null,
      description: null,
      isActive: false,
      demoItemFileAttachments: this.fb.array([]),
    });
  }

  private buildAttachment(): FormGroup {
    return this.fb.group({
      id: 0,
      fileName: [null, Validators.required],
      folderNAme: null,
      isActive: false,
    });
  }

  addItem() {
    this.demoItems.push(this.buildItem());
  }

  removeItem(i: number) {
    this.demoItems.removeAt(i);
  }

  addAttachment(i: number) {
    this.attachmentsAt(i).push(this.buildAttachment());
  }

  removeAttachment(i: number, j: number) {
    this.attachmentsAt(i).removeAt(j);
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    console.log('Form Submit:', this.form.getRawValue());
  }

  resetForm() {
    this.form.reset({ isActive: false, demoItems: [] });
    this.demoItems.clear();
    this.addItem(); // add default item after reset
  }
   onUpload(event: UploadEvent) {
    console.log(event)
        //this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded with Basic Mode' });
    }
}
