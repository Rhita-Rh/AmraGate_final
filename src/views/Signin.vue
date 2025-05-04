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
  background: #e3f0fc;
  font-family: 'Quicksand', sans-serif;
  overflow: hidden;
  animation: floatBg 10s infinite alternate;
}

@keyframes floatBg {
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
}

/* Card Container */
.page-container {
  background: #f2f2f6;
  border-radius: 18px;
  box-shadow: 0 12px 30px rgba(120, 190, 90, 0.1);
  padding: 40px 30px;
  max-width: 420px;
  width: 90%;
  border: 1px solid #cbd9e3;
  transition: transform 0.4s ease;
}

.page-container:hover {
  transform: translateY(-5px);
}

/* Title */
.title h1 {
  text-align: center;
  background: linear-gradient(to right, #0288d1, #4fc3f7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 2.4em;
  letter-spacing: 1px;
  margin-bottom: 25px;
}

/* Input Fields */
.form-group {
  margin-bottom: 18px;
}

label {
  color: #0288d1;
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
  border: 1.5px solid #81d4fa;
  background-color: #e3f2fd;
  font-size: 15px;
  transition: all 0.3s ease;
}

input:focus {
  border-color: #4fc3f7;
  box-shadow: 0 0 0 3px rgba(79, 195, 247, 0.25);
  outline: none;
}

/* Submit Button */
button[type="submit"] {
  width: 100%;
  padding: 14px;
  background: linear-gradient(to right, #2563eb, #60a0d4);
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 10px;
  box-shadow: 0 4px 15px rgba(79, 195, 247, 0.4);
  transition: all 0.3s ease;
}

button[type="submit"]:hover {
  background: linear-gradient(to right, #294c99, #4a7faa);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(28, 137, 218, 0.5);
}

/* Links and Prompts */
.signup-prompt {
  text-align: center;
  margin-top: 18px;
  font-size: 14px;
}

.signup-text {
  color: #4e4e4e;
}

.signup-link {
  color: #0288d1;
  text-decoration: none;
  font-weight: bold;
  margin-left: 5px;
  transition: color 0.2s;
}

.signup-link:hover {
  color: #0288d1;
}

.forgot-password {
  display: block;
  text-align: center;
  margin-top: 12px;
  font-size: 13px;
  color: #0288d1;
  text-decoration: underline dashed;
  transition: text-decoration 0.2s;
}

.forgot-password:hover {
  text-decoration: underline solid;
}

/* Google Sign-in */
.google-signin {
  margin-top: 25px;
  text-align: center;
  font-size: 14px;
  color: #616161;
  font-weight: 500;
}

.clickable-icon {
  margin-left: 10px;
  vertical-align: middle;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.clickable-icon:hover {
  transform: rotate(-5deg) scale(1.1);
  box-shadow: 0 5px 12px rgba(66, 133, 244, 0.5);
}
</style>
