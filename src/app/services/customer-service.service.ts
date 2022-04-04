import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http: HttpClient) { }

  getCustomers() {
    return this.http.get<any>('http://localhost:3000/customers');
   
  }
  postCustomer(data : any) {
    return this.http.post<any>('http://localhost:3000/customers',data);
   
  }
}
