/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const customerData = {
    '1': {
        'name': 'Company 1',
        'kvkNumber': '12345678',
        'address': {
            'street': 'Johan Huizingalaan 765',
            'postalCode': '1066VH',
            'city': 'Amsterdam',
            'country': 'NL'
        }
    },
    '2': {
        'name': 'Company 2',
        'kvkNumber': '87651234',
        'address': {
            'street': 'Johan Huizingalaan 763A',
            'postalCode': '1066VH',
            'city': 'Amsterdam',
            'country': 'NL'
        }
    }
};

const manufacturerData = {
    '1': {
        'name': 'Manufacturer 1',
        'kvkNumber': '31245687',
        'address': {
            'street': 'Ducklaan 765',
            'postalCode': '1111AA',
            'city': 'Den Haag',
            'country': 'NL'
        }
    }
};

const maintenanceFirmData = {
    '1': {
        'name': 'MaintenanceFirm 1',
        'kvkNumber': '56781234',
        'address': {
            'street': 'Duckstraat 763A',
            'postalCode': '2222BB',
            'city': 'Groningen',
            'country': 'NL'
        }
    },
    '2': {
        'name': 'MaintenanceFirm 2',
        'kvkNumber': '65128734',
        'address': {
            'street': 'Dorpsstraat 1',
            'postalCode': '3333CC',
            'city': 'Lutjebroek',
            'country': 'NL'
        }
    }
};

const sheetData = {
    '1': {
        'reason': '',
        'maintenanceFirm': '1'
    },
    '2': {
        'reason': '',
        'maintenanceFirm': '2'
    }            
};

const elevatorData = {
    'Elevator01': {
        'type': 'Regular',
        'model': 'I',
        'customer': '1',
        'manufacturer': '1',
        'sheet': '1'
    },
    'Elevator02': {
        'type': 'Regular',
        'model': 'II',
        'customer': '1',
        'manufacturer': '1',
        'sheet': '2'
    },
};

// DEMO SETUP FUNCTIONS
/**
 * Create the participants & assets to use in the demo
 * @param {composer.demo.SetupDemo} setupDemo - the SetupDemo transaction
 * @transaction
 */
async function setupDemo() {
    console.log('running setupDemo()...');

    const factory = getFactory();
    const namespace = 'composer.elevator';

    let customers;
    let manufacturers;
    let maintenanceFirms;
    let mainatenanceSheets;
    let elevators;

    // create array of Customer particpant resources identified by the top level keys in customerData const
    customers = Object.keys(customerData).map(function (customerID) {
        const customer = customerData[customerID]; // customer i from test data

        //populate customer particpant resource with JSON from customer i
        const customerResource = factory.newResource(namespace, 'Customer', customerID);
        customerResource.name = customer.name;
        customerResource.kvkNumber = customer.kvkNumber;
        customerResource.address = factory.newConcept('composer.base', 'Address');
        customerResource.address.street = customer.address.street;
        customerResource.address.postalCode = customer.address.postalCode;
        customerResource.address.city = customer.address.city;
        customerResource.address.country = customer.address.country;
        return customerResource;
    });

    // create array of Manufacturer particpant resources identified by the top level keys in manufacturerData const
    manufacturers = Object.keys(manufacturerData).map(function (manufacturerID) {
        const manufacturer = manufacturerData[manufacturerID]; // manufacturer i from test data

        //populate manufacturer particpant resource with JSON from manufacturer i
        const manufacturerResource = factory.newResource(namespace, 'Manufacturer', manufacturerID);
        manufacturerResource.name = manufacturer.name;
        manufacturerResource.kvkNumber = manufacturer.kvkNumber;
        manufacturerResource.address = factory.newConcept('composer.base', 'Address');
        manufacturerResource.address.street = manufacturer.address.street;
        manufacturerResource.address.postalCode = manufacturer.address.postalCode;
        manufacturerResource.address.city = manufacturer.address.city;
        manufacturerResource.address.country = manufacturer.address.country;
        return manufacturerResource;
    });

    // create array of maintenanceFirm particpant resources identified by the top level keys in maintenanceFirmData const
    maintenanceFirms = Object.keys(maintenanceFirmData).map(function (maintenanceFirmID) {
        const maintenanceFirm = maintenanceFirmData[maintenanceFirmID]; // maintenanceFirm i from test data

        //populate maintenance firm particpant resource with JSON from maintenanceFirm i
        const maintenanceFirmResource = factory.newResource(namespace, 'MaintenanceFirm', maintenanceFirmID);
        maintenanceFirmResource.name = maintenanceFirm.name;
        maintenanceFirmResource.kvkNumber = maintenanceFirm.kvkNumber;
        maintenanceFirmResource.address = factory.newConcept('composer.base', 'Address');
        maintenanceFirmResource.address.street = maintenanceFirm.address.street;
        maintenanceFirmResource.address.postalCode = maintenanceFirm.address.postalCode;
        maintenanceFirmResource.address.city = maintenanceFirm.address.city;
        maintenanceFirmResource.address.country = maintenanceFirm.address.country;
        return maintenanceFirmResource;
    });

    // add all customers
    const customerRegistry = await getParticipantRegistry(namespace + '.Customer');
    await customerRegistry.addAll(customers);

    // add all manufacturers
    const manufacturerRegistry = await getParticipantRegistry(namespace + '.Manufacturer');
    await manufacturerRegistry.addAll(manufacturers);

    // add all maintenanceFirms
    const maintenanceFirmRegistry = await getParticipantRegistry(namespace + '.MaintenanceFirm');
    await maintenanceFirmRegistry.addAll(maintenanceFirms);

    // create array of maintenanceSheet assets identified by the top level keys in sheetData const
    maintenanceSheets = Object.keys(sheetData).map(function (sheetID) {
        const sheet = sheetData[sheetID]; // sheet i from sheet data

        //populate maintenance sheet resource with JSON from sheet i
        const maintenanceSheetResource = factory.newResource(namespace, 'MaintenanceSheet', sheetID);
        maintenanceSheetResource.reason = sheet.reason;
        const relatedFirm = factory.newRelationship(namespace, 'MaintenanceFirm', sheet.maintenanceFirm);
        maintenanceSheetResource.maintenanceFirm = relatedFirm;
        return maintenanceSheetResource;
    });

    // add all maintenance sheets
    const maintenanceSheetRegistry = await getAssetRegistry(namespace + '.MaintenanceSheet');
    await maintenanceSheetRegistry.addAll(maintenanceSheets); 

    // create array of elevator assets identified by the top level keys in elevatorData const
    elevators = Object.keys(elevatorData).map(function (elevatorID) {
        const elevator = elevatorData[elevatorID]; // elevator i from elevator data

        //populate elevator resource with JSON from elevator i
        const elevatorResource = factory.newResource(namespace, 'Elevator', elevatorID);
        elevatorResource.type = elevator.type;
        elevatorResource.model = elevator.model;

        const relatedCustomer = factory.newRelationship(namespace, 'Customer', elevator.customer);
        const relatedManufacturer = factory.newRelationship(namespace, 'Manufacturer', elevator.manufacturer);
        const relatedSheet = factory.newRelationship(namespace, 'MaintenanceSheet', elevator.sheet);
    
        elevatorResource.customer = relatedCustomer;
        elevatorResource.manufacturer = relatedManufacturer;
        elevatorResource.sheet = relatedSheet;
        return elevatorResource;
    });    

    // add all elevators
    const elevatorRegistry = await getAssetRegistry(namespace + '.Elevator');
    await elevatorRegistry.addAll(elevators);
}

/**
 * Delete the participants & assets in the demo
 * @param {composer.demo.DeleteDemo} deleteDemo - the DeleteDemo transaction
 * @transaction
 */
async function deleteDemo() {
    console.log('running deleteDemo()...');

    const factory = getFactory();
    const namespace = 'composer.elevator';

    // delete all customers
    const customerRegistry = await getParticipantRegistry(namespace + '.Customer');
    await customerRegistry.removeAll(Object.keys(customerData));

    // delete all manufacturers
    const manufacturerRegistry = await getParticipantRegistry(namespace + '.Manufacturer');
    await manufacturerRegistry.removeAll(Object.keys(manufacturerData));

    // delete all maintenanceFirms
    const maintenanceFirmRegistry = await getParticipantRegistry(namespace + '.MaintenanceFirm');
    await maintenanceFirmRegistry.removeAll(Object.keys(maintenanceFirmData));

    // add all maintenance sheets
    const maintenanceSheetRegistry = await getAssetRegistry(namespace + '.MaintenanceSheet');
    await maintenanceSheetRegistry.removeAll(Object.keys(sheetData)); 
    
    // add all elevators
    const elevatorRegistry = await getAssetRegistry(namespace + '.Elevator');
    await elevatorRegistry.removeAll(Object.keys(elevatorData));
}
