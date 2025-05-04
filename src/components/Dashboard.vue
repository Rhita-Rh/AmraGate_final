<template>
  <div class="user-profile">
    <div class="back-button-container">
      <router-link to="/Home" class="back-button">
        <span class="back-icon">←</span>
        <span class="back-text">Back to Home</span>
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
          <div style="font-size: 25px">
            <p>{{ userData.name }}</p>
          </div>
        </div>
    <div class="profile-container">
      <div class="profile-section">
        <h2>My Dashboard</h2>

        <div class="navigation-links">
          <router-link to="/my-projects">
            <button class="follow-btn">My Projects</button>
          </router-link>
          <router-link to="/UpdateProfile">
            <button class="follow-btn">Update Profile</button>
          </router-link>
          <router-link to="/mycomp">
            <button class="follow-btn">My competences</button>
          </router-link>

          <router-link to="/followers">
            <button class="follow-btn">My followers</button> 
          </router-link>
          <router-link to="/following">
            <button class="follow-btn">Following</button> 
          </router-link>
        </div>
        
        <div class="user-info">
          <h3>Personal Information</h3>
          <div class="info-item">
            <span class="info-label">Name:</span>
            <span class="info-value">{{ userData.name }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Email:</span>
            <span class="info-value">{{ userData.email }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Bio:</span>
            <span class="info-value">{{ userData.bio }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Phone:</span>
            <span class="info-value">{{ userData.phone }}</span>
          </div>
        </div>

        <!-- Starred Projects Section -->
        <div class="starred-projects-section">
          <h3>Starred Projects</h3>
          <div v-if="starredProjects.length > 0">
            <div
              v-for="project in starredProjects"
              :key="project.id"
              class="project-card"
            >
              <div class="info-item">
                <span class="info-label">Project:</span>
                <span class="info-value">{{ project.title }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Description:</span>
                <span class="info-value">{{ project.description }}</span>
              </div>
              <button @click="unstarProject(project.id)" class="unstar-btn">Unstar</button>
              <router-link :to="`/project/${project.id}`" class="details-btn">View Details</router-link>
            </div>
          </div>
          <div v-else>
            <p>No starred projects.</p>
          </div>
        </div>

        <div class="goals-section">
          <h3>My Goals</h3>
          <div v-if="userData.goals && userData.goals.length">
            <div
              v-for="(goal, index) in userData.goals"
              :key="index"
              class="goal-card"
            >
              <div class="info-item">
                <span class="info-label">Goal:</span>
                <span class="info-value">{{ goal.obj }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Status:</span>
                <span class="info-value">{{ goal.status }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Progress:</span>
                <span class="info-value">{{ goal.suivi }}</span>
              </div>

              <router-link :to="{ name: 'Edit_goal', params: { index } }">
                <button class="follow-btn">Edit</button>
              </router-link>
              <button @click="deletegoal(index)" class="cancel-btn">Delete</button>
            </div>
            <div v-if="!showAddGoalForm">
              <button @click="set_true" class="add-btn">Add a New Goal</button>
            </div>
          </div>
          <div v-else>
            <p>No goals listed.</p>
            <button @click="set_true" class="add-btn">Add a New Goal</button>
          </div>
          
          <!-- Add new goal form -->
          <div v-if="showAddGoalForm" class="add-goal-form" ref="down">
            <h3>Add a New Goal</h3>
            <form @submit.prevent="addGoal">
              <div class="form-group">
                <label>Objective:</label>
                <input type="text" v-model="newGoal.obj" placeholder="Goal objective" required>
              </div>
              <div class="form-group">
                <label>Status:</label>
                <select v-model="newGoal.status" required>
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div class="form-group">
                <label>Progress:</label>
                <input type="text" v-model="newGoal.suivi" placeholder="My progression" required>
              </div>
              <div class="form-actions">
                <button type="submit" class="save-btn">Save Goal</button>
                <button @click="set_false" type="button" class="delete-btn">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div class="charts-section">
        <div class="chart-container">
          <nbre_competences_mois />
        </div>
        <div class="chart-container">
          <projet_realis/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db, auth } from "../firebase-config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Edit_goal from "../components/Edit_goal.vue";
import Edit_comp from "../components/Edit_comp.vue";
import nbre_competences_mois from "./nbre_competences_mois.vue";
import projet_realis from "./projet_realis.vue";
import { nextTick } from "vue";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, getDocs, deleteDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default {
  props: {
    goals: Array,
    userId: String,
  },
  components: {
    Edit_goal,
    Edit_comp,
    nbre_competences_mois,
    projet_realis
  },
  data() {
    return {
      currentUserId: auth.currentUser?.uid || "",
      userData: {
        name: "",
        email: "",
        bio: "",
        phone: "",
        goals: [],
        competences: [],
      },
      starredProjects: [],
      showAddGoalForm: false,
      newGoal: {
        obj: "",
        status: "",
        suivi: ""
      },
      goalEditVisible: []
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
    this.fetchStarredProjects();
  },
  methods: {
    async fetchUserData() {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          this.userData = data;
          this.competences = data.competences || [];
          this.goalEditVisible = (data.goals || []).map(() => false);
        }
      }
    },
    async fetchStarredProjects() {
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (user) {
        try {
          // Get starred projects for current user
          const starredQuery = collection(db, 'starred');
          const starredSnapshot = await getDocs(starredQuery);
          const starredProjectIds = starredSnapshot.docs
            .filter(doc => doc.data().userId === user.uid)
            .map(doc => doc.data().projectId);

          // Get project details for each starred project
          const projectsCollection = collection(db, 'projects');
          const projectsSnapshot = await getDocs(projectsCollection);
          this.starredProjects = projectsSnapshot.docs
            .filter(doc => starredProjectIds.includes(doc.id))
            .map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
        } catch (error) {
          console.error('Error fetching starred projects:', error);
        }
      }
    },
    async unstarProject(projectId) {
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (user) {
        try {
          const starredRef = collection(db, 'starred');
          const starDoc = doc(starredRef, `${user.uid}_${projectId}`);
          await deleteDoc(starDoc);
          
          // Update local state
          this.starredProjects = this.starredProjects.filter(project => project.id !== projectId);
        } catch (error) {
          console.error('Error unstarring project:', error);
        }
      }
    },
    set_true() {
      this.showAddGoalForm = true;
      nextTick(() => {
        this.$refs.down?.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      });
    },
    set_false() {
      this.showAddGoalForm = false;
    },
    async updateProfile() {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "users", user.uid);
        await updateDoc(docRef, this.userData);
        alert("Updated Profile");
        this.$router.push("/Home");
      }
    },
    async deleteCompetence(index) {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const competences = this.userData.competences || [];
        competences.splice(index, 1);
        await updateDoc(docRef, { competences });
        this.userData.competences = competences;
      }
    },
    async addGoal() {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const goals = this.userData.goals || [];

        goals.push({
          obj: this.newGoal.obj,
          status: this.newGoal.status,
          suivi: this.newGoal.suivi
        });
        await updateDoc(docRef, { goals });

        this.userData.goals = goals;
        this.newGoal = { obj: "", status: "", suivi: "" };
        this.showAddGoalForm = false;

        alert("New goal added!");
      }
    },
    async deletegoal(index) {
      if(confirm("Do you want to delete this goal?")){
        const user = auth.currentUser;
        if (user) {
          const docRef = doc(db, "users", user.uid);
          const goals = this.userData.goals || [];
          goals.splice(index, 1);
          await updateDoc(docRef, { goals });
          this.userData.goals = goals;
        }
          alert("Goal deleted!");
      }
      
    },
    updateGoalLocally(updatedGoal, goalIndex) {
      this.userData.goals[goalIndex] = updatedGoal;
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
        
        // Upload the file
        await uploadBytes(storageRef, file);
        
        // Get download URL
        const photoURL = await getDownloadURL(storageRef);
        
        // Update user profile in Firestore
        const docRef = doc(db, "users", user.uid);
        await updateDoc(docRef, { photoURL });
        
        // Update local data
        this.userData.photoURL = photoURL;
        
      } catch (error) {
        console.error("Error uploading profile picture:", error);
        alert("Error uploading profile picture");
      }
    },
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

.profile-container {
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  gap: 30px;
  flex-wrap: wrap;
}

.profile-section {
  flex: 1;
  max-width: 700px;
}

.charts-section {
  width: 450px;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.chart-container {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 12px 30px rgba(148, 182, 229, 0.15);
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
}

h3 {
  color: #4d5a6a;
  margin: 25px 0 15px;
  font-size: 20px;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 8px;
}

/* NAVIGATION BUTTONS */
.navigation-links {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  margin-bottom: 30px;
}

.navigation-links button {
  background: linear-gradient(135deg, #94e594, #9eeec2);
  color: white;
  border: none;
  border-radius: 10px;
  padding: 10px 18px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.navigation-links button:hover {
  background: linear-gradient(135deg, #7bdd8a, #9eeec2);
  transform: translateY(-2px);
}

/* PROFILE INFO */
.user-info {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 25px;
  margin-bottom: 25px;
  box-shadow: 0 12px 20px rgba(148, 182, 229, 0.15);
}

.info-item {
  display: flex;
  margin-bottom: 15px;
  align-items: center;
}

.info-label {
  font-weight: 600;
  width: 100px;
  color: #7ba6dd;
}

.info-value {
  flex: 1;
  padding: 8px 12px;
  background: #f5f8fd;
  border-radius: 6px;
}

/* PROFILE PICTURE */
.profile-picture-section {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 25px;
  margin-top: 20px;
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
}

/* GOALS & FORMS */
.goal-card,
.add-goal-form {
  background: white;
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 15px;
  box-shadow: 0 6px 12px rgba(148, 182, 229, 0.12);
}

.form-group {
  margin-bottom: 18px;
}

.form-group label {
  font-weight: 500;
  color: #4a4a4a;
  display: block;
  margin-bottom: 6px;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #d0d6e2;
  border-radius: 10px;
  background-color: #f9fafd;
  font-size: 15px;
}

.form-actions {
  display: flex;
  gap: 15px;
}

.save-btn,
.add-btn {
  background: linear-gradient(135deg, #94e594, #9eeec2);
  color: white;
  border: none;
  border-radius: 10px;
  padding: 12px 20px;
  cursor: pointer;
  flex: 1;
  transition: all 0.3s ease;
}

.save-btn:hover,
.add-btn:hover {
  background: linear-gradient(135deg, #7bdd8a, #9eeec2);
}

/* EDIT BUTTON */
.follow-btn {
  background: linear-gradient(135deg, #94e594, #9eeec2);
  color: white;
  border: none;
  border-radius: 10px;
  padding: 10px 18px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
}

.follow-btn:hover {
  background: linear-gradient(135deg, #7bdd8a, #9eeec2);
  transform: translateY(-2px);
}

/* DELETE BUTTON */
.cancel-btn,
.delete-btn {
  background: linear-gradient(135deg, #e48a8a, #f2b6b6);
  color: white;
  border: none;
  border-radius: 10px;
  padding: 10px 18px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
}

.cancel-btn:hover,
.delete-btn:hover {
  background: linear-gradient(135deg, #db7979, #e9a0a0);
  transform: translateY(-2px);
}


/* STARRED PROJECTS */
.starred-projects-section {
  margin-top: 2rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  box-shadow: 0 6px 12px rgba(148, 182, 229, 0.15);
}

.project-card {
  background: #f5f8fd;
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid #e0e8f5;
}

.unstar-btn {
  background: linear-gradient(135deg, #e48a8a, #f2b6b6);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  cursor: pointer;
  margin-top: 10px;
  transition: all 0.3s ease;
}

.unstar-btn:hover {
  background: linear-gradient(135deg, #db7979, #e9a0a0);
}

.details-btn {
  background: linear-gradient(135deg, #94e594, #9eeec2);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  cursor: pointer;
  margin-left: 10px;
  margin-top: 10px;
  text-decoration: none;
  transition: all 0.3s ease;
}

.details-btn:hover {
  background: linear-gradient(135deg, #7bdd8a, #9eeec2);
}

/* MEDIA QUERY */
@media (max-width: 992px) {
  .profile-container {
    flex-direction: column;
  }

  .charts-section {
    width: 100%;
    margin-top: 30px;
  }
}
</style>