# Have a running Postgres SQL server instance
To start the Postgres container and import the backup file, run the following command in the terminal:
```
docker-compose up -d
```

Or you can use your own instance.

# Then, import the backup file:
Create database "metrics"
Use backup file below to restore into that database.  
File: [metrics.backup](metrics.backup)  
I used pgadmin to import it, there are some warnings/errors, but things should work.

// I'm using postgres 17
