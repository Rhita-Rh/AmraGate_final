<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <div class="illustration">
        <svg width="300" height="300" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="150" cy="150" r="140" fill="#E8F5E9"/>
          <path d="M100 100 L200 200 M200 100 L100 200" stroke="#4CAF50" stroke-width="8" stroke-linecap="round"/>
          <circle cx="150" cy="150" r="140" stroke="#4CAF50" stroke-width="4" stroke-dasharray="20 10"/>
        </svg>
      </div>
      <h1>Oops! Page Not Found</h1>
      <p>Looks like you've wandered into uncharted territory. Let's get you back on track!</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFound'
}
</script>

<style scoped>
.not-found-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #f1fff5, #ffffff);
  padding: 20px;
}

.not-found-content {
  text-align: center;
  max-width: 600px;
  padding: 40px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 12px 30px rgba(76, 175, 80, 0.1);
}

.illustration {
  margin-bottom: 30px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

h1 {
  color: #2c3e50;
  font-size: 2.5rem;
  margin-bottom: 20px;
  font-weight: 600;
}

p {
  color: #4a5568;
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 30px;
}

@media (max-width: 480px) {
  .not-found-content {
    padding: 30px 20px;
  }
  
  h1 {
    font-size: 2rem;
  }
  
  p {
    font-size: 1rem;
  }
}
</style>
