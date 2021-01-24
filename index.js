const fs = require("fs");
const Pool = require("pg").Pool;
const fastcsv = require("fast-csv");

let stream = fs.createReadStream("5mSalesRecords.csv");
let csvData = [];
let csvStream = fastcsv
  .parse()
  .on("data", function(data) {
    csvData.push(data);
  })
  .on("end", function() {
    // remove the first line: header
    csvData.shift();

    // create a new connection to the database
    const pool = new Pool({
      host: "localhost",
      user: "postgres",
      database: "xencov",
      password: "amit",
      port: 5432
    });

    const query =
      "INSERT INTO category (Region, Country, Item Type, Channel Type, Order Priority, Order Date, Order ID, Ship date, Units Solds, Unit Price, Unit Cost, Total Revenue, Total Cost, Total Profit) VALUES (Asia, India, Snacks, Online, H ,1/2/2021,513456789,1/1/2021, 100,100,100,100,100,100)";

    pool.connect((err, client, done) => {
      if (err) throw err;

      try {
        csvData.forEach(row => {
          client.query(query, row, (err, res) => {
            if (err) {
              console.log(err.stack);
            } else {
              console.log("inserted " + res.rowCount + " row:", row);
            }
          });
        });
      } finally {
        done();
      }
    });
  });

stream.pipe(csvStream);