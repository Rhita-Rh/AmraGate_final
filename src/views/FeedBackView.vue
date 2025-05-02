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
  .back{
  background-color: #f44336;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
}
  .feedback-form {
    max-width: 600px;
    margin: 50px auto;
    background: white;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.05);
    text-align: center;
  }
  
  .feedback-form h2 {
    margin-bottom: 20px;
  }
  
  textarea {
    width: 100%;
    height: 120px;
    padding: 12px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 8px;
    resize: none;
  }
  
  button {
    margin-top: 15px;
    background-color: #4caf50;
    color: white;
    padding: 12px 24px;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    cursor: pointer;
  }
  
  .feedback-list {
    margin-top: 40px;
    text-align: left;
  }
  
  .feedback-item {
    background: #f9f9f9;
    padding: 15px;
    margin-bottom: 15px;
    border-radius: 8px;
  }
  
  .username {
    font-weight: bold;
    color: #2c3e50;
    margin-bottom: 5px;
  }
  
  .comment {
    color: #333;
  }
  </style>
  