const { createApp } = Vue;

createApp({
  data() {
    return {
      clientes: [],
      mostrarForm: false,
      editando: false,
      clienteEditandoId: null,
      novoCliente: {
        nome: '',
        email: '',
        telefone: '',
        cpf: '',
        endereco: ''
      },
      isDark: false,
      alerta: { visivel: false, mensagem: '', tipo: 'success' }
    };
  },

  mounted() {
    // Proteção de Rota
    const token = localStorage.getItem('auth-token');
    if (!token) {
      alert('Acesso negado. Faça o login.');
      window.location.href = 'login.html';
      return;
    }

    this.isDark = localStorage.getItem('temaEscuro') === 'true';
    document.documentElement.classList.toggle('dark', this.isDark);
    this.buscarClientes();
  },

  methods: {
    mostrarAlerta(msg, tipo = 'success') {
      this.alerta.mensagem = msg;
      this.alerta.tipo = tipo;
      this.alerta.visivel = true;
      setTimeout(() => { this.alerta.visivel = false; }, 3000);
    },

    async buscarClientes() {
      const token = localStorage.getItem('auth-token');
      try {
        const res = await fetch('http://localhost:2024/clientes', {
          headers: { 'auth-token': token }
        });
        this.clientes = await res.json();
      } catch (error) {
        console.error(error);
        this.mostrarAlerta('Erro ao buscar clientes.', 'error');
      }
    },

    async salvarCliente() {
      const token = localStorage.getItem('auth-token');
      const metodo = this.editando ? 'PUT' : 'POST';
      const url = this.editando 
        ? `http://localhost:2024/clientes/${this.clienteEditandoId}` 
        : 'http://localhost:2024/clientes';

      try {
        const res = await fetch(url, {
          method: metodo,
          headers: { 
            'Content-Type': 'application/json', 
            'auth-token': token 
          },
          body: JSON.stringify(this.novoCliente)
        });

        if (res.ok) {
          this.mostrarAlerta(this.editando ? 'Cliente atualizado!' : 'Cliente cadastrado!');
          this.buscarClientes();
          this.toggleForm();
        } else {
          this.mostrarAlerta('Erro ao salvar.', 'error');
        }
      } catch (error) {
        this.mostrarAlerta('Erro de conexão.', 'error');
      }
    },

    async excluirCliente(id) {
      if (!confirm('Excluir este cliente?')) return;
      const token = localStorage.getItem('auth-token');
      
      try {
        const res = await fetch(`http://localhost:2024/clientes/${id}`, {
          method: 'DELETE',
          headers: { 'auth-token': token }
        });

        if (res.ok) {
          this.mostrarAlerta('Cliente removido!');
          this.buscarClientes();
        } else {
          this.mostrarAlerta('Erro ao excluir.', 'error');
        }
      } catch (error) {
        this.mostrarAlerta('Erro de conexão.', 'error');
      }
    },

    toggleForm() {
      this.mostrarForm = !this.mostrarForm;
      // Limpa o form ao fechar ou ao abrir para criar novo
      if (!this.mostrarForm || !this.editando) {
        this.resetarFormulario();
      }
    },

    editarCliente(cliente) {
      this.mostrarForm = true;
      this.editando = true;
      this.clienteEditandoId = cliente._id;
      this.novoCliente = { ...cliente };
    },

    resetarFormulario() {
      this.editando = false;
      this.clienteEditandoId = null;
      this.novoCliente = {
        nome: '',
        email: '',
        telefone: '',
        cpf: '',
        endereco: ''
      };
    },

    toggleTheme() {
      this.isDark = !this.isDark;
      document.documentElement.classList.toggle('dark', this.isDark);
      localStorage.setItem('temaEscuro', this.isDark);
    }
  }
}).mount('#app');