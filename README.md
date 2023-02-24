This project is tested with BrowserStack.
# React App
1. Open folder with name "reactApp" in cmd.
2. Run "npm install" command to install node modules.
3. To start react app use command "npm start"
4. React app will be up in url: "http://localhost:3000"

# Nodejs Server.
1. Open folder with name "server" in cmd.
2. Run "npm install" command to install node modules.
3. To start server use command "nodemon server.js"
4. Default port of server will be "http://localhost:8080"

# Configuring Database.
1. Open the Server project.
2. Open file "db.config.js"
3. In this file enter your database username and password.
4. Open mysql workbench and create a Database with name "narayanaMiniApp".
5. Import the schema structure in DB by taking it from DatabaseDump folder.


# Running ReactApp from nodejs server(Using static files).
1. Open the react app in cmd.
2. Run command npm run build.
3. Copy the build folder generated from react.
4. Open server project.
5. Paste the build folder generated in step-2
6. Open server project in cmd.
7. Run command npm start.
8. Open browser and hit url: http://localhost:8080/
9. Now reactapp and nodejs is working on single server.

#Ubuntu new Ec2 instllation instructions (https://ourcodeworld.com/articles/read/977/how-to-deploy-a-node-js-application-on-aws-ec2-server)

##Connect to Ubuntu
13.233.225.91
ec2-13-233-225-91.ap-south-1.compute.amazonaws.com

## Install Node js https://github.com/nodesource/distributions/blob/master/README.md#debinstall
curl -sL https://deb.nodesource.com/setup_15.x | sudo -E bash -
sudo apt-get install -y nodejs
	

##download source code
git clone https://github.com/PawanSapra/narayanaGroupPortal.git
cd /narayanaGroupPortal/server
npm install
sudo node server.js

##check database connection
mysql -u admin -h 'nspira-prod.cluster-crwtwmsp5n0r.ap-south-1.rds.amazonaws.com' -p'0lq37F8hWTo8'

##Install pm2 so that node server crashes it auto-restart and on machine reboot it auto restarts
sudo npm install pm2 -g
##Register pm2 to start on reboot
sudo pm2 startup
##Deregister pme from start on reboot
pm2 unstartup systemd
## To start the server
sudo pm2 start server.js
## To check detailed usage of server
sudo pm2  show server
## To just check status of server
sudo pm2 list
## To stop the server
sudo pm2 stop server

##Prod Database:
Master username: admin
Master password: 0lq37F8hWTo8
Endpoint: nspira-prod.cluster-crwtwmsp5n0r.ap-south-1.rds.amazonaws.com

mysqldump -u admin -p 6xXsqlx9ACngk7rJ4pH0 > nspiraDump.sql

mysqldump -u admin -p 0lq37F8hWTo8 > nspiraDump.sql


mysql --host nspira-prod.cluster-crwtwmsp5n0r.ap-south-1.rds.amazonaws.com --user admin --password=0lq37F8hWTo8


mysqldump -u username -p dbname > dbexport.sql

##CHECK THE DB CONNECTION
mysql --host helpdesk-narayana.cluster-cnnrkrggtx6l.ap-south-1.rds.amazonaws.com --user admin --password=6xXsqlx9ACngk7rJ4pH0
GRANT ALL PRIVILEGES ON narayanaminiapp.* TO 'admin'@'helpdesk-narayana.cluster-cnnrkrggtx6l.ap-south-1.rds.amazonaws.com';
## DOWNLOAD THE DB DUMP
mysqldump --column-statistics=0 --host nspira-prod.cluster-crwtwmsp5n0r.ap-south-1.rds.amazonaws.com  -u admin -p narayanaminiapp > dbexport.sql

##EXECUTE THE DB DUMP

mysql --host helpdesk-narayana.cluster-cnnrkrggtx6l.ap-south-1.rds.amazonaws.com -u admin -p narayanaminiapp <Escalation.sql

##Smaera Nspira Access Keys
Access KEy: AKIARC4HAKKN6MY7ZCN3
Secret Key: QXVI9bzsAQBGXHuEsvLJC+jvDmLo2GWL8EW8LQjC
aws s3 cp s3://nspira-mini-helpdesk/dir localdir --recursive
aws s3 cp s3://YOUR_BUCKET/YOUR_FOLDER . --recursive --dryrun
aws s3 cp s3://nspira-mini-helpdesk/s3Data . --recursive
aws s3 cp s3://nspira-mini-helpdesk/C:\Users\Karan Kapoor\Desktop\s3Data . --recursive --dryrun

##DOWNLOAD S3 FILES
aws s3 cp s3://nspira-mini-helpdesk/ . --recursive
aws s3 cp s3://smaera/ . --recursive --dryrun

##Upload S3 FILES
aws s3 cp ticket s3://smaera/ticket  --recursive

##List All FILES
aws s3 ls s3://smaera --recursive

##DELETE ALL FILES
aws s3 rm s3://smaera/ --recursive

##NSPIRA DNS NAME
DNS name: narayanagroup-839414536.ap-south-1.elb.amazonaws.com

##NSPIRA S3
Bucket name: smaera
Access key ID: AKIAXEJQD25Q4QPWV4NS
Secret access key: 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
https://narayanagroup-839414536.ap-south-1.elb.amazonaws.com/