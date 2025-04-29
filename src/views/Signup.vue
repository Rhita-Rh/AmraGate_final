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
                  <input type="text" v-model="name" required />
                </div>
  
                <div class="form-group">
                  <label>USERNAME</label>
                  <input type="text" v-model="username" required />
                </div>
  
                <div class="form-group">
                  <label>PASSWORD</label>
                  <input type="password" v-model="password" required minlength="8" />
                </div>
  
                <div class="form-group">
                  <label>EMAIL</label>
                  <input type="email" v-model="email" required />
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
          agreeToTerms: false
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
        
        async submitForm() {
          if (!this.validateForm()) return;
  
          try {
            // Create user in Firebase Auth
            const user = await registerWithEmailAndPassword(this.email, this.password,this.username);
  
            // Create Firestore user document
            await setDoc(doc(db, "users", user.uid), {
              name: this.name,
              username: this.username,
              email: this.email,
              bio:"",
              competences:[],
              goals:[],
              createdAt: new Date(),
            });
  
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
  .bigbro {
    display: flex;
    justify-content: center;     
    align-items: center;         
    min-height: 100vh;
    background-color: #fdf6f0; 
  }
  
  .page-container {
    width: 100%;
    max-width: 400px;
  }
  
  .flexy {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .form-container {
    background-color: #fffaf5; /* very light peach */
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(202, 164, 114, 0.2); /* soft golden-brown shadow */
    width: 100%;
  }
  
  .title h1 {
    margin-bottom: 20px;
    text-align: center;
    font-size: 28px;
    color: #8b5e3c; /* rich chestnut brown */
    font-family: 'Georgia', serif;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 6px;
    font-weight: bold;
    color: #9a6d45; /* warm brown */
  }
  
  .form-group input {
    width: 95%;
    padding: 10px 14px;
    border: 1px solid #d4b197; /* soft tan */
    border-radius: 6px;
    font-size: 16px;
    background-color: #fffefc; /* almost white */
    color: #5a3d2b; /* darker text */
  }
  
  button[type="submit"] {
    width: 100%;
    background-color: #e8a87c; /* warm muted orange */
    color: white;
    padding: 12px;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    margin-top: 10px;
    transition: background-color 0.3s;
  }
  
  button[type="submit"]:hover {
    background-color: #d08b66; /* slightly deeper orange */
  }
  
  .login-prompt {
    margin-top: 15px;
    text-align: center;
  }
  
  .login-text {
    font-size: 14px;
    color: #7d5a44; /* medium soft brown */
  }
  
  .login-link {
    margin-left: 5px;
    color: #ba6c4f; /* soft reddish-brown */
    text-decoration: none;
  }
  
  .login-link:hover {
    text-decoration: underline;
  }
  
  .column-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;        
    width: 100%;
    max-width: 400px;           
    padding: 20px 0;           
  }
  
  .bottom-section {
    text-align: center;
    margin-bottom: 20px;
  }
  
  </style>
  