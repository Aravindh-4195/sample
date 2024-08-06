const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const RegisterModel = require('./models/Register');
const crypto = require('crypto');

const app = express();

app.use(cors({
  origin: ["https://deploy-mern-frontend.vercel.app"],
  methods: ["POST", "GET"],
  credentials: true
}));

app.use(express.json());

mongoose.connect('mongodb+srv://1mareeduaravindh1:mongo123@cluster0.esgzz6v.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0');

app.get("/", (req, res) => {
  res.json("Hello");
});

function hmac_rawurlsafe_base64_string(distinct_id, secret) {
  const hash = crypto
    .createHmac("sha256", secret)
    .update(distinct_id)
    .digest("base64url");
  return hash.trimEnd("=");
}

app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  const subscriberId = hmac_rawurlsafe_base64_string(email, "your-secret-key"); // Create subscriberId

  RegisterModel.findOne({ email: email })
    .then(user => {
      if (user) {
        res.json({ message: "Already have an account" });
      } else {
        RegisterModel.create({ name: name, email: email, password: password })
          .then(result => {
            // Return the new user data along with subscriberId
            res.json({ result, subscriberId });
          })
          .catch(err => res.json(err));
      }
    }).catch(err => res.json(err));
});

app.listen(3001, () => {
  console.log("Server is Running");
});
