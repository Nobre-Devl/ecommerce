const { createApp } = Vue;

createApp({
  data() {
    return {
      produtos: [],
      filtroBusca: '',
      filtroDataInicio: '',
      filtroDataFim: '',
      filtroCategoria: '',
      filtroPrecoMin: 0,
      filtroPrecoMax: 0,
      precoMin: 0,
      precoMax: 100,
      abrirFiltros: false,
      mostrarForm: false,
      editando: false,
      produtoEditandoId: null,
      novoProduto: {
        nome: '',
        categoria: '',
        preco: 0,
        estoque: 0,
        desc: '',
        imagem: '',
        data: ''
      },
      isDark: false,
      hoje: new Date().toISOString().split('T')[0],
      
      alerta: {
        visivel: false,
        mensagem: '',
        tipo: 'success' 
      }
    };
  },

  computed: {
    categoriasDisponiveis() {
      const cats = this.produtos.map(p => p.categoria).filter(c => c);
      return [...new Set(cats)];
    },

    produtosFiltrados() {
      return this.produtos.filter(p => {
        const buscaOk = p.nome.toLowerCase().includes(this.filtroBusca.toLowerCase());

        const dataProduto = p.data ? p.data.split('T')[0] : '';
        const dataInicio = this.filtroDataInicio || '0000-01-01';
        const dataFim = this.filtroDataFim || this.hoje;
        const dataOk = dataProduto >= dataInicio && dataProduto <= dataFim;

        const categoriaOk = !this.filtroCategoria || p.categoria === this.filtroCategoria;
        const precoOk = p.preco >= this.filtroPrecoMin && p.preco <= this.filtroPrecoMax;

        return buscaOk && dataOk && categoriaOk && precoOk;
      });
    },

    sliderMinPercent() {
      return ((this.filtroPrecoMin - this.precoMin) / (this.precoMax - this.precoMin)) * 100;
    },

    sliderWidthPercent() {
      return ((this.filtroPrecoMax - this.filtroPrecoMin) / (this.precoMax - this.precoMin)) * 100;
    }
  },

  mounted() {
    this.isDark = localStorage.getItem('temaEscuro') === 'true';
    document.documentElement.classList.toggle('dark', this.isDark);
    this.buscarProdutos();
  },

  methods: {
    mostrarAlerta(mensagem, tipo = 'success', duracao = 3000) {
      this.alerta.mensagem = mensagem;
      this.alerta.tipo = tipo;
      this.alerta.visivel = true;

      setTimeout(() => {
        this.alerta.visivel = false;
      }, duracao);
    },

    formatarDataLocal(dataStr) {
      if (!dataStr) return 'Sem data';
      const [year, month, day] = dataStr.split('-');
      return `${day}/${month}/${year}`;
    },

    async buscarProdutos() {
      const res = await fetch('http://localhost:2024/produtos');
      this.produtos = await res.json();

      const precos = this.produtos.map(p => p.preco);
      this.precoMin = Math.min(...precos, 0);
      this.precoMax = Math.max(...precos, 100);
      this.filtroPrecoMin = this.precoMin;
      this.filtroPrecoMax = this.precoMax;
    },

    limparFiltros() {
      this.filtroBusca = '';
      this.filtroDataInicio = '';
      this.filtroDataFim = '';
      this.filtroCategoria = '';
      this.resetPreco();
    },

    resetPreco() {
      this.filtroPrecoMin = this.precoMin;
      this.filtroPrecoMax = this.precoMax;
    },

    corrigirMinMax(tipo) {
      if (tipo === 'min' && this.filtroPrecoMin > this.filtroPrecoMax)
        this.filtroPrecoMin = this.filtroPrecoMax;
      if (tipo === 'max' && this.filtroPrecoMax < this.filtroPrecoMin)
        this.filtroPrecoMax = this.filtroPrecoMin;
    },

    toggleForm() {
      this.mostrarForm = !this.mostrarForm;
      if (!this.mostrarForm) this.resetarFormulario();
    },

    carregarImagem(event) {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = e => {
        this.novoProduto.imagem = e.target.result;
      };
      reader.readAsDataURL(file);
    },

    async salvarProduto() {
      if (!this.novoProduto.data) this.novoProduto.data = new Date().toISOString();

      const metodo = this.editando ? 'PUT' : 'POST';
      const url = this.editando
        ? `http://localhost:2024/produtos/${this.produtoEditandoId}`
        : 'http://localhost:2024/produtos';

      const res = await fetch(url, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.novoProduto)
      });

      if (res.ok) {
        const msg = this.editando ? '✅ Produto atualizado!' : '✅ Produto cadastrado!';
        this.mostrarAlerta(msg, 'success');
        
        this.buscarProdutos();
        this.toggleForm();
      } else {
        this.mostrarAlerta('❌ Erro ao salvar produto.', 'error');
      }
    },

    editarProduto(prod) {
      this.mostrarForm = true;
      this.editando = true;
      this.produtoEditandoId = prod._id;
      this.novoProduto = { ...prod };
    },

    async excluirProduto(id) {
      if (!confirm('Tem certeza que deseja excluir este produto?')) return;

      const res = await fetch(`http://localhost:2024/produtos/${id}`, { method: 'DELETE' });

      if (res.ok) {
        this.mostrarAlerta('🗑️ Produto excluído!', 'success');
        this.buscarProdutos();
      } else {
        this.mostrarAlerta('❌ Erro ao excluir produto.', 'error');
      }
    },

    resetarFormulario() {
      this.editando = false;
      this.produtoEditandoId = null;
      this.novoProduto = {
        nome: '',
        categoria: '',
        preco: 0,
        estoque: 0,
        desc: '',
        imagem: '',
        data: ''
      };
    },

    toggleTheme() {
      this.isDark = !this.isDark;
      document.documentElement.classList.toggle('dark', this.isDark);
      localStorage.setItem('temaEscuro', this.isDark);
    },

    formatarData(dataStr) {
      if (!dataStr) return 'Sem data';
      const data = new Date(dataStr);
      if (isNaN(data)) return 'Data inválida';
      return data.toLocaleDateString('pt-BR');
    }
  }
}).mount('#app');