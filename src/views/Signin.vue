<template>
  <div class="bigbro">
    <div class="page-container">
      <div class="flexy">
        <div class="form-container">
          <form @submit.prevent="loginUser" class="form">
            <div class="title">
              <h1>Log-in</h1>
            </div>
            <div class="form-group">
              <label>EMAIL</label>
              <input type="email" v-model="email" required />
            </div>
            <div class="form-group">
              <label>PASSWORD</label>
              <input type="password" v-model="password" required />
            </div>
            <button type="submit">SIGN IN</button>
            <div class="signup-prompt">
              <p class="signup-text">
                Create an account
                <router-link to="/signup" class="signup-link">Sign up</router-link>
              </p>
            </div>
            <router-link to="/Forgot" class="forgot-password">Forgot Password?</router-link>
            <br>
            <div class="google-signin">
              Sign up with :
              <img
                src="/google.jpeg"
                width="40"
                height="40"
                alt="Sign in with Google"
                @click="mysignInWithGoogle"
                class="clickable-icon"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { loginWithEmailAndPassword, signInWithGoogle } from "../firebase-config";

export default {
  name: 'Signin',
  data() {
    return {
      email: '',
      password: '',
    };
  },
  methods: {
    async loginUser() {
      try {
        await loginWithEmailAndPassword(this.email, this.password);
        this.$router.push("/Home");
      } catch (error) {
        console.error('Login error:', error);
        if (error.code === "auth/wrong-password") {
          alert("Wrong password. Redirecting to reset page...");
          this.$router.push("/Forgot");
        } else if (error.code === "auth/user-not-found") {
          alert("User not found.");
        } else {
          alert("Error: " + error.message);
        }
      }
    },
    async mysignInWithGoogle() {
        try {
          const result = await signInWithGoogle();
          console.log("Google Sign-in successful:", result);
          this.$router.push("/Home"); // or wherever you want to go
        } catch (error) {
          console.error("Google Sign-in error:", error);
          alert("Google Sign-in failed: " + error.message);
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
  font-family: 'Quicksand', sans-serif;
  background: radial-gradient(circle at top left, #f3f8fd, #f8f0f8);
  animation: floatBg 10s infinite alternate;
  color: #4a4a4a;
}

@keyframes floatBg {
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
}

/* Card Container */
.page-container {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 12px 30px rgba(148, 182, 229, 0.15);
  padding: 40px 30px;
  max-width: 420px;
  width: 90%;
  transition: transform 0.4s ease;
}

.page-container:hover {
  transform: translateY(-5px);
}

/* Title */
.title h1 {
  text-align: center;
  background: linear-gradient(to right, #7ba6dd, #94b6e7);
  background: linear-gradient(135deg, #7ba6dd 0%, #94b6e7 50%, #7ba6dd 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  font-size: 2.4em;
  letter-spacing: 1px;
  margin-bottom: 25px;
}

/* Input Fields */
.form-group {
  margin-bottom: 18px;
}

label {
  color: #7ba6dd;
  font-weight: 600;
  font-size: 14px;
  display: block;
  margin-bottom: 6px;
}

input[type="email"],
input[type="password"] {
  width: 95%;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1.5px solid #d0d6e2;
  background-color: #f9fafd;
  font-size: 15px;
  transition: all 0.3s ease;
}

input:focus {
  border-color: #7ba6dd;
  box-shadow: 0 0 0 3px rgba(123, 166, 221, 0.2);
  outline: none;
}

/* Submit Button */
button[type="submit"] {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #94e594, #9eeec2);
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 10px;
  box-shadow: 0 4px 15px rgba(148, 182, 229, 0.2);
  transition: all 0.3s ease;
}

button[type="submit"]:hover {
  background: linear-gradient(135deg, #7bdd8a, #9eeec2);
  transform: translateY(-2px);
}

/* Links and Prompts */
.signup-prompt {
  text-align: center;
  margin-top: 18px;
  font-size: 14px;
}

.signup-text {
  color: #4d5a6a;
}

.signup-link {
  color: #7ba6dd;
  text-decoration: none;
  font-weight: bold;
  margin-left: 5px;
  transition: color 0.2s;
}

.signup-link:hover {
  color: #94b6e7;
}

.forgot-password {
  display: block;
  text-align: center;
  margin-top: 12px;
  font-size: 13px;
  color: #7ba6dd;
  text-decoration: underline dashed;
  transition: text-decoration 0.2s;
}

.forgot-password:hover {
  text-decoration: underline solid;
}

/* Google Sign-in */
.google-signin {
  margin-top: 20px;
  text-align: center;
}

.google-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 24px;
  background: white;
  border: 1px solid #d0d6e2;
  border-radius: 12px;
  color: #4d5a6a;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.google-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #7ba6dd;
}

.google-icon {
  width: 20px;
  height: 20px;
}

@media (max-width: 480px) {
  .page-container {
    padding: 30px 20px;
  }
  
  .title h1 {
    font-size: 2rem;
  }
  
  input[type="email"],
  input[type="password"] {
    width: 100%;
  }
}
</style>
