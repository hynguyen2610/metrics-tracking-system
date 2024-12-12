# To start the Postgres container and import the backup file, run the following command in the terminal:

docker-compose up -d

This introduction to setup a postgres DB instance is
optional, you can use your own instance.

# Then, import the backup file:
Create database "metrics"
Use backup file below to restore into that database.  
File: metrics.backup  
I used pgadmin to import it, there are some warnings/errors, but things should work.

The latest version of postgres DB currently is 17.

