/**
 * @file contract
 * @author atom-yang
 */

import * as protobuf from '@aelfqueen/protobufjs/light';
import ContractMethod from './contractMethod';
import { noop } from '../util/utils';

const getServicesFromFileDescriptors = descriptors => {
  const root = protobuf.Root.fromDescriptor(descriptors);
  return descriptors.file.filter(f => f.service.length > 0).map(f => {
    const sn = f.service[0].name;
    const fullName = f.package ? `${f.package}.${sn}` : sn;
    return root.lookupService(fullName);
    // service.resolveAll();
    // return service;
  });
};

class Contract {
  constructor(chain, services, address) {
    this._chain = chain;
    this.transactionHash = null;
    this.address = address;
    this.services = services;
  }
}


export default class ContractFactory {
  constructor(chain, fileDescriptorSet, wallet) {
    this.chain = chain;
    this.services = getServicesFromFileDescriptors(fileDescriptorSet);
    this.wallet = wallet;
  }

  static bindMethodsToContract(contract, wallet) {
    contract.services.forEach(service => {
      Object.keys(service.methods).forEach(key => {
        const method = service.methods[key].resolve();
        const contractMethod = new ContractMethod(contract._chain, method, contract.address, wallet);
        contractMethod.bindMethodToContract(contract);
      });
    });
  }

  at(address, callback = noop) {
    const contractInstance = new Contract(this.chain, this.services, address);
    ContractFactory.bindMethodsToContract(contractInstance, this.wallet);
    callback(null, contractInstance);
    return contractInstance;
  }
}