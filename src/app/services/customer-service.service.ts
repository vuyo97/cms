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
  editCustomer(data :any) {
    return this.http.put<any>(`http://localhost:3000/customers/${data.id}`,data);
   
  }
  
  deleteCustomer(id : any) {
    return this.http.delete<any>(`http://localhost:3000/customers/${id}`);
   
  }
}
