<script>
import axios from 'axios';

export default {
  name: 'OrderListView', 
  
  data() {
    return {
      orders: [], 
      ordersStatus: [],   
      editingOrderId: null,     
      isLoading: true, 
      error: null,
      filters: [],
      api : process.env.VUE_APP_API_BASE_URL,       
    };
  },
  

  mounted() {
    this.getOrders();
    this.getOrderStatus();

  },
  
  methods: {

    async getOrders() {
      this.isLoading = true;
      this.error = null;
      
      try {
        let data = await axios.get(`${this.api}orders`);

        if (data.data?.status == 200 && data.data?.record?.length > 0) {

          this.orders = data.data.record;
        }

      } catch (err) {
      
        console.error("Falha ao buscar solicitações:", err);
        this.error = 'Não foi possível carregar a lista de solicitações. Tente novamente.';
      } finally {
        this.isLoading = false;
      }
    },
    async getOrderStatus() {
      this.isLoading = true;
      this.error = null;

      let ordersStatus = [];
      
      try {
        let data = await axios.get(`${this.api}orders/orderSatus`);

        if (data.data?.status == 200 && data.data?.record?.length > 0) {

          data.data?.record?.forEach(element => {
            ordersStatus.push({value:element.id, label: element.status});
          });
        }

        this.ordersStatus = ordersStatus;

      } catch (err) {
      
        console.error("Falha ao buscar status:", err);
        this.error = 'Não foi possível carregar a lista de status. Tente novamente.';
      } finally {
        this.isLoading = false;
      }

    },
    startEdit(orderId) {
      this.editingOrderId = orderId;
    },
    stopEdit() {
      setTimeout(() => {
        this.editingOrderId = null;
      }, 300); 
    }, 
    async updateStatus(order, newStatus, label) {

      
      const statusArray = this.ordersStatus.filter(statusItem => statusItem.value == newStatus);
      
      const originalStatus = order.order_status_id;
      order.order_status_id = newStatus;
      order.status = statusArray[0]?.label;

      try {

        const response = await axios.patch(`${this.api}orders/updateStatusOrder/${order.id}`, {
         status:newStatus
        });
        

      } catch (error) {

        order.status = originalStatus;
        alert('Erro ao atualizar o status do pedido. Tente novamente.');
      }
    },  
    goToNewOrder() {
      this.$router.push({ path: '/order/create' });
    },
    editOrder(orderId) {
      this.$router.push({ 
        name: 'OrderEdit', 
        params: { 
          id: orderId 
        } 
      });
    }
  }
};
</script>

<template>
  <div class="orders-container">
    <div class="header">
      <h1>Lista de Pedidos de Viagem</h1>
      <button @click="goToNewOrder" class="add-button">
        + Novo Pedido
      </button>
    </div>

    <div v-if="isLoading" class="status-message loading">
      Carregando lista de pedidos de viagem...
    </div>

    <div v-else-if="error" class="status-message error">
      {{ error }}
      <button @click="getOrders" class="retry-button">Tentar Novamente</button>
    </div>

    <div v-else-if="orders.length === 0" class="status-message empty">
      Nenhum pedido encontrado. Clique em "Novo Pedido" para cadastrar o primeiro.
    </div>

    <div v-else class="order-list">
      <!-- <div 
        v-for="order in orders" 
        :key="order.id" 
        class="order-item"
      >
        <div class="order-info">
          <strong>#{{ order.id }} - {{ order.cliente }}</strong>
        </div>
        <div class="order-value">
          {{ order.status }}
        </div>
      </div> -->

      <table class="order-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuário</th>
            <th>Data de Partida</th>
            <th>Data de Retorno</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="order in orders" :key="order.id">
            <td @click="editOrder(order.id)">{{ order.id }}</td>
            
            <td>{{ order.user }}</td>
            
            <td>{{ order.departure_date }}</td>
            
            <td>{{ order.return_date }}</td>
            
            <td 
              class="status-cell"
              @mouseover="startEdit(order.id)" 
              @mouseleave="stopEdit"
            >
              
              <select 
                v-if="editingOrderId === order.id" 
                :value="order.status"
                @change="updateStatus(order, $event.target.value, order.status)"
                class="status-select"
              >
                <option 
                  v-for="option in ordersStatus" 
                  :key="option.value" 
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
              
              <span 
                v-else
                :class="['status-badge', order.status.toLowerCase()]"
              >
                {{ order.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.orders-container {
  max-width: 900px;
  margin: 40px auto;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  border-bottom: 2px solid #eee;
  padding-bottom: 15px;
}

h1 {
  font-size: 1.8em;
  color: #333;
}

.add-button {
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.3s;
}

.add-button:hover {
  background-color: #0056b3;
}

/* Estilos da Lista */
.order-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.order-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9f9f9;
}

.order-info strong {
  display: block;
  font-size: 1.1em;
  color: #333;
}

.order-info small {
  color: #777;
}

.order-value {
  font-weight: bold;
  color: #28a745; /* Verde para valores */
  font-size: 1.2em;
}

/* Estilos de Status */
.status-message {
  padding: 20px;
  border-radius: 4px;
  text-align: center;
  font-size: 1.1em;
}

.loading {
  background-color: #e9f7ff;
  color: #007bff;
}

.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.empty {
  background-color: #fff3cd;
  color: #856404;
}

.retry-button {
  margin-left: 10px;
  padding: 5px 10px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.table-container {
  overflow-x: auto; /* Permite rolagem horizontal em telas pequenas */
}

.order-table {
  width: 100%;
  border-collapse: collapse; /* Remove o espaçamento entre bordas */
  text-align: left;
}

.order-table th,
.order-table td {
  padding: 12px 15px;
  border-bottom: 1px solid #ddd;
}

.order-table th {
  background-color: #f4f4f4;
  color: #555;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.9em;
}

.order-table tr:hover {
  background-color: #f0f8ff; /* Fundo azul claro ao passar o mouse */
}

/* Estilos para a coluna Status (Badges) */
.status-badge {
  display: inline-block;
  padding: 5px 8px;
  border-radius: 15px;
  font-size: 0.85em;
  font-weight: bold;
  text-transform: capitalize;
}

/* Cores de Exemplo para Status */
.status-badge.solicitado {
  background-color: #ffc107;
  color: #6a4a00;
}

.status-badge.aprovado {
  background-color: #28a745;
  color: white;
}

.status-badge.cancelado {
  background-color: #dc3545;
  color: white;
}
</style>