export default {
    template: `

    <div style="background-color: #d4edda; min-height: 100vh; padding: 20px;">
    <div style="background-color: #343a40; color: #ffffff; padding: 20px; border-radius: 8px;" class="container mt-5">
  <h2 class="mb-4">Product Creation</h2>

  <!-- Create Form -->
  <form @submit.prevent="createProduct" class="mb-4">
    <div class="form-group">
      <label for="productName">Product Name:</label>
      <input v-model="newProduct.ProductName" type="text" class="form-control" id="productName" name="productName" required>
    </div>
    <div class="form-group">
      <label for="description">Description:</label>
      <input v-model="newProduct.Description" type="text" class="form-control" id="description" name="description" required>
    </div>
    <div class="form-group">
      <label for="ratePerUnit">Rate Per Unit:</label>
      <input v-model="newProduct.RatePerUnit" type="number" class="form-control" id="ratePerUnit" name="ratePerUnit" required step=".01">
    </div>
    <div class="form-group">
      <label for="stockQuantity">Stock Quantity:</label>
      <input v-model="newProduct.StockQuantity" type="number" class="form-control" id="stockQuantity" name="stockQuantity" required>
    </div>
    <button type="submit" class="btn btn-success">Create</button>
  </form>

  
  <!-- Update Form Modal -->
  <div class="modal fade" id="updateProductModal" tabindex="-1" role="dialog" aria-labelledby="updateProductModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
              <div class="modal-header">
                  <h5 class="modal-title" id="updateProductModalLabel">Update Product</h5>
                  <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                  </button>
              </div>
              <div class="modal-body" style="background-color: #343a40; color: #ffffff; padding: 20px; border-radius: 8px;">
                  <!-- Update Form Content -->
                  <form @submit.prevent="updateProduct(selectedProduct.ProductID)">
                      <!-- Include the update form fields here -->
                      <div class="form-group">
                          <label for="productName">Update Product Name:</label>
                          <input v-model="updatedProduct.ProductName" type="text" class="form-control" id="productName" name="productName" required>
                      </div>
                      <div class="form-group">
                        <label for="description">Update Description:</label>
                        <input v-model="updatedProduct.Description" type="text" class="form-control" id="description" name="description" required>
                      </div>
                      <div class="form-group">
                        <label for="ratePerUnit">Update Rate Per Unit:</label>
                        <input v-model="updatedProduct.RatePerUnit" type="number" class="form-control" id="ratePerUnit" name="ratePerUnit" required step=".01">
                      </div>
                      <div class="form-group">
                        <label for="stockQuantity">Update Stock Quantity:</label>
                        <input v-model="updatedProduct.StockQuantity" type="number" class="form-control" id="stockQuantity" name="stockQuantity" required>
                      </div>
                      <div class="form-group">
                        <label for="sectionDropdown">Select Section:</label>
                        <select v-model="updatedProduct.SectionID" id="sectionDropdown" class="form-control">
                          <option v-for="section in sections" :key="section.SectionID" :value="section.SectionID">{{section.SectionName}}</option>
                        </select>
                      </div>
                      <!-- ... (other form fields) ... -->
                      <button type="submit" class="btn btn-warning">Update</button>
                      <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cancel</button>
                  </form>
              </div>
          </div>
      </div>
  </div>







  <!-- All products -->
  <div>
    <h3>Products - Description - Rate per Unit - Stock Quantity | Section Name</h3>   <button @click='exportProducts' class="btn btn-outline-info">Export <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-filetype-csv" viewBox="0 0 16 16">
    <path fill-rule="evenodd" d="M14 4.5V14a2 2 0 0 1-2 2h-1v-1h1a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5zM3.517 14.841a1.13 1.13 0 0 0 .401.823c.13.108.289.192.478.252.19.061.411.091.665.091.338 0 .624-.053.859-.158.236-.105.416-.252.539-.44.125-.189.187-.408.187-.656 0-.224-.045-.41-.134-.56a1.001 1.001 0 0 0-.375-.357 2.027 2.027 0 0 0-.566-.21l-.621-.144a.97.97 0 0 1-.404-.176.37.37 0 0 1-.144-.299c0-.156.062-.284.185-.384.125-.101.296-.152.512-.152.143 0 .266.023.37.068a.624.624 0 0 1 .246.181.56.56 0 0 1 .12.258h.75a1.092 1.092 0 0 0-.2-.566 1.21 1.21 0 0 0-.5-.41 1.813 1.813 0 0 0-.78-.152c-.293 0-.551.05-.776.15-.225.099-.4.24-.527.421-.127.182-.19.395-.19.639 0 .201.04.376.122.524.082.149.2.27.352.367.152.095.332.167.539.213l.618.144c.207.049.361.113.463.193a.387.387 0 0 1 .152.326.505.505 0 0 1-.085.29.559.559 0 0 1-.255.193c-.111.047-.249.07-.413.07-.117 0-.223-.013-.32-.04a.838.838 0 0 1-.248-.115.578.578 0 0 1-.255-.384h-.765ZM.806 13.693c0-.248.034-.46.102-.633a.868.868 0 0 1 .302-.399.814.814 0 0 1 .475-.137c.15 0 .283.032.398.097a.7.7 0 0 1 .272.26.85.85 0 0 1 .12.381h.765v-.072a1.33 1.33 0 0 0-.466-.964 1.441 1.441 0 0 0-.489-.272 1.838 1.838 0 0 0-.606-.097c-.356 0-.66.074-.911.223-.25.148-.44.359-.572.632-.13.274-.196.6-.196.979v.498c0 .379.064.704.193.976.131.271.322.48.572.626.25.145.554.217.914.217.293 0 .554-.055.785-.164.23-.11.414-.26.55-.454a1.27 1.27 0 0 0 .226-.674v-.076h-.764a.799.799 0 0 1-.118.363.7.7 0 0 1-.272.25.874.874 0 0 1-.401.087.845.845 0 0 1-.478-.132.833.833 0 0 1-.299-.392 1.699 1.699 0 0 1-.102-.627v-.495Zm8.239 2.238h-.953l-1.338-3.999h.917l.896 3.138h.038l.888-3.138h.879l-1.327 4Z"/>
  </svg>
  </button><span v-if='isWaiting'> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-repeat" viewBox="0 0 16 16">
  <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"/>
  <path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3M3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9z"/>
</svg>
 </span>
    <ul class="list-group">
      <li v-for="product in allProducts" :key="product.ProductID" class="list-group-item d-flex justify-content-between align-items-center">
        <span>
          <strong>{{ product.ProductName }}</strong> - {{ product.Description }} - ₹{{ product.RatePerUnit }} - {{ product.StockQuantity }}units | {{ getSectionName(product.SectionID) }}
        </span>
        <button type="button" class="btn btn-outline-secondary ms-auto" data-bs-toggle="modal" data-bs-target="#updateProductModal" @click="selectProduct(product)">Edit</button>
        <button type="button" class="btn btn-outline-danger" @click="deleteProduct(product.ProductID)">Delete</button>
      </li>
    </ul>
  </div>
</div>
</div>
    `
    ,
    data() {
        return {
          newProduct: {
            ProductName: '',
            Description: '',
            RatePerUnit: 0.0,
            StockQuantity: 0,
            SectionID: null,
          },
            selectedProduct: null,
            token: localStorage.getItem('auth-token'),
            selectedSectionId: null,
            isWaiting: false,
            updatedProduct: {
                ProductName: '',
                Description: '',
                RatePerUnit: 0.0,
                StockQuantity: 0,
                SectionID: null,
            },
          allProducts: [],
          sections: [],
        };
      },
      methods: {
        getSectionName(sectionID) {
            const section = this.sections.find(section => section.SectionID === sectionID);
            return section ? section.SectionName : 'Unknown Section';
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
                this.sections = data;
              } else {
                this.error=data.message;
                this.sections = [];
              }
            } catch (error) {
              console.error('Error fetching sections:', error);
              this.sections = [];
            }
          },
        async createProduct() {
          try {
            const res = await fetch('/api/products', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authentication-Token': localStorage.getItem('auth-token'),
              },
              body: JSON.stringify(this.newProduct),
            });
    
            const data = await res.json();
    
            if (res.ok) {
              console.log('Product created:', data);
              this.newProduct = {
                ProductName: '',
                Description: '',
                RatePerUnit: 0.0,
                StockQuantity: 0,
                SectionID: 0,
              };
              await this.fetchProducts();
            } else {
              console.error('Error creating product:', data.message);
            }
          } catch (error) {
            console.error('Error in API Call:', error);
          }
        },
        async fetchProducts() {
          try {
            const res = await fetch('/api/products');
            const data = await res.json();
            if (res.ok) {
              this.allProducts = data;
            } else {
              console.error('Error fetching products:', data);
              this.allProducts = [];
            }
          } catch (error) {
            console.error('Error fetching products:', error);
            this.allProducts = [];
          }
        },
        selectProduct(product) {
            
            this.selectedProduct = product;

            
            this.updatedProduct = {
              ProductName: product.ProductName,
              Description: product.Description,
              RatePerUnit: product.RatePerUnit,
              StockQuantity: product.StockQuantity,
              SectionID: product.SectionID,
            };

            // pop up modal for update
        const modal = document.getElementById('updateProductModal');
        modal.classList.add('show');
        modal.style.display = 'block';
        document.body.classList.add('modal-open');

          },
        async updateProduct(productID) {
        
          try {
           
            if (!this.selectedProduct) {
              console.error('No product selected for update');
              return;
            }
    
            const updatedFields = {};
    
            
            if (this.updatedProduct.ProductName.trim()) {
              updatedFields.ProductName = this.updatedProduct.ProductName.trim();
            }
    
            if (this.updatedProduct.Description.trim()) {
              updatedFields.Description = this.updatedProduct.Description.trim();
            }
    
            if (!isNaN(this.updatedProduct.RatePerUnit)) {
              updatedFields.RatePerUnit = parseFloat(this.updatedProduct.RatePerUnit);
            }
    
            if (!isNaN(this.updatedProduct.StockQuantity)) {
              updatedFields.StockQuantity = parseInt(this.updatedProduct.StockQuantity);
            }
    
            if (!isNaN(this.updatedProduct.SectionID)) {
              updatedFields.SectionID = parseInt(this.updatedProduct.SectionID);
            }
    
            const res = await fetch(`/api/products/${productID}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authentication-Token': localStorage.getItem('auth-token'),
              },
              body: JSON.stringify(updatedFields),
            });
    
            const data = await res.json();
    
            if (res.ok) {
              console.log('Product updated:', data);
              
              this.updatedProduct = {
                ProductName: '',
                Description: '',
                RatePerUnit: 0.0,
                StockQuantity: 0,
                SectionID: 0,
              };
              await this.fetchProducts();
            } else {
              console.error('Error updating product:', data.message);
            }
          } catch (error) {
            console.error('Error in API Call:', error);
          }
        },
        
        async deleteProduct(productID) {
          
          try {
            const res = await fetch(`/api/products/${productID}`, {
              method: 'DELETE',
              headers: {
                'Authentication-Token': localStorage.getItem('auth-token'),
              },
            });
    
            const data = await res.json();
    
            if (res.ok) {
              console.log('Product deleted:', data);
              await this.fetchProducts();
            } else {
              console.error('Error deleting product:', data.message);
            }
          } catch (error) {
            console.error('Error in API Call:', error);
          }
        },
        async exportProducts() {
          this.isWaiting = true
          const res = await fetch('/download-csv')
          const data = await res.json()
          if (res.ok) {
            const taskId = data['task-id']
            const intv = setInterval(async () => {
              const csv_res = await fetch(`/get-csv/${taskId}`)
              if (csv_res.ok) {
                this.isWaiting = false
                clearInterval(intv)
                window.location.href = `/get-csv/${taskId}`
              }
            }, 1000)
          }
        },
      },
      mounted() {
        this.fetchProducts();
        this.fetchSections();
      },
};
  