<template>
  <div>
    <h3>AVEZ VOUS D'AUTRES COMPETENCES ?</h3>
    <form @submit.prevent="ajouterCompetence" class="c4">
      <legend>Ajouter une compétence</legend>

      <div class="c3">
        <label class="c5">Name :</label>
        <input type="text" v-model="name" required />
      </div>

      <div class="c3">
        <label class="c5">Niveau :</label>
        <select v-model="level" required>
          <option value="">-- Choisir un niveau --</option>
          <option>Débutant</option>
          <option>Intermédiaire</option>
          <option>Avancé</option>
        </select>
      </div>

      <div class="c3">
        <label class="c5">Date de début :</label>
        <input type="date" v-model="date_debut" required />
      </div>

      <div class="c3">
        <label class="c5">Date d'acquisition :</label>
        <input type="date" v-model="date_acqui" required />
      </div>

      <div class="c3">
        <label class="c5">Date de progression :</label>
        <input type="date" v-model="date_progr" required />
      </div>

      <button>AJOUTER</button>
    </form>
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
      date_progr: '',
      date_debut: ''
    };
  },
  methods: {
    async ajouterCompetence() {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
          throw new Error('Utilisateur non connecté');
        }

        const userRef = doc(db, 'users', user.uid);

        const competence = {
          name: this.name,
          level: this.level,
          date_acqui: this.date_acqui,
          date_progr: this.date_progr,
          date_debut: this.date_debut
        };

        await updateDoc(userRef, {
          competences: arrayUnion(competence)
        });

        this.$router.push('/Dashboard');
      } catch (error) {
        console.error("Erreur lors de l'ajout :", error);
        alert("Une erreur est survenue lors de l'ajout de la compétence.");
      }
    }
  }
};
</script>

<style scoped>
.c3 {
  display: flex;
  flex-direction: row;
  gap: 20px;
  font-size: 16px;
  align-items: center;
}

.c4 {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: rgb(173, 208, 171);
  padding: 20px;
  border-radius: 8px;
}

.c5 {
  font-weight: bold;
  width: 150px;
}
</style>
