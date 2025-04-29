<template>
  <div class="bigbro">
    <div class="column-wrapper">
      <div class="page-container">
        <div class="flexy">
          <div class="form-container">
            <form @submit.prevent="submitForm" class="form">
              <div class="title">
                <h1>Sign up</h1>
              </div>

              <div class="form-group">
                <label>NAME</label>
                <input type="text" v-model="name" required placeholder="enter your name..."/>
              </div>

              <div class="form-group">
                <label>USERNAME</label>
                <input type="text" v-model="username" required placeholder="enter your username.."/>
              </div>

              <div class="form-group">
                <label>PASSWORD</label>
                <input type="password" v-model="password" required minlength="8" placeholder="enter your password.."/>
              </div>

              <div class="form-group">
                <label>EMAIL</label>
                <input type="email" v-model="email" required placeholder="enter your email..." />
              </div>

              <div class="form-group">
                <label>PHONE NUMBER (Optional)</label>
                <input type="tel" v-model="phoneNumber" placeholder="Enter your phone number" />
              </div>

              <div class="form-group">
                <label>PROFILE PICTURE (Optional)</label>
                <input type="file" @change="handleFileUpload" />
              </div>

              <div class="terms">
                <input type="checkbox" v-model="agreeToTerms" required />
                <label>I read and agree to <span>Terms & Conditions</span></label>
              </div>

              <button type="submit">CREATE MY ACCOUNT</button>
            </form>
          </div>
        </div>
      </div>
      <div class="login-prompt">
        Already have an account?
        <RouterLink to="/" style="color: #8b5e3c;">Sign in</RouterLink>
      </div>
    </div>
  </div>
</template>

  
<script>
import { registerWithEmailAndPassword, db } from "../firebase-config";
import { doc, setDoc } from "firebase/firestore";
import { RouterLink } from "vue-router";

export default {
  name: "Signup",
  components: {
    RouterLink
  },
  data() {
    return {
      name: "",
      username: "",
      email: "",
      password: "",
      phoneNumber: "", // Added phone number
      agreeToTerms: false,
      photo: null, // Added photo for profile picture
    };
  },
  methods: {
    validateForm() {
      if (!this.name || !this.username || !this.email || !this.password) {
        alert('Please fill in all required fields');
        return false;
      }
      if (!this.agreeToTerms) {
        alert('You must agree to the terms and conditions.');
        return false;
      }
      return true;
    },

    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.photo = file;
      }
    },

    async submitForm() {
      if (!this.validateForm()) return;

      try {
        // Create user in Firebase Auth
        const user = await registerWithEmailAndPassword(this.email, this.password, this.username);

        // Prepare user data for Firestore
        const userData = {
          name: this.name,
          username: this.username,
          email: this.email,
          phoneNumber: this.phoneNumber, // Add phone number
          bio: "",
          createdAt: new Date(),
        };

        // If the user uploaded a photo, include it (you'll need to handle storage separately if needed)
        if (this.photo) {
          // For example, upload the photo to Firebase Storage and get the URL
          // You can implement Firebase Storage upload logic here if needed
          const photoURL = await uploadPhoto(this.photo);
          userData.photoURL = photoURL;
        }

        // Create Firestore user document
        await setDoc(doc(db, "users", user.uid), userData);

        alert('Registration successful!');
        this.$router.push('/');

      } catch (error) {
        alert('Registration failed: ' + error.message);
      }
    }
  }
};
</script>

  <style scoped>
  /* Background Styling */
  .bigbro {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: radial-gradient(circle at bottom right, #e8f5e9, #fff3f3);
    font-family: 'Quicksand', sans-serif;
  }
  
  /* Column Wrapper Layout */
  .column-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }
  
  /* Card Container */
  .page-container {
    background: linear-gradient(145deg, #ffffff, #f4fff9);
    border-radius: 20px;
    box-shadow: 0 12px 30px rgba(120, 190, 90, 0.2);
    padding: 35px 30px;
    max-width: 500px;
    width: 90%;
    transition: transform 0.4s ease;
    margin:50px;
  }
  
  .page-container:hover {
    transform: translateY(-4px);
  }
  
  /* Title */
  .title h1 {
    text-align: center;
    color: #43a047;
    font-size: 2.2em;
    margin-bottom: 25px;
    letter-spacing: 1px;
  }
  
  /* Inputs and Labels */
  .form-group {
    margin-bottom: 18px;
  }
  
  label {
    color: #558b2f;
    font-weight: 600;
    font-size: 14px;
    display: block;
    margin-bottom: 6px;
  }
  
  input[type="text"],
  input[type="email"],
  input[type="password"] ,
  input[type="tel"]{
    width: 95%;
    padding: 12px 14px;
    border-radius: 10px;
    border: 1.5px solid #aed581;
    background-color: #f9fff8;
    font-size: 15px;
    transition: all 0.3s ease;
  }
  
  input:focus {
    border-color: #66bb6a;
    box-shadow: 0 0 0 3px rgba(102, 187, 106, 0.2);
    outline: none;
  }
  
  /* Terms Checkbox */
  .terms {
    display: flex;
    align-items: center;
    margin-bottom: 18px;
    font-size: 13px;
    color: #4e4e4e;
  }
  .terms input[type="checkbox"] {
    margin-right: 8px;
  }
  
  .terms span {
    font-weight: bold;
    color: #ff7043;
    cursor: pointer;
  }
  
  /* Submit Button */
  button[type="submit"] {
    width: 100%;
    padding: 14px;
    background: linear-gradient(135deg, #66bb6a, #a5d6a7);
    color: white;
    font-weight: bold;
    border: none;
    border-radius: 12px;
    font-size: 16px;
    cursor: pointer;
    margin-top: 10px;
    box-shadow: 0 4px 12px rgba(102, 187, 106, 0.4);
    transition: all 0.3s ease;
  }
  
  button[type="submit"]:hover {
    background: linear-gradient(135deg, #388e3c, #81c784);
    transform: translateY(-2px);
  }
  
  /* Sign-in Link Prompt */
  .login-prompt {
    margin-top: 20px;
    font-size: 14px;
    color: #6e6e6e;
    text-align: center;
  }
  
  .login-prompt a {
    font-weight: bold;
    margin-left: 5px;
    text-decoration: none;
    transition: color 0.2s ease;
  }
  
  .login-prompt a:hover {
    color: #0cbf12;
  }
  </style>
  