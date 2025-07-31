document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('messageForm');
  const input = document.getElementById('messageInput');
  const grid = document.getElementById('messageGrid');

  const modal = document.getElementById('editModal');
  const editInput = document.getElementById('editInput');
  const closeModal = document.getElementById('closeModal');
  const saveEdit = document.getElementById('saveEdit');

  let editId = null;

  async function fetchMessages() {
    const res = await fetch('/messages');
    const messages = await res.json();
    grid.innerHTML = '';

    messages.forEach(msg => {
      const card = document.createElement('div');
      card.className = 'col-md-6 col-lg-4 animate__animated animate__fadeInUp';

      card.innerHTML = `
        <div class="card shadow-sm border-0 h-100">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">#${msg.id}</h5>
            <p class="card-text flex-grow-1">${msg.message}</p>
            <div class="d-flex justify-content-end gap-2 mt-3">
              <button class="btn btn-sm btn-outline-primary" onclick="editMessage(${msg.id}, '${msg.message.replace(/'/g, "\\'")}')">Edit</button>
              <button class="btn btn-sm btn-outline-danger" onclick="deleteMessage(${msg.id})">Delete</button>
            </div>
          </div>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  async function handleFormSubmit(e) {
    e.preventDefault();
    const message = input.value.trim();
    if (!message) return;
    await fetch('/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    input.value = '';
    fetchMessages();
  }

  form.addEventListener('submit', handleFormSubmit);

  window.deleteMessage = async (id) => {
    if (confirm('Are you sure you want to delete this message?')) {
      await fetch(`/messages/${id}`, { method: 'DELETE' });
      fetchMessages();
    }
  };

  window.editMessage = (id, currentMsg) => {
    editId = id;
    editInput.value = currentMsg;
    modal.style.display = 'block';
  };

  async function handleSaveEditClick() {
    const newMsg = editInput.value.trim();
    if (!newMsg) return;
    await fetch(`/messages/${editId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: newMsg })
    });
    modal.style.display = 'none';
    fetchMessages();
  }

  saveEdit.addEventListener('click', handleSaveEditClick);

  closeModal.onclick = () => modal.style.display = 'none';

  window.onclick = e => {
    if (e.target == modal) modal.style.display = 'none';
  };

  fetchMessages();
});
