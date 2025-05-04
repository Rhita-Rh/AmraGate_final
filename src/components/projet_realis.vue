<template>
  <div>
    <canvas id="projectsChart"></canvas>
  </div>
</template>

<script>
import { onMounted } from "vue";
import Chart from "chart.js/auto";  // Chart.js for pie/doughnut charts
import { auth, db } from "../firebase-config"; 
import { collection, query, where, getDocs } from "firebase/firestore";

export default {
  name: "projet_realis",  // Name of the component

  setup() {
    const getProjects = async () => {
      const user = auth.currentUser;
      if (!user) return [];

      try {
        // Firestore query to get projects where userId matches the current user's ID
        const projectsQuery = query(
          collection(db, "projects"),
          where("owner", "==", user.uid)  // Check if project owner matches the current user's ID
        );
        const querySnapshot = await getDocs(projectsQuery);
        const projects = querySnapshot.docs.map(doc => doc.data());

        return projects;
      } catch (error) {
        console.error("Erreur récupération des projets Firestore :", error);
        return [];
      }
    };
    onMounted(async () => {
  const projects = await getProjects();

  const labels = projects.map(p => p.title || "Sans titre");
  const dataValues = projects.map(() => 1);  // 1 for each project
  const backgroundColors = projects.map((_, i) =>
    `hsl(${(i * 360) / projects.length}, 70%, 60%)`
  ); // Generate distinct HSL colors

  const ctx = document.getElementById("projectsChart").getContext("2d");
  new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: labels,
      datasets: [{
        label: "Projets",
        data: dataValues,
        backgroundColor: backgroundColors,
        borderColor: "#fff",
        borderWidth: 2
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
            label: function (tooltipItem) {
              return `${tooltipItem.label}: ${tooltipItem.raw} projet`;
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

