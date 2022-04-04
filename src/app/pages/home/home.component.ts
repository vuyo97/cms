import { Component, OnInit } from '@angular/core';
import { CustomerService } from 'src/app/services/customer-service.service';
import { PrimeNGConfig } from 'primeng/api';
import { LazyLoadEvent } from 'primeng/api';
import { MessageService } from 'primeng/api';
import {FormControl, FormGroupDirective, NgForm, Validators, FormBuilder} from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import {ErrorStateMatcher} from '@angular/material/core';
import * as $ from 'jquery';



export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

export interface Customer{
  id:number;
  company_name: string;
  email:string;
  phone_number:string;
  ip_address:string;
  address:string
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [MessageService,ConfirmationService]
})
export class HomeComponent implements OnInit {
  customers : any;
  loading: boolean ;
  clonedCustomer: { [s: string]: Customer; } = {};
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  matcher = new MyErrorStateMatcher();

  constructor(private customerService: CustomerService, private primengConfig: PrimeNGConfig, private messageService: MessageService,private formBuilder:FormBuilder,private confirmationService: ConfirmationService) { 
    this.loading = false;

  }

  customerForm = this.formBuilder.group({
    company_name:[''],
    email:[''],
    phone_number:[''],
    ip_address:[''],
    address:['']
  })

  ngOnInit(): void {
    this.customerService.getCustomers().subscribe((response: any) => {
        this.customers = response;
        console.log(this.customers);})

        this.loading = true;
        this.primengConfig.ripple = true;
  }

  onRowEditInit(customer: Customer) {
    console.log(customer);
    this.clonedCustomer[customer.id] = {...customer};
  }

  onRowEditSave(customer: Customer) {
      if (customer.company_name) {
        console.log(this.clonedCustomer[customer.id]);
          delete this.clonedCustomer[customer.id];
          this.customerService.editCustomer(customer).subscribe((response : any) => {
            this.messageService.add({severity:'success', summary: 'Success', detail:'Customer is updated'});
          });
      }
      else {
          this.messageService.add({severity:'error', summary: 'Error', detail:'Customer Name'});
      }
  }

  onRowEditCancel(customer: Customer, index: number) {
      this.customers[index] = this.clonedCustomer[customer.id];
      delete this.clonedCustomer[customer.id];
  }
 

deleteProduct(customer: Customer) {
  console.log(customer.id)
    this.confirmationService.confirm({
        message: 'Are you sure you want to delete ' + customer.company_name + '?',
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {       
            this.customerService.deleteCustomer(customer.id).subscribe((response : any) => {
              this.customers = this.customers.filter((val:any) => val.id !== customer.id);
              this.messageService.add({severity:'success', summary: 'Successful', detail: 'Customer Deleted', life: 3000});
            });
           
        }
    });
}
  saveCustomer(){
    if(this.customerForm.valid){
      //this.customerForm.value.id = this.customers.length + 1;
      console.log(this.customerForm.value);
      this.customerService.postCustomer(this.customerForm.value).subscribe({
        next:(res: any)=>{
          this.messageService.add({severity:'success', summary: 'Success', detail:'Customer added successfully'});
        },
        error:()=>{
          this.messageService.add({severity:'error', summary: 'Error', detail:'Form Invalid!'});
          this.customerForm.reset();
          $("#customerModal" ).hide("slow");
        }
      })
    }else{
      this.messageService.add({severity:'error', summary: 'Error', detail:'Form Invalid!'});
    }
   

  }
 
}
