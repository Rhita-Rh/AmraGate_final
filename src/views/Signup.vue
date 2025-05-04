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
                <input type="text" v-model="name" required placeholder="enter your name..." />
              </div>

              <div class="form-group">
                <label>USERNAME</label>
                <input type="text" v-model="username" required placeholder="enter your username.." />
              </div>

              <div class="form-group">
                <label>PASSWORD</label>
                <input type="password" v-model="password" required minlength="8" placeholder="enter your password.." />
              </div>

              <div class="form-group">
                <label>EMAIL</label>
                <input type="email" v-model="email" required placeholder="enter your email..." />
              </div>

              <div class="form-group">
                <label>PHONE NUMBER (Optional)</label>
                <input type="tel" v-model="phone" placeholder="Enter your phone number" />
              </div>

              <div class="form-group">
                <label>PROFILE PICTURE (Optional)</label>
                <input type="file" id="file-input" @change="handleFileUpload" class="file-input" />
                <label for="file-input" class="custom-file-input">Choose file</label>
                <div v-if="previewImage">
                  <img :src="previewImage" alt="Preview" width="100" style="margin-top: 10px; border-radius: 8px;" />
                </div>
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
        <RouterLink to="/" style="color: #4450a0;">Sign in</RouterLink>
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
    RouterLink,
  },
  data() {
    return {
      name: "",
      username: "",
      email: "",
      password: "",
      phone: "",
      agreeToTerms: false,
      photo: null,
      previewImage: null,
    };
  },
  methods: {
    validateForm() {
      if (!this.name || !this.username || !this.email || !this.password) {
        alert("Please fill in all required fields");
        return false;
      }
      if (!this.agreeToTerms) {
        alert("You must agree to the terms and conditions.");
        return false;
      }
      return true;
    },

    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.photo = file;
        this.previewImage = URL.createObjectURL(file);
      }
    },

    async uploadImage(file) {
      const url = "https://api.cloudinary.com/v1_1/dgcpm3hlg/image/upload";
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "unsigned"); // Replace with your actual preset

      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Cloudinary error response:", errorText);
        throw new Error("Image upload failed");
      }

      const data = await response.json();
      return data.secure_url;
    },

    async submitForm() {
      if (!this.validateForm()) return;

      try {
        const user = await registerWithEmailAndPassword(
          this.email,
          this.password,
          this.username
        );

        let photoURL = "";

        if (this.photo) {
          photoURL = await this.uploadImage(this.photo);
        }

        const userData = {
          name: this.name,
          username: this.username,
          email: this.email,
          phone: this.phone,
          bio: "",
          followers: [],
          following: [],
          createdAt: new Date(),
          photoURL: photoURL,
        };

        await setDoc(doc(db, "users", user.uid), userData);

        alert("Registration successful!");
        this.$router.push("/signin");
      } catch (error) {
        alert("Registration failed: " + error.message);
      }
    },
  },
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
  color: #7ba6dd;
  font-weight: 600;
  font-size: 14px;
  display: block;
  margin-bottom: 6px;
}

input[type="text"],
input[type="email"],
input[type="password"],
input[type="tel"] {
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

/* File Input */
.file-input {
  display: none;
}

.custom-file-input {
  padding: 12px 24px;
  background: linear-gradient(135deg, #94e594, #9eeec2);
  color: white;
  border-radius: 10px;
  width: 35%;
  height: 20px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.custom-file-input:hover {
  background: linear-gradient(135deg, #7bdd8a, #9eeec2);
  transform: translateY(-2px);
}

/* Terms Checkbox */
.terms {
  display: flex;
  align-items: center;
  margin: 18px 0;
  font-size: 13px;
  color: #4d5a6a;
}

.terms input[type="checkbox"] {
  margin-right: 8px;
  accent-color: #7ba6dd;
}

.terms span {
  font-weight: bold;
  color: #7ba6dd;
  cursor: pointer;
  text-decoration: underline;
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
  
  input[type="text"],
  input[type="email"],
  input[type="password"],
  input[type="tel"] {
    width: 100%;
  }
  
  .custom-file-input {
    width: 100%;
    margin-top: 10px;
  }
}
</style>
