<template>
    <div class="forgot-password">
      <h2>Reset Your Password</h2>
      <form @submit.prevent="resetPassword">
        <label for="email">Enter your email address:</label>
        <input type="email" v-model="email" id="email" required placeholder="Your email" />
        <button type="submit">Submit</button>
      </form>
    </div>
  </template>
  
  <script>
  import { auth, sendPasswordResetEmail } from '../firebase-config';
  export default {
  name: 'ForgotPassword',
  data() {
    return {
      email: ''
    };
  },
  methods: {
    async resetPassword() {
      if (this.email) {
        try {
          await sendPasswordResetEmail(auth, this.email);
          alert('Password reset email sent');
          this.$router.push('/');
        } catch (error) {
          console.error('Error resetting password:', error.message);

          if (error.code === 'auth/invalid-email') {
            alert('The email address is not valid.');
          } else if (error.code === 'auth/user-not-found') {
            alert('No user found with this email address.');
          } else {
            alert('Error resetting password: ' + error.message);
          }
        }
      } else {
        alert('Please enter an email address');
      }
    }
  }
};
  </script>
  
  <style scoped>
  .forgot-password {
    padding: 20px;
    background-color: #f5f5f5;
    border-radius: 8px;
    max-width: 400px;
    margin: auto;
  }
  
  .forgot-password h2 {
    text-align: center;
    margin-bottom: 20px;
  }
  
  .forgot-password form {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  .forgot-password input {
    padding: 10px;
    font-size: 16px;
    border-radius: 6px;
    border: 1px solid #ccc;
  }
  
  .forgot-password button {
    padding: 10px;
    font-size: 16px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
  }
  
  .forgot-password button:hover {
    background-color: #0056b3;
  }
  </style>
  