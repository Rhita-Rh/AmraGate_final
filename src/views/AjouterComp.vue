<template>
  <div class="bigbro">
    <div class="page-container">
      <div class="title">
        <h1>ANY OTHER COMPETENCE YOU WANT TO SHARP?</h1>
      </div>

      <form @submit.prevent="ajouterCompetence">
        <div class="form-group">
          <label>Name:</label>
          <input type="text" v-model="name" required />
        </div>

        <div class="form-group">
          <label>Level:</label>
          <select v-model="level" required>
            <option value="">-- Select a level --</option>
            <option>Débutant</option>
            <option>Intermédiaire</option>
            <option>Avancé</option>
          </select>
        </div>

        <div class="form-group">
          <label>Acquisition Date:</label>
          <input type="date" v-model="date_acqui" required />
        </div>

        <button type="submit">ADD</button>

        <router-link to="/Dashboard">
          <button type="button">GO TO Dashboard</button>
        </router-link>
      </form>

      <div v-if="lastAdded" class="signup-prompt">
        <h4>Last Added:</h4>
        <p>
          <strong>{{ lastAdded.name }}</strong> added
          {{ getDaysSince(lastAdded.date_progr) }} days ago.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from '../firebase-config';
import { getAuth } from 'firebase/auth';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';

export default {
  name: 'AjouterComp',
  data() {
    return {
      name: '',
      level: '',
      date_acqui: '',
      lastAdded: null
    };
  },
  methods: {
    async ajouterCompetence() {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) throw new Error('Utilisateur non connecté');

        const userRef = doc(db, 'users', user.uid);
        const today = new Date().toISOString().split('T')[0];

        const competence = {
          name: this.name,
          level: this.level,
          date_acqui: this.date_acqui,
          date_debut: today,
          date_progr: today
        };

        await updateDoc(userRef, {
          competences: arrayUnion(competence)
        });

        this.lastAdded = competence;

        // Reset form
        this.name = '';
        this.level = '';
        this.date_acqui = '';
      } catch (error) {
        console.error("Erreur lors de l'ajout :", error);
        alert("Une erreur est survenue lors de l'ajout de la compétence.");
      }
    },
    getDaysSince(date) {
      const now = new Date();
      const past = new Date(date);
      const diff = now - past;
      return Math.floor(diff / (1000 * 60 * 60 * 24));
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Quicksand&display=swap');

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
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 100% 50%;
  }
}

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

.title h1 {
  text-align: center;
  color: #43a047;
  font-size: 2.2em;
  letter-spacing: 1px;
  margin-bottom: 25px;
}

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

input[type='text'],
input[type='date'],
select {
  width: 100%;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1.5px solid #aed581;
  background-color: #f9fff8;
  font-size: 15px;
  transition: all 0.3s ease;
}

input:focus,
select:focus {
  border-color: #66bb6a;
  box-shadow: 0 0 0 3px rgba(102, 187, 106, 0.2);
  outline: none;
}

button {
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

button:hover {
  background: linear-gradient(135deg, #388e3c, #81c784);
  transform: translateY(-2px);
}

.signup-prompt {
  text-align: center;
  margin-top: 18px;
  font-size: 14px;
}
</style>
