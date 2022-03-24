export class CustomerService {
  getCustomersLarge() {
    return fetch("../../../constants/customer_large.json")
      .then((res) => res.json())
      .then((d) => d.data);
  }
}
