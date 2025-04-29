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
      
      // Filter completed projects (assuming there's a 'status' field with value 'Terminé')
      //const completedProjects = projects.filter((project) => project.status === "Terminé");
      
      // Count the completed projects by type (or any other attribute, you can modify this logic)
      const projectTypes = projects.map((project) => project.type);
      const data = projectTypes.reduce((acc, type) => {
        acc[type] = (acc[type] || 0) + 1;  // Count the occurrences of each project type
        return acc;
      }, {});

      const labels = Object.keys(data);  // Types of projects
      const dataValues = Object.values(data);  // Number of completed projects per type

      // Render Doughnut chart for projects
      const ctx = document.getElementById("projectsChart").getContext("2d");
      new Chart(ctx, {
        type: "doughnut",  // Use doughnut chart
        data: {
          labels: labels,  // Use project types as labels
          datasets: [{
            label: "Projets réalisés",
            data: dataValues,  // The count of completed projects by type
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
                  return tooltipItem.label + ": " + tooltipItem.raw + " projet(s) terminé(s)";
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

