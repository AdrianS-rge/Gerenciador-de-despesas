document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('manage-adds');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const nome = formData.get('nome');
        const quantidade = formData.get('quantidade');
        const preco = formData.get('preco');

        if(!nome || !quantidade || !preco) {
            alert("Todos os valores sao obrigatorios!")
            return
        }
        try {
            const response = await fetch('http://localhost:3000/produtos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({nome, quantidade, preco})
            })

            if(response.ok) {
                console.log('Produto adicionado com sucesso');
                form.reset();
                fetchProducts();

            } else {
                console.log('Erro ao adicionar produto', response.status)
            } 
        } catch (err) {
                console.error('Erro interno no servidor', err)
        }
    });

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:3000/produtos')
            const data = await response.json();

            const products = document.getElementById('products');
            products.innerHTML = '';

            let totalValue = 0;

            data.forEach(product => {
                totalValue += product.preco // * product.quantidade

                const listProducts = document.createElement('li');

                const nomeElement = document.createElement('span');
                nomeElement.textContent = `Nome: ${product.nome}`;
                listProducts.appendChild(nomeElement);

                const quantidadeElement = document.createElement('span');
                quantidadeElement.textContent = `Quantidade: ${product.quantidade}`;
                listProducts.appendChild(quantidadeElement);

                const precoElement = document.createElement('span');
                precoElement.textContent = `Preço: R$ ${product.preco.toFixed(2)}`;
                listProducts.appendChild(precoElement)

                const removeButton = document.createElement('button');
                removeButton.textContent = 'remover'
                removeButton.addEventListener('click', async () => {
                    try {
                        const deleteResponse = await fetch(`http://localhost:3000/produtos/${product.id}`, {
                            method: 'DELETE'
                        });

                        if(deleteResponse.ok) {
                            console.log('Produto excluido com sucesso')
                            fetchProducts()
                        } else {
                            console.error('Erro ao remover produto:',deleteResponse.statusText)
                        }
                    } catch (err) {
                        console.error('Erro interno no servidor', err)
                    }
                });

                const editButton = document.createElement('button');
                editButton.textContent = 'editar'
                editButton.addEventListener('click', () => {
                    const novoNome = prompt('Nome', product.nome);
                    const novaQuantidade = prompt('Quantidade', product.quantidade)
                    const novoPreco = prompt('Preco', product.preco)

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
                })

                const valorTotal = document.getElementById("valor-total")
                valorTotal.textContent = `Valor total: R$${totalValue.toFixed(2)}`;

                listProducts.appendChild(editButton)
                listProducts.appendChild(removeButton);
                products.appendChild(listProducts);
                
            })
        } catch (err) {
            console.error('Erro ao obter produtos', err)
        }
    }

    fetchProducts();
})