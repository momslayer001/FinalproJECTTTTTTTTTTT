const API_URL = 'https://6799f858747b09cdcccd2eb1.mockapi.io/sigmaboi';

function setLoading(loading) {
    document.getElementById('loading').style.display = loading ? 'block' : 'none';
}

async function fetchProducts() {
    try {
        setLoading(true);
        const response = await fetch(API_URL);
        const products = await response.json();
        renderProducts(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        alert('Failed to load products');
    } finally {
        setLoading(false);
    }
}

async function saveProduct(e) {
    e.preventDefault();
    
    const productId = document.getElementById('productId').value;
    const productData = {
        name: document.getElementById('name').value,
        description: document.getElementById('description').value,
        price: parseFloat(document.getElementById('price').value),
        stock: parseInt(document.getElementById('stock').value),
        gift: {
            remote: document.getElementById('remote').checked,
            plug: document.getElementById('plug').checked,
            mouse: document.getElementById('mouse').checked
        }
    };

    try {
        setLoading(true);
        if (productId) {
            await fetch(`${API_URL}/${productId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });
        } else {
            await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });
        }
        resetForm();
        fetchProducts();
    } catch (error) {
        console.error('Error saving product:', error);
        alert('เกิดข้อผิดพลาดในการบันทึก');
    } finally {
        setLoading(false);
    }
}

async function deleteProduct(id) {
    if (confirm('คุณต้องการลบสินค้านี้หรือไม่?')) {
        try {
            setLoading(true);
            await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });
            fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('เกิดข้อผิดพลาดในการลบ');
        } finally {
            setLoading(false);
        }
    }
}

async function editProduct(id) {
    try {
        setLoading(true);
        const response = await fetch(`${API_URL}/${id}`);
        const product = await response.json();
        
        document.getElementById('productId').value = product.id;
        document.getElementById('name').value = product.name;
        document.getElementById('description').value = product.description;
        document.getElementById('price').value = product.price;
        document.getElementById('stock').value = product.stock;
        
        document.getElementById('remote').checked = product.gift?.remote || false;
        document.getElementById('plug').checked = product.gift?.plug || false;
        document.getElementById('mouse').checked = product.gift?.mouse || false;
    } catch (error) {
        console.error('Error fetching product details:', error);
        alert('ไม่สามารถโหลดข้อมูลสินค้าได้');
    } finally {
        setLoading(false);
    }
}

function renderProducts(products) {
    const tbody = document.getElementById('productTableBody');
    tbody.innerHTML = '';

    products.forEach(product => {
        const gifts = [];
        if (product.gift?.remote) gifts.push('รีโมท');
        if (product.gift?.plug) gifts.push('ปลั๊ก');
        if (product.gift?.mouse) gifts.push('เมาส์');
        
        const giftDisplay = gifts.length 
            ? gifts.map(g => `<span class="gift-item">${g}</span>`).join(' ')
            : 'ไม่มี';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.description}</td>
            <td>฿${parseFloat(product.price).toFixed(2)}</td>
            <td>${product.stock}</td>
            <td>${giftDisplay}</td>
            <td class="action-buttons">
                <button class="edit-btn" onclick="editProduct('${product.id}')">แก้ไข</button>
                <button class="delete-btn" onclick="deleteProduct('${product.id}')">ลบ</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function resetForm() {
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
}

document.getElementById('productForm').addEventListener('submit', saveProduct);

// Initialize the page
fetchProducts();