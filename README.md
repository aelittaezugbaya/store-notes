# Pretty Good

Pretty Good is a simple task management applciation created as a project for
Application Development Methods course at Metropolia UAS

## Getting Started

Because there is no distributable version atm, its a bit complecated to
see the application at work.

* clone the repo
* start server side
* navigate to "\<path-to-project-root\>/front"
* make sure you have npm installed
* run the following commands

> npm install

> npm start

When started it will write the local port number on which application is served

Apart from it, a basic hibernate.cfg.xml file is required that specifies your
mysql connection and credentials to it, and an empty schema called "prettygood"
should be created as well.

### Credentials

To log in to system one can use one of the following credentials

* username: pekka, password: 123456 (Worker permissions)
* username: anna, password: 123456 (Manager permissions)
* username: maija, password: 123456 (Worker permissions)

## Tests
To run front-end tests

* start server side
* navigate to "\<path-to-project-root\>/front"
* run

> npm run test-start


