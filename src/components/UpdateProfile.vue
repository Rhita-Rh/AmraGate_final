<template>
  <div class="user-profile">
    <div class="back-button-container">
      <router-link to="/Dashboard" class="back-button">
        <span class="back-icon">←</span>
        <span class="back-text">Back to Dashboard</span>
      </router-link>
    </div>
    
    <div class="profile-picture-section">
      <div class="avatar-container">
        <img 
          v-if="userData.photoURL" 
          :src="userData.photoURL" 
          alt="Profile Picture"
          class="profile-avatar"
        >
        <div v-else class="default-avatar">
          {{ userInitials }}
        </div>
      </div>
      <input 
        type="file" 
        id="avatar-upload" 
        accept="image/*" 
        @change="handleFileUpload"
        style="display: none"
      >
      <button 
        class="upload-btn"
        @click="triggerFileInput"
      >
        {{ userData.photoURL ? 'Change Photo' : 'Upload Photo' }}
      </button>
    </div>
    
    <form @submit.prevent="updateProfile" class="profile-form">
      <h2>Update Profile</h2>
      
      <div class="form-group">
        <label>Name:</label>
        <input v-model="userData.name" />
      </div>
      
      <div class="form-group">
        <label>Email:</label>
        <input v-model="userData.email" disabled />
      </div>

      <div class="form-group">
        <label>Phone:</label>
        <input v-model="userData.phone" />
      </div>
      
      <div class="form-group">
        <label>Bio:</label>
        <textarea v-model="userData.bio"></textarea>
      </div>
      
      <div class="form-actions">
        <button type="submit" class="save-btn">Save Changes</button>
        <button type="button" @click="$router.push('/Dashboard')" class="cancel-btn">Cancel</button>
      </div>
    </form>
  </div>
</template>

<script>
import { db, auth } from "../firebase-config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default {
  name: "UpdateProfile",
  data() {
    return {
      userData: {
        name: "",
        email: "",
        bio: "",
        phone: "",
        photoURL: ""
      }
    };
  },
  computed: {
    userInitials() {
      if (!this.userData.name) return '?';
      const names = this.userData.name.split(' ');
      return names.map(name => name[0]).join('').toUpperCase();
    }
  },
  created() {
    this.fetchUserData();
  },
  methods: {
    async fetchUserData() {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          this.userData = docSnap.data();
          if (!this.userData.email && user.email) {
            this.userData.email = user.email;
          }
        }
      }
    },
    async updateProfile() {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "users", user.uid);
        await updateDoc(docRef, this.userData);
        alert("Profile updated successfully!");
        this.$router.push("/Dashboard");
      }
    },
    triggerFileInput() {
      document.getElementById('avatar-upload').click();
    },
    async handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;
      
      try {
        const user = auth.currentUser;
        const storage = getStorage();
        const storageRef = ref(storage, `profile_pictures/${user.uid}`);
        
        await uploadBytes(storageRef, file);
        const photoURL = await getDownloadURL(storageRef);
        
        const docRef = doc(db, "users", user.uid);
        await updateDoc(docRef, { photoURL });
        
        this.userData.photoURL = photoURL;
      } catch (error) {
        console.error("Error uploading profile picture:", error);
        alert("Error uploading profile picture");
      }
    }
  }
};
</script>

<style scoped>
.user-profile {
  min-height: 100vh;
  padding: 20px;
  font-family: 'Quicksand', sans-serif;
  background: radial-gradient(circle at top left, #f3f8fd, #f8f0f8);
  animation: floatBg 10s infinite alternate;
  color: #4a4a4a;
  overflow-x: hidden;
}

@keyframes floatBg {
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
}

/* BACK BUTTON */
.back-button-container {
  margin-bottom: 20px;
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #ffffffcc;
  color: #4d5a6a;
  padding: 10px 20px;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 500;
  font-size: 15px;
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

.back-button:hover {
  background-color: #f5f8fd;
  transform: translateY(-1px);
}

.back-icon {
  font-size: 18px;
}

/* HEADINGS */
h2 {
  color: #7ba6dd;
  margin-bottom: 20px;
  font-size: 28px;
  text-align: center;
}

/* PROFILE PICTURE */
.profile-picture-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: 25px;
  margin-top: 20px;
  flex-wrap: wrap;
}

.avatar-container {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

.profile-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.default-avatar {
  font-size: 32px;
  font-weight: bold;
  color: #6b7c93;
}

.upload-btn {
  background: linear-gradient(135deg, #94e594, #9eeec2);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.upload-btn:hover {
  background: linear-gradient(135deg, #7bdd8a, #9eeec2);
  transform: translateY(-1px);
}

/* FORM STYLES */
.profile-form {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 25px;
  max-width: 600px;
  margin: 0 auto;
  box-shadow: 0 12px 20px rgba(148, 182, 229, 0.15);
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  font-weight: 600;
  color: #7ba6dd;
  display: block;
  margin-bottom: 8px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #d0d6e2;
  border-radius: 10px;
  background-color: #f9fafd;
  font-size: 15px;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: #7ba6dd;
  outline: none;
  box-shadow: 0 0 0 2px rgba(123, 166, 221, 0.2);
}

.form-group textarea {
  height: 120px;
  resize: vertical;
}

.form-group input[disabled] {
  background-color: #f0f0f0;
  cursor: not-allowed;
}

/* FORM BUTTONS */
.form-actions {
  display: flex;
  gap: 15px;
  margin-top: 25px;
}

.save-btn {
  background: linear-gradient(135deg, #94e594, #9eeec2);
  color: white;
  border: none;
  border-radius: 10px;
  padding: 12px 20px;
  cursor: pointer;
  flex: 1;
  font-weight: 600;
  transition: all 0.3s ease;
}

.save-btn:hover {
  background: linear-gradient(135deg, #7bdd8a, #9eeec2);
  transform: translateY(-1px);
}

.cancel-btn {
  background: linear-gradient(135deg, #e48a8a, #f2b6b6);
  color: white;
  border: none;
  border-radius: 10px;
  padding: 12px 20px;
  cursor: pointer;
  flex: 1;
  font-weight: 600;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  background: linear-gradient(135deg, #db7979, #e9a0a0);
  transform: translateY(-1px);
}

/* RESPONSIVE DESIGN */
@media (max-width: 768px) {
  .profile-form {
    padding: 20px;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .profile-picture-section {
    flex-direction: column;
    text-align: center;
  }
}
</style>