export default {
    template: `
    <div style="background-color: #d4edda; min-height: 100vh; padding: 20px;">
    <div style="background-color: #343a40; color: #ffffff; padding: 20px; border-radius: 8px;" class="container mt-5">
    <h2 style="color: #ffffff;">Section Requests</h2>
    <div v-if="error" style="color: #dc3545;">{{ error }}</div>
    <ul style="list-style: none; padding: 0;">
      <li v-if="!allSections.section_info" style="color: #868e96; padding: 10px;">No section requests yet.</li>
      <li v-else v-for="section in allSections.section_info" :key="section.id" style="background-color: #212529; margin-bottom: 10px; padding: 10px; border-radius: 4px;">
        <div>Section Name: {{ section.name }}, Section ID: {{ section.id }}</div>
        <div>
          <button type="button" style="background-color: #28a745; color: #ffffff; border: none; padding: 5px 10px; border-radius: 4px; margin-right: 5px;" @click="approveSection(section.id)">Approve</button>
          <button type="button" style="background-color: #dc3545; color: #ffffff; border: none; padding: 5px 10px; border-radius: 4px;" @click="declineSection(section.id)">Decline</button>
        </div>
      </li>
    </ul>
    
    
    <!-- Popup modal -->
    <div class="modal fade" id="customModal" tabindex="-1" aria-labelledby="customModalLabel" aria-hidden="true" style="background-color: rgba(0, 0, 0, 0.5);">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content" style="background-color: #343a40; border-radius: 8px; color: #ffffff;">
          <div class="modal-header">
            <h5 class="modal-title" id="customModalLabel">Section Approved</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body" style="padding: 20px;">
            <p id="modalContent"></p>
          </div>
          <div class="modal-footer" style="border-top: none;">
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal" style="background-color: #007bff; border-color: #007bff;">Close</button>
          </div>
        </div>
      </div>
    </div>


</div>
  </div>`,
    data() {
      return {
        allSections: [],
        token: localStorage.getItem('auth-token'),
        error: null,
      };
    },
    methods: {
      async approveSection(sectionId) {
        try {
          const res = await fetch(`/activate/section/${sectionId}`, {
            method: 'GET',
            headers: {
              'Authentication-Token': this.token,
            },
          });
          const data = await res.json();
          if (res.ok) {
            // alert('Manager Approved:', data.message);
            var modal = new bootstrap.Modal(document.getElementById('customModal'), {
                keyboard: false,
                backdrop: 'static'
              });
            

              document.getElementById('modalContent').innerText = 'Section Approved: ' + data.message;
            
             
              modal.show();
            
            this.fetchSectionRequests();
          } else {
            alert('Error Approving Section:', data.message);
          }
        } catch (error) {
          console.error('Error in API Call:', error);
        }
      },
      async declineSection(sectionId) {
        try {
          const res = await fetch(`/api/sections/${sectionId}`, {
            method: 'DELETE',
            headers: {
              'Authentication-Token': this.token,
            },
          });
          const data = await res.json();
          if (res.ok) {
            // alert('Manager Declined:', data.message);
            var modal = new bootstrap.Modal(document.getElementById('customModal'), {
                keyboard: false,
                backdrop: 'static'
              });
            

              document.getElementById('modalContent').innerText = 'Section Declined: ' + data.message;
            
              
              modal.show();
           
            this.fetchSectionRequests();
          } else {
            alert('Error Declining Section:', data.message);
          }
        } catch (error) {
          console.error('Error in API Call:', error);
        }
      },
      async fetchSectionRequests() {
       
        try {
          const res = await fetch('/section-requests', {
            headers: {
              'Authentication-Token': this.token,
            },
          });
          const data = await res.json().catch((e) => {});
          if (res.ok) {
            this.allSections = data;
          } else {
            this.error = res.status + ' ' + res.statusText + ' ERROR';
          }
        } catch (error) {
          console.error('Error fetching section requests:', error);
        }
      },
    },
    async mounted() {
      
      this.fetchSectionRequests();
    },
  };
  