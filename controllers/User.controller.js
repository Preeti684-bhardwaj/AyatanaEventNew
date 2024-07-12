const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const BaseController = require("./base");
const models = require("../models");
const sendEmail = require("../utils/sendEmail");
const {
  isValidEmail,
  isValidPhone,
  isValidPassword,
  isValidLength,
} = require("../utils/validation");
const { password } = require("../config/env");
const sequelize = require("../config/db.config").sequelize; // Ensure this path is correct

const generateToken = (user) => {
  return jwt.sign({ obj: user }, process.env.JWT_SECRET, {
    expiresIn: "72h", // expires in 72 hours
  });
};
const guestUserToken = (user) => {
  return jwt.sign({ obj: user }, process.env.JWT_SECRET);
};
const generateOtp = () => {
  // Define the possible characters for the OTP
  const chars = "0123456789";
  // Define the length of the OTP
  const len = 6;
  let otp = "";
  // Generate the OTP
  for (let i = 0; i < len; i++) {
    otp += chars[Math.floor(Math.random() * chars.length)];
  }

  this.resetOtp = otp;
  this.resetOtpExpire = Date.now() + 15 * 60 * 1000;

  return otp;
};

class UserController extends BaseController {
  constructor() {
    super(models.User);
    this.router.post("/signup", this.signup.bind(this));
    this.router.post("/signin", this.signin.bind(this));
    this.router.get("/verify-email", this.verifyEmail.bind(this));
    this.router.post("/forgotPassword", this.forgotPassword.bind(this));
    this.router.post("/resetpassword/:userId", this.resetPassword.bind(this));
    this.router.post("/sendOtp", this.sendOtp.bind(this));
    this.router.post("/guestLogin", this.guestUser.bind(this));
    this.router.post("/otpVerification",this.emailOtpVerification.bind(this));
  }

  listArgVerify(req, res, queryOptions) {
    const { role, active } = req.body;

    if (role) {
      queryOptions.where.role = role;
    }

    if (active !== undefined) {
      queryOptions.where.active = active;
    }

    if (queryOptions.attributes) {
      queryOptions.attributes = queryOptions.attributes.filter(
        (attr) => !["password", "resetToken"].includes(attr)
      );
    } else {
      queryOptions.attributes = { exclude: ["password", "resetToken"] };
    }

    return queryOptions;
  }

  async afterCreate(req, res, newObject, transaction) {
    // Add additional setup after creating an agent, if necessary
  }

  signup = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const { name, email, phone, password } = req.body;

      // Validate input fields
      if (
        [name, email, phone, password].some((field) => field?.trim() === "")
      ) {
        return res
          .status(400)
          .send({ message: "Please provide all necessary fields" });
      }

      if (!isValidPhone(phone)) {
        return res.status(400).send({ message: "Invalid Phone Number" });
      }

      if (!isValidEmail(email)) {
        return res.status(400).send({ message: "Invalid email" });
      }

      if (!isValidPassword(password)) {
        return res.status(400).send({
          message:
            "Password must contain at least 8 characters, including uppercase, lowercase, number and special character",
        });
      }

      if (!isValidLength(name)) {
        return res.status(400).send({
          message:
            "Name should be greater than 3 characters and less than 40 characters and should not start with number",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      // Check for existing user by email or phone
      const existingUserByEmail = await models.User.findOne({
        where: { email },
      });
      const existingUserByPhone = await models.User.findOne({
        where: { phone },
      });
      let user;
      if (existingUserByEmail && existingUserByPhone) {
        // Both email and phone already exist
        return res.status(400).send({
          message: "either email and phone number are already in use",
        });
      }

      if (existingUserByEmail) {
        // Email exists but phone doesn't match
        if (existingUserByEmail.phone !== phone) {
          return res.status(400).send({
            message: "Email already in use",
          });
        }
        // Update existing user
        existingUserByEmail.name = name;
        existingUserByEmail.password = hashedPassword;
        await existingUserByEmail.save({ transaction });
        user = existingUserByEmail;
      } else if (existingUserByPhone) {
        // Phone exists but email doesn't match
        return res.status(400).send({
          message: "Phone number already in use",
        });
      } else {
        // Create new user
        const emailToken = generateToken({ email });
        user = await models.User.create(
          {
            name,
            email,
            phone,
            password: hashedPassword,
            emailToken,
          },
          { transaction }
        );
      }

      await transaction.commit();
      res.status(201).send({
        id: user.id,
        email: user.email,
        phone: user.phone,
      });
    } catch (error) {
      await transaction.rollback();
      res.status(500).send({
        message: error.message || "Some error occurred during signup.",
      });
    }
  };
   
//   Email OTP verification
 emailOtpVerification =async (req, res) => {
    const { phone, otp} = req.body;
  
    // Validate the OTP
    if (!otp) {
      return res
        .status(400)
        .json({ success: false, message: "OTP is required." });
    }
  
    try {
      const user = await models.User.findOne({ where: { phone } });
      console.log(user);
      if (!user) {
        return res.status(400).json({
          success: false,
          message: "User not found or invalid details.",
        });
      }
  
      // Check OTP validity
      if (user.otp !== otp) {
        return res.status(400).json({ success: false, message: "Invalid OTP" });
      }
      if (user.otpExpire < Date.now()) {
        return res.status(400).json({ success: false, message: "expired OTP." });
      }
  
      // Update user details
      user.IsEmailVerified = true;
      user.otp = null;
      user.otpExpire = null;
      await user.save();
  
      res.status(201).json({
        success: true,
        message: "User data",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
        },
      });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Server Error", error: error.message });
    }
  };
  
  signin = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({ message: "Please Enter Email & Password" });
    }
    try {
      const user = await models.User.findOne({ where: { email:email } });
      if (!user) {
        return res.status(404).send({ message: "User not found." });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(403).send({ message: "Invalid password." });
      }

      const obj = {
        type: "USER",
        id: user.id,
        email: user.email,
      };

      const token = generateToken(obj);

      res.status(200).send({
        id: user.id,
        token: token,
      });
    } catch (error) {
      res.status(500).send({
        message: error.message || "Some error occurred during signin.",
      });
    }
  };

  verifyEmail = async (req, res) => {
    const { token } = req.query;

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await models.User.findByPk(decoded.obj.id);

      if (!user) {
        return res.status(404).send({ message: "Agent not found." });
      }

      agent.isEmailVerified = true;
      await user.save();

      res.status(200).send({ message: "Email verified successfully." });
    } catch (error) {
      res.status(500).send({
        message: error.message || "Could not verify email.",
      });
    }
  };
  // forget password
  forgotPassword = async (req, res) => {
    const { email } = req.body;

    // Validate input fields
    if (!email) {
      return res.status(400).send({ message: "Missing email id" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).send({ message: "Invalid email address" });
    }

    try {
      // Find the user by email
      const user = await models.User.findOne({
        where: {
          email: email.trim(),
        },
      });

      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }
      //   if (!user.isVerified) {
      //     return res.status(404).send({message:"user is not verified"});
      //   }

      // Get ResetPassword Token
      const otp = generateOtp(); // Assuming you have a method to generate the OTP
      user.otp = otp;
      user.otpExpire = Date.now() + 15 * 60 * 1000; // Set OTP expiration time (e.g., 15 minutes)

      await user.save({ validate: false });

      const message = `Your One Time Password is ${otp}`;

      await sendEmail({
        email: user.email,
        subject: `Password Recovery`,
        message,
      });

      res.status(200).json({
        success: true,
        message: `OTP sent to ${user.email} successfully`,
        userId: user.id,
      });
    } catch (error) {
      user.resetOtp = null;
      user.resetOtpExpire = null;
      await user.save({ validate: false });

      return res.status(500).send(error.message);
    }
  };

  // reset password
  resetPassword = async (req, res) => {
    const { password, otp } = req.body;
    const userId = req.params.userId;

    // Validate input fields
    if (!password || !otp) {
      return res
        .status(400)
        .send({ message: "Missing required fields: password or OTP" });
    }

    try {
      // Find the user by ID
      const user = await models.User.findByPk(userId);

      if (!user) {
        return res.status(400).send({ message: "User not found" });
      }

      // Verify the OTP
      if (user.otp !== otp.trim()) {
        return res.status(400).send({ message: "Invalid OTP" });
      }
      if (user.otpExpire < Date.now()) {
        return res.status(400).send({ message: "expired OTP" });
      }

      // Update the user's password and clear OTP fields
      user.password = password;
      user.resetOtp = null;
      user.resetOtpExpire = null;

      await user.save({ validate: true });

      // Exclude password from the response
      const updatedUser = await models.User.findByPk(user.id, {
        attributes: {
          exclude: ["password"],
        },
      });

      return res.status(200).json({
        success: true,
        message: `Password updated for ${updatedUser.email}`,
      });
    } catch (error) {
      return res.status(500).send(error.message);
    }
  };

  // send OTP
  sendOtp = async (req, res) => {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).send({ message: "Missing phone" });
    }

    if (!isValidPhone(phone)) {
      return res.status(400).send({ message: "Invalid phone" });
    }

    try {
      const user = await models.User.findOne({
        where: {
          phone: phone.trim(),
        },
      });

      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      const otp = generateOtp();
      user.otp = otp;
      user.otpExpire = Date.now() + 15 * 60 * 1000;

      await user.save({ validate: false });

      const message = `Your One Time Password (OTP) is ${otp}`;
      try {
        await sendEmail({
          email: user.email,
          subject: `One-Time Password (OTP) for Verification`,
          message,
        });

        res.status(200).json({
          success: true,
          message: `OTP sent to ${user.email} successfully`,
          email: user.email,
          userId: user.id,
        });
      } catch (emailError) {
        user.resetOtp = null;
        user.resetOtpExpire = null;
        await user.save({ validate: false });

        console.error("Failed to send OTP email:", emailError);
        return res.status(500).send(emailError.message);
      }
    } catch (error) {
      return res.status(500).send(error.message);
    }
  };

  // guest user
  guestUser = async (req, res) => {
    try {
      const obj = {
        type: "USER",
      };
  
      const guestToken = guestUserToken(obj);
      res.status(200).send({
        token: guestToken,
      });
    } catch (error) {
      res.status(500).send({
        message: error.message || "Some error occurred during signin.",
      });
    }
  };
}

module.exports = new UserController();
