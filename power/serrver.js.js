twilio = require("twilio");
const mongoose = require("mongoose");
const { spawn } = require("child_process");
require("dotenv").config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Twilio setup
const twilioClient = twilioconst express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const (process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
const OTPs = {}; // Store OTPs temporarily

// MongoDB setup
mongoose.connect("mongodb://localhost:27017/career_predictor", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({ phone: String, career: String });
const User = mongoose.model("User", userSchema);

// Send OTP API
app.post("/send-otp", async (req, res) => {
    const { phone } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000);
    OTPs[phone] = otp;

    await twilioClient.messages.create({
        body: `Your OTP is: ${otp}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone,
    });
    res.json({ success: true, message: "OTP sent!" });
});

// Verify OTP API
app.post("/verify-otp", (req, res) => {
    const { phone, otp } = req.body;
    if (OTPs[phone] == otp) {
        delete OTPs[phone];
        res.json({ success: true, message: "OTP Verified!" });
    } else {
        res.json({ success: false, message: "Invalid OTP" });
    }
});

// Career Prediction API
app.post("/predict-career", (req, res) => {
    const answers = req.body.answers;
    const pythonProcess = spawn("python3", ["predict.py", JSON.stringify(answers)]);

    pythonProcess.stdout.on("data", async (data) => {
        const career = data.toString().trim();
        await User.create({ phone: req.body.phone, career });
        res.json({ success: true, career });
    });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
