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
.bigbro {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #fdf6f0; /* soft cream */
}

.page-container {
  width: 100%;
  max-width: 400px;
}
.google-signin {
  margin-bottom: 10px;
  font-size: 14px;
  color: #7d5a44;
}
.flexy {
  display: flex;
  justify-content: center;
  align-items: center;
}
.clickable-icon {
  cursor: pointer;
  vertical-align: middle;
  margin-left: 10px;
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

.signup-prompt {
  margin-top: 15px;
  text-align: center;
}

.signup-text {
  font-size: 14px;
  color: #7d5a44; /* medium soft brown */
}

.signup-link {
  margin-left: 5px;
  color: #ba6c4f; /* soft reddish-brown */
  text-decoration: none;
}

.signup-link:hover {
  text-decoration: underline;
}

.forgot-password {
  display: block;
  text-align: center;
  margin-top: 12px;
  font-size: 14px;
  color: #b2765e; /* dusty rose */
  text-decoration: none;
}

.forgot-password:hover {
  text-decoration: underline;
}
</style>
