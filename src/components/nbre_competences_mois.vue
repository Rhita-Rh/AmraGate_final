<template>
  <div>
    <canvas id="competenceChart"></canvas>
  </div>
</template>

<script>
import { onMounted } from "vue";
import Chart from "chart.js/auto";  // Chart.js for pie/donut charts
import { auth, db } from "../firebase-config"; 
import { doc, getDoc } from "firebase/firestore";

export default {
  name: "nbreCompetencesMois",  // Name of the component

  setup() {
    const getCompetences = async () => {
      const user = auth.currentUser;
      if (!user) return [];

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const competences = userDoc.data().competences || [];
        return competences.map((c) => c.name);  // Get the name of each competence
      } catch (error) {
        console.error("Erreur récupération Firestore :", error);
        return [];
      }
    };

    onMounted(async () => {
      const competences = await getCompetences();
      
      const labels = competences;  // Competence names will be the labels
      const data = competences.reduce((acc, competence) => {
        acc[competence] = (acc[competence] || 0) + 1;  // Count occurrences
        return acc;
      }, {});  // Count how many times each competence appears

      const dataValues = Object.values(data);  // Extract the counts (values)
      
      const ctx = document.getElementById("competenceChart").getContext("2d");
      new Chart(ctx, {
        type: "doughnut",  // Use doughnut chart (can also use "pie" type)
        data: {
          labels: labels,  // Use competence names as labels
          datasets: [{
            label: "Compétences ajoutées",
            data: dataValues,  // Use the counts of competences
            backgroundColor: [
              "#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#33FFF5", 
              "#FFD700", "#FF4500", "#32CD32", "#8A2BE2", "#7FFF00"
            ],  // Colors for each segment
            borderColor: ["#fff", "#fff", "#fff", "#fff", "#fff"],  // Border color for each slice
            borderWidth: 2  // Border width
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            tooltip: {
              callbacks: {
                label: function(tooltipItem) {
                  return tooltipItem.label + ": " + tooltipItem.raw + " ajoutée(s)";
                }
              }
            }
          }
        }
      });
    });
  }
};
</script>

<style scoped>
canvas {
  max-width: 50%;
  height: auto;
}
</style>

