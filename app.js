const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql'
});

const Produto = sequelize.define('produto', {
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    quantidade: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    preco: {
        type: Sequelize.FLOAT,
        allowNull: false
    }
}, {
    tableName: 'produtos',
    timestamps: false
});

app.use(cors());
app.use(express.json());

app.get('/produtos', async (req, res) => {
    try {
        await Produto.sync();
        const produtos = await Produto.findAll();
        res.json(produtos);
    } catch (err) {
        console.error('Erro ao conectar', err);
        res.status(500).json({ error: 'Erro interno no servidor', details: err.message });
    }
});

app.post('/produtos', async (req, res) => {
    try {
        const { nome, quantidade, preco } = req.body;
        await Produto.sync();
        const novoProduto = await Produto.create({ nome, quantidade, preco });
        res.status(201).json(novoProduto);
    } catch (err) {
        console.error("Erro ao criar produto", err);
        res.status(500).json({ error: 'Erro interno no servidor', details: err.message });
    }
});

app.delete('/produtos/:id', async (req, res) => {
    try {
        const produtoId = req.params.id;
        await Produto.sync();
        const produto = await Produto.findByPk(produtoId);
        if (produto) {
            await produto.destroy();
            res.status(204).send(); // Sucesso sem conteúdo
        } else {
            res.status(404).json({ error: 'Produto não encontrado' });
        }
    } catch (err) {
        console.error("Erro ao remover produto", err);
        res.status(500).json({ error: 'Erro interno no servidor', details: err.message });
    }
});

app.put('/produtos/:id', async (req, res) => {
    try {
        const produtoId = req.params.id;
        const { nome, quantidade, preco } = req.body;
        await Produto.sync();
        const produto = await Produto.findByPk(produtoId); 
        if(produto) {
            produto.nome = nome;
            produto.quantidade = quantidade;
            produto.preco = preco;
            await produto.save();
            res.json(produto);
        } else {
        res.status(404).json({ erro: 'Produto não encontrado' });
    } 
    } catch (err) {
        console.error("Erro ao atualizar produto", err);
        res.status(500).json({ erro: 'Erro interno no servidor'})
    }
})

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor conectado com sucesso na porta ${PORT}`);
});