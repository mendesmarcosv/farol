# 🚢 Farol - Landing Page

Uma landing page moderna e minimalista desenvolvida com Bootstrap 5, seguindo o design do Figma

## 🎨 Design

### Paleta de Cores
- **Primary**: `#54BF44` (Verde principal)
- **Light Gray**: `#f1f1f1`
- **White**: `#ffffff`
- **Light Green**: `#DEF3C6`
- **Dark Green**: `#263228`
- **Cream**: `#F4F1ED`

### Tipografia
- **Títulos**: Rethink Sans (Google Fonts)
- **Texto corrido**: Montserrat (Google Fonts)

## 🚀 Funcionalidades

### ✅ Implementado
- [x] Hero section com animações
- [x] Navegação responsiva
- [x] Botões customizados (primário e secundário)
- [x] Elementos flutuantes animados
- [x] Design system baseado em Bootstrap
- [x] Variáveis CSS customizáveis
- [x] Animações suaves
- [x] Responsividade completa

### 🔄 Próximas Seções
- [ ] Seção Sobre
- [ ] Seção Serviços
- [ ] Seção Contato
- [ ] Footer
- [ ] Animações específicas do Figma

## 📁 Estrutura do Projeto

```
farol/
├── index.html              # Página principal
├── assets/
│   ├── css/
│   │   └── style.css      # Estilos customizados
│   ├── scss/
│   │   ├── _variables.scss # Variáveis do Bootstrap customizadas
│   │   └── main.scss      # Arquivo SCSS principal
│   └── js/
│       └── script.js      # JavaScript customizado
└── README.md              # Documentação
```

## 🛠️ Tecnologias

- **Bootstrap 5** - Framework CSS
- **Google Fonts** - Rethink Sans & Montserrat
- **Vanilla JavaScript** - Interações e animações
- **SCSS** - Preprocessador CSS (configurado)
- **Font Awesome** - Ícones (preparado)

## 📱 Responsividade

O site foi desenvolvido seguindo a abordagem mobile-first do Bootstrap:
- **Mobile**: < 576px
- **Tablet**: 576px - 992px
- **Desktop**: > 992px

## 🎯 Customização Fácil

### Alterar Cores
No arquivo `assets/css/style.css`, você pode modificar as variáveis CSS:

```css
:root {
  --primary-color: #54BF44;    /* Cor principal */
  --dark-green: #263228;       /* Verde escuro */
  --light-green: #DEF3C6;      /* Verde claro */
  --cream: #F4F1ED;            /* Creme */
}
```

### Usando SCSS (Opcional)
Para usar SCSS, você pode instalar o Sass e compilar:

```bash
npm install -g sass
sass assets/scss/main.scss assets/css/style.css --watch
```



## 🔗 Links de Referência

- [Design no Figma](https://www.figma.com/design/GotBCnm3DQRYYKkvgluq5G/Farol?node-id=66-497&t=gI7M9FkFgDer5MVi-1)
- [Bootstrap 5 Documentation](https://getbootstrap.com/docs/5.3/)

---

**Desenvolvido para o projeto Farol** 🚢 
