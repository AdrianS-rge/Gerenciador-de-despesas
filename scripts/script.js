document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('manage-adds');
    const paginacaoContainer = document.getElementById('paginacao');

    let paginaAtual = 1;
    const itensPorPagina = 7;

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const nome = formData.get('nome');
        const quantidade = formData.get('quantidade');
        const preco = formData.get('preco');

        if (!nome || !quantidade || !preco) {
            alert("Todos os valores são obrigatórios!");
            return;
        }
        try {
            const response = await fetch('http://localhost:3000/produtos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nome, quantidade, preco })
            });

            if (response.ok) {
                console.log('Produto adicionado com sucesso');
                form.reset();
                fetchProducts();
            } else {
                console.log('Erro ao adicionar produto', response.status);
            }
        } catch (err) {
            console.error('Erro interno no servidor', err);
        }
    });

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:3000/produtos');
            const data = await response.json();

            const products = document.getElementById('products');
            products.innerHTML = '';

            let totalValue = 0;

            const start = (paginaAtual - 1) * itensPorPagina;
            const end = start + itensPorPagina;
            const paginatedData = data.slice(start, end);

            paginatedData.forEach(product => {
                totalValue += product.preco; // * product.quantidade

                const listProducts = document.createElement('li');

                const nomeElement = document.createElement('span');
                nomeElement.textContent = `Nome: ${product.nome}`;
                listProducts.appendChild(nomeElement);

                const quantidadeElement = document.createElement('span');
                quantidadeElement.textContent = `Quantidade: ${product.quantidade}`;
                listProducts.appendChild(quantidadeElement);

                const precoElement = document.createElement('span');
                precoElement.textContent = `Preço: R$ ${product.preco.toFixed(2)}`;
                listProducts.appendChild(precoElement);

                const removeButton = document.createElement('button');
                removeButton.textContent = 'remover';
                removeButton.classList.add('remove-button');
                removeButton.addEventListener('click', async () => {
                    try {
                        const deleteResponse = await fetch(`http://localhost:3000/produtos/${product.id}`, {
                            method: 'DELETE'
                        });

                        if (deleteResponse.ok) {
                            console.log('Produto excluído com sucesso');
                            fetchProducts();
                        } else {
                            console.error('Erro ao remover produto:', deleteResponse.statusText);
                        }
                    } catch (err) {
                        console.error('Erro interno no servidor', err);
                    }
                });

                const editButton = document.createElement('button');
                editButton.textContent = 'editar';
                editButton.classList.add('edit-button');
                editButton.addEventListener('click', () => {
                    const novoNome = prompt('Nome', product.nome);
                    const novaQuantidade = prompt('Quantidade', product.quantidade);
                    const novoPreco = prompt('Preço', product.preco);

                    if (novoNome && novaQuantidade && novoPreco) {
                        fetch(`http://localhost:3000/produtos/${product.id}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ nome: novoNome, quantidade: parseInt(novaQuantidade), preco: parseFloat(novoPreco) })
                        }).then(() => {
                            fetchProducts();
                        }).catch(err => console.error('Erro ao modificar produto', err));
                    }
                });

                const valorTotal = document.getElementById("valor-total");
                valorTotal.textContent = `Valor total: R$${totalValue.toFixed(2)}`;

                listProducts.appendChild(editButton);
                listProducts.appendChild(removeButton);
                products.appendChild(listProducts);
            });

            updatePagination(data.length);
        } catch (err) {
            console.error('Erro ao obter produtos', err);
        }
    };

    const updatePagination = (totalItems) => {
        paginacaoContainer.innerHTML = '';

        const totalPages = Math.ceil(totalItems / itensPorPagina);

        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            pageButton.classList.add('paginacao-button');
            if (i === paginaAtual) {
                pageButton.style.backgroundColor = '#0056b3';
            }
            pageButton.addEventListener('click', () => {
                paginaAtual = i;
                fetchProducts();
            });
            paginacaoContainer.appendChild(pageButton);
        }
    };

    fetchProducts();
});
