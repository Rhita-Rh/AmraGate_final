<template>
  <div class="landing-page">
    <nav class="navbar">
      <div class="navbar-content">
        <div class="logo">
          <img src="@/assets/logo.png" alt="AmraGate Logo" class="logo-image">
        </div>
        <div class="nav-links">
          <router-link to="/signin" class="nav-btn signin-btn">Sign In</router-link>
          <router-link to="/signup" class="nav-btn signup-btn">Sign Up</router-link>
        </div>
      </div>
    </nav>

    <header class="hero-section">
      <div class="hero-content">
        <h1>Welcome to AmraGate</h1>
        <p class="hero-subtitle">Your Gateway to Professional Growth and Collaboration</p>
        <div class="cta-buttons">
          <router-link to="/signin" class="primary-btn">Get Started</router-link>
          <router-link to="/signup" class="secondary-btn">Sign Up</router-link>
        </div>
      </div>
      <div class="hero-icons">
        <div class="icon-container">
          <div class="icon-wrapper">
            <span class="icon">📊</span>
            <span class="icon-label">Projects</span>
          </div>
          <div class="icon-wrapper">
            <span class="icon">🎯</span>
            <span class="icon-label">Goals</span>
          </div>
          <div class="icon-wrapper">
            <span class="icon">🤝</span>
            <span class="icon-label">Network</span>
          </div>
        </div>
      </div>
    </header>

    <section class="features-section">
      <h2>Why Choose AmraGate?</h2>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">📊</div>
          <h3>Project Management</h3>
          <p>Organize and showcase your projects with ease. Track progress and collaborate effectively.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🎯</div>
          <h3>Goal Setting</h3>
          <p>Set and track your professional goals. Stay motivated and achieve your objectives.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🤝</div>
          <h3>Networking</h3>
          <p>Connect with like-minded professionals. Share knowledge and grow together.</p>
        </div>
      </div>
    </section>

    <section class="cta-section">
      <h2>Ready to Start Your Journey?</h2>
      <p>Join thousands of professionals who are already using AmraGate to achieve their goals.</p>
      <router-link to="/signup" class="primary-btn">Create Your Account</router-link>
    </section>
  </div>
</template>

<style scoped>
.landing-page {
  min-height: 100vh;
  font-family: 'Quicksand', sans-serif;
  background: radial-gradient(circle at top left, #f3f8fd, #f8f0f8);
  animation: floatBg 10s infinite alternate;
  color: #4a4a4a;
}

/* Navbar Styles */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 2px 10px rgba(148, 182, 229, 0.1);
  z-index: 1000;
}

.navbar-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
}

.logo-image {
  width: 150px;
  height: auto;
}


.nav-links {
  display: flex;
  gap: 1rem;
}

.nav-btn {
  padding: 0.5rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.signin-btn {
  color: #7ba6dd;
  border: 2px solid #7ba6dd;
}

.signin-btn:hover {
  background: #7ba6dd;
  color: white;
  transform: translateY(-2px);
}

.signup-btn {
  background: linear-gradient(135deg, #94e594, #9eeec2);
  color: white;
}

.signup-btn:hover {
  background: linear-gradient(135deg, #7bdd8a, #9eeec2);
  transform: translateY(-2px);
}

@keyframes floatBg {
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
}

.hero-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2rem;
  padding-top: 6rem;
  max-width: 1200px;
  margin: 0 auto;
}

.hero-content {
  flex: 1;
  max-width: 600px;
}

.hero-icons {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.icon-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.icon-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  animation: float 6s ease-in-out infinite;
}

.icon-wrapper:nth-child(1) {
  animation-delay: 0s;
}

.icon-wrapper:nth-child(2) {
  animation-delay: 0.2s;
}

.icon-wrapper:nth-child(3) {
  animation-delay: 0.4s;
}

.icon {
  font-size: 4rem;
  background: rgba(255, 255, 255, 0.95);
  padding: 1.5rem;
  border-radius: 20px;
  box-shadow: 0 12px 30px rgba(148, 182, 229, 0.15);
  transition: all 0.3s ease;
}

.icon:hover {
  transform: scale(1.1);
  box-shadow: 0 15px 35px rgba(148, 182, 229, 0.2);
}

.icon-label {
  font-size: 1.2rem;
  font-weight: 600;
  color: #4d5a6a;
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
}

.hero-content h1 {
  font-size: 3.5rem;
  font-weight: 700;
  background: linear-gradient(to right, #7ba6dd, #94b6e7);
  -webkit-text-fill-color: transparent;
  margin-bottom: 1.5rem;
}

.hero-subtitle {
  font-size: 1.5rem;
  color: #4d5a6a;
  margin-bottom: 2.5rem;
}

.cta-buttons {
  display: flex;
  gap: 1.5rem;
}

.primary-btn, .secondary-btn {
  padding: 1rem 2rem;
  border-radius: 10px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.primary-btn {
  background: linear-gradient(135deg, #94e594, #9eeec2);
  color: white;
}

.primary-btn:hover {
  background: linear-gradient(135deg, #7bdd8a, #9eeec2);
  transform: translateY(-2px);
}

.secondary-btn {
  background: linear-gradient(135deg, #e48a8a, #f2b6b6);
  color: white;
}

.secondary-btn:hover {
  background: linear-gradient(135deg, #db7979, #e9a0a0);
  transform: translateY(-2px);
}

.features-section {
  padding: 5rem 2rem;
  text-align: center;
}

.features-section h2, .cta-section h2 {
  font-size: 2.5rem;
  color: #7ba6dd;
  margin-bottom: 3rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 12px 30px rgba(148, 182, 229, 0.15);
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(148, 182, 229, 0.2);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1.5rem;
}

.feature-card h3 {
  color: #4d5a6a;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.feature-card p {
  color: #6b7c93;
  line-height: 1.6;
}

.cta-section {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  max-width: 800px;
  margin: 0 auto 5rem;
  padding: 3rem;
  box-shadow: 0 12px 30px rgba(148, 182, 229, 0.15);
}

.cta-section p {
  font-size: 1.2rem;
  color: #4d5a6a;
  margin-bottom: 2rem;
}

@media (max-width: 768px) {
  .navbar-content {
    padding: 1rem;
  }

  .hero-section {
    flex-direction: column;
    text-align: center;
    padding-top: 8rem;
  }

  .hero-content {
    margin-bottom: 2rem;
  }

  .hero-content h1 {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1.2rem;
  }

  .cta-buttons {
    flex-direction: column;
    gap: 1rem;
  }

  .primary-btn, .secondary-btn {
    width: 100%;
  }

  .icon-container {
    flex-direction: row;
    gap: 1rem;
  }

  .icon {
    font-size: 3rem;
    padding: 1rem;
  }

  .icon-label {
    font-size: 1rem;
  }

  .features-section {
    padding: 3rem 1rem;
  }

  .cta-section {
    margin: 0 1rem 3rem;
  }
}
</style>
