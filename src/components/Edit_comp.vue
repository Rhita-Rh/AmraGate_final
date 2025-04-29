<template>
    <div>
        <form @submit.prevent="saveCompetence">
            <legend>Edit Competence</legend>
            
            <div>
                <label>Name :</label>
                <input type="text" v-model="name">
            </div>

            <div>
                <label>Niveau :</label>
                <select v-model="level">
                    <option>Any</option>
                    <option>Débutant</option>
                    <option>Intermédiaire</option>
                    <option>Avancé</option>
                </select>
            </div>

            <div>
                <label>Date d'acquisition :</label>
                <input type="text" v-model="date_acqui">
            </div>

            <div>
                <label>Date de progression :</label>
                <input type="text" v-model="date_progr">
            </div>

            <div>
                <label>Date debut</label>
                <input type="date" v-model="date_debut">
            </div>

            <button type="submit">Save</button>
        </form>

    </div>
    
    
    
    
</template>

<script>

import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase-config";

export default {
  name: 'Edit_comp',
  props: {
        userId: {
        type: String,
        required: true
        },
        competenceIndex: {
        type: Number,
        required: true
        }
    },
    data() {
    return {
        name: "",
        level: "",
        date_acqui: "",
        date_progr: "",
        date_debut: ""
    }
    },
    mounted() {
    if (this.$props.competence) {
      this.name = this.competence.name;
      this.level = this.competence.level;
      this.date_acqui = this.competence.date_acqui;
      this.date_progr = this.competence.date_progr;
      this.date_debut = this.competence.date_debut;
    }
    },
    methods: {
    async saveCompetence() {
      try {
        // 1. Get the user's document reference
        const userRef = doc(db, "users", this.userId);

        // 2. Get current user data
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
          throw new Error("User not found");
        }

        const userData = userSnap.data();
        let competences = userData.competences || [];

        // 3. Update the competence at the specific index
        competences[this.competenceIndex] = {
          name: this.name,
          level: this.level,
          date_acqui: this.date_acqui,
          date_progr: this.date_progr,
          date_debut: this.date_debut
        };

        // 4. Update the competences array in Firestore
        await updateDoc(userRef, {
          competences: competences
        });

        alert("Compétence mise à jour avec succès !");
      } catch (error) {
        console.error("Erreur lors de la mise à jour:", error);
      }

    }
  }


}
</script>

<style scoped>

</style>