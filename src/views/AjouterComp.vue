<template>
    <div>
        <h3>AVEZ VOUS D'AUTRES COMPETENCES ?</h3>
        <form @submit.prevent="ajouterCompetence" class="c4">
            <legend>Ajouter une......</legend>
            
            <div class="c3">
                <label class="c5">Name :</label>
                <input type="text" v-model="name">
            </div>

            <div class="c3">
                <label  class="c5">Niveau :</label>
                <select v-model="level">
                    <option>Any</option>
                    <option>Débutant</option>
                    <option>Intermédiaire</option>
                    <option>Avancé</option>
                </select>
            </div>

            <div class="c3">
                <label  class="c5">Date de début :</label>
                <input type="date" v-model="date_debut">
            </div>

            <div class="c3">
                <label  class="c5">Date d'acquisition :</label>
                <input type="date" v-model="date_acqui">
            </div>

            <div class="c3">
                <label  class="c5">Date de progression :</label>
                <input type="date" v-model="date_progr">
            </div>

            
            <button>AJOUTER</button>

           
        </form>

    </div>
    
    
    
    
</template>

<script>

import { db } from '../firebase-config';
import { getAuth } from 'firebase/auth';
import { useRouter } from 'vue-router';


export default {
  name: 'AjouterComp',
  data(){
    return{
        name:"",
        level:"",
        date_acqui:"",
        date_progr:"",
        date_debut:"",
        router: useRouter()

    }
  },
  methods: {
    async ajouterCompetence() {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        
        if (!user) {
          throw new Error("Utilisateur non connecté");
        }
        
        const userCollection = collection(db, 'users', user.uid, 'competences');
        
        await addDoc(userCollection, {
          name: this.name,
          level: this.level,
          date_acqui: this.date_acqui,
          date_progr: this.date_progr,
          date_debut: this.date_debut
        });

        this.router.push('/Dashboard');
        
      } catch (error) {
        console.error("Erreur lors de l'ajout :", error);
      }
    }
  


}
}
</script>

<style scoped>

.c3{
    display: flex;
    flex-direction: row;
    gap: 20px;
    font: 20px;
}

.c4{
    display: flex;
    flex-direction: column;
    gap: 10px;
    background-color: rgb(173, 208, 171) ;
   
}
.c5{
    font-weight: bold;
}



</style>

  