const express = require("express");
const redis = require("redis");
const app = express();
const auth = require("./authentication"); 
const port = process.env.PORT || 5000;
const redisClient = redis.createClient({
  host: 'redis-14348.c12.us-east-1-4.ec2.cloud.redislabs.com',
  port: 14348,
  password: 'sC2SvFQpljFlZeZwGvDmiJkLBWdX1mMT'
});


//If the API request is sent using any other HTTP method apart from the one you chose, return HTTP 405
app.get("/inbound/sms", (req, res) => {
  res.status(405).json({ error: "HTTP 405 method not allowed" });
});
app.get("/outbound/sms", (req, res) => {
  res.status(405).json({ error: "HTTP 405 method not allowed" });
});
app.put("/inbound/sms", (req, res) => {
  res.status(405).json({ error: "HTTP 405 method not allowed" });
});
app.put("/outbound/sms", (req, res) => {
  res.status(405).json({ error: "HTTP 405 method not allowed" });
});
app.delete("/inbound/sms", (req, res) => {
  res.status(405).json({ error: "HTTP 405 method not allowed" });
});
app.delete("/outbound/sms", (req, res) => {
  res.status(405).json({ error: "HTTP 405 method not allowed" });
});
app.post("/", (req, res) => {
  res.status(405).json({ error: "HTTP 405 method not allowed" });
});
app.get("/", (req, res) => {
  res.status(405).json({ error: "HTTP 405 method not allowed" });
});

app.use(express.json());
app.use((err, req, res, next) => {
  if (err) {
    res.json({ message: "", error: "JSON object is invalid" });
  } else {
    next();
  }
});

const checkSTOP = async (req, res, next) => {
  const { to, from, text } = req.body;
  if (text === "STOP" || text === "STOP\r" || text === "STOP\r\n" || text === "STOP\n") {
    await redisClient.setex(from, 14400, to);
  }
  next();
};


const handleSTOP = async (req, res, next) => {
  const { to, from } = req.body;
  const Preq = auth.missingParameter(req.body);
    if (Preq.error) return res.status(400).json(Preq);
  const value = await redisClient.exists(from, async (err, count) => {
    if (err) throw err;
    if (count === 1) {
      return res.status(400).json({
        message: "",
        error: `sms from <${from}> to <${to}> blocked by STOP request`,
      });
    }
    await redisClient.exists(`${from}:count`, async (err, count) => {
      if (err) throw err;
      
      if (count === 1) {
        redisClient.incr(`${from}:count`, (err, count) => {
          if (err) throw err;
          console.log(count)
          if (count > 49) {
            console.log(`Limit reached for <${from}>`)
            return res
              .status(400)
              .json({ message: "", error: `limit reached for <${from}>` });
          }
          return next();
        });
      } else {
        await redisClient.setex(`${from}:count`, 20, 0);
        return next();
      }
    });
  });
};

//App routes 

app.post("/inbound/sms", checkSTOP, (req, res) => {
  try {
    const Preq = auth.missingParameter(req.body);
    if (Preq.error) return res.status(400).json(Preq);

    const Pvalid = auth.validateParameter(req.body);
    if (Pvalid.error) return res.status(400).json(Pvalid);
  } catch (err) {
    return res.status(500).json({ message: "", error: "unknown failure" });
  }

  return res.status(200).json({ message: "inbound sms is ok", error: "" });
});

app.post("/outbound/sms", handleSTOP,checkSTOP, (req, res) => {
  try {
    const Preq = auth.missingParameter(req.body);
    if (Preq.error) return res.status(400).json(Preq);

    const Pvalid = auth.validateParameter(req.body);
    if (Pvalid.error) return res.status(400).json(Pvalid);
  } catch (err) {
    return res.status(500).json({ message: "", error: "unknown failure" });
  }

  return res.status(200).json({ message: "outbound sms is ok", error: "" });
});


app.listen(port);
console.log('Server listening on port : ' + port);



