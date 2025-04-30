<template>
    <div class="competences-view">
      <div class="competences-container">
        <div class="header-section">
          <h1>My Competences</h1>
          <div class="action-buttons">
            <router-link to="/AjouterComp">
              <button class="add-btn">Add Competence</button>
            </router-link>
            <router-link to="/Dashboard">
              <button class="back-btn">Back to Dashboard</button>
            </router-link>
          </div>
        </div>
        
        <div v-if="loading" class="loading">Loading...</div>
        
        <div v-else>
          <div v-if="competences.length === 0" class="empty-state">
            You haven't added any competences yet.
          </div>
          
          <div v-else class="competences-list">
            <div v-for="(competence, index) in competences" :key="index" class="competence-card">
              <div class="competence-header">
                <h3>{{ competence.name }}</h3>
                <span class="level-badge" :class="competence.level.toLowerCase()">
                  {{ competence.level }}
                </span>
              </div>
              
              <div class="competence-details">
                <div class="detail-item">
                  <span class="detail-label">Acquired:</span>
                  <span>{{ formatDate(competence.date_acqui) }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Started Tracking:</span>
                  <span>{{ formatDate(competence.date_debut) }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Last Progress:</span>
                  <span>{{ formatDate(competence.date_progr) }}</span>
                </div>
              </div>
              
              <router-link 
                :to="{ name: 'Edit_comp', params: { 
                  userId: currentUserId, 
                  index: index 
                }}"
                class="edit-btn"
              >
                Edit
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { db, auth } from '../firebase-config'
  import { doc, getDoc } from 'firebase/firestore'
  
  export default {
    name: 'CompetencesView',
    data() {
      return {
        competences: [],
        loading: true,
        currentUserId: ''
      }
    },
    async created() {
      await this.fetchCompetences()
    },
    methods: {
      async fetchCompetences() {
        try {
          const user = auth.currentUser
          if (!user) return
          
          this.currentUserId = user.uid
          const userRef = doc(db, 'users', user.uid)
          const docSnap = await getDoc(userRef)
          
          if (docSnap.exists()) {
            this.competences = docSnap.data().competences || []
          }
        } catch (error) {
          console.error('Error fetching competences:', error)
        } finally {
          this.loading = false
        }
      },
      formatDate(dateString) {
        if (!dateString) return 'N/A'
        const options = { year: 'numeric', month: 'short', day: 'numeric' }
        return new Date(dateString).toLocaleDateString(undefined, options)
      }
    }
  }
  </script>
  
  <style scoped>
  .competences-view {
    background-color: #f8f9fa;
    min-height: 100vh;
    padding: 20px;
  }
  
  .competences-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    font-family: 'Quicksand', sans-serif;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  }
  
  .header-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    flex-wrap: wrap;
    gap: 15px;
  }
  
  .header-section h1 {
    color: #2c3e50;
    margin: 0;
  }
  
  .action-buttons {
    display: flex;
    gap: 15px;
  }
  
  button {
    border: none;
    border-radius: 6px;
    padding: 10px 20px;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    font-family: 'Quicksand', sans-serif;
    font-weight: 500;
  }
  
  .add-btn {
    background-color: #42b983;
    color: white;
  }
  
  .add-btn:hover {
    background-color: #35a771;
    transform: translateY(-2px);
    box-shadow: 0 3px 6px rgba(66, 185, 131, 0.3);
  }
  
  .back-btn {
    background-color: #c62828;
    color: white;
  }
  
  .back-btn:hover {
    background-color: #b71c1c;
    transform: translateY(-2px);
    box-shadow: 0 3px 6px rgba(198, 40, 40, 0.3);
  }
  
  .loading, .empty-state {
    text-align: center;
    padding: 40px;
    color: #666;
  }
  
  .competences-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    margin-top: 20px;
  }
  
  .competence-card {
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    padding: 20px;
    position: relative;
    background: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  
  .competence-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .competence-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }
  
  .competence-header h3 {
    color: #2c3e50;
    margin: 0;
    font-size: 1.1rem;
  }
  
  .level-badge {
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: capitalize;
    margin-right: 60px;
  }
  
  .level-badge.beginner {
    background-color: #e3f2fd;
    color: #1976d2;
  }
  
  .level-badge.intermediate {
    background-color: #fff8e1;
    color: #ff8f00;
  }
  
  .level-badge.advanced {
    background-color: #e8f5e9;
    color: #388e3c;
  }
  
  .detail-item {
    margin-bottom: 8px;
    display: flex;
  }
  
  .detail-label {
    font-weight: 600;
    margin-right: 8px;
    min-width: 120px;
    color: #555;
    font-size: 0.9rem;
  }
  
  .detail-item span:last-child {
    color: #2c3e50;
  }
  
  .edit-btn {
    position: absolute;
    top: 15px;
    right: 15px;
    background-color: #42b983;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 6px 12px;
    font-size: 0.85rem;
    font-weight: 500;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(66, 185, 131, 0.3);
  }
  
  .edit-btn:hover {
    background-color: #35a771;
    transform: translateY(-1px);
    box-shadow: 0 3px 6px rgba(66, 185, 131, 0.4);
  }
  
  /* Responsive adjustments */
  @media (max-width: 768px) {
    .header-section {
      flex-direction: column;
      align-items: flex-start;
    }
    
    .action-buttons {
      width: 100%;
      flex-direction: column;
      gap: 10px;
    }
    
    .action-buttons button {
      width: 100%;
    }
    
    .competences-list {
      grid-template-columns: 1fr;
    }
    
    .competence-card {
      padding: 15px;
    }
    
    .detail-label {
      min-width: 100px;
    }
  }
  </style>