<template>
    <div>
      <div class=" c1">
        <img src="R.png">
        <button>Log out</button>
      </div>
    <div class="c2">
      <label class="c3">Profile</label>
      <label class="c3">Home</label>
      <label class="c3">Add project</label>
    </div>
  
    <div>
      <ProjectsDi />
      
    </div>
  
    <div> 
      <!--chart.js visualisation dyal koulchi -->
    </div>
  
    </div>
    
  </template>
  
  <script>
  import ProjectsDi from '@/components/ProjectsDi.vue';
  
  
  
  export default {
    name: 'HomeView',
    components:{
      ProjectsDi
    } 
      
  }
  </script>
  
  <style scoped>
  
  .c1{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    background-color: rgb(173, 208, 171);
    font-size: 30px;
    font-weight: bold;
  
  }
  
  .c2{
    display: flex;
    flex-direction: row;
    gap: 10px;
    background-color: rgb(173, 208, 171);
    font-size: 30px;
    font-weight: bold;
  
  }
  
  .c3{
    border: solid 1px gr;
    padding: 10px;
  }
  
  
    
  </style>
  