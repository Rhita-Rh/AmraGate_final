<template>
  <form @submit.prevent="submitForm" class="form">
    <h1 class="form-title">Add Project</h1>

    <div class="form-group">
      <label class="form-label">Project's name</label>
      <input
        type="text"
        v-model="formData.title"
        required
        class="form-input"
        placeholder="Enter Project Title"
      />
    </div>

    <div class="form-group">
      <label class="form-label">Description</label>
      <textarea
        v-model="formData.description"
        required
        class="form-input"
        placeholder="Enter Project Description"
      ></textarea>
    </div>

    <div class="form-group">
      <label class="form-label">Project Stack</label>
      <div class="input-container">
        <input
          type="text"
          v-model="newTech"
          @keyup.enter="addTech"
          placeholder="Add a new technology and hit Enter"
          class="tech-input"
        />
        <button type="button" @click="addTech" class="add-btn">Add</button>

        <div class="tags">
          <span
            v-for="(tech, index) in formData.techStack"
            :key="index"
            class="tech-tag"
          >
            {{ tech }}
            <button
              type="button"
              @click="removeTech(index)"
              class="remove-btn"
            >
              x
            </button>
          </span>
        </div>
      </div>
    </div>

    <div class="form-group">
      <label class="form-label">Github Link</label>
      <input
        type="url"
        v-model="formData.github"
        placeholder="Add your project link"
        class="form-input"
      />
    </div>

    <div class="form-group">
      <label class="form-label">Upload project image</label>
      <input type="file" @change="handleImageUpload" accept="image/*" class="file-input" />

      <div v-if="previewImage" class="preview">
        <img :src="previewImage" alt="Preview" class="preview-img" />
      </div>
    </div>

    <div class="form-actions">
      <button type="submit" class="submit-btn" :disabled="loading">
        {{ loading ? "Submitting..." : "Submit" }}
      </button>

      <button type="button" @click="$router.push('/Dashboard')" class="home-btn">
        Back to Home
      </button>
    </div>
  </form>
</template>

<script>
import { db } from "../firebase-config";
import { collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default {
  name: "AddProject",
  data() {
    return {
      newTech: "",
      loading: false,
      errorMessage: "",
      previewImage: null,
      uploadedImage: null,
      formData: {
        title: "",
        description: "",
        techStack: [],
        github: "",
      },
    };
  },
  methods: {
    addTech() {
      if (this.newTech.trim() !== "") {
        this.formData.techStack.push(this.newTech.trim());
        this.newTech = "";
      }
    },
    removeTech(index) {
      this.formData.techStack.splice(index, 1);
    },
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.uploadedImage = file;
        this.previewImage = URL.createObjectURL(file);
      }
    },
    async uploadImage(file) {
      const url = "https://api.cloudinary.com/v1_1/dgcpm3hlg/image/upload";
      const formData = new FormData();

      formData.append("file", file);
      formData.append("upload_preset", "unsigned");

      console.log("Uploading to Cloudinary:", file);

      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      console.log("Cloudinary response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Cloudinary error response:", errorText);
        throw new Error("Image upload failed");
      }

      const data = await response.json();
      console.log("Cloudinary response data:", data);

      return data.secure_url;
    },
    async submitForm() {
      this.loading = true;
      this.errorMessage = "";

      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
          throw new Error("User not authenticated");
        }

        let imageUrl = "";

        if (this.uploadedImage) {
          imageUrl = await this.uploadImage(this.uploadedImage);
        }

        const userId = user.uid;

        const projectData = {
          title: this.formData.title,
          description: this.formData.description,
          owner: userId,
          addedAt: new Date(),
          techStack: this.formData.techStack,
          github: this.formData.github,
          imageUrl: imageUrl,
        };

        const projectRef = await addDoc(collection(db, "projects"), projectData);

        console.log("Project added with ID:", projectRef.id);

        this.resetForm();
      } catch (error) {
        console.error("Error storing project:", error);
        this.errorMessage = error.message;
      } finally {
        this.loading = false;
      }
    },
    resetForm() {
      this.formData = {
        title: "",
        description: "",
        techStack: [],
        github: "",
      };
      this.newTech = "";
      this.previewImage = null;
      this.uploadedImage = null;
    },
  },
};
</script>

<style scoped>
.form {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: #f8fafc;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.form-title {
  color: #2d3748;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  color: #4a5568;
  font-weight: 500;
}

.form-input,
.tech-input,
.file-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #fff;
  transition: border-color 0.2s;
}

.form-input:focus,
.tech-input:focus {
  outline: none;
  border-color: #a0aec0;
  box-shadow: 0 0 0 3px rgba(160, 174, 192, 0.1);
}

.input-container {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.add-btn {
  padding: 0.5rem 1rem;
  background-color: #9ae6b4;
  color: #2d3748;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.add-btn:hover {
  background-color: #81e6d9;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tech-tag {
  display: inline-flex;
  align-items: center;
  background-color: #e6fffa;
  padding: 0.25rem 0.75rem;
  border-radius: 16px;
  font-size: 0.875rem;
  color: #2d3748;
}

.remove-btn {
  margin-left: 0.5rem;
  background: none;
  border: none;
  color: #718096;
  cursor: pointer;
  padding: 0;
}

.remove-btn:hover {
  color: #e53e3e;
}

.preview {
  margin-top: 1rem;
}

.preview-img {
  max-width: 100%;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.submit-btn,
.home-btn {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.submit-btn {
  background-color: #9ae6b4;
  color: #2d3748;
}

.submit-btn:hover {
  background-color: #81e6d9;
}

.submit-btn:disabled {
  background-color: #cbd5e0;
  cursor: not-allowed;
}

.home-btn {
  background-color: #e2e8f0;
}

</style>
