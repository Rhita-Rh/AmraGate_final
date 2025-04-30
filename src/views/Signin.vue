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
        this.$router.push("/Dashboard");
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
  background: radial-gradient(circle at top left, #d0f8ce, #fce4ec);
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
  background: linear-gradient(145deg, #ffffff, #f8fff4);
  border-radius: 20px;
  box-shadow: 0 12px 30px rgba(120, 190, 90, 0.2);
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
  color: #43a047;
  font-size: 2.2em;
  letter-spacing: 1px;
  margin-bottom: 25px;
}

/* Input Fields */
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

input[type="email"],
input[type="password"] {
  width: 90%;
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
  color: #97ff80;
  text-decoration: none;
  font-weight: bold;
  margin-left: 5px;
  transition: color 0.2s;
}

.signup-link:hover {
  color: #d32f2f;
}

.forgot-password {
  display: block;
  text-align: center;
  margin-top: 12px;
  font-size: 13px;
  color: #789262;
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
}

.clickable-icon {
  margin-left: 10px;
  vertical-align: middle;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: transform 0.3s ease;
}

.clickable-icon:hover {
  transform: rotate(-5deg) scale(1.1);
}
</style>
