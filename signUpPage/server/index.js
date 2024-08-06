const crypto = require('crypto');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const RegisterModel = require('./models/Register');

const app = express();
app.use(cors(
    {
        origin: ["https://deploy-mern-frontend.vercel.app"],
        methods: ["POST", "GET"],
        credentials: true
    }
));
app.use(express.json());

mongoose.connect('mongodb+srv://yousaf:test123@cluster0.g4i5dey.mongodb.net/test?retryWrites=true&w=majority');

// HMAC function
function hmac_rawurlsafe_base64_string(distinct_id, secret) {
    const hash = crypto
        .createHmac("sha256", secret)
        .update(distinct_id)
        .digest("base64url");
    return hash.trimEnd("=");
}

app.get("/", (req, res) => {
    res.json("Hello");
});

app.post('/register', (req, res) => {
    const {name, email, password} = req.body;
    RegisterModel.findOne({email: email})
    .then(user => {
        if(user) {
            res.json("Already have an account");
        } else {
            RegisterModel.create({name: name, email: email, password: password})
            .then(result => {
                // Generate the subscriber ID using HMAC
                const secret = 'eHrvAlcrNRyBaiFbv3DGM33fCfFBDDYa3xHU1gv9dWM'; // replace with your secret key
                const subscriberId = hmac_rawurlsafe_base64_string(email, secret);
                res.json({ ...result._doc, subscriberId });
            })
            .catch(err => res.json(err));
        }
    }).catch(err => res.json(err));
});

app.listen(3001, () => {
    console.log("Server is Running");
});
