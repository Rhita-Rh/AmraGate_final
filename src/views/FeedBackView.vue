<template>
    <div class="feedback-form">
      <router-link to="/Home"><button class="back">Back to Home</button></router-link>
      <h2>Send Feedback</h2>
      <textarea v-model="message" placeholder="Your message..."></textarea>
      <button @click="sendFeedback">Send</button>
  
      <div class="feedback-list">
        <div v-for="fb in feedbacks" :key="fb.id" class="feedback-item">
          <div class="username">{{ fb.username }}</div>
          <div class="comment">{{ fb.message }}</div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { db, auth } from '../firebase-config';
  import {
    collection,
    addDoc,
    serverTimestamp,
    onSnapshot,
    query,
    orderBy,
  } from 'firebase/firestore';
  
  export default {
    data() {
      return {
        message: '',
        feedbacks: [],
      };
    },
    mounted() {
      const feedbackRef = collection(db, 'feedbacks');
      const q = query(feedbackRef, orderBy('createdAt', 'desc'));
      onSnapshot(q, (snapshot) => {
        this.feedbacks = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      });
    },
    methods: {
      async sendFeedback() {
        const user = auth.currentUser;
        if (!user) {
          alert('Please log in to submit feedback.');
          return;
        }
        if (!this.message.trim()) {
          alert('Please write a message.');
          return;
        }
  
        await addDoc(collection(db, 'feedbacks'), {
          username: user.displayName || user.email,
          message: this.message,
          createdAt: serverTimestamp(),
        });
  
        this.message = '';
      }
    }
  };
  </script>
  
  <style scoped>
  .feedback-form {
    max-width: 600px;
    margin: 2rem auto;
    padding: 2rem;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 20px;
    box-shadow: 0 12px 30px rgba(148, 182, 229, 0.15);
    font-family: 'Quicksand', sans-serif;
    text-align: center;
  }
  
  .feedback-form h2 {
    color: #7ba6dd;
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }
  
  textarea {
    width: 100%;
    height: 120px;
    padding: 1rem;
    border: 1px solid #d0d6e2;
    border-radius: 10px;
    background: #f9fafd;
    font-size: 1rem;
    resize: none;
    transition: all 0.3s ease;
  }
  
  textarea:focus {
    outline: none;
    border-color: #7ba6dd;
    box-shadow: 0 0 0 2px rgba(123, 166, 221, 0.2);
  }
  
  button {
    margin-top: 1.5rem;
    padding: 0.75rem 1.5rem;
    background: linear-gradient(135deg, #94e594, #9eeec2);
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  button:hover {
    background: linear-gradient(135deg, #7bdd8a, #9eeec2);
    transform: translateY(-2px);
  }
  
  .back {
    margin-bottom: 1rem;
    background: linear-gradient(135deg, #e48a8a, #f2b6b6);
    color: white;
    border: none;
    border-radius: 8px;
    padding: 0.6rem 1.2rem;
    font-weight: 600;
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .back:hover {
    background: linear-gradient(135deg, #db7979, #e9a0a0);
    transform: translateY(-2px);
  }
  
  .feedback-list {
    margin-top: 2rem;
    text-align: left;
  }
  
  .feedback-item {
    background: #f9fafd;
    padding: 1rem;
    border-radius: 12px;
    margin-bottom: 1rem;
    box-shadow: 0 2px 6px rgba(148, 182, 229, 0.08);
  }
  
  .username {
    font-weight: 600;
    color: #2d3748;
    margin-bottom: 0.25rem;
  }
  
  .comment {
    color: #4a5568;
    font-size: 0.95rem;
  }
  
  @media (max-width: 768px) {
    .feedback-form {
      padding: 1.5rem;
    }
  
    button, .back {
      width: 100%;
    }
  }
  </style>
  