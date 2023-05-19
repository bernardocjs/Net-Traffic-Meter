const express = require("express");
const nodemailer = require("nodemailer");
const net = require("net");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const http = require("http").createServer(app);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
  },
});

const HOST = "127.0.0.1";
const PORT_TRAFFIC = 50000;

// Connect to the server socket
const network_client = new net.Socket();
network_client.connect(PORT_TRAFFIC, HOST, () => {
  console.log("Conectado ao provedor de tráfego.");
});

io.on("connection", (socket) => {
  network_client.on("data", (data) => {
    // console.log("funfa");
    socket.emit("data", JSON.parse(data));
  });
});
// Start the server
http.listen(8000, () => {
  console.log("Server iniciou na porta 8000");
});

app.post("/send-email", (req, res) => {
  const to = req.body.to;
  const subject = req.body.subject;
  const text = req.body.text;
  // Create a transporter using your email service provider's SMTP settings
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "hackthon2023viasat@gmail.com",
      pass: "spogqtdyptxcbdib",
    },
  });

  // Configure the email options
  const mailOptions = {
    from: "hackthon2023viasat@gmail.com",
    to: to,
    subject: subject,
    text: text,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      res.status(500).send("An error occurred while sending the email.");
    } else {
      console.log("Email sent:", info.response);
      res.status(200).send("Email sent successfully!");
    }
  });
});
