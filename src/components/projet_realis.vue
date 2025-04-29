<template>
    <div>
      <canvas id="projectsChart"></canvas>
    </div>
  </template>
  
  <script>
  import { onMounted } from "vue";
  import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
  import { getAuth } from "firebase/auth";
  import Chart from "chart.js/auto";
  
  export default {
    name: "ProjectsChart",
  
    setup() {
      const db = getFirestore();
      const auth = getAuth();
  
      const getProjetsParMois = async () => {
        const user = auth.currentUser;
        if (!user) return {};
  
        // Requête Firestore pour obtenir les projets de cet utilisateur
        const projetsQuery = query(
          collection(db, "projets"),
          where("userId", "==", user.uid)
        );
  
        try {
          const querySnapshot = await getDocs(projetsQuery);
          const countsByMonth = {};
          const countsByType = {};
  
          querySnapshot.forEach((doc) => {
            const projet = doc.data();
            const date = new Date(projet.dateRealisation);
            const mois = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
            
            // Comptage par mois
            countsByMonth[mois] = (countsByMonth[mois] || 0) + 1;
  
            // Comptage par type de projet
            countsByType[projet.type] = (countsByType[projet.type] || 0) + 1;
          });
  
          return { countsByMonth, countsByType };
        } catch (error) {
          console.error("Erreur récupération des projets Firestore:", error);
          return {};
        }
      };
  
      onMounted(async () => {
        const { countsByMonth, countsByType } = await getProjetsParMois();
  
        // Pour un graphique par mois
        const labelsMonth = Object.keys(countsByMonth).sort();
        const dataMonth = labelsMonth.map((mois) => countsByMonth[mois]);
  
        // Pour un graphique par type
        const labelsType = Object.keys(countsByType);
        const dataType = labelsType.map((type) => countsByType[type]);
  
        // Affichage du graphique par mois
        const ctxMonth = document.getElementById("projectsChart").getContext("2d");
        new Chart(ctxMonth, {
          type: "bar", // Ou 'pie' pour un graphique circulaire
          data: {
            labels: labelsMonth,
            datasets: [
              {
                label: "Projets réalisés par mois",
                data: dataMonth,
                backgroundColor: "rgba(75, 192, 192, 0.6)",
              },
            ],
          },
        });
  
        // Si tu veux afficher un autre graphique, par exemple, par type de projet :
        const ctxType = document.getElementById("projectsChartType").getContext("2d");
        new Chart(ctxType, {
          type: "pie", // Graphique circulaire pour le type de projet
          data: {
            labels: labelsType,
            datasets: [
              {
                label: "Projets par type",
                data: dataType,
                backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56", "#4BC0C0"],
              },
            ],
          },
        });
      });
    },
  };
  </script>
  
  <style scoped>
  canvas {
    max-width: 100%;
    margin-bottom: 30px;
  }
  </style>
  