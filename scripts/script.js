document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('manage-adds');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const nome = formData.get('nome');
        const quantidade = formData.get('quantidade');
        const preco = formData.get('preco');

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

            data.forEach(product => {
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

                listProducts.appendChild(removeButton);
                products.appendChild(listProducts);
                
            })
        } catch (err) {
            console.error('Erro ao obter produtos', err)
        }
    }

    fetchProducts();
})