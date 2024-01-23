export default {
  template:`
  <div style="background-color: #d4edda; min-height: 100vh; padding: 20px;">
  <div style="background-color: #343a40; color: #ffffff; padding: 20px; border-radius: 8px;" class="container mt-5">
  <h2 style="color: #ffffff;" class="mb-4">Section Creation and Updation</h2>

  <!-- Create Form -->
  <div class='text-danger'>{{error}}</div>
  <form @submit.prevent="createSection" class="mb-4">
    <div style="margin-bottom: 20px;">
      <label for="sectionName" style="color: #ffffff;">Section Name:</label>
      <input v-model="newSectionName" type="text" class="form-control" id="sectionName" name="sectionName" required>
    </div>
    <button type="submit" style="background-color: #007bff; color: #ffffff;" class="btn btn-primary">Create</button>
  </form>

  <!-- Read/Update Form -->
  <form @submit.prevent="updateSection" class="mb-4">
    <div style="margin-bottom: 20px;">
      <label for="existingSectionId" style="color: #ffffff;">Select Section:</label>
      <select v-model="selectedSectionId" class="form-control" id="existingSectionId" name="existingSectionId" required>
        <option v-for="section in existingSections" :key="section.SectionID" :value="section.SectionID" style="background-color: #343a40; color: #ffffff;">{{ section.SectionName }}</option>
      </select>
    </div>
    <div style="margin-bottom: 20px;">
      <label for="updatedSectionName" style="color: #ffffff;">Updated Section Name:</label>
      <input v-model="updatedSectionName" type="text" class="form-control" id="updatedSectionName" name="updatedSectionName" required>
    </div>
    <button type="submit" style="background-color: #ffc107; color: #343a40;" class="btn btn-warning">Update</button>
    <button type="button" style="background-color: #dc3545; color: #ffffff;" class="btn btn-danger" @click="deleteSection">Delete</button>
  </form>
  <div class="container mt-5">
  <h2 class="mb-4">All Sections</h2>

  <ul class="list-group">
    <li v-for="section in existingSections" :key="section.SectionID" :value="section.SectionID" class="list-group-item bg-dark text-white mb-2">
      <strong>{{ section.SectionName }}</strong>
      <ul v-if="section.products && section.products.length" class="list-group">
        <li v-for="product in section.products" :key="product.ProductID" :value="product.ProductID" class="list-group-item bg-secondary text-white">
          {{ product.ProductName }}
        </li>
      </ul>
    </li>
  </ul>
</div>
</div>
</div>
`,
data() {
  return {
  
    newSectionName: '',
    existingItemId: null,
    updatedItemName: '',
    token: localStorage.getItem('auth-token'),
    newSectionName: '',
    selectedSectionId: null,
    existingSections: [],
    updatedSectionName: '',
    error:null,
  };
},
methods: {
  async createSection() {
    
    if (!this.newSectionName.trim()) {
      console.error('SectionName cannot be empty');
      return;
    }
  
    try {
      const res = await fetch('/api/sections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authentication-Token': this.token,
        },
        body: JSON.stringify({
          SectionName: this.newSectionName,
        }),
      });
  
      const data = await res.json();
  
      if (res.ok) {
       
        console.log('Section created:', data);
        
        this.newSectionName = '';
        
        await this.fetchSections();
      } else {
       
        this.error=data.message;
      }
    } catch (error) {
      console.error('Error in API Call:', error);
    }
  },
  async fetchSections() {
    try {
      const res = await fetch('/api/sections', {
        headers: {
          'Authentication-Token': this.token,
        },
      });
      const data = await res.json();
      if (res.ok) {
        this.existingSections = data;
      } else {
        this.error=data.message;
        this.existingSections = [];
      }
    } catch (error) {
      console.error('Error fetching sections:', error);
      this.existingSections = [];
    }
  },    
  async readSection() {
    
    try {
      const res = await fetch('/api/sections', {
        headers: {
          'Authentication-Token': this.token, 
        },
      });

      const data = await res.json();

      if (res.ok) {
        
        console.log('Sections:', data);
        
      } else {
        
        this.error=data.message;
      }
    } catch (error) {
      console.error('Error in API Call:', error);
    }
  },
  async updateSection() {
    try {
      const res = await fetch(`/api/sections/${this.selectedSectionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authentication-Token': this.token,
        },
        body: JSON.stringify({
          SectionName: this.updatedSectionName,
        }),
      });
  
      const data = await res.json();
  
      if (res.ok) {
        console.log('Section updated:', data);
        this.updatedSectionName = ''; 
        await this.fetchSections();
      } else {
        this.error=data.message;
      }
    } catch (error) {
      console.error('Error in API Call:', error);
    }
  },
  async deleteSection() {
    try {
      const res = await fetch(`/api/sections/${this.selectedSectionId}`, {
        method: 'DELETE',
        headers: {
          'Authentication-Token': this.token,
        },
      });
  
      const data = await res.json();
  
      if (res.ok) {
        console.log('Section deleted:', data);
        await this.fetchSections();
      } else {
        this.error=data.message;
      }
    } catch (error) {
      console.error('Error in API Call:', error);
    }
  },
},
mounted() {
  this.fetchSections();
  this.error=null;
},
};